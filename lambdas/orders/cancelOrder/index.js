const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const ORDERS_TABLE = "Orders";
const PRODUCTS_TABLE = "Products";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

// Estados desde los que un Cliente puede solicitar cancelación
const CANCELLABLE_BY_CLIENT = ["Pendiente"];

exports.handler = async (event) => {
  try {
    const claims = event.requestContext?.authorizer?.claims || {};
    const role = claims["custom:role"] || claims.role;
    const userId = claims.sub;

    if (!role) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No autenticado" }),
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

    // El cliente solo puede cancelar sus propios pedidos
    if (role === "Cliente" && order.userId !== userId) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No tienes permisos para cancelar este pedido" }),
      };
    }

    // El cliente solo puede cancelar pedidos en estado Pendiente
    if (role === "Cliente" && !CANCELLABLE_BY_CLIENT.includes(order.status)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: `No es posible cancelar un pedido en estado "${order.status}". Solo puedes cancelar pedidos en estado: ${CANCELLABLE_BY_CLIENT.join(", ")}`,
        }),
      };
    }

    if (order.status === "Cancelado") {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "El pedido ya está cancelado" }),
      };
    }

    if (order.status === "Entregado") {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No se puede cancelar un pedido ya entregado" }),
      };
    }

    const now = new Date().toISOString();

    // Restaurar stock de todos los productos del pedido
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

    // Marcar el pedido como Cancelado
    await docClient.send(
      new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { orderId },
        UpdateExpression: "SET #s = :status, updatedAt = :now, cancelledBy = :uid",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":status": "Cancelado",
          ":now": now,
          ":uid": userId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        orderId,
        status: "Cancelado",
        cancelledBy: userId,
        cancelledAt: now,
        message: "Pedido cancelado correctamente. El stock ha sido restaurado.",
      }),
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error interno al cancelar el pedido" }),
    };
  }
};
