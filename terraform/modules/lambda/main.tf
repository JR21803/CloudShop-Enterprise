data "archive_file" "create_user" {

  type = "zip"

  source_dir = "${path.root}/lambdas/users/createUser"

  output_path = "${path.root}/lambdas/users/createUser.zip"

}

resource "aws_lambda_function" "create_user" {

  function_name = "createUser"

  filename = data.archive_file.create_user.output_path

  source_code_hash = data.archive_file.create_user.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "get_users" {

  type = "zip"

  source_dir = "${path.root}/lambdas/users/getUsers"

  output_path = "${path.root}/lambdas/users/getUsers.zip"

}

data "archive_file" "get_user_by_id" {

  type = "zip"

  source_dir = "${path.root}/lambdas/users/getUserById"

  output_path = "${path.root}/lambdas/users/getUserById.zip"

}

data "archive_file" "update_user" {

  type = "zip"

  source_dir = "${path.root}/lambdas/users/updateUser"

  output_path = "${path.root}/lambdas/users/updateUser.zip"

}

data "archive_file" "deactivate_user" {

  type = "zip"

  source_dir = "${path.root}/lambdas/users/deactivateUser"

  output_path = "${path.root}/lambdas/users/deactivateUser.zip"

}

resource "aws_lambda_function" "get_users" {

  function_name = "getUsers"

  filename = data.archive_file.get_users.output_path

  source_code_hash = data.archive_file.get_users.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "get_user_by_id" {

  function_name = "getUserById"

  filename = data.archive_file.get_user_by_id.output_path

  source_code_hash = data.archive_file.get_user_by_id.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "update_user" {

  function_name = "updateUser"

  filename = data.archive_file.update_user.output_path

  source_code_hash = data.archive_file.update_user.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "deactivate_user" {

  function_name = "deactivateUser"

  filename = data.archive_file.deactivate_user.output_path

  source_code_hash = data.archive_file.deactivate_user.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}



data "archive_file" "total_sales" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/totalSales"

  output_path = "${path.root}/lambdas/dashboard/totalSales.zip"

}

resource "aws_lambda_function" "total_sales" {

  function_name = "totalSales"

  filename = data.archive_file.total_sales.output_path

  source_code_hash = data.archive_file.total_sales.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "order_by_status" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/orderByStatus"

  output_path = "${path.root}/lambdas/dashboard/orderByStatus.zip"

}

resource "aws_lambda_function" "order_by_status" {

  function_name = "orderByStatus"

  filename = data.archive_file.order_by_status.output_path

  source_code_hash = data.archive_file.order_by_status.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}


data "archive_file" "out_of_stock" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/outOfStock"

  output_path = "${path.root}/lambdas/dashboard/outOfStock.zip"

}

resource "aws_lambda_function" "out_of_stock" {

  function_name = "outOfStock"

  filename = data.archive_file.out_of_stock.output_path

  source_code_hash = data.archive_file.out_of_stock.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "top_products" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/topProducts"

  output_path = "${path.root}/lambdas/dashboard/topProducts.zip"

}

resource "aws_lambda_function" "top_products" {

  function_name = "topProducts"

  filename = data.archive_file.top_products.output_path

  source_code_hash = data.archive_file.top_products.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "top_customers" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/topCustomers"

  output_path = "${path.root}/lambdas/dashboard/topCustomers.zip"

}
resource "aws_lambda_function" "top_customers" {

  function_name = "topCustomers"

  filename = data.archive_file.top_customers.output_path

  source_code_hash = data.archive_file.top_customers.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "sales_by_store" {

  type = "zip"

  source_dir = "${path.root}/lambdas/dashboard/salesByStore"

  output_path = "${path.root}/lambdas/dashboard/salesByStore.zip"

}

resource "aws_lambda_function" "sales_by_store" {

  function_name = "salesByStore"

  filename = data.archive_file.sales_by_store.output_path

  source_code_hash = data.archive_file.sales_by_store.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}
