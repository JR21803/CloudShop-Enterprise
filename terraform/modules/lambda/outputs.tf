output "create_user_lambda_arn" {
  value = aws_lambda_function.create_user.arn
}

output "create_user_invoke_arn" {
  value = aws_lambda_function.create_user.invoke_arn
}

output "get_users_invoke_arn" {
  value = aws_lambda_function.get_users.invoke_arn
}

output "get_user_by_id_invoke_arn" {
  value = aws_lambda_function.get_user_by_id.invoke_arn
}

output "update_user_invoke_arn" {
  value = aws_lambda_function.update_user.invoke_arn
}

output "deactivate_user_invoke_arn" {
  value = aws_lambda_function.deactivate_user.invoke_arn
}

output "create_user_function_name" {
  value = aws_lambda_function.create_user.function_name
}

output "get_users_function_name" {
  value = aws_lambda_function.get_users.function_name
}

output "get_user_by_id_function_name" {
  value = aws_lambda_function.get_user_by_id.function_name
}

output "update_user_function_name" {
  value = aws_lambda_function.update_user.function_name
}

output "deactivate_user_function_name" {
  value = aws_lambda_function.deactivate_user.function_name
}

output "total_sales_invoke_arn" {
  value = aws_lambda_function.total_sales.invoke_arn
}

output "order_by_status_invoke_arn" {
  value = aws_lambda_function.order_by_status.invoke_arn
}

output "out_of_stock_invoke_arn" {
  value = aws_lambda_function.out_of_stock.invoke_arn
}

output "top_products_invoke_arn" {
  value = aws_lambda_function.top_products.invoke_arn
}

output "top_customers_invoke_arn" {
  value = aws_lambda_function.top_customers.invoke_arn
}

output "sales_by_store_invoke_arn" {
  value = aws_lambda_function.sales_by_store.invoke_arn
}

output "total_sales_function_name" {
  value = aws_lambda_function.total_sales.function_name
}

output "order_by_status_function_name" {
  value = aws_lambda_function.order_by_status.function_name
}

output "out_of_stock_function_name" {
  value = aws_lambda_function.out_of_stock.function_name
}

output "top_products_function_name" {
  value = aws_lambda_function.top_products.function_name
}

output "top_customers_function_name" {
  value = aws_lambda_function.top_customers.function_name
}

output "sales_by_store_function_name" {
  value = aws_lambda_function.sales_by_store.function_name
}

# Products Outputs
output "create_product_invoke_arn" {
  value = aws_lambda_function.create_product.invoke_arn
}
output "create_product_function_name" {
  value = aws_lambda_function.create_product.function_name
}
output "get_products_invoke_arn" {
  value = aws_lambda_function.get_products.invoke_arn
}
output "get_products_function_name" {
  value = aws_lambda_function.get_products.function_name
}
output "get_product_by_id_invoke_arn" {
  value = aws_lambda_function.get_product_by_id.invoke_arn
}
output "get_product_by_id_function_name" {
  value = aws_lambda_function.get_product_by_id.function_name
}
output "update_product_invoke_arn" {
  value = aws_lambda_function.update_product.invoke_arn
}
output "update_product_function_name" {
  value = aws_lambda_function.update_product.function_name
}
output "delete_product_invoke_arn" {
  value = aws_lambda_function.delete_product.invoke_arn
}
output "delete_product_function_name" {
  value = aws_lambda_function.delete_product.function_name
}

# Stores Outputs
output "create_store_invoke_arn" {
  value = aws_lambda_function.create_store.invoke_arn
}
output "create_store_function_name" {
  value = aws_lambda_function.create_store.function_name
}
output "get_stores_invoke_arn" {
  value = aws_lambda_function.get_stores.invoke_arn
}
output "get_stores_function_name" {
  value = aws_lambda_function.get_stores.function_name
}
output "get_store_by_id_invoke_arn" {
  value = aws_lambda_function.get_store_by_id.invoke_arn
}
output "get_store_by_id_function_name" {
  value = aws_lambda_function.get_store_by_id.function_name
}
output "update_store_invoke_arn" {
  value = aws_lambda_function.update_store.invoke_arn
}
output "update_store_function_name" {
  value = aws_lambda_function.update_store.function_name
}
output "deactivate_store_invoke_arn" {
  value = aws_lambda_function.deactivate_store.invoke_arn
}
output "deactivate_store_function_name" {
  value = aws_lambda_function.deactivate_store.function_name
}

# Cart Outputs
output "get_cart_invoke_arn" {
  value = aws_lambda_function.get_cart.invoke_arn
}
output "get_cart_function_name" {
  value = aws_lambda_function.get_cart.function_name
}
output "add_product_invoke_arn" {
  value = aws_lambda_function.add_product.invoke_arn
}
output "add_product_function_name" {
  value = aws_lambda_function.add_product.function_name
}
output "update_quantity_invoke_arn" {
  value = aws_lambda_function.update_quantity.invoke_arn
}
output "update_quantity_function_name" {
  value = aws_lambda_function.update_quantity.function_name
}
output "remove_product_invoke_arn" {
  value = aws_lambda_function.remove_product.invoke_arn
}
output "remove_product_function_name" {
  value = aws_lambda_function.remove_product.function_name
}
output "clear_cart_invoke_arn" {
  value = aws_lambda_function.clear_cart.invoke_arn
}
output "clear_cart_function_name" {
  value = aws_lambda_function.clear_cart.function_name
}

# Orders Outputs
output "create_order_invoke_arn" { value = aws_lambda_function.create_order.invoke_arn }
output "create_order_function_name" { value = aws_lambda_function.create_order.function_name }
output "get_orders_invoke_arn" { value = aws_lambda_function.get_orders.invoke_arn }
output "get_orders_function_name" { value = aws_lambda_function.get_orders.function_name }
output "get_order_by_id_invoke_arn" { value = aws_lambda_function.get_order_by_id.invoke_arn }
output "get_order_by_id_function_name" { value = aws_lambda_function.get_order_by_id.function_name }
output "update_order_status_invoke_arn" { value = aws_lambda_function.update_order_status.invoke_arn }
output "update_order_status_function_name" { value = aws_lambda_function.update_order_status.function_name }
output "cancel_order_invoke_arn" { value = aws_lambda_function.cancel_order.invoke_arn }
output "cancel_order_function_name" { value = aws_lambda_function.cancel_order.function_name }

# Audit & Notifications Outputs
output "get_audit_invoke_arn" { value = aws_lambda_function.get_audit.invoke_arn }
output "get_audit_function_name" { value = aws_lambda_function.get_audit.function_name }
output "process_audit_event_arn" { value = aws_lambda_function.process_audit_event.arn }
output "process_audit_event_function_name" { value = aws_lambda_function.process_audit_event.function_name }
output "send_email_arn" { value = aws_lambda_function.send_email.arn }
output "send_email_function_name" { value = aws_lambda_function.send_email.function_name }
