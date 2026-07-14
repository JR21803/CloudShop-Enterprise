output "waf_arn" {
  value       = aws_wafv2_web_acl.cloudshop.arn
  description = "ARN del WAF Web ACL de CloudShop"
}

output "waf_id" {
  value       = aws_wafv2_web_acl.cloudshop.id
  description = "ID del WAF Web ACL de CloudShop"
}
