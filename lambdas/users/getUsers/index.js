const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require("../../roleAuth");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async (event) => {
    try {
        const claims = event.requestContext?.authorizer?.claims || {};
        const role = getRole(claims);

        if (!claims.sub) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Autenticación requerida" })
            };
        }

        if (!hasRole(claims, ["Administrador"])) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Solo el Administrador puede consultar usuarios" })
            };
        }

        const result = await docClient.send(
            new ScanCommand({ TableName: process.env.USERS_TABLE })
        );

        const users = (result.Items || []).filter((user) => user.status === "ACTIVE");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(users)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error del servidor" })
        };
    }
};