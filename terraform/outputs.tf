output "frontend_s3_bucket" {
  value       = module.frontend.bucket_name
  description = "Nombre del bucket S3 del frontend"
}

output "frontend_cloudfront_domain" {
  value       = module.frontend.cloudfront_domain_name
  description = "Dominio de CloudFront para acceder al frontend"
}

output "frontend_cloudfront_distribution_id" {
  value       = module.frontend.cloudfront_distribution_id
  description = "ID de la distribución de CloudFront del frontend"
}

output "api_gateway_url" {
  value       = module.apigateway.api_url
  description = "URL de invocación del API Gateway"
}

output "cognito_user_pool_id" {
  value       = module.cognito.user_pool_id
  description = "ID del User Pool de Cognito"
}

output "cognito_client_id" {
  value       = module.cognito.client_id
  description = "ID del app client de Cognito usado por el frontend"
}

output "aws_region" {
  value       = var.aws_region
  description = "Región AWS configurada"
}