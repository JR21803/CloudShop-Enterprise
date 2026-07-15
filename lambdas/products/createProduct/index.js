const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, PutCommand} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { getRole, hasRole } = require("../../roleAuth");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const body = JSON.parse(event.body || "{}") || {};
    const claims = event.requestContext?.authorizer?.claims || {};
    const role = getRole(claims);
    const ownerId = claims.sub;

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
            body: JSON.stringify({ message: "Solo el Administrador puede crear productos" })
        };
    }

    const product = {
        productId: uuidv4(),
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        shop: body.shop,
        ownerId: ownerId
    };

    await docClient.send(
        new PutCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Item: product
        })
    );

    return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(product)
    };
};