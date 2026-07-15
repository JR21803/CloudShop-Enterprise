variable "aws_region" {
  description = "AWS region for the Lambda execution role policies"
  type        = string
}

variable "users_table" {
  description = "Users DynamoDB table name"
  type        = string
}

variable "products_table" {
  description = "Products DynamoDB table name"
  type        = string
}

variable "stores_table" {
  description = "Stores DynamoDB table name"
  type        = string
}

variable "cart_table" {
  description = "Cart DynamoDB table name"
  type        = string
}

variable "orders_table" {
  description = "Orders DynamoDB table name"
  type        = string
}

variable "audit_table" {
  description = "Audit DynamoDB table name"
  type        = string
}

variable "eventbridge_bus_name" {
  description = "Name of the CloudShop EventBridge bus"
  type        = string
  default     = "cloudshop-events"
}

variable "ses_from_email" {
  description = "Verified SES email identity used by the notification Lambda"
  type        = string
  default     = "noreply@cloudshop.com"
}
