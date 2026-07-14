# ============================================================
# EventBridge - Bus personalizado y reglas de CloudShop
# ============================================================

resource "aws_cloudwatch_event_bus" "cloudshop" {
  name = "cloudshop-events"
  tags = { Project = "CloudShop" }
}

# ── Regla: order.created ─────────────────────────────────────
resource "aws_cloudwatch_event_rule" "order_created" {
  name           = "cloudshop-order-created"
  description    = "Captura eventos de pedidos creados"
  event_bus_name = aws_cloudwatch_event_bus.cloudshop.name

  event_pattern = jsonencode({
    source        = ["cloudshop.orders"]
    "detail-type" = ["order.created"]
  })

  tags = { Project = "CloudShop" }
}

# ── Regla: order.cancelled ───────────────────────────────────
resource "aws_cloudwatch_event_rule" "order_cancelled" {
  name           = "cloudshop-order-cancelled"
  description    = "Captura eventos de pedidos cancelados"
  event_bus_name = aws_cloudwatch_event_bus.cloudshop.name

  event_pattern = jsonencode({
    source        = ["cloudshop.orders"]
    "detail-type" = ["order.cancelled"]
  })

  tags = { Project = "CloudShop" }
}

# ── Targets: order.created ───────────────────────────────────
resource "aws_cloudwatch_event_target" "audit_on_order_created" {
  rule           = aws_cloudwatch_event_rule.order_created.name
  event_bus_name = aws_cloudwatch_event_bus.cloudshop.name
  target_id      = "processAuditEventCreated"
  arn            = var.process_audit_event_arn
}

resource "aws_cloudwatch_event_target" "email_on_order_created" {
  rule           = aws_cloudwatch_event_rule.order_created.name
  event_bus_name = aws_cloudwatch_event_bus.cloudshop.name
  target_id      = "sendEmailOnOrderCreated"
  arn            = var.send_email_arn
}

# ── Targets: order.cancelled ─────────────────────────────────
resource "aws_cloudwatch_event_target" "audit_on_order_cancelled" {
  rule           = aws_cloudwatch_event_rule.order_cancelled.name
  event_bus_name = aws_cloudwatch_event_bus.cloudshop.name
  target_id      = "processAuditEventCancelled"
  arn            = var.process_audit_event_arn
}

# ── Permisos: EventBridge → Lambda ───────────────────────────
resource "aws_lambda_permission" "allow_eb_audit_created" {
  statement_id  = "AllowEventBridgeAuditOnOrderCreated"
  action        = "lambda:InvokeFunction"
  function_name = var.process_audit_event_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.order_created.arn
}

resource "aws_lambda_permission" "allow_eb_email_created" {
  statement_id  = "AllowEventBridgeEmailOnOrderCreated"
  action        = "lambda:InvokeFunction"
  function_name = var.send_email_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.order_created.arn
}

resource "aws_lambda_permission" "allow_eb_audit_cancelled" {
  statement_id  = "AllowEventBridgeAuditOnOrderCancelled"
  action        = "lambda:InvokeFunction"
  function_name = var.process_audit_event_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.order_cancelled.arn
}
