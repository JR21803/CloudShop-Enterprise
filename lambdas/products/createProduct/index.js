const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, PutCommand} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const claims = event.requestContext.authorizer.claims;
    const ownerId = claims.sub;

    const product = {
        productId: uuidv4(),
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        shop: body.shop,
        ownerId: ownerId
    };

    await docClient.send(
        new PutCommand({
            TableName: "Files",
            Item: file
        })
    );

    return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(file)
    };
};