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

        const stores = {};

        orders.forEach(order => {

            const id = order.storeId || "DESCONOCIDO";

            if (!stores[id]) {

                stores[id] = {
                    storeId: id,
                    name: order.storeName || "DESCONOCIDO",
                    sales: 0,
                    orders: 0

                };

            }

            stores[id].sales += Number(order.total || 0);

            stores[id].orders++;


        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(
                Object.values(stores)
            )

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