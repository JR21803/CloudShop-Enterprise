variable "user_pool_arn" {
  type = string
}

variable "create_user_invoke_arn" {
  type = string
}

variable "get_users_invoke_arn" {
  type = string
}

variable "get_user_by_id_invoke_arn" {
  type = string
}

variable "update_user_invoke_arn" {
  type = string
}

variable "deactivate_user_invoke_arn" {
  type = string
}

variable "create_user_function_name" {
  type = string
}

variable "get_users_function_name" {
  type = string
}

variable "get_user_by_id_function_name" {
  type = string
}

variable "update_user_function_name" {
  type = string
}

variable "deactivate_user_function_name" {
  type = string
}

variable "total_sales_invoke_arn" {
  type = string
}

variable "order_by_status_invoke_arn" {
  type = string
}

variable "out_of_stock_invoke_arn" {
  type = string
}

variable "top_products_invoke_arn" {
  type = string
}

variable "top_customers_invoke_arn" {
  type = string
}

variable "sales_by_store_invoke_arn" {
  type = string
}

variable "total_sales_function_name" {
  type = string
}

variable "order_by_status_function_name" {
  type = string
}

variable "out_of_stock_function_name" {
  type = string
}

variable "top_products_function_name" {
  type = string
}

variable "top_customers_function_name" {
  type = string
}

variable "sales_by_store_function_name" {
  type = string
}

# Products
variable "create_product_invoke_arn" { type = string }
variable "create_product_function_name" { type = string }
variable "get_products_invoke_arn" { type = string }
variable "get_products_function_name" { type = string }
variable "get_product_by_id_invoke_arn" { type = string }
variable "get_product_by_id_function_name" { type = string }
variable "update_product_invoke_arn" { type = string }
variable "update_product_function_name" { type = string }
variable "delete_product_invoke_arn" { type = string }
variable "delete_product_function_name" { type = string }

# Stores
variable "create_store_invoke_arn" { type = string }
variable "create_store_function_name" { type = string }
variable "get_stores_invoke_arn" { type = string }
variable "get_stores_function_name" { type = string }
variable "get_store_by_id_invoke_arn" { type = string }
variable "get_store_by_id_function_name" { type = string }
variable "update_store_invoke_arn" { type = string }
variable "update_store_function_name" { type = string }
variable "deactivate_store_invoke_arn" { type = string }
variable "deactivate_store_function_name" { type = string }
# Cart
variable "get_cart_invoke_arn" { type = string }
variable "get_cart_function_name" { type = string }
variable "add_product_invoke_arn" { type = string }
variable "add_product_function_name" { type = string }
variable "update_quantity_invoke_arn" { type = string }
variable "update_quantity_function_name" { type = string }
variable "remove_product_invoke_arn" { type = string }
variable "remove_product_function_name" { type = string }
variable "clear_cart_invoke_arn" { type = string }
variable "clear_cart_function_name" { type = string }

# Orders
variable "create_order_invoke_arn" { type = string }
variable "create_order_function_name" { type = string }
variable "get_orders_invoke_arn" { type = string }
variable "get_orders_function_name" { type = string }
variable "get_order_by_id_invoke_arn" { type = string }
variable "get_order_by_id_function_name" { type = string }
variable "update_order_status_invoke_arn" { type = string }
variable "update_order_status_function_name" { type = string }
variable "cancel_order_invoke_arn" { type = string }
variable "cancel_order_function_name" { type = string }

# Audit
variable "get_audit_invoke_arn" { type = string }
variable "get_audit_function_name" { type = string }
