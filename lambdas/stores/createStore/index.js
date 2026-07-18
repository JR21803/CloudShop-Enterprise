const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const { getRole, hasRole } = require('roleAuth');

const { randomUUID } = require("crypto");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}") || {};
        const claims = event.requestContext?.authorizer?.claims || {};
        const role = getRole(claims);
        const ownerId = claims.sub || "unknown";

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
                body: JSON.stringify({ message: "Solo el Administrador puede crear tiendas" })
            };
        }

        const store = {
            storeId: randomUUID(),
            name: body.name,
            address: body.address,
            phone: body.phone,
            status: "ACTIVE",
            ownerId: ownerId
        };

        await docClient.send(
            new PutCommand({
                TableName: process.env.STORES_TABLE,
                Item: store
            })
        );

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(store)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error creating store" })
        };
    }
};
