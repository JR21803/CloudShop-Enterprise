const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const AUDIT_TABLE = process.env.AUDIT_TABLE;

// Mapeo de EventBridge detail-type → nombre de acción en auditoría
const ACTION_MAP = {
  "order.created": "CREAR_PEDIDO",
  "order.cancelled": "CANCELAR_PEDIDO",
  "order.status_updated": "ACTUALIZAR_PEDIDO",
  "product.deleted": "ELIMINAR_PRODUCTO",
  "user.created": "CREAR_USUARIO",
};

exports.handler = async (event) => {
  console.log("Audit event received:", JSON.stringify(event, null, 2));

  try {
    const detailType = event["detail-type"] || "EVENTO_DESCONOCIDO";
    const detail = event.detail || {};

    const accion = ACTION_MAP[detailType] || detailType.toUpperCase().replace(/\./g, "_");
    const usuario = detail.userId || detail.userEmail || "sistema";
    const fecha = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

   const auditRecord = {
      auditId: randomUUID(),
      usuario,
      accion,
      fecha,
      resultado: "EXITOSO",
      detalles: {
        source: event.source,
        detailType,
        orderId: detail.orderId || null,
        productId: detail.productId || null,
        productName: detail.name || null,
        userEmail: detail.userEmail || null,
        total: detail.total || null,
        storeId: detail.storeId || null,
        status: detail.status || null,
      },
      timestamp: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({ TableName: AUDIT_TABLE, Item: auditRecord })
    );

    console.log("Audit record saved:", auditRecord.auditId);
    return { statusCode: 200, body: "Audit record saved" };
  } catch (error) {
    console.error("Error saving audit record:", error);
    // No lanzar el error: EventBridge reintentaría y llenaría la tabla con duplicados
    return { statusCode: 500, body: "Audit error logged" };
  }
};
