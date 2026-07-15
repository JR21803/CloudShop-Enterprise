output "user_pool_arn" {
  value = aws_cognito_user_pool.users.arn
}

output "user_pool_id" {
  value = aws_cognito_user_pool.users.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "admins_group_name" {
  value = aws_cognito_user_group.admins.name
}

output "operators_group_name" {
  value = aws_cognito_user_group.operators.name
}

output "clients_group_name" {
  value = aws_cognito_user_group.clients.name
}