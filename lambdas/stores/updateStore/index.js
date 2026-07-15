const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { getRole, hasRole } = require("../../roleAuth");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};

exports.handler = async (event) => {
    try {
        const storeId = event.pathParameters?.id;
        if (!storeId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Missing store id" })
            };
        }

        const claims = event.requestContext?.authorizer?.claims || {};
        const role = getRole(claims);
        if (!claims.sub) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Autenticación requerida" })
            };
        }

        if (!hasRole(claims, ["Administrador"])) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Solo el Administrador puede actualizar tiendas" })
            };
        }

        const body = JSON.parse(event.body || "{}") || {};
        
        let updateExpression = "set ";
        let expressionAttributeValues = {};
        let expressionAttributeNames = {};

        if (body.name) {
            updateExpression += "#n = :name, ";
            expressionAttributeValues[":name"] = body.name;
            expressionAttributeNames["#n"] = "name";
        }
        if (body.address) {
            updateExpression += "address = :address, ";
            expressionAttributeValues[":address"] = body.address;
        }
        if (body.phone) {
            updateExpression += "phone = :phone, ";
            expressionAttributeValues[":phone"] = body.phone;
        }

        if (Object.keys(expressionAttributeValues).length === 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "No fields to update" })
            };
        }

        updateExpression = updateExpression.slice(0, -2); // Remove trailing comma and space

        const commandParams = {
            TableName: process.env.STORES_TABLE,
            Key: { storeId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };
        
        if (Object.keys(expressionAttributeNames).length > 0) {
            commandParams.ExpressionAttributeNames = expressionAttributeNames;
        }

        const { Attributes } = await docClient.send(new UpdateCommand(commandParams));

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(Attributes)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error updating store" })
        };
    }
};
