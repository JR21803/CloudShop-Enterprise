const {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

const VALID_GROUPS = {
    Administrador: "CloudShopAdministradores",
    Operador: "CloudShopOperadores",
    Cliente: "CloudShopClientes",
};

const DEFAULT_GROUP = "CloudShopClientes";

exports.handler = async (event) => {
    try {
        const attributes = event.request?.userAttributes || {};
        const requestedRole = attributes["custom:role"];
        const groupName = VALID_GROUPS[requestedRole] || DEFAULT_GROUP;

        await client.send(
            new AdminAddUserToGroupCommand({
                UserPoolId: event.userPoolId,
                Username: event.userName,
                GroupName: groupName
            })
        );

        console.log(`Usuario ${event.userName} agregado al grupo ${groupName}`);
    } catch (error) {
        console.error("Error asignando grupo:", error);
    }

    return event;
};