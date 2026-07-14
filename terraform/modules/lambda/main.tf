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

data "archive_file" "create_product" {

  type = "zip"

  source_dir = "${path.root}/lambdas/products/createProduct"

  output_path = "${path.root}/lambdas/products/createProduct.zip"

}

resource "aws_lambda_function" "create_product" {

  function_name = "createProduct"

  filename = data.archive_file.create_product.output_path

  source_code_hash = data.archive_file.create_product.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

data "archive_file" "get_products" {

  type = "zip"

  source_dir = "${path.root}/lambdas/products/getProducts"

  output_path = "${path.root}/lambdas/products/getProducts.zip"

}

data "archive_file" "get_product_by_id" {

  type = "zip"

  source_dir = "${path.root}/lambdas/products/getProductById"

  output_path = "${path.root}/lambdas/products/getProductById.zip"

}

data "archive_file" "update_product" {

  type = "zip"

  source_dir = "${path.root}/lambdas/products/updateProduct"

  output_path = "${path.root}/lambdas/products/updateProduct.zip"

}

data "archive_file" "delete_product" {

  type = "zip"

  source_dir = "${path.root}/lambdas/products/deleteProduct"

  output_path = "${path.root}/lambdas/products/deleteProduct.zip"

}

resource "aws_lambda_function" "get_Products" {

  function_name = "getProducts"

  filename = data.archive_file.get_products.output_path

  source_code_hash = data.archive_file.get_products.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "get_product_by_id" {

  function_name = "getProductById"

  filename = data.archive_file.get_product_by_id.output_path

  source_code_hash = data.archive_file.get_product_by_id.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "update_product" {

  function_name = "updateProduct"

  filename = data.archive_file.update_product.output_path

  source_code_hash = data.archive_file.update_product.output_base64sha256

  runtime = "nodejs20.x"

  handler = "index.handler"

  role = var.lambda_role_arn

}

resource "aws_lambda_function" "delete_product" {

  function_name = "deleteProduct"

  filename = data.archive_file.delete_product.output_path

  source_code_hash = data.archive_file.delete_product.output_base64sha256

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

data "archive_file" "create_store" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/stores/createStore"
  output_path = "${path.root}/lambdas/stores/createStore.zip"
}

resource "aws_lambda_function" "create_store" {
  function_name    = "createStore"
  filename         = data.archive_file.create_store.output_path
  source_code_hash = data.archive_file.create_store.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "get_stores" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/stores/getStores"
  output_path = "${path.root}/lambdas/stores/getStores.zip"
}

resource "aws_lambda_function" "get_stores" {
  function_name    = "getStores"
  filename         = data.archive_file.get_stores.output_path
  source_code_hash = data.archive_file.get_stores.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "get_store_by_id" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/stores/getStoreById"
  output_path = "${path.root}/lambdas/stores/getStoreById.zip"
}

resource "aws_lambda_function" "get_store_by_id" {
  function_name    = "getStoreById"
  filename         = data.archive_file.get_store_by_id.output_path
  source_code_hash = data.archive_file.get_store_by_id.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "update_store" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/stores/updateStore"
  output_path = "${path.root}/lambdas/stores/updateStore.zip"
}

resource "aws_lambda_function" "update_store" {
  function_name    = "updateStore"
  filename         = data.archive_file.update_store.output_path
  source_code_hash = data.archive_file.update_store.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "deactivate_store" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/stores/deactivateStore"
  output_path = "${path.root}/lambdas/stores/deactivateStore.zip"
}

resource "aws_lambda_function" "deactivate_store" {
  function_name    = "deactivateStore"
  filename         = data.archive_file.deactivate_store.output_path
  source_code_hash = data.archive_file.deactivate_store.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}
data "archive_file" "get_cart" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/cart/getCart"
  output_path = "${path.root}/lambdas/cart/getCart.zip"
}

resource "aws_lambda_function" "get_cart" {
  function_name    = "getCart"
  filename         = data.archive_file.get_cart.output_path
  source_code_hash = data.archive_file.get_cart.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "add_product" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/cart/addProduct"
  output_path = "${path.root}/lambdas/cart/addProduct.zip"
}

resource "aws_lambda_function" "add_product" {
  function_name    = "addProduct"
  filename         = data.archive_file.add_product.output_path
  source_code_hash = data.archive_file.add_product.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "update_quantity" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/cart/updateQuantity"
  output_path = "${path.root}/lambdas/cart/updateQuantity.zip"
}

resource "aws_lambda_function" "update_quantity" {
  function_name    = "updateQuantity"
  filename         = data.archive_file.update_quantity.output_path
  source_code_hash = data.archive_file.update_quantity.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "remove_product" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/cart/removeProduct"
  output_path = "${path.root}/lambdas/cart/removeProduct.zip"
}

resource "aws_lambda_function" "remove_product" {
  function_name    = "removeProduct"
  filename         = data.archive_file.remove_product.output_path
  source_code_hash = data.archive_file.remove_product.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "clear_cart" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/cart/clearCart"
  output_path = "${path.root}/lambdas/cart/clearCart.zip"
}

resource "aws_lambda_function" "clear_cart" {
  function_name    = "clearCart"
  filename         = data.archive_file.clear_cart.output_path
  source_code_hash = data.archive_file.clear_cart.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

# ============================================================
# ORDERS
# ============================================================

data "archive_file" "create_order" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/orders/createOrder"
  output_path = "${path.root}/lambdas/orders/createOrder.zip"
}

resource "aws_lambda_function" "create_order" {
  function_name    = "createOrder"
  filename         = data.archive_file.create_order.output_path
  source_code_hash = data.archive_file.create_order.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
  environment {
    variables = { EVENT_BUS_NAME = "cloudshop-events" }
  }
}

data "archive_file" "get_orders" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/orders/getOrders"
  output_path = "${path.root}/lambdas/orders/getOrders.zip"
}

resource "aws_lambda_function" "get_orders" {
  function_name    = "getOrders"
  filename         = data.archive_file.get_orders.output_path
  source_code_hash = data.archive_file.get_orders.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "get_order_by_id" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/orders/getOrderById"
  output_path = "${path.root}/lambdas/orders/getOrderById.zip"
}

resource "aws_lambda_function" "get_order_by_id" {
  function_name    = "getOrderById"
  filename         = data.archive_file.get_order_by_id.output_path
  source_code_hash = data.archive_file.get_order_by_id.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "update_order_status" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/orders/updateOrderStatus"
  output_path = "${path.root}/lambdas/orders/updateOrderStatus.zip"
}

resource "aws_lambda_function" "update_order_status" {
  function_name    = "updateOrderStatus"
  filename         = data.archive_file.update_order_status.output_path
  source_code_hash = data.archive_file.update_order_status.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "cancel_order" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/orders/cancelOrder"
  output_path = "${path.root}/lambdas/orders/cancelOrder.zip"
}

resource "aws_lambda_function" "cancel_order" {
  function_name    = "cancelOrder"
  filename         = data.archive_file.cancel_order.output_path
  source_code_hash = data.archive_file.cancel_order.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

# ============================================================
# AUDIT & NOTIFICATIONS
# ============================================================

data "archive_file" "get_audit" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/audit/getAudit"
  output_path = "${path.root}/lambdas/audit/getAudit.zip"
}

resource "aws_lambda_function" "get_audit" {
  function_name    = "getAudit"
  filename         = data.archive_file.get_audit.output_path
  source_code_hash = data.archive_file.get_audit.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "process_audit_event" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/audit/processAuditEvent"
  output_path = "${path.root}/lambdas/audit/processAuditEvent.zip"
}

resource "aws_lambda_function" "process_audit_event" {
  function_name    = "processAuditEvent"
  filename         = data.archive_file.process_audit_event.output_path
  source_code_hash = data.archive_file.process_audit_event.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
}

data "archive_file" "send_email" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/notifications/sendEmail"
  output_path = "${path.root}/lambdas/notifications/sendEmail.zip"
}

resource "aws_lambda_function" "send_email" {
  function_name    = "sendEmail"
  filename         = data.archive_file.send_email.output_path
  source_code_hash = data.archive_file.send_email.output_base64sha256
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = var.lambda_role_arn
  environment {
    variables = { SES_FROM_EMAIL = var.ses_from_email }
  }
}
