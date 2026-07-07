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