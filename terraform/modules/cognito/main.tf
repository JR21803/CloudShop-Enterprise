resource "aws_cognito_user_pool" "users" {
  name = "CloudShopUsers"
  username_attributes = [
    "email"
  ]

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true
    required            = false

    string_attribute_constraints {
      min_length = 1
      max_length = 50
    }
  }
  
  auto_verified_attributes = ["email"]

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Tu código de verificación de CloudShop es {####}."
    email_subject        = "CloudShop - Código de verificación"
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
  mfa_configuration = "OFF"

  lambda_config {
    post_confirmation = var.post_confirmation_lambda_arn
  }

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

  write_attributes = ["email", "name", "custom:role"]
  read_attributes  = ["email", "name", "custom:role"]
}

resource "aws_cognito_user_group" "admins" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopAdministradores"
  description  = "Administradores de CloudShop"
  precedence   = 1
}

resource "aws_cognito_user_group" "operators" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopOperadores"
  description  = "Operadores de CloudShop"
  precedence   = 2
}

resource "aws_cognito_user_group" "clients" {
  user_pool_id = aws_cognito_user_pool.users.id
  name         = "CloudShopClientes"
  description  = "Clientes de CloudShop"
  precedence   = 3
}
