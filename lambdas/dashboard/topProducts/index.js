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

        
        const orders = (result.Items || []).filter(order => order.status !== "Cancelado");

        const products = {};

        orders.forEach(order => {
            const items = order.items || [];

            items.forEach(item => {
                const id = item.productId;

                if (!products[id]) {
                    products[id] = {
                        productId: id,
                        name: item.name,
                        sold: 0,
                        revenue: 0
                    };
                }

                products[id].sold += Number(item.quantity || 0);
                products[id].revenue += Number(item.subtotal || (item.price * item.quantity) || 0);
            });
        });

        const response = Object.values(products)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
            .map(p => ({
                ...p,
                revenue: Math.round(p.revenue * 100) / 100
            })
        
        
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)
        };

    } catch (error) {
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