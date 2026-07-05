resource "aws_api_gateway_rest_api" "files_api" {
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

resource "aws_api_gateway_method" "update_user" {
  rest_api_id      = aws_api_gateway_rest_api.cloudshop_api.id
  resource_id      = aws_api_gateway_resource.user_id.id
  http_method      = "PUT"
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = true
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
    aws_api_gateway_integration.sales_by_store

  ]

}

resource "aws_api_gateway_stage" "dev" {

  deployment_id = aws_api_gateway_deployment.deployment.id

  rest_api_id = aws_api_gateway_rest_api.cloudshop_api.id

  stage_name = "dev"

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

  rest_api_id = aws_api_gateway_rest_api.api.id

  parent_id = aws_api_gateway_resource.dashboard.id

  path_part = "orderByStatus"

}

resource "aws_api_gateway_method" "order_by_status" {

  rest_api_id = aws_api_gateway_rest_api.api.id

  resource_id = aws_api_gateway_resource.order_by_status.id

  http_method = "GET"

  authorization = "COGNITO_USER_POOLS"

  authorizer_id = aws_api_gateway_authorizer.authorizer.id

  api_key_required = true

}

resource "aws_api_gateway_integration" "order_by_status" {

  rest_api_id = aws_api_gateway_rest_api.api.id

  resource_id = aws_api_gateway_resource.order_by_status.id

  http_method = aws_api_gateway_method.order_by_status.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"

  uri = var.order_by_status_invoke_arn

}

resource "aws_api_gateway_resource" "out_of_stock" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "outOfStock"
}

resource "aws_api_gateway_method" "out_of_stock" {
  rest_api_id    = aws_api_gateway_rest_api.api.id
  resource_id    = aws_api_gateway_resource.out_of_stock.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.authorizer.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "out_of_stock" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.out_of_stock.id
  http_method          = aws_api_gateway_method.out_of_stock.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.out_of_stock_invoke_arn
}

resource "aws_api_gateway_resource" "top_products" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topProducts"
}

resource "aws_api_gateway_method" "top_products" {
  rest_api_id    = aws_api_gateway_rest_api.api.id
  resource_id    = aws_api_gateway_resource.top_products.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.authorizer.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "top_products" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.top_products.id
  http_method          = aws_api_gateway_method.top_products.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.top_products_invoke_arn
}

resource "aws_api_gateway_resource" "top_customers" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "topCustomers"
}

resource "aws_api_gateway_method" "top_customers" {
  rest_api_id    = aws_api_gateway_rest_api.api.id
  resource_id    = aws_api_gateway_resource.top_customers.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.authorizer.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "top_customers" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.top_customers.id
  http_method          = aws_api_gateway_method.top_customers.http_method
  integration_http_method = "POST"
  type                 = "AWS_PROXY"
  uri                  = var.top_customers_invoke_arn
}

resource "aws_api_gateway_resource" "sales_by_store" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.dashboard.id
  path_part   = "salesByStore"
}

resource "aws_api_gateway_method" "sales_by_store" {
  rest_api_id    = aws_api_gateway_rest_api.api.id
  resource_id    = aws_api_gateway_resource.sales_by_store.id
  http_method    = "GET"
  authorization  = "COGNITO_USER_POOLS"
  authorizer_id  = aws_api_gateway_authorizer.authorizer.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "sales_by_store" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
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