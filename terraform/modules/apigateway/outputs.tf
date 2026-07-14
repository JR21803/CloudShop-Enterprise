output "api_url" {
  value = aws_api_gateway_stage.dev.invoke_url
}

output "stage_arn" {
  value       = aws_api_gateway_stage.dev.arn
  description = "ARN del stage dev, requerido para asociar el WAF"
}