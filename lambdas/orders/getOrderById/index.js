const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require('roleAuth');

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const ORDERS_TABLE = process.env.ORDERS_TABLE;

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
        body: JSON.stringify({ message: "No tienes permisos para ver pedidos" }),
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

    // El cliente solo puede ver sus propios pedidos
    if (role === "Cliente" && order.userId !== userId) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No tienes permisos para ver este pedido" }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(order),
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error interno al consultar el pedido" }),
    };
  }
};
