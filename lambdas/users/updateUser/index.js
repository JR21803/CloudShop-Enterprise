const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
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
        const userId = event.pathParameters.userId;
        const body = JSON.parse(event.body || "{}");

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
                body: JSON.stringify({ message: "Solo el Administrador puede actualizar usuarios" })
            };
        }

        const existingUser = await docClient.send(
            new GetCommand({ TableName: process.env.USERS_TABLE, Key: { userId } })
        );

        if (!existingUser.Item) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Usuario no encontrado" })
            };
        }

        await docClient.send(
            new UpdateCommand({
                TableName: process.env.USERS_TABLE,
                Key: { userId },
                UpdateExpression: "SET #n = :n, email = :e, #r = :r",
                ExpressionAttributeNames: { "#n": "name", "#r": "role" },
                ExpressionAttributeValues: { ":n": body.name, ":e": body.email, ":r": body.role }
            })
        );

        const updatedUser = await docClient.send(
            new GetCommand({ TableName: process.env.USERS_TABLE, Key: { userId } })
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(updatedUser.Item)
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