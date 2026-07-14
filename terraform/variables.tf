variable "aws_region" {
  type = string
}

variable "project_name" {
  type = string
}

variable "environment" { //Borrar, no necesario
  type = string
}

variable "owner" { //Borrar, no necesario
  type = string
}

variable "ses_from_email" {
  type        = string
  description = "Correo verificado en SES para el remitente de notificaciones"
  default     = "noreply@cloudshop.com"
}

