output "bucket_name" {
  value       = aws_s3_bucket.frontend.id
  description = "Nombre del bucket S3 del frontend"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.frontend.domain_name
  description = "Nombre de dominio de la distribución de CloudFront"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.frontend.id
  description = "ID de la distribución de CloudFront"
}
