variable "process_audit_event_arn" {
  type        = string
  description = "ARN de la Lambda que procesa eventos de auditoría"
}

variable "process_audit_event_function_name" {
  type        = string
  description = "Nombre de la Lambda que procesa eventos de auditoría"
}

variable "send_email_arn" {
  type        = string
  description = "ARN de la Lambda que envía notificaciones por SES"
}

variable "send_email_function_name" {
  type        = string
  description = "Nombre de la Lambda que envía notificaciones por SES"
}

variable "event_bus_name" {
  type = string
}