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

        const body = JSON.parse(event.body || "{}");

        const ExistingUser = await docClient.send(

            new GetCommand({
                TableName: "Users",
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
                TableName: "Users",
                Key: {
                    userId: userId
                },

                UpdateExpression: "SET #n = :n, email = :e, #r = :r",

                ExpressionAttributeNames: {
                    "#n": "name",
                    "#r": "role"
                },

                ExpressionAttributeValues: {
                    ":n": body.name,
                    ":e": body.email,
                    ":r": body.role
                }
            })
        );

        const updatedUser = await docClient.send(

            new GetCommand({
                TableName: "Users",
                Key: {
                    userId: userId
                }
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify(updatedUser.Item)
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