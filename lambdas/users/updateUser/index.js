const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand,
    AdminRemoveUserFromGroupCommand,
    AdminListGroupsForUserCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const { getRole, hasRole } = require('roleAuth');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const cognitoClient = new CognitoIdentityProviderClient({});

const USER_POOL_ID = process.env.USER_POOL_ID;

const GROUP_BY_ROLE = {
    Administrador: "CloudShopAdministradores",
    Operador: "CloudShopOperadores",
    Cliente: "CloudShopClientes",
};

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async (event) => {
    try {
        const claims = event.requestContext?.authorizer?.claims || {};
        const userId = event.pathParameters.userId;
        const body = JSON.parse(event.body || "{}");

        if (!claims.sub) {
            return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ message: "Autenticación requerida" }) };
        }

        if (!hasRole(claims, ["Administrador"])) {
            return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ message: "Solo el Administrador puede actualizar usuarios" }) };
        }

        const existingUser = await docClient.send(
            new GetCommand({ TableName: process.env.USERS_TABLE, Key: { userId } })
        );

        if (!existingUser.Item) {
            return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ message: "Usuario no encontrado" }) };
        }

        await docClient.send(
            new UpdateCommand({
                TableName: process.env.USERS_TABLE,
                Key: { userId },
                UpdateExpression: "SET #n = :n, email = :e, #r = :r",
                ExpressionAttributeNames: { "#n": "name", "#r": "role" },
                ExpressionAttributeValues: { ":n": body.name, ":e": body.email, ":r": body.role }
            })
        );

        
        if (body.role && GROUP_BY_ROLE[body.role]) {
            try {
                const cognitoUsername = existingUser.Item.email; 

                const currentGroups = await cognitoClient.send(
                    new AdminListGroupsForUserCommand({ UserPoolId: USER_POOL_ID, Username: cognitoUsername })
                );

    
                for (const group of currentGroups.Groups || []) {
                    if (Object.values(GROUP_BY_ROLE).includes(group.GroupName)) {
                        await cognitoClient.send(
                            new AdminRemoveUserFromGroupCommand({
                                UserPoolId: USER_POOL_ID,
                                Username: cognitoUsername,
                                GroupName: group.GroupName
                            })
                        );
                    }
                }

                // Agregar al nuevo grupo
                await cognitoClient.send(
                    new AdminAddUserToGroupCommand({
                        UserPoolId: USER_POOL_ID,
                        Username: cognitoUsername,
                        GroupName: GROUP_BY_ROLE[body.role]
                    })
                );
            } catch (cognitoError) {
                console.error("Error sincronizando grupo de Cognito (no crítico):", cognitoError);
            }
        }

        const updatedUser = await docClient.send(
            new GetCommand({ TableName: process.env.USERS_TABLE, Key: { userId } })
        );

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(updatedUser.Item) };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: "Error del servidor" }) };
    }
};