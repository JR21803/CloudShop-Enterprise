const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({});
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "noreply@cloudshop.com";

exports.handler = async (event) => {
  console.log("Email notification event:", JSON.stringify(event, null, 2));

  try {
    const detailType = event["detail-type"];
    const detail = event.detail || {};

    if (!detail.userEmail) {
      console.warn("No userEmail in event detail, skipping email.");
      return { statusCode: 200, body: "No email to send" };
    }

    const { subject, body } = buildEmail(detailType, detail);

    await sesClient.send(
      new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: [detail.userEmail] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: body, Charset: "UTF-8" },
          },
        },
      })
    );

    console.log("Email sent to:", detail.userEmail);
    return { statusCode: 200, body: "Email sent" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { statusCode: 500, body: "Email error logged" };
  }
};

function buildEmail(detailType, detail) {
  const orderIdShort = (detail.orderId || "").substring(0, 8).toUpperCase();
  const total = (detail.total || 0).toFixed(2);
  const itemCount = (detail.items || []).length;

  if (detailType === "order.created") {
    return {
      subject: `CloudShop Enterprise - Pedido #${orderIdShort} recibido`,
      body: `
        <h2>¡Tu pedido ha sido recibido!</h2>
        <p>Hola,</p>
        <p>Confirmamos la recepción de tu pedido en <strong>CloudShop Enterprise</strong>.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Número de pedido</strong></td><td style="padding:8px;border:1px solid #ddd">#${orderIdShort}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Productos</strong></td><td style="padding:8px;border:1px solid #ddd">${itemCount} artículo(s)</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Total</strong></td><td style="padding:8px;border:1px solid #ddd">$${total} USD</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Estado</strong></td><td style="padding:8px;border:1px solid #ddd">Pendiente</td></tr>
        </table>
        <p>Puedes consultar el estado de tu pedido en cualquier momento desde tu cuenta.</p>
        <p>Gracias por tu compra.</p>
        <p><em>CloudShop Enterprise</em></p>
      `,
    };
  }

  if (detailType === "order.cancelled") {
    return {
      subject: `CloudShop Enterprise - Pedido #${orderIdShort} cancelado`,
      body: `
        <h2>Tu pedido ha sido cancelado</h2>
        <p>Hola,</p>
        <p>Te informamos que el pedido <strong>#${orderIdShort}</strong> ha sido cancelado.</p>
        <p>Si tienes dudas, no dudes en contactarnos.</p>
        <p><em>CloudShop Enterprise</em></p>
      `,
    };
  }

  return {
    subject: `CloudShop Enterprise - Notificación de pedido`,
    body: `<p>Ha ocurrido un evento en tu pedido <strong>#${orderIdShort}</strong>.</p>`,
  };
}
