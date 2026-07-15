const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require("../../roleAuth");

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
        const cartId = claims.sub || "unknown";

        if (!claims.sub) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Autenticación requerida" })
            };
        }

        if (!role || !hasRole(claims, ["Cliente"])) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Solo los Clientes pueden agregar productos al carrito" })
            };
        }

        const body = JSON.parse(event.body || "{}");
        const { productId, quantity, price } = body;

        if (!productId || quantity === undefined) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Missing productId or quantity" })
            };
        }

        const { Item } = await docClient.send(
            new GetCommand({
                TableName: process.env.CART_TABLE,
                Key: { cartId }
            })
        );

        let cart = Item || { cartId, products: [] };
        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);

        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity, price: price || 0 });
        }

        await docClient.send(
            new PutCommand({
                TableName: process.env.CART_TABLE,
                Item: cart
            })
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(cart)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error adding product to cart" })
        };
    }
};
