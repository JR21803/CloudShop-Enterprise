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
                TableName: "Orders"
            })
        );

        const orders = result.Items || [];

        let totalSales = 0;

        orders.forEach((order) => {
            totalSales += Number(order.total || 0);
        });
            
        return {
            statusCode: 200,
            body: JSON.stringify({ totalOrders: orders.length, totalSales: totalSales })
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