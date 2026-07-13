module "iam" {
  source = "./modules/iam"
}

module "cognito" {
  source = "./modules/cognito"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "lambda" {
  source          = "./modules/lambda"
  lambda_role_arn = module.iam.lambda_role_arn
}

module "apigateway" {

  source = "./modules/apigateway"

  user_pool_arn = module.cognito.user_pool_arn

  create_user_invoke_arn = module.lambda.create_user_invoke_arn

  get_users_invoke_arn = module.lambda.get_users_invoke_arn

  get_user_by_id_invoke_arn = module.lambda.get_user_by_id_invoke_arn

  update_user_invoke_arn = module.lambda.update_user_invoke_arn

  deactivate_user_invoke_arn = module.lambda.deactivate_user_invoke_arn

  create_user_function_name = module.lambda.create_user_function_name

  get_users_function_name = module.lambda.get_users_function_name

  get_user_by_id_function_name = module.lambda.get_user_by_id_function_name

  update_user_function_name = module.lambda.update_user_function_name

  deactivate_user_function_name = module.lambda.deactivate_user_function_name

  # dashboard

  total_sales_invoke_arn = module.lambda.total_sales_invoke_arn

  order_by_status_invoke_arn = module.lambda.order_by_status_invoke_arn

  out_of_stock_invoke_arn = module.lambda.out_of_stock_invoke_arn

  top_products_invoke_arn = module.lambda.top_products_invoke_arn

  top_customers_invoke_arn = module.lambda.top_customers_invoke_arn

  sales_by_store_invoke_arn = module.lambda.sales_by_store_invoke_arn

  total_sales_function_name = module.lambda.total_sales_function_name

  order_by_status_function_name = module.lambda.order_by_status_function_name

  out_of_stock_function_name = module.lambda.out_of_stock_function_name

  top_products_function_name = module.lambda.top_products_function_name

  top_customers_function_name = module.lambda.top_customers_function_name

  sales_by_store_function_name = module.lambda.sales_by_store_function_name

  # products
  create_product_invoke_arn     = module.lambda.create_product_invoke_arn
  create_product_function_name  = module.lambda.create_product_function_name
  get_products_invoke_arn       = module.lambda.get_products_invoke_arn
  get_products_function_name    = module.lambda.get_products_function_name
  get_product_by_id_invoke_arn  = module.lambda.get_product_by_id_invoke_arn
  get_product_by_id_function_name = module.lambda.get_product_by_id_function_name
  update_product_invoke_arn     = module.lambda.update_product_invoke_arn
  update_product_function_name  = module.lambda.update_product_function_name
  delete_product_invoke_arn     = module.lambda.delete_product_invoke_arn
  delete_product_function_name  = module.lambda.delete_product_function_name

  # stores
  create_store_invoke_arn       = module.lambda.create_store_invoke_arn
  create_store_function_name    = module.lambda.create_store_function_name
  get_stores_invoke_arn         = module.lambda.get_stores_invoke_arn
  get_stores_function_name      = module.lambda.get_stores_function_name
  get_store_by_id_invoke_arn    = module.lambda.get_store_by_id_invoke_arn
  get_store_by_id_function_name = module.lambda.get_store_by_id_function_name
  update_store_invoke_arn       = module.lambda.update_store_invoke_arn
  update_store_function_name    = module.lambda.update_store_function_name
  deactivate_store_invoke_arn   = module.lambda.deactivate_store_invoke_arn
  deactivate_store_function_name = module.lambda.deactivate_store_function_name

}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
}