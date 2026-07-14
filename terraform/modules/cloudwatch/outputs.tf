output "dashboard_name" {
  value       = aws_cloudwatch_dashboard.cloudshop.dashboard_name
  description = "Nombre del CloudWatch Dashboard ejecutivo"
}
