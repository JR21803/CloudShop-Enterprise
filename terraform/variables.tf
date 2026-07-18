variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "cloudshop"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "ses_from_email" {
  type        = string
  description = "Correo verificado en SES para el remitente de notificaciones"
  default     = "20245984@esen.edu.sv"
}

variable "bucket_name" {
  type        = string
  description = "Nombre explícito del bucket S3 del frontend. Si se deja vacío, Terraform genera uno único."
  default     = ""
}

