# ============================================================
# SES - Identidad de correo para notificaciones de CloudShop
# ============================================================

resource "aws_ses_email_identity" "from_email" {
  email = var.ses_from_email
}

resource "aws_ses_configuration_set" "cloudshop" {
  name = "cloudshop-ses-config"
}
