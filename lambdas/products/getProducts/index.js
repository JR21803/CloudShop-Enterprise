const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   ScanCommand
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

    if (!claims.sub) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Autenticación requerida" })
        };
    }

    const allowedRoles = ["Administrador", "Operador", "Cliente"];
    if (!role || !allowedRoles.includes(role)) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Rol no autorizado" })
        };
    }

    const result = await docClient.send(
        new ScanCommand({
            TableName: process.env.PRODUCTS_TABLE
        })
    );

    const products = result.Items;

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(products)
    };
};