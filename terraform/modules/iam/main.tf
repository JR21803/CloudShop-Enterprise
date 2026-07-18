locals {
  dynamodb_table_arns = [
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.users_table}",
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.products_table}",
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.stores_table}",
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.cart_table}",
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.orders_table}",
    "arn:aws:dynamodb:${var.aws_region}:*:table/${var.audit_table}"
  ]
}

resource "aws_iam_role" "lambda_role" {
  name = "cloudshop-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "dynamodb_policy" {
  name = "cloudshop-dynamodb-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = local.dynamodb_table_arns
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "dynamodb_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.dynamodb_policy.arn
}

# ── Política: EventBridge (PutEvents al bus de CloudShop) ────
resource "aws_iam_policy" "eventbridge_policy" {
  name = "cloudshop-eventbridge-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["events:PutEvents"]
        Resource = "arn:aws:events:${var.aws_region}:*:event-bus/${var.eventbridge_bus_name}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eventbridge_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.eventbridge_policy.arn
}

# ── Política: SES (SendEmail para notificaciones) ─────────────
resource "aws_iam_policy" "ses_policy" {
  name = "cloudshop-ses-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ses:SendEmail", "ses:SendRawEmail"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ses_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.ses_policy.arn
}
