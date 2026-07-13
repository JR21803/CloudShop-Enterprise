const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const store = {
        storeId: crypto.randomUUID(),
        name: body.name,
        address: body.address,
        phone: body.phone,
        status: "ACTIVE"
    };

    await docClient.send(
        new PutCommand({
            TableName: "Stores",
            Item: store
        })
    );

    return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(store)
    };
};
