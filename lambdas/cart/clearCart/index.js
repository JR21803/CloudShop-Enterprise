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

        const { Item } = await docClient.send(
            new GetCommand({
                TableName: "Cart",
                Key: { cartId }
            })
        );

        let cart = Item || { cartId, products: [] };
        
        cart.products = [];

        await docClient.send(
            new PutCommand({
                TableName: "Cart",
                Item: cart
            })
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Cart cleared", cart })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error clearing cart" })
        };
    }
};
