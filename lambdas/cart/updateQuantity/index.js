const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    try {
        const claims = event.requestContext?.authorizer?.claims;
        const cartId = claims ? claims.sub : "unknown";
        
        const productId = event.pathParameters?.productId;
        const body = JSON.parse(event.body);
        const { quantity } = body;

        if (!productId || quantity === undefined) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Missing productId or quantity" })
            };
        }

        const { Item } = await docClient.send(
            new GetCommand({
                TableName: "Cart",
                Key: { cartId }
            })
        );

        if (!Item) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Cart not found" })
            };
        }

        let cart = Item;
        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);

        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity = quantity;
        } else {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Product not found in cart" })
            };
        }

        await docClient.send(
            new PutCommand({
                TableName: "Cart",
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
            body: JSON.stringify({ message: "Error updating quantity" })
        };
    }
};
