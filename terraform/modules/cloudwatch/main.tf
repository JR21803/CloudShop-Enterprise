# ============================================================
# CloudWatch - Logs, Alarmas y Dashboard ejecutivo
# ============================================================

locals {
  all_lambda_functions = toset([
    "createUser", "getUsers", "getUserById", "updateUser", "deactivateUser",
    "createProduct", "getProducts", "getProductById", "updateProduct", "deleteProduct",
    "createStore", "getStores", "getStoreById", "updateStore", "deactivateStore",
    "getCart", "addProduct", "updateQuantity", "removeProduct", "clearCart",
    "totalSales", "orderByStatus", "outOfStock", "topProducts", "topCustomers", "salesByStore",
    "createOrder", "getOrders", "getOrderById", "updateOrderStatus", "cancelOrder",
    "getAudit", "processAuditEvent", "sendEmail",
  ])
}

# ── Log Groups para todas las Lambdas ────────────────────────
resource "aws_cloudwatch_log_group" "lambda_logs" {
  for_each          = local.all_lambda_functions
  name              = "/aws/lambda/${each.key}"
  retention_in_days = 14
  tags              = { Project = "CloudShop" }
}

# ── Alarmas: errores en Lambdas de pedidos ───────────────────
resource "aws_cloudwatch_metric_alarm" "order_lambda_errors" {
  for_each = toset([
    "createOrder", "getOrders", "getOrderById", "updateOrderStatus", "cancelOrder",
  ])

  alarm_name          = "cloudshop-${each.key}-errors"
  alarm_description   = "Lambda ${each.key}: más de 5 errores en 1 minuto"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  treat_missing_data  = "notBreaching"
  dimensions          = { FunctionName = each.key }
  tags                = { Project = "CloudShop" }
}

# ── Alarma: latencia alta en API Gateway ─────────────────────
resource "aws_cloudwatch_metric_alarm" "api_high_latency" {
  alarm_name          = "cloudshop-api-high-latency"
  alarm_description   = "Latencia promedio del API Gateway supera 3000ms"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Latency"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Average"
  threshold           = 3000
  treat_missing_data  = "notBreaching"
  dimensions          = { ApiName = "CloudShopAPI", Stage = "dev" }
  tags                = { Project = "CloudShop" }
}

# ── Alarma: errores 4XX (autenticación/autorización) ─────────
resource "aws_cloudwatch_metric_alarm" "api_4xx_errors" {
  alarm_name          = "cloudshop-api-4xx-errors"
  alarm_description   = "API Gateway: más de 20 errores 4XX en 1 minuto"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  threshold           = 20
  treat_missing_data  = "notBreaching"
  dimensions          = { ApiName = "CloudShopAPI", Stage = "dev" }
  tags                = { Project = "CloudShop" }
}

# ── Alarma: errores 5XX ───────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "api_5xx_errors" {
  alarm_name          = "cloudshop-api-5xx-errors"
  alarm_description   = "API Gateway: más de 10 errores 5XX en 1 minuto"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  treat_missing_data  = "notBreaching"
  dimensions          = { ApiName = "CloudShopAPI", Stage = "dev" }
  tags                = { Project = "CloudShop" }
}

# ── Dashboard ejecutivo ───────────────────────────────────────
resource "aws_cloudwatch_dashboard" "cloudshop" {
  dashboard_name = "CloudShop-Executive"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x = 0; y = 0; width = 12; height = 6
        properties = {
          title   = "API Gateway - Latencia Promedio (ms)"
          region  = var.aws_region
          view    = "timeSeries"
          period  = 60
          stat    = "Average"
          metrics = [["AWS/ApiGateway", "Latency", "ApiName", "CloudShopAPI", "Stage", "dev"]]
        }
      },
      {
        type   = "metric"
        x = 12; y = 0; width = 12; height = 6
        properties = {
          title   = "API Gateway - Errores 4XX / 5XX"
          region  = var.aws_region
          view    = "timeSeries"
          period  = 60
          stat    = "Sum"
          metrics = [
            ["AWS/ApiGateway", "4XXError", "ApiName", "CloudShopAPI", "Stage", "dev"],
            ["AWS/ApiGateway", "5XXError", "ApiName", "CloudShopAPI", "Stage", "dev"],
          ]
        }
      },
      {
        type   = "metric"
        x = 0; y = 6; width = 24; height = 6
        properties = {
          title   = "Lambda Pedidos - Errores e Invocaciones"
          region  = var.aws_region
          view    = "timeSeries"
          period  = 60
          stat    = "Sum"
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "createOrder"],
            ["AWS/Lambda", "Errors", "FunctionName", "cancelOrder"],
            ["AWS/Lambda", "Invocations", "FunctionName", "createOrder"],
            ["AWS/Lambda", "Invocations", "FunctionName", "getOrders"],
            ["AWS/Lambda", "Invocations", "FunctionName", "processAuditEvent"],
          ]
        }
      },
    ]
  })
}
