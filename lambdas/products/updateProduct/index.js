const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   GetCommand,
   UpdateCommand
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
        const ownerId = claims.sub;
        const productId = event.pathParameters?.id;
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

  
        if (!productId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "ID de producto requerido" })
            };
        }

       
        if (!body.name || body.name.trim() === "") {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "El nombre del producto es requerido" })
            };
        }

      
        if (!body.category || body.category.trim() === "") {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "La categoría del producto es requerida" })
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

        const existing = await docClient.send(
            new GetCommand({
                TableName: process.env.PRODUCTS_TABLE,
                Key: { productId }
            })
        );

        if (!existing.Item) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Producto no encontrado" })
            };
        }

      
        if (role !== "Administrador" && existing.Item.ownerId !== ownerId) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "No tienes permiso para actualizar este producto" })
            };
        }


        const result = await docClient.send(
            new UpdateCommand({
                TableName: process.env.PRODUCTS_TABLE,
                Key: { productId },
                UpdateExpression: "SET #n = :name, description = :description, category = :category, price = :price, stock = :stock, updatedAt = :updatedAt",
                ExpressionAttributeNames: {
                    "#n": "name"
                },
                ExpressionAttributeValues: {
                    ":name": body.name.trim(),
                    ":description": body.description ? body.description.trim() : "",
                    ":category": body.category.trim(),
                    ":price": Math.round(price * 100) / 100,
                    ":stock": Math.floor(stock), 
                    ":updatedAt": new Date().toISOString()
                },
                ConditionExpression: "attribute_exists(productId)", 
                ReturnValues: "ALL_NEW"
            })
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result.Attributes)
        };

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        
        
        if (error.name === "ConditionalCheckFailedException") {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Producto no encontrado" })
            };
        }

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error interno del servidor al actualizar el producto" })
        };
    }
};