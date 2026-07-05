const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");


const {
    DynamoDBDocumentClient,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const result = await docClient.send(

            new ScanCommand({
                TableName: "Products"
            })
        );

        const products = result.Items || [];

        const outOfStock = products.filter(product => Number(product.stock || 0) <= 0);

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error del servidor" })
        };
    }
};