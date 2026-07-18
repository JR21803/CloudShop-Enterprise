const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   GetCommand
} = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require('roleAuth');
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

    if (!claims.sub) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Autenticación requerida" })
        };
    }

    if (!role) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Rol no autorizado" })
        };
    }

    const result = await docClient.send(
        new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId }
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Item)
    };
};