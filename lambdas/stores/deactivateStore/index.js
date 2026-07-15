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
    try {
        const storeId = event.pathParameters?.id;

        if (!storeId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Missing store id" })
            };
        }

        const { Attributes } = await docClient.send(
            new UpdateCommand({
                TableName: process.env.STORES_TABLE,
                Key: { storeId },
                UpdateExpression: "set #status = :status",
                ExpressionAttributeNames: {
                    "#status": "status"
                },
                ExpressionAttributeValues: {
                    ":status": "INACTIVE"
                },
                ReturnValues: "ALL_NEW"
            })
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Store deactivated", store: Attributes })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error deactivating store" })
        };
    }
};
