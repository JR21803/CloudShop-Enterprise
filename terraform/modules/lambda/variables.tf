variable "lambda_role_arn" {
  type = string
}

variable "ses_from_email" {
  type    = string
  default = "noreply@cloudshop.com"
}
