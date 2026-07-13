const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const ownerId = claims.sub;
    const productId = event.pathParameters.id;

    const existing = await docClient.send(
        new GetCommand({
            TableName: "Products",
            Key: { productId }
        })
    );

    if (!existing.Item || existing.Item.ownerId !== ownerId) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Forbidden" })
        };
    }

    await docClient.send(
        new UpdateCommand({
            TableName: "Products",
            Key: { productId },
            UpdateExpression: "SET #s = :deleted",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":deleted": "DELETED" }
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Deleted successfully" })
    };
};