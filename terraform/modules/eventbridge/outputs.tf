output "event_bus_name" {
  value       = aws_cloudwatch_event_bus.cloudshop.name
  description = "Nombre del EventBus personalizado de CloudShop"
}

output "event_bus_arn" {
  value       = aws_cloudwatch_event_bus.cloudshop.arn
  description = "ARN del EventBus personalizado de CloudShop"
}
