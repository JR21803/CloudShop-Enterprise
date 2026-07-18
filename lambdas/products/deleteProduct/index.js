const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require('roleAuth');
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const eventBridgeClient = new EventBridgeClient({});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const claims = event.requestContext?.authorizer?.claims || {};
    const role = getRole(claims);
    const ownerId = claims.sub;
    const productId = event.pathParameters.id;

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
            body: JSON.stringify({ message: "Solo el Administrador puede eliminar productos" })
        };
    }

    // Garantizar que el Operador y Cliente nunca puedan llegar a este flujo de eliminación
    if (role === "Operador" || role === "Cliente") {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Solo el Administrador puede eliminar productos" })
        };
    }

    const existing = await docClient.send(
        new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId }
        })
    );

    if (!existing.Item || (role !== "Administrador" && existing.Item.ownerId !== ownerId)) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Forbidden" })
        };
    }

    await docClient.send(
        new UpdateCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId },
            UpdateExpression: "SET #s = :deleted",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":deleted": "DELETED" }
        })
    );

    try {
        await eventBridgeClient.send(new PutEventsCommand({
            Entries: [{
                Source: "cloudshop.products",
                DetailType: "product.deleted",
                Detail: JSON.stringify({
                    userId: ownerId,
                    productId: productId
                }),
                EventBusName: process.env.EVENT_BUS_NAME
            }]
        }));
    } catch (eventError) {
        console.error("Error publicando evento de auditoría (no crítico):", eventError);
    }

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Deleted successfully" })
    };
};