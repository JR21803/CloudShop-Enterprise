const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");


const {
    DynamoDBDocumentClient,
    PutCommand
} = require("@aws-sdk/lib-dynamodb");


const { v4: uuidv4 } = require("uuid");
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");

        if (!body.name || body.name.trim() === "") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Un nombre es requerido" })
            };
        }

        if (!body.email || body.email.trim() === "") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Un email es requerido" })
            };
        }
            
        const user = {
            userId: uuidv4(),
            name: body.name,
            email: body.email,
            role: body.role || "Cliente",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
        };

        await docClient.send(
            new PutCommand({
                TableName: process.env.USERS_TABLE,
                Item: user
            })
        );
        return {
            statusCode: 201,
            body: JSON.stringify(user)
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al crear usuario" })
        };
    }
};