const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");


const {
    DynamoDBDocumentClient,
    GetCommand
} = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const userId = event.pathParameters.userId;

        const result = await docClient.send(

            new GetCommand({
                TableName: "Users",
                Key: {
                    userId: userId
                }
            })
        );

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario no encontrado" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item)
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