const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require("../../roleAuth");

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
        body: JSON.stringify({ message: "No tienes permisos para consultar pedidos" }),
      };
    }

    let scanParams = { TableName: ORDERS_TABLE };

    if (role === "Cliente") {
      // El cliente solo ve sus propios pedidos
      scanParams.FilterExpression = "userId = :uid";
      scanParams.ExpressionAttributeValues = { ":uid": userId };
    } else if (role === "Administrador") {
      // El Administrador ve todos los pedidos
      const statusFilter = event.queryStringParameters?.status;
      if (statusFilter) {
        scanParams.FilterExpression = "#s = :status";
        scanParams.ExpressionAttributeNames = { "#s": "status" };
        scanParams.ExpressionAttributeValues = { ":status": statusFilter };
      }
    } else if (role === "Operador") {
      // El Operador solo ve pedidos que requieren gestión operativa, no reportes ni usuarios
      scanParams.FilterExpression = "#s IN (:pending, :confirmed, :preparing, :sent)";
      scanParams.ExpressionAttributeNames = { "#s": "status" };
      scanParams.ExpressionAttributeValues = {
        ":pending": "Pendiente",
        ":confirmed": "Confirmado",
        ":preparing": "En preparación",
        ":sent": "Enviado",
      };
    } else {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "No tienes permisos para consultar pedidos" }),
      };
    }

    const result = await docClient.send(new ScanCommand(scanParams));
    const orders = result.Items || [];

    // Ordenar del más reciente al más antiguo
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ orders, count: orders.length }),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error interno al consultar pedidos" }),
    };
  }
};
