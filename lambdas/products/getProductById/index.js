const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   GetCommand
} = require("@aws-sdk/lib-dynamodb");

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

    const result = await docClient.send(
        new GetCommand({
            TableName: "Products",
            Key: { productId }
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Item)
    };
};