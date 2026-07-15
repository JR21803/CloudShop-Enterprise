const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   GetCommand,
   UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require("../../roleAuth");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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
    const body = JSON.parse(event.body || "{}") || {};

    if (!claims.sub) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Autenticación requerida" })
        };
    }

    if (!hasRole(claims, ["Administrador", "Operador"])) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Solo Administrador u Operador pueden actualizar productos" })
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

    const result = await docClient.send(
        new UpdateCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId },
            UpdateExpression:
                "SET #n = :name, description = :description, category = :category, price = :price, stock = :stock",
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ExpressionAttributeValues: {
                ":name": body.name,
                ":description": body.description,
                ":category": body.category,
                ":price": body.price,
                ":stock": body.stock,
            },
            ReturnValues: "ALL_NEW"
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Attributes)
    };
};