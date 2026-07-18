const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require('roleAuth');

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const AUDIT_TABLE = process.env.AUDIT_TABLE;

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

    if (!claims.sub) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Autenticación requerida" }),
      };
    }

    if (!hasRole(claims, ["Administrador"])) {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Acceso denegado: solo el Administrador puede consultar la auditoría" }),
      };
    }

    const qp = event.queryStringParameters || {};
    const scanParams = { TableName: AUDIT_TABLE };

    const filters = [];
    const attrValues = {};

    if (qp.accion) {
      filters.push("accion = :accion");
      attrValues[":accion"] = qp.accion;
    }
    if (qp.fecha) {
      filters.push("fecha = :fecha");
      attrValues[":fecha"] = qp.fecha;
    }
    if (qp.usuario) {
      filters.push("usuario = :usuario");
      attrValues[":usuario"] = qp.usuario;
    }
    if (qp.resultado) {
      filters.push("resultado = :resultado");
      attrValues[":resultado"] = qp.resultado;
    }

    if (filters.length > 0) {
      scanParams.FilterExpression = filters.join(" AND ");
      scanParams.ExpressionAttributeValues = attrValues;
    }

    const result = await docClient.send(new ScanCommand(scanParams));
    const records = result.Items || [];

    records.sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ records, count: records.length }),
    };
  } catch (error) {
    console.error("Error fetching audit records:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error al consultar registros de auditoría" }),
    };
  }
};
