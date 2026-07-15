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
  ses_from_email  = var.ses_from_email
  users_table     = module.dynamodb.users_table
  products_table  = module.dynamodb.products_table
  stores_table    = module.dynamodb.stores_table
  cart_table      = module.dynamodb.cart_table
  orders_table    = module.dynamodb.orders_table
  audit_table     = module.dynamodb.audit_table
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
  create_product_invoke_arn       = module.lambda.create_product_invoke_arn
  create_product_function_name    = module.lambda.create_product_function_name
  get_products_invoke_arn         = module.lambda.get_products_invoke_arn
  get_products_function_name      = module.lambda.get_products_function_name
  get_product_by_id_invoke_arn    = module.lambda.get_product_by_id_invoke_arn
  get_product_by_id_function_name = module.lambda.get_product_by_id_function_name
  update_product_invoke_arn       = module.lambda.update_product_invoke_arn
  update_product_function_name    = module.lambda.update_product_function_name
  delete_product_invoke_arn       = module.lambda.delete_product_invoke_arn
  delete_product_function_name    = module.lambda.delete_product_function_name

  # stores
  create_store_invoke_arn        = module.lambda.create_store_invoke_arn
  create_store_function_name     = module.lambda.create_store_function_name
  get_stores_invoke_arn          = module.lambda.get_stores_invoke_arn
  get_stores_function_name       = module.lambda.get_stores_function_name
  get_store_by_id_invoke_arn     = module.lambda.get_store_by_id_invoke_arn
  get_store_by_id_function_name  = module.lambda.get_store_by_id_function_name
  update_store_invoke_arn        = module.lambda.update_store_invoke_arn
  update_store_function_name     = module.lambda.update_store_function_name
  deactivate_store_invoke_arn    = module.lambda.deactivate_store_invoke_arn
  deactivate_store_function_name = module.lambda.deactivate_store_function_name

  # cart
  get_cart_invoke_arn           = module.lambda.get_cart_invoke_arn
  get_cart_function_name        = module.lambda.get_cart_function_name
  add_product_invoke_arn        = module.lambda.add_product_invoke_arn
  add_product_function_name     = module.lambda.add_product_function_name
  update_quantity_invoke_arn    = module.lambda.update_quantity_invoke_arn
  update_quantity_function_name = module.lambda.update_quantity_function_name
  remove_product_invoke_arn     = module.lambda.remove_product_invoke_arn
  remove_product_function_name  = module.lambda.remove_product_function_name
  clear_cart_invoke_arn         = module.lambda.clear_cart_invoke_arn
  clear_cart_function_name      = module.lambda.clear_cart_function_name

  # orders
  create_order_invoke_arn           = module.lambda.create_order_invoke_arn
  create_order_function_name        = module.lambda.create_order_function_name
  get_orders_invoke_arn             = module.lambda.get_orders_invoke_arn
  get_orders_function_name          = module.lambda.get_orders_function_name
  get_order_by_id_invoke_arn        = module.lambda.get_order_by_id_invoke_arn
  get_order_by_id_function_name     = module.lambda.get_order_by_id_function_name
  update_order_status_invoke_arn    = module.lambda.update_order_status_invoke_arn
  update_order_status_function_name = module.lambda.update_order_status_function_name
  cancel_order_invoke_arn           = module.lambda.cancel_order_invoke_arn
  cancel_order_function_name        = module.lambda.cancel_order_function_name

  # audit
  get_audit_invoke_arn    = module.lambda.get_audit_invoke_arn
  get_audit_function_name = module.lambda.get_audit_function_name
}

# ── EventBridge ─────────────────────────────────────────────
module "eventbridge" {
  source = "./modules/eventbridge"

  process_audit_event_arn           = module.lambda.process_audit_event_arn
  process_audit_event_function_name = module.lambda.process_audit_event_function_name
  send_email_arn                    = module.lambda.send_email_arn
  send_email_function_name          = module.lambda.send_email_function_name

  depends_on = [module.lambda]
}

# ── SES ─────────────────────────────────────────────────────
module "ses" {
  source         = "./modules/ses"
  ses_from_email = var.ses_from_email
}

# ── CloudWatch ───────────────────────────────────────────────
module "cloudwatch" {
  source     = "./modules/cloudwatch"
  aws_region = var.aws_region

  depends_on = [module.lambda]
}

# ── WAF ─────────────────────────────────────────────────────
module "waf" {
  source                = "./modules/waf"
  api_gateway_stage_arn = module.apigateway.stage_arn

  depends_on = [module.apigateway]
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
}