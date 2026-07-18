resource "aws_api_gateway_rest_api" "cloudshop_api" {
  name        = "CloudShopAPI"
  description = "API REST de CloudShop Enterprise"
}

locals {
  cors_allow_origin = "https://d1atv5wbhkay99.cloudfront.net"

  deployment_trigger_ids = [
    aws_api_gateway_rest_api.cloudshop_api.id,
    aws_api_gateway_authorizer.cognito.id,
    aws_api_gateway_resource.users.id,
    aws_api_gateway_resource.user_id.id,
    aws_api_gateway_resource.products.id,
    aws_api_gateway_resource.product_id.id,
    aws_api_gateway_resource.stores.id,
    aws_api_gateway_resource.store_id.id,
    aws_api_gateway_resource.cart.id,
    aws_api_gateway_resource.orders.id,
    aws_api_gateway_resource.order_id.id,
    aws_api_gateway_resource.audit.id,
    aws_api_gateway_method.products_options.id,
    aws_api_gateway_method.product_id_options.id,
    aws_api_gateway_method.stores_options.id,
    aws_api_gateway_method.store_id_options.id,
    aws_api_gateway_method.orders_options.id,
    aws_api_gateway_method.order_id_options.id,
    aws_api_gateway_method_response.products_options_200.id,
    aws_api_gateway_method_response.product_id_options_200.id,
    aws_api_gateway_method_response.stores_options_200.id,
    aws_api_gateway_method_response.store_id_options_200.id,
    aws_api_gateway_method_response.orders_options_200.id,
    aws_api_gateway_method_response.order_id_options_200.id,
    aws_api_gateway_integration_response.products_options_200.id,
    aws_api_gateway_integration_response.product_id_options_200.id,
    aws_api_gateway_integration_response.stores_options_200.id,
    aws_api_gateway_integration_response.store_id_options_200.id,
    aws_api_gateway_integration_response.orders_options_200.id,
    aws_api_gateway_integration_response.order_id_options_200.id,


    aws_api_gateway_resource.dashboard.id,
    aws_api_gateway_resource.total_sales.id,
    aws_api_gateway_resource.order_by_status.id,
    aws_api_gateway_resource.out_of_stock.id,
    aws_api_gateway_resource.top_products.id,
    aws_api_gateway_resource.top_customers.id,
    aws_api_gateway_resource.sales_by_store.id,

    aws_api_gateway_method.total_sales_options.id,
    aws_api_gateway_method.order_by_status_options.id,
    aws_api_gateway_method.out_of_stock_options.id,
    aws_api_gateway_method.top_products_options.id,
    aws_api_gateway_method.top_customers_options.id,
    aws_api_gateway_method.sales_by_store_options.id,

    aws_api_gateway_method_response.total_sales_options_200.id,
    aws_api_gateway_method_response.order_by_status_options_200.id,
    aws_api_gateway_method_response.out_of_stock_options_200.id,
    aws_api_gateway_method_response.top_products_options_200.id,
    aws_api_gateway_method_response.top_customers_options_200.id,
    aws_api_gateway_method_response.sales_by_store_options_200.id,

    aws_api_gateway_integration_response.total_sales_options_200.id,
    aws_api_gateway_integration_response.order_by_status_options_200.id,
    aws_api_gateway_integration_response.out_of_stock_options_200.id,
    aws_api_gateway_integration_response.top_products_options_200.id,
    aws_api_gateway_integration_response.top_customers_options_200.id,
    aws_api_gateway_integration_response.sales_by_store_options_200.id,    

    
  ]
}

resource "aws_api_gateway_resource" "users" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "users"
}

resource "aws_api_gateway_resource" "user_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.users.id
  path_part   = "{id}"
}

//metodo post
resource "aws_api_gateway_method" "create_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.users.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "create_user" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  resource_id = aws_api_gateway_resource.users.id

  http_method = aws_api_gateway_method.create_user.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"

  uri = var.create_user_invoke_arn

}

resource "aws_lambda_permission" "create_user" {

  statement_id = "AllowExecutionCreateUser"

  action = "lambda:InvokeFunction"

  function_name = var.create_user_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}


resource "aws_api_gateway_method" "get_users" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.users.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_users" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.get_users.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_users_invoke_arn
}

resource "aws_lambda_permission" "get_users" {

  statement_id = "AllowExecutionGetUsers"

  action = "lambda:InvokeFunction"

  function_name = var.get_users_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_api_gateway_method" "get_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.user_id.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_user_by_id" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.get_user.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_user_by_id_invoke_arn
}

resource "aws_lambda_permission" "get_user_by_id" {
  statement_id  = "AllowExecutionGetUserById"
  action        = "lambda:InvokeFunction"
  function_name = var.get_user_by_id_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

resource "aws_api_gateway_method" "update_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.user_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "update_user" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.update_user.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_user_invoke_arn
}

resource "aws_lambda_permission" "update_user" {

  statement_id = "AllowExecutionUpdateUser"

  action = "lambda:InvokeFunction"

  function_name = var.update_user_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_api_gateway_method" "delete_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.user_id.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "deactivate_user" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.delete_user.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.deactivate_user_invoke_arn
}

resource "aws_lambda_permission" "delete_user" {

  statement_id = "AllowExecutionDeleteUser"

  action = "lambda:InvokeFunction"

  function_name = var.deactivate_user_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_api_gateway_authorizer" "cognito" {

  name = "CloudShopAuthorizer"

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  type = "COGNITO_USER_POOLS"

  provider_arns = [

    var.user_pool_arn

  ]

}

resource "aws_api_gateway_deployment" "deployment" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  triggers = {
    redeployment = sha1(jsonencode(local.deployment_trigger_ids))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [

    aws_api_gateway_integration.create_user,
    aws_api_gateway_integration.get_users,
    aws_api_gateway_integration.get_user_by_id,
    aws_api_gateway_integration.update_user,
    aws_api_gateway_integration.deactivate_user,

    aws_api_gateway_integration.total_sales,
    aws_api_gateway_integration.order_by_status,
    aws_api_gateway_integration.out_of_stock,
    aws_api_gateway_integration.top_products,
    aws_api_gateway_integration.top_customers,
    aws_api_gateway_integration.sales_by_store,

    aws_api_gateway_integration.get_products,
    aws_api_gateway_integration.create_product,
    aws_api_gateway_integration.get_product_by_id,
    aws_api_gateway_integration.update_product,
    aws_api_gateway_integration.delete_product,

    aws_api_gateway_integration.get_stores,
    aws_api_gateway_integration.create_store,
    aws_api_gateway_integration.get_store_by_id,
    aws_api_gateway_integration.update_store,
    aws_api_gateway_integration.delete_store,

    aws_api_gateway_integration.get_cart,
    aws_api_gateway_integration.add_product,
    aws_api_gateway_integration.update_quantity,
    aws_api_gateway_integration.remove_product,
    aws_api_gateway_integration.clear_cart,

    aws_api_gateway_integration.create_order,
    aws_api_gateway_integration.get_orders,
    aws_api_gateway_integration.get_order_by_id,
    aws_api_gateway_integration.update_order_status,
    aws_api_gateway_integration.cancel_order,

    aws_api_gateway_integration.get_audit,

    aws_api_gateway_integration.products_options,
    aws_api_gateway_integration.product_id_options,
    aws_api_gateway_integration.stores_options,
    aws_api_gateway_integration.store_id_options,
    aws_api_gateway_integration.orders_options,
    aws_api_gateway_integration.order_id_options,

    aws_api_gateway_method_response.products_options_200,
    aws_api_gateway_method_response.product_id_options_200,
    aws_api_gateway_method_response.stores_options_200,
    aws_api_gateway_method_response.store_id_options_200,
    aws_api_gateway_method_response.orders_options_200,
    aws_api_gateway_method_response.order_id_options_200,

    aws_api_gateway_integration_response.products_options_200,
    aws_api_gateway_integration_response.product_id_options_200,
    aws_api_gateway_integration_response.stores_options_200,
    aws_api_gateway_integration_response.store_id_options_200,
    aws_api_gateway_integration_response.orders_options_200,
    aws_api_gateway_integration_response.order_id_options_200,


    aws_api_gateway_integration.users_options,
    aws_api_gateway_integration.user_id_options,
    aws_api_gateway_integration.cart_options,
    aws_api_gateway_integration.cart_items_options,
    aws_api_gateway_integration.cart_product_id_options,
    aws_api_gateway_integration.total_sales_options,
    aws_api_gateway_integration.order_by_status_options,
    aws_api_gateway_integration.out_of_stock_options,
    aws_api_gateway_integration.top_products_options,
    aws_api_gateway_integration.top_customers_options,
    aws_api_gateway_integration.sales_by_store_options,
    aws_api_gateway_integration.audit_options,

    aws_api_gateway_method_response.users_options_200,
    aws_api_gateway_method_response.user_id_options_200,
    aws_api_gateway_method_response.cart_options_200,
    aws_api_gateway_method_response.cart_items_options_200,
    aws_api_gateway_method_response.cart_product_id_options_200,
    aws_api_gateway_method_response.total_sales_options_200,
    aws_api_gateway_method_response.order_by_status_options_200,
    aws_api_gateway_method_response.out_of_stock_options_200,
    aws_api_gateway_method_response.top_products_options_200,
    aws_api_gateway_method_response.top_customers_options_200,
    aws_api_gateway_method_response.sales_by_store_options_200,
    aws_api_gateway_method_response.audit_options_200,

    aws_api_gateway_integration_response.users_options_200,
    aws_api_gateway_integration_response.user_id_options_200,
    aws_api_gateway_integration_response.cart_options_200,
    aws_api_gateway_integration_response.cart_items_options_200,
    aws_api_gateway_integration_response.cart_product_id_options_200,
    aws_api_gateway_integration_response.total_sales_options_200,
    aws_api_gateway_integration_response.order_by_status_options_200,
    aws_api_gateway_integration_response.out_of_stock_options_200,
    aws_api_gateway_integration_response.top_products_options_200,
    aws_api_gateway_integration_response.top_customers_options_200,
    aws_api_gateway_integration_response.sales_by_store_options_200,
    aws_api_gateway_integration_response.audit_options_200,

  ]

}

resource "aws_api_gateway_stage" "dev" {

  deployment_id = aws_api_gateway_deployment.deployment.id

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  stage_name = "dev"

}


# ==========================================
# PRODUCTS ENDPOINTS
# ==========================================

resource "aws_api_gateway_resource" "products" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "products"
}

resource "aws_api_gateway_method" "products_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.products.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "products_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.products.id
  http_method             = aws_api_gateway_method.products_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "products_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.products.id
  http_method = aws_api_gateway_method.products_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "products_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.products.id
  http_method = aws_api_gateway_method.products_options.http_method
  status_code = aws_api_gateway_method_response.products_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.products_options,
    aws_api_gateway_method_response.products_options_200,
  ]
}

resource "aws_api_gateway_resource" "product_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.products.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "product_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.product_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "product_id_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.product_id.id
  http_method             = aws_api_gateway_method.product_id_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "product_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.product_id.id
  http_method = aws_api_gateway_method.product_id_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "product_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.product_id.id
  http_method = aws_api_gateway_method.product_id_options.http_method
  status_code = aws_api_gateway_method_response.product_id_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.product_id_options,
    aws_api_gateway_method_response.product_id_options_200,
  ]
}

# GET /products
resource "aws_api_gateway_method" "get_products" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.products.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_products" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.products.id
  http_method             = aws_api_gateway_method.get_products.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_products_invoke_arn
}

resource "aws_lambda_permission" "get_products" {
  statement_id  = "AllowExecutionGetProducts"
  action        = "lambda:InvokeFunction"
  function_name = var.get_products_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# POST /products
resource "aws_api_gateway_method" "create_product" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.products.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "create_product" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.products.id
  http_method             = aws_api_gateway_method.create_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.create_product_invoke_arn
}

resource "aws_lambda_permission" "create_product" {
  statement_id  = "AllowExecutionCreateProduct"
  action        = "lambda:InvokeFunction"
  function_name = var.create_product_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

  
}

# GET /products/{id}
resource "aws_api_gateway_method" "get_product_by_id" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.product_id.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_product_by_id" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.product_id.id
  http_method             = aws_api_gateway_method.get_product_by_id.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_product_by_id_invoke_arn
}

resource "aws_lambda_permission" "get_product_by_id" {
  statement_id  = "AllowExecutionGetProductById"
  action        = "lambda:InvokeFunction"
  function_name = var.get_product_by_id_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# PUT /products/{id}
resource "aws_api_gateway_method" "update_product" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.product_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "update_product" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.product_id.id
  http_method             = aws_api_gateway_method.update_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_product_invoke_arn
}

resource "aws_lambda_permission" "update_product" {
  statement_id  = "AllowExecutionUpdateProduct"
  action        = "lambda:InvokeFunction"
  function_name = var.update_product_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# DELETE /products/{id}
resource "aws_api_gateway_method" "delete_product" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.product_id.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "delete_product" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.product_id.id
  http_method             = aws_api_gateway_method.delete_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.delete_product_invoke_arn
}

resource "aws_lambda_permission" "delete_product" {
  statement_id  = "AllowExecutionDeleteProduct"
  action        = "lambda:InvokeFunction"
  function_name = var.delete_product_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}


# ==========================================
# STORES ENDPOINTS
# ==========================================

resource "aws_api_gateway_resource" "stores" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "stores"
}

resource "aws_api_gateway_method" "stores_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.stores.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "stores_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.stores.id
  http_method             = aws_api_gateway_method.stores_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "stores_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.stores.id
  http_method = aws_api_gateway_method.stores_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "stores_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.stores.id
  http_method = aws_api_gateway_method.stores_options.http_method
  status_code = aws_api_gateway_method_response.stores_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.stores_options,
    aws_api_gateway_method_response.stores_options_200,
  ]
}

resource "aws_api_gateway_resource" "store_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.stores.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "store_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.store_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "store_id_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.store_id.id
  http_method             = aws_api_gateway_method.store_id_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "store_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.store_id.id
  http_method = aws_api_gateway_method.store_id_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "store_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.store_id.id
  http_method = aws_api_gateway_method.store_id_options.http_method
  status_code = aws_api_gateway_method_response.store_id_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.store_id_options,
    aws_api_gateway_method_response.store_id_options_200,
  ]
}

# GET /stores
resource "aws_api_gateway_method" "get_stores" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.stores.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_stores" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.stores.id
  http_method             = aws_api_gateway_method.get_stores.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_stores_invoke_arn
}

resource "aws_lambda_permission" "get_stores" {
  statement_id  = "AllowExecutionGetStores"
  action        = "lambda:InvokeFunction"
  function_name = var.get_stores_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# POST /stores
resource "aws_api_gateway_method" "create_store" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.stores.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "create_store" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.stores.id
  http_method             = aws_api_gateway_method.create_store.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.create_store_invoke_arn
}

resource "aws_lambda_permission" "create_store" {
  statement_id  = "AllowExecutionCreateStore"
  action        = "lambda:InvokeFunction"
  function_name = var.create_store_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# GET /stores/{id}
resource "aws_api_gateway_method" "get_store_by_id" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.store_id.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_store_by_id" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.store_id.id
  http_method             = aws_api_gateway_method.get_store_by_id.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_store_by_id_invoke_arn
}

resource "aws_lambda_permission" "get_store_by_id" {
  statement_id  = "AllowExecutionGetStoreById"
  action        = "lambda:InvokeFunction"
  function_name = var.get_store_by_id_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# PUT /stores/{id}
resource "aws_api_gateway_method" "update_store" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.store_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "update_store" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.store_id.id
  http_method             = aws_api_gateway_method.update_store.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_store_invoke_arn
}

resource "aws_lambda_permission" "update_store" {
  statement_id  = "AllowExecutionUpdateStore"
  action        = "lambda:InvokeFunction"
  function_name = var.update_store_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# DELETE /stores/{id}
resource "aws_api_gateway_method" "delete_store" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.store_id.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "delete_store" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.store_id.id
  http_method             = aws_api_gateway_method.delete_store.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.deactivate_store_invoke_arn
}

resource "aws_lambda_permission" "delete_store" {
  statement_id  = "AllowExecutionDeleteStore"
  action        = "lambda:InvokeFunction"
  function_name = var.deactivate_store_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}


//dashboard

resource "aws_api_gateway_resource" "dashboard" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "dashboard"
}

resource "aws_api_gateway_resource" "total_sales" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "totalSales"
}

resource "aws_api_gateway_method" "total_sales" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.total_sales.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "total_sales" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  resource_id = aws_api_gateway_resource.total_sales.id

  http_method = aws_api_gateway_method.total_sales.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"

  uri = var.total_sales_invoke_arn

}

resource "aws_api_gateway_resource" "order_by_status" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  parent_id = aws_api_gateway_resource.dashboard.id

  path_part = "orderByStatus"

}

resource "aws_api_gateway_method" "order_by_status" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  resource_id = aws_api_gateway_resource.order_by_status.id

  http_method = "GET"

  authorization = "COGNITO_USER_POOLS"

  authorizer_id = aws_api_gateway_authorizer.cognito.id

  api_key_required = false

}

resource "aws_api_gateway_integration" "order_by_status" {

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  resource_id = aws_api_gateway_resource.order_by_status.id

  http_method = aws_api_gateway_method.order_by_status.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"

  uri = var.order_by_status_invoke_arn

}

resource "aws_api_gateway_resource" "out_of_stock" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "outOfStock"
}

resource "aws_api_gateway_method" "out_of_stock" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.out_of_stock.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "out_of_stock" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.out_of_stock.id
  http_method             = aws_api_gateway_method.out_of_stock.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.out_of_stock_invoke_arn
}

resource "aws_api_gateway_resource" "top_products" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topProducts"
}

resource "aws_api_gateway_method" "top_products" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.top_products.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "top_products" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.top_products.id
  http_method             = aws_api_gateway_method.top_products.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.top_products_invoke_arn
}

resource "aws_api_gateway_resource" "top_customers" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topCustomers"
}

resource "aws_api_gateway_method" "top_customers" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.top_customers.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "top_customers" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.top_customers.id
  http_method             = aws_api_gateway_method.top_customers.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.top_customers_invoke_arn
}

resource "aws_api_gateway_resource" "sales_by_store" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "salesByStore"
}

resource "aws_api_gateway_method" "sales_by_store" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.sales_by_store.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "sales_by_store" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.sales_by_store.id
  http_method             = aws_api_gateway_method.sales_by_store.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.sales_by_store_invoke_arn
}

resource "aws_lambda_permission" "dashboard_total_sales" {

  statement_id = "AllowExecutionTotalSales"

  action = "lambda:InvokeFunction"

  function_name = var.total_sales_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_lambda_permission" "dashboard_order_by_status" {

  statement_id = "AllowExecutionOrderByStatus"

  action = "lambda:InvokeFunction"

  function_name = var.order_by_status_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_lambda_permission" "dashboard_out_of_stock" {

  statement_id = "AllowExecutionOutOfStock"

  action = "lambda:InvokeFunction"

  function_name = var.out_of_stock_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_lambda_permission" "dashboard_top_products" {

  statement_id = "AllowExecutionTopProducts"

  action = "lambda:InvokeFunction"

  function_name = var.top_products_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_lambda_permission" "dashboard_top_customers" {

  statement_id = "AllowExecutionTopCustomers"

  action = "lambda:InvokeFunction"

  function_name = var.top_customers_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}

resource "aws_lambda_permission" "dashboard_sales_by_store" {

  statement_id = "AllowExecutionSalesByStore"

  action = "lambda:InvokeFunction"

  function_name = var.sales_by_store_function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"

}
# ==========================================
# CART ENDPOINTS
# ==========================================

resource "aws_api_gateway_resource" "cart" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "cart"
}

resource "aws_api_gateway_resource" "cart_items" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.cart.id
  path_part   = "items"
}

resource "aws_api_gateway_resource" "cart_product_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.cart_items.id
  path_part   = "{productId}"
}

# GET /cart
resource "aws_api_gateway_method" "get_cart" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.cart.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_cart" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.get_cart.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_cart_invoke_arn
}

resource "aws_lambda_permission" "get_cart" {
  statement_id  = "AllowExecutionGetCart"
  action        = "lambda:InvokeFunction"
  function_name = var.get_cart_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# DELETE /cart (clearCart)
resource "aws_api_gateway_method" "clear_cart" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.cart.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "clear_cart" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.clear_cart.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.clear_cart_invoke_arn
}

resource "aws_lambda_permission" "clear_cart" {
  statement_id  = "AllowExecutionClearCart"
  action        = "lambda:InvokeFunction"
  function_name = var.clear_cart_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# POST /cart/items (addProduct)
resource "aws_api_gateway_method" "add_product" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.cart_items.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "add_product" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart_items.id
  http_method             = aws_api_gateway_method.add_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.add_product_invoke_arn
}

resource "aws_lambda_permission" "add_product" {
  statement_id  = "AllowExecutionAddProduct"
  action        = "lambda:InvokeFunction"
  function_name = var.add_product_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# PUT /cart/items/{productId} (updateQuantity)
resource "aws_api_gateway_method" "update_quantity" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.cart_product_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "update_quantity" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart_product_id.id
  http_method             = aws_api_gateway_method.update_quantity.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_quantity_invoke_arn
}

resource "aws_lambda_permission" "update_quantity" {
  statement_id  = "AllowExecutionUpdateQuantity"
  action        = "lambda:InvokeFunction"
  function_name = var.update_quantity_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# DELETE /cart/items/{productId} (removeProduct)
resource "aws_api_gateway_method" "remove_product" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.cart_product_id.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "remove_product" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart_product_id.id
  http_method             = aws_api_gateway_method.remove_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.remove_product_invoke_arn
}

resource "aws_lambda_permission" "remove_product" {
  statement_id  = "AllowExecutionRemoveProduct"
  action        = "lambda:InvokeFunction"
  function_name = var.remove_product_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# ==========================================
# ORDERS ENDPOINTS
# ==========================================

resource "aws_api_gateway_resource" "orders" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "orders"
}

resource "aws_api_gateway_method" "orders_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.orders.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "orders_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.orders.id
  http_method             = aws_api_gateway_method.orders_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "orders_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.orders.id
  http_method = aws_api_gateway_method.orders_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "orders_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.orders.id
  http_method = aws_api_gateway_method.orders_options.http_method
  status_code = aws_api_gateway_method_response.orders_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.orders_options,
    aws_api_gateway_method_response.orders_options_200,
  ]
}

resource "aws_api_gateway_resource" "order_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.orders.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "order_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.order_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "order_id_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.order_id.id
  http_method             = aws_api_gateway_method.order_id_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "order_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.order_id.id
  http_method = aws_api_gateway_method.order_id_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "order_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.order_id.id
  http_method = aws_api_gateway_method.order_id_options.http_method
  status_code = aws_api_gateway_method_response.order_id_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.order_id_options,
    aws_api_gateway_method_response.order_id_options_200,
  ]
}

# POST /orders — createOrder
resource "aws_api_gateway_method" "create_order" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.orders.id
  http_method      = "POST"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "create_order" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.orders.id
  http_method             = aws_api_gateway_method.create_order.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.create_order_invoke_arn
}

resource "aws_lambda_permission" "create_order" {
  statement_id  = "AllowExecutionCreateOrder"
  action        = "lambda:InvokeFunction"
  function_name = var.create_order_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# GET /orders — getOrders
resource "aws_api_gateway_method" "get_orders" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.orders.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_orders" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.orders.id
  http_method             = aws_api_gateway_method.get_orders.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_orders_invoke_arn
}

resource "aws_lambda_permission" "get_orders" {
  statement_id  = "AllowExecutionGetOrders"
  action        = "lambda:InvokeFunction"
  function_name = var.get_orders_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# GET /orders/{id} — getOrderById
resource "aws_api_gateway_method" "get_order_by_id" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.order_id.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_order_by_id" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.order_id.id
  http_method             = aws_api_gateway_method.get_order_by_id.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_order_by_id_invoke_arn
}

resource "aws_lambda_permission" "get_order_by_id" {
  statement_id  = "AllowExecutionGetOrderById"
  action        = "lambda:InvokeFunction"
  function_name = var.get_order_by_id_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# PUT /orders/{id} — updateOrderStatus
resource "aws_api_gateway_method" "update_order_status" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.order_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "update_order_status" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.order_id.id
  http_method             = aws_api_gateway_method.update_order_status.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_order_status_invoke_arn
}

resource "aws_lambda_permission" "update_order_status" {
  statement_id  = "AllowExecutionUpdateOrderStatus"
  action        = "lambda:InvokeFunction"
  function_name = var.update_order_status_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# DELETE /orders/{id} — cancelOrder
resource "aws_api_gateway_method" "cancel_order" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.order_id.id
  http_method      = "DELETE"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "cancel_order" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.order_id.id
  http_method             = aws_api_gateway_method.cancel_order.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.cancel_order_invoke_arn
}

resource "aws_lambda_permission" "cancel_order" {
  statement_id  = "AllowExecutionCancelOrder"
  action        = "lambda:InvokeFunction"
  function_name = var.cancel_order_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}

# ==========================================
# AUDIT ENDPOINT
# ==========================================

resource "aws_api_gateway_resource" "audit" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_rest_api.cloudshop_api.root_resource_id
  path_part   = "audit"
}

# GET /audit — getAudit (solo Administrador)
resource "aws_api_gateway_method" "get_audit" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.audit.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "get_audit" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.audit.id
  http_method             = aws_api_gateway_method.get_audit.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_audit_invoke_arn
}

resource "aws_lambda_permission" "get_audit" {
  statement_id  = "AllowExecutionGetAudit"
  action        = "lambda:InvokeFunction"
  function_name = var.get_audit_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cloudshop_api.execution_arn}/*/*"
}



resource "aws_api_gateway_gateway_response" "unauthorized" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  response_type = "UNAUTHORIZED"
  status_code   = "401"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
  }
}

resource "aws_api_gateway_gateway_response" "access_denied" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  response_type = "ACCESS_DENIED"
  status_code   = "403"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
  }
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
  }
}




# ==========================================
# OPTIONS - USERS
# ==========================================

resource "aws_api_gateway_method" "users_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "users_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.users_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "users_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "users_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_options.http_method
  status_code = aws_api_gateway_method_response.users_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.users_options,
    aws_api_gateway_method_response.users_options_200,
  ]
}

# ==========================================
# OPTIONS - USER_ID
# ==========================================

resource "aws_api_gateway_method" "user_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.user_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_id_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.user_id_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "user_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.user_id.id
  http_method = aws_api_gateway_method.user_id_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "user_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.user_id.id
  http_method = aws_api_gateway_method.user_id_options.http_method
  status_code = aws_api_gateway_method_response.user_id_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.user_id_options,
    aws_api_gateway_method_response.user_id_options_200,
  ]
}

# ==========================================
# OPTIONS - CART
# ==========================================

resource "aws_api_gateway_method" "cart_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.cart.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cart_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.cart_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "cart_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cart_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_options.http_method
  status_code = aws_api_gateway_method_response.cart_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.cart_options,
    aws_api_gateway_method_response.cart_options_200,
  ]
}

# ==========================================
# OPTIONS - CART_ITEMS
# ==========================================

resource "aws_api_gateway_method" "cart_items_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.cart_items.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cart_items_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart_items.id
  http_method             = aws_api_gateway_method.cart_items_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "cart_items_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart_items.id
  http_method = aws_api_gateway_method.cart_items_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cart_items_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart_items.id
  http_method = aws_api_gateway_method.cart_items_options.http_method
  status_code = aws_api_gateway_method_response.cart_items_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.cart_items_options,
    aws_api_gateway_method_response.cart_items_options_200,
  ]
}

# ==========================================
# OPTIONS - CART_PRODUCT_ID
# ==========================================

resource "aws_api_gateway_method" "cart_product_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.cart_product_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cart_product_id_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.cart_product_id.id
  http_method             = aws_api_gateway_method.cart_product_id_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "cart_product_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart_product_id.id
  http_method = aws_api_gateway_method.cart_product_id_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cart_product_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.cart_product_id.id
  http_method = aws_api_gateway_method.cart_product_id_options.http_method
  status_code = aws_api_gateway_method_response.cart_product_id_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.cart_product_id_options,
    aws_api_gateway_method_response.cart_product_id_options_200,
  ]
}

# ==========================================
# OPTIONS - DASHBOARD ENDPOINTS
# ==========================================

resource "aws_api_gateway_method" "total_sales_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.total_sales.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "total_sales_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.total_sales.id
  http_method             = aws_api_gateway_method.total_sales_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "total_sales_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.total_sales.id
  http_method = aws_api_gateway_method.total_sales_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "total_sales_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.total_sales.id
  http_method = aws_api_gateway_method.total_sales_options.http_method
  status_code = aws_api_gateway_method_response.total_sales_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.total_sales_options,
    aws_api_gateway_method_response.total_sales_options_200,
  ]
}

resource "aws_api_gateway_method" "order_by_status_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.order_by_status.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "order_by_status_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.order_by_status.id
  http_method             = aws_api_gateway_method.order_by_status_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "order_by_status_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.order_by_status.id
  http_method = aws_api_gateway_method.order_by_status_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "order_by_status_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.order_by_status.id
  http_method = aws_api_gateway_method.order_by_status_options.http_method
  status_code = aws_api_gateway_method_response.order_by_status_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.order_by_status_options,
    aws_api_gateway_method_response.order_by_status_options_200,
  ]
}

resource "aws_api_gateway_method" "out_of_stock_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.out_of_stock.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "out_of_stock_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.out_of_stock.id
  http_method             = aws_api_gateway_method.out_of_stock_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "out_of_stock_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.out_of_stock.id
  http_method = aws_api_gateway_method.out_of_stock_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "out_of_stock_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.out_of_stock.id
  http_method = aws_api_gateway_method.out_of_stock_options.http_method
  status_code = aws_api_gateway_method_response.out_of_stock_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.out_of_stock_options,
    aws_api_gateway_method_response.out_of_stock_options_200,
  ]
}

resource "aws_api_gateway_method" "top_products_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.top_products.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "top_products_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.top_products.id
  http_method             = aws_api_gateway_method.top_products_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "top_products_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.top_products.id
  http_method = aws_api_gateway_method.top_products_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "top_products_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.top_products.id
  http_method = aws_api_gateway_method.top_products_options.http_method
  status_code = aws_api_gateway_method_response.top_products_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.top_products_options,
    aws_api_gateway_method_response.top_products_options_200,
  ]
}

resource "aws_api_gateway_method" "top_customers_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.top_customers.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "top_customers_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.top_customers.id
  http_method             = aws_api_gateway_method.top_customers_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "top_customers_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.top_customers.id
  http_method = aws_api_gateway_method.top_customers_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "top_customers_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.top_customers.id
  http_method = aws_api_gateway_method.top_customers_options.http_method
  status_code = aws_api_gateway_method_response.top_customers_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.top_customers_options,
    aws_api_gateway_method_response.top_customers_options_200,
  ]
}

resource "aws_api_gateway_method" "sales_by_store_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.sales_by_store.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "sales_by_store_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.sales_by_store.id
  http_method             = aws_api_gateway_method.sales_by_store_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "sales_by_store_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.sales_by_store.id
  http_method = aws_api_gateway_method.sales_by_store_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "sales_by_store_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.sales_by_store.id
  http_method = aws_api_gateway_method.sales_by_store_options.http_method
  status_code = aws_api_gateway_method_response.sales_by_store_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.sales_by_store_options,
    aws_api_gateway_method_response.sales_by_store_options_200,
  ]
}

# ==========================================
# OPTIONS - AUDIT
# ==========================================

resource "aws_api_gateway_method" "audit_options" {
  rest_api_id   = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id   = aws_api_gateway_resource.audit.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "audit_options" {
  rest_api_id             = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id             = aws_api_gateway_resource.audit.id
  http_method             = aws_api_gateway_method.audit_options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "audit_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.audit.id
  http_method = aws_api_gateway_method.audit_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "audit_options_200" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id = aws_api_gateway_resource.audit.id
  http_method = aws_api_gateway_method.audit_options.http_method
  status_code = aws_api_gateway_method_response.audit_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.cors_allow_origin}'"
  }

  depends_on = [
    aws_api_gateway_integration.audit_options,
    aws_api_gateway_method_response.audit_options_200,
  ]
}


