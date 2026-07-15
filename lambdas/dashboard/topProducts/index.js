const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");



const {
    DynamoDBDocumentClient,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async () => {

    try {

        const result = await docClient.send(

            new ScanCommand({

                TableName: process.env.ORDERS_TABLE

            })

        );

        const orders = result.Items || [];

        const products = {};

        orders.forEach(order => {

            const items = order.items || [];

            items.forEach(item => {
                const id = item.productId;

                if (!products[id]) {

                    products[id] = {

                        productId: id,

                        name: item.name,

                        sold: 0

                    };

                }

                products[id].sold+= Number(item.quantity || 0);

            });

        });

        const response = Object.values(products)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        return {

            statusCode: 200,

            body: JSON.stringify(response)

        };

    }

    catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({

                message: "Error del servidor"

            })

        };

    }

};