# AWS Provider Configuration
provider "aws" {
  region = var.region
}

# Cognito Module
module "cognito" {
  source = "./modules/cognito"
  region = var.region
}

# Generate aws-exports.ts for React app
resource "local_file" "aws_exports" {
  content = templatefile("${path.module}/aws-exports-template.js", {
    region              = var.region,
    user_pool_id        = module.cognito.user_pool_id,
    user_pool_client_id = module.cognito.app_client_id,
  })

  filename = "${path.module}/../frontend/src/aws-exports.ts"

  # Ensure Cognito is created before this file
  depends_on = [module.cognito]
}

# CloudFront Module
module "cloudfront" {
  source            = "./modules/cloudfront"
  region            = var.region
  bucket_name       = module.s3.frontend_bucket_name  # Assume output from S3 module
  aliases           = var.cloudfront_aliases
  certificate_arn   = var.cloudfront_certificate_arn
  logging_bucket    = var.logging_bucket
  logging_prefix    = var.logging_prefix

  # Ensure CloudFront waits for aws-exports.ts
  depends_on = [local_file.aws_exports]
}

# S3 Module
module "s3" {
  source             = "./modules/s3"
  bucket_name        = var.bucket_name
  oai_arn            = module.cloudfront.origin_access_identity_arn  # Pass OAI ARN from CloudFront

  # Ensure S3 waits for aws-exports.ts
  depends_on = [local_file.aws_exports]
}

# Ensure that CloudFront is created after S3 and its policy is updated
resource "null_resource" "dependencies" {
  depends_on = [
    module.s3,
    module.cloudfront
  ]
}

# Global Outputs
output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "cognito_app_client_id" {
  value = module.cognito.app_client_id
}

output "cloudfront_domain" {
  value = module.cloudfront.cloudfront_domain_name
}