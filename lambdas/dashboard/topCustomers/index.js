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

        const customers = {};

        orders.forEach(order => {

            const id = order.userId;

            if (!customers[id]) {

                customers[id] = {
                    userId: id,
                    name: order.userName || "Unknown",
                    orders: 0,
                    total: 0

                };

            }

            customers[id].orders++;

            customers[id].total += Number(order.total || 0);

        });

        const response = Object.values(customers)
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 10);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)

        };

    }

    catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({

                message: "Error del servidor"

            })

        };

    }

};