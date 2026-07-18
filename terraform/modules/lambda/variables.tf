variable "lambda_role_arn" {
  type = string
}

variable "ses_from_email" {
  type    = string
  default = "noreply@cloudshop.com"
}

variable "users_table" {
  type    = string
  default = "Users"
}

variable "products_table" {
  type    = string
  default = "Products"
}

variable "stores_table" {
  type    = string
  default = "Stores"
}

variable "cart_table" {
  type    = string
  default = "Cart"
}

variable "orders_table" {
  type    = string
  default = "Orders"
}

variable "audit_table" {
  type    = string
  default = "Audit"
}

variable "cognito_user_pool_arn" {
  type = string
}

variable "eventbridge_bus_name" {
  description = "Name of the CloudShop EventBridge bus"
  type        = string
  default     = "cloudshop-events"
}