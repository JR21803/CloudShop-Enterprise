const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const ORDERS_TABLE = process.env.ORDERS_TABLE;
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

// Máquina de estados del pedido
const VALID_TRANSITIONS = {
  Pendiente: ["Confirmado", "Cancelado"],
  Confirmado: ["En preparación", "Cancelado"],
  "En preparación": ["Enviado", "Cancelado"],
  Enviado: ["Entregado"],
  Entregado: [],
  Cancelado: [],
};

exports.handler = async (event) => {
  try {
    const claims = event.requestContext?.authorizer?.claims || {};
    const role = claims["custom:role"] || claims.role;
    const userId = claims.sub;

    // Solo Administrador y Operador pueden cambiar estado de pedidos
    if (!["Administrador", "Operador"].includes(role)) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Solo Administrador u Operador pueden actualizar el estado del pedido" }),
      };
    }

    const orderId = event.pathParameters?.id;
    if (!orderId) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Se requiere el ID del pedido" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { status: newStatus } = body;

    if (!newStatus) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Se requiere el nuevo estado (status)" }),
      };
    }

    if (!Object.keys(VALID_TRANSITIONS).includes(newStatus)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: `Estado inválido. Valores permitidos: ${Object.keys(VALID_TRANSITIONS).join(", ")}`,
        }),
      };
    }

    const { Item: order } = await docClient.send(
      new GetCommand({ TableName: ORDERS_TABLE, Key: { orderId } })
    );

    if (!order) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Pedido no encontrado" }),
      };
    }

    const currentStatus = order.status;
    const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowedNext.includes(newStatus)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: `Transición inválida: ${currentStatus} → ${newStatus}. Transiciones permitidas: ${allowedNext.join(", ") || "ninguna (estado final)"}`,
        }),
      };
    }

    const now = new Date().toISOString();

    // Si se cancela, restaurar stock
    if (newStatus === "Cancelado" && currentStatus !== "Cancelado") {
      for (const item of order.items || []) {
        await docClient.send(
          new UpdateCommand({
            TableName: PRODUCTS_TABLE,
            Key: { productId: item.productId },
            UpdateExpression: "SET stock = stock + :qty, updatedAt = :now",
            ExpressionAttributeValues: {
              ":qty": item.quantity,
              ":now": now,
            },
          })
        );
      }
    }

    await docClient.send(
      new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { orderId },
        UpdateExpression: "SET #s = :status, updatedAt = :now, updatedBy = :updatedBy",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":status": newStatus,
          ":now": now,
          ":updatedBy": userId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        orderId,
        previousStatus: currentStatus,
        status: newStatus,
        updatedAt: now,
      }),
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error interno al actualizar el estado del pedido" }),
    };
  }
};
