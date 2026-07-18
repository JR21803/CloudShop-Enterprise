const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { getRole, hasRole } = require('roleAuth');
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const eventBridgeClient = new EventBridgeClient({});


exports.handler = async (event) => {
    try {
        const claims = event.requestContext?.authorizer?.claims || {};
        const role = getRole(claims);
        const body = JSON.parse(event.body || "{}");

        if (!claims.sub) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Autenticación requerida" })
            };
        }

        if (!role || !hasRole(claims, ["Administrador"])) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: "Solo el Administrador puede crear usuarios" })
            };
        }

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

        try {

            await eventBridgeClient.send(new PutEventsCommand({
                Entries: [{
                    Source: "cloudshop.users",
                    DetailType: "user.created",
                    Detail: JSON.stringify({
                        userId: user.userId,
                        userEmail: user.email
                    }),
                    EventBusName: process.env.EVENT_BUS_NAME
                }]
            }));
        } catch (eventError) {
            console.error("Error publicando evento de auditoría (no crítico):", eventError);
        }

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