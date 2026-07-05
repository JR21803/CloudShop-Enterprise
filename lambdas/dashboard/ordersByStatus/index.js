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

        const summary = {};

        orders.forEach((order) => {

            const status = order.status || "DESCONOCIDO";
            
            summary[status] = summary[status] || 0 + 1;
        });

        const response = Object.keys(summary).map(status => ({
            status,
            count: summary[status]
        }));

        
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