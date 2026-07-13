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
  value = aws_lambda_function.get_Products.invoke_arn
}
output "get_products_function_name" {
  value = aws_lambda_function.get_Products.function_name
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

