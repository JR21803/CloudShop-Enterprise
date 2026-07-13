resource "aws_api_gateway_rest_api" "cloudshop_api" {
  name        = "CloudShopAPI"
  description = "API REST de CloudShop Enterprise"
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
  api_key_required = true
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
  api_key_required = true
}

resource "aws_api_gateway_integration" "get_users" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.users.id
  http_method          = aws_api_gateway_method.get_users.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.get_users_invoke_arn
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
  api_key_required = true
}

resource "aws_api_gateway_integration" "get_user_by_id" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.user_id.id
  http_method          = aws_api_gateway_method.get_user.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.get_user_by_id_invoke_arn
}

resource "aws_api_gateway_method" "update_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.user_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "update_user" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.user_id.id
  http_method          = aws_api_gateway_method.update_user.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.update_user_invoke_arn
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
  api_key_required = true
}

resource "aws_api_gateway_integration" "deactivate_user" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.user_id.id
  http_method          = aws_api_gateway_method.delete_user.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.deactivate_user_invoke_arn
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
    aws_api_gateway_integration.delete_store

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

resource "aws_api_gateway_resource" "product_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.products.id
  path_part   = "{id}"
}

# GET /products
resource "aws_api_gateway_method" "get_products" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.products.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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

resource "aws_api_gateway_resource" "store_id" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.stores.id
  path_part   = "{id}"
}

# GET /stores
resource "aws_api_gateway_method" "get_stores" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.stores.id
  http_method      = "GET"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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
  api_key_required = true
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

  api_key_required = true

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
  rest_api_id    = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id    = aws_api_gateway_resource.out_of_stock.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "out_of_stock" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.out_of_stock.id
  http_method          = aws_api_gateway_method.out_of_stock.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.out_of_stock_invoke_arn
}

resource "aws_api_gateway_resource" "top_products" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topProducts"
}

resource "aws_api_gateway_method" "top_products" {
  rest_api_id    = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id    = aws_api_gateway_resource.top_products.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "top_products" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.top_products.id
  http_method          = aws_api_gateway_method.top_products.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.top_products_invoke_arn
}

resource "aws_api_gateway_resource" "top_customers" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topCustomers"
}

resource "aws_api_gateway_method" "top_customers" {
  rest_api_id    = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id    = aws_api_gateway_resource.top_customers.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "top_customers" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.top_customers.id
  http_method          = aws_api_gateway_method.top_customers.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.top_customers_invoke_arn
}

resource "aws_api_gateway_resource" "sales_by_store" {
  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "salesByStore"
}

resource "aws_api_gateway_method" "sales_by_store" {
  rest_api_id    = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id    = aws_api_gateway_resource.sales_by_store.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "sales_by_store" {
  rest_api_id          = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id          = aws_api_gateway_resource.sales_by_store.id
  http_method          = aws_api_gateway_method.sales_by_store.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.sales_by_store_invoke_arn
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