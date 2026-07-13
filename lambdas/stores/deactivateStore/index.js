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

    await docClient.send(
        new UpdateCommand({
            TableName: "Stores",
            Key: { storeId },
            UpdateExpression: "SET #s = :status",
            ExpressionAttributeNames: {
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":status": "INACTIVE"
            }
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Store deactivated successfully" })
    };
};
