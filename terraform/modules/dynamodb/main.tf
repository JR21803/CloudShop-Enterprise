resource "aws_dynamodb_table" "users" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  attribute {
    name = "userId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}

resource "aws_dynamodb_table" "products" {
  name         = "Products"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "productId"
  attribute {
    name = "productId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}


resource "aws_dynamodb_table" "stores" {
  name         = "Stores"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "storeId"
  attribute {
    name = "storeId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}

resource "aws_dynamodb_table" "cart" {
  name         = "Cart"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "cartId"
  attribute {
    name = "cartId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = "Orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "orderId"
  attribute {
    name = "orderId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}

resource "aws_dynamodb_table" "audit" {
  name         = "Audit"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "auditId"
  attribute {
    name = "auditId"
    type = "S"
  }
  tags = {
    Project = "CloudShop"
  }
}
