# ============================================================
# WAF v2 - Protección para API Gateway (REGIONAL)
# ============================================================

resource "aws_wafv2_web_acl" "cloudshop" {
  name  = "cloudshop-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # Regla 1: Managed Common Rule Set (SQLi, XSS, LFI…)
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CloudShopCommonRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # Regla 2: Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CloudShopBadInputsMetric"
      sampled_requests_enabled   = true
    }
  }

  # Regla 3: Rate limiting por IP (1000 req / 5 min)
  rule {
    name     = "CloudShopRateLimitByIP"
    priority = 3

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 1000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CloudShopRateLimitMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "CloudShopWAFMetric"
    sampled_requests_enabled   = true
  }

  tags = { Project = "CloudShop" }
}

# Asociar WAF con el stage de API Gateway
resource "aws_wafv2_web_acl_association" "api_gateway" {
  resource_arn = var.api_gateway_stage_arn
  web_acl_arn  = aws_wafv2_web_acl.cloudshop.arn
}
