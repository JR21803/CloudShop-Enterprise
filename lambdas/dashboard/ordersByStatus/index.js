const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require('roleAuth');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
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

        if (!role || !hasRole(claims, ["Administrador", "Operador"])) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Solo el Administrador u Operador puede consultar este reporte" })
            };
        }

        const result = await docClient.send(
            new ScanCommand({
                TableName: process.env.ORDERS_TABLE
            })
        );

        const orders = result.Items || [];
        const summary = {};

        orders.forEach((order) => {
            const status = order.status || "DESCONOCIDO";
            summary[status] = (summary[status] || 0) + 1;
        });

        const response = Object.keys(summary).map(status => ({
            status,
            count: summary[status]
        }));

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error del servidor" })
        };
    }
};