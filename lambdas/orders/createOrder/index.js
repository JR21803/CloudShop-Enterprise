const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const { randomUUID } = require("crypto");
const { getRole, hasRole } = require('roleAuth');

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const ebClient = new EventBridgeClient({});

const ORDERS_TABLE = process.env.ORDERS_TABLE;
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || "cloudshop-events";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async (event) => {
  try {
    const claims = event.requestContext?.authorizer?.claims || {};
    const role = getRole(claims);
    const userId = claims.sub;
    const userEmail = claims.email;

    if (!claims.sub) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Autenticación requerida" }),
      };
    }

    if (!hasRole(claims, ["Cliente", "Administrador", "Operador"])) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No tienes permisos para crear pedidos" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    let { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "El pedido debe contener al menos un producto" }),
      };
    }

    const mergedMap = new Map();
    for (const item of items) {
      if (!item.productId) continue;
      const existing = mergedMap.get(item.productId);
      if (existing) {
        existing.quantity += Number(item.quantity) || 0;
      } else {
        mergedMap.set(item.productId, { productId: item.productId, quantity: Number(item.quantity) || 0 });
      }
    }
    items = Array.from(mergedMap.values());

    // Validar stock y recalcular precios desde DynamoDB para evitar manipulación
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: `Item inválido: se requiere productId y quantity > 0` }),
        };
      }

      const { Item: product } = await docClient.send(
        new GetCommand({ TableName: PRODUCTS_TABLE, Key: { productId } })
      );

      if (!product || product.status === "DELETED") {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: `Producto ${productId} no encontrado` }),
        };
      }

      const currentStock = Number(product.stock) || 0;
      if (currentStock < quantity) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            message: `Stock insuficiente para "${product.name}". Disponible: ${currentStock}`,
          }),
        };
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;
      total += subtotal;

      validatedItems.push({
        productId,
        name: product.name,
        storeId: product.storeId || null,
        quantity,
        price: unitPrice,
        subtotal,
      });
    }

    // Determinar la tienda principal del pedido (primer ítem o body)
    const storeId = body.storeId || validatedItems[0]?.storeId || "unknown";

    const orderId = randomUUID();
    const now = new Date().toISOString();

    const order = {
      orderId,
      userId,
      userEmail,
      storeId,
      items: validatedItems,
      total: Math.round(total * 100) / 100,
      status: "Pendiente",
      createdAt: now,
      updatedAt: now,
    };

    // Persistir el pedido
    await docClient.send(new PutCommand({ TableName: ORDERS_TABLE, Item: order }));

    // Descontar stock de cada producto
    for (const item of validatedItems) {
      await docClient.send(
        new UpdateCommand({
          TableName: PRODUCTS_TABLE,
          Key: { productId: item.productId },
          UpdateExpression: "SET stock = stock - :qty, updatedAt = :now",
          ConditionExpression: "stock >= :qty",
          ExpressionAttributeValues: {
            ":qty": item.quantity,
            ":now": now,
          },
        })
      );
    }

    // Publicar evento a EventBridge (fallo no crítico)
    try {
      await ebClient.send(
        new PutEventsCommand({
          Entries: [
            {
              EventBusName: EVENT_BUS_NAME,
              Source: "cloudshop.orders",
              DetailType: "order.created",
              Detail: JSON.stringify({
                orderId,
                userId,
                userEmail,
                storeId,
                items: validatedItems,
                total: order.total,
                status: "Pendiente",
                createdAt: now,
              }),
            },
          ],
        })
      );
    } catch (ebError) {
      console.error("EventBridge publish error:", ebError.message);
    }

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify(order),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error interno al crear el pedido" }),
    };
  }
};
