const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
   DynamoDBDocumentClient,
   ScanCommand
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

    const result = await docClient.send(
        new ScanCommand({
            TableName: process.env.PRODUCTS_TABLE
        })
    );

    const products = result.Items

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(products)
    };
};