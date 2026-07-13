const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const storeId = event.pathParameters.id;
    const body = JSON.parse(event.body);

    const result = await docClient.send(
        new UpdateCommand({
            TableName: "Stores",
            Key: { storeId },
            UpdateExpression: "SET #n = :name, address = :address, phone = :phone",
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ExpressionAttributeValues: {
                ":name": body.name,
                ":address": body.address,
                ":phone": body.phone
            },
            ReturnValues: "ALL_NEW"
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Attributes)
    };
};
