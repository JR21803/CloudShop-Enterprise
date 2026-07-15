const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");


const {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const userId = event.pathParameters.userId;

        const existingUser = await docClient.send(

            new GetCommand({
                TableName: process.env.USERS_TABLE,
                Key: {
                    userId: userId
                }
            })
        );

        if (!ExistingUser.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario no encontrado" })
            };
        }

        await docClient.send(
            new UpdateCommand({
                TableName: process.env.USERS_TABLE,
                Key: {
                    userId: userId
                },

                UpdateExpression: "SET #s = :status",

                ExpressionAttributeNames: {
                    "#s": "status"
                },

                ExpressionAttributeValues: {
                    ":status": "inactive"
                }
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Usuario desactivado correctamente" })
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