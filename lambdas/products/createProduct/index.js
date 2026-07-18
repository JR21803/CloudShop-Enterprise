const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
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
    try {
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

        if (!hasRole(claims, ["Administrador", "Operador"])) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Solo el Administrador y Operador pueden crear productos" })
            };
        }

       
        if (!body.name || body.name.trim() === "") {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "El nombre del producto es requerido" })
            };
        }

 
        if (body.description && body.description.length > 500) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "La descripción no puede exceder los 500 caracteres" })
            };
        }
        const price = Number(body.price);
        if (isNaN(price) || price < 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "El precio debe ser un número válido mayor o igual a 0" })
            };
        }

        const stock = Number(body.stock);
        if (isNaN(stock) || stock < 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "El inventario debe ser un número válido mayor o igual a 0" })
            };
        }

        
        if (!body.category || body.category.trim() === "") {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "La categoría del producto es requerida" })
            };
        }

      
        if (!body.shop || body.shop.trim() === "") {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "La tienda del producto es requerida" })
            };
        }


        const product = {
            productId: randomUUID(),
            name: body.name.trim(),
            description: body.description ? body.description.trim() : "",
            category: body.category.trim(),
            price: Math.round(price * 100) / 100, 
            stock: Math.floor(stock), 
            shop: body.shop.trim(),
            ownerId: ownerId,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };


        await docClient.send(
            new PutCommand({
                TableName: process.env.PRODUCTS_TABLE,
                Item: product
            })
        );


        try {
            await eventBridgeClient.send(new PutEventsCommand({
                Entries: [{
                    Source: "cloudshop.products",
                    DetailType: "product.created",
                    Detail: JSON.stringify({
                        userId: ownerId,
                        productId: product.productId,
                        name: product.name,
                        storeId: product.shop,
                        price: product.price,
                        stock: product.stock,
                        category: product.category
                    }),
                    EventBusName: process.env.EVENT_BUS_NAME
                }]
            }));
        } catch (eventError) {
            console.error("Error al publicar evento en EventBridge:", eventError);
            
        }

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(product)
        };

    } catch (error) {
        console.error("Error al crear producto:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Error interno del servidor al crear el producto"
            })
        };
    }
};