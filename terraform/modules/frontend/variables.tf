variable "project_name" {
  type        = string
  description = "Nombre del proyecto"
}

variable "environment" {
  type        = string
  description = "Entorno de desarrollo"
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "Región de AWS"
}

variable "bucket_name" {
  type        = string
  description = "Nombre explícito del bucket S3. Si se deja vacío, se genera uno único con sufijo aleatorio."
  default     = ""
}
