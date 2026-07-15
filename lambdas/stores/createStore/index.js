const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        
        const claims = event.requestContext?.authorizer?.claims;
        const ownerId = claims ? claims.sub : "unknown";

        const store = {
            storeId: uuidv4(),
            name: body.name,
            address: body.address,
            phone: body.phone,
            status: "ACTIVE",
            ownerId: ownerId
        };

        await docClient.send(
            new PutCommand({
                TableName: process.env.STORES_TABLE,
                Item: store
            })
        );

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(store)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error creating store" })
        };
    }
};
