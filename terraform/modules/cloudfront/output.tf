# terraform/modules/cloudfront/outputs.tf

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.cloudfront_distribution.domain_name
}

output "cloudfront_id" {
  description = "The ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.cloudfront_distribution.id
}

output "origin_access_identity" {
  description = "The Origin Access Identity associated with the CloudFront distribution."
  value       = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
}

output "cloudfront_aliases" {
  description = "The list of aliases (CNAMEs) for the CloudFront distribution."
  value       = var.aliases
}

output "origin_access_identity_arn" {
  description = "The ARN of the Origin Access Identity."
  value       = aws_cloudfront_origin_access_identity.oai.iam_arn
}

