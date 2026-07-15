resource "aws_cognito_user_pool" "users" {
  name = "CloudShopUsers"
  username_attributes = [
    "email"
  ]
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
  mfa_configuration = "OFF"
}

resource "aws_cognito_user_pool_client" "client" {
  name            = "CloudShopClient"
  user_pool_id    = aws_cognito_user_pool.users.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

resource "aws_cognito_user_group" "admins" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopAdmins"
  description  = "Administrators of CloudShop"
  precedence   = 1
}

resource "aws_cognito_user_group" "operators" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopOperators"
  description  = "Operators of CloudShop"
  precedence   = 2
}

resource "aws_cognito_user_group" "clients" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopClients"
  description  = "Customers of CloudShop"
  precedence   = 3
}
