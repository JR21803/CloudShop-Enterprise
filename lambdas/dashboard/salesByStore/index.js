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
                TableName: "Orders"
            })

        );

        const orders = result.Items || [];

        const stores = {};

        orders.forEach(order => {

            const id = order.storeId || "DESCONOCIDO";

            if (!stores[id]) {

                stores[id] = {
                    storeId: id,
                    name: order.storeName || "DESCONOCIDO",
                    sales: 0,
                    orders: 0

                };

            }

            stores[id].sales += Number(order.total || 0);

            stores[id].orders++;


        });

        return {
            statusCode: 200,
            body: JSON.stringify(
                Object.values(stores)
            )

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