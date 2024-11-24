# terraform/modules/cloudfront/variables.tf

variable "region" {
  description = "AWS region for resource deployment."
  type        = string
  default     = "us-east-1"  # Ensure this matches your S3 bucket's region
}

variable "bucket_name" {
  description = "Name of the S3 bucket hosting the frontend."
  type        = string
}

variable "aliases" {
  description = "List of alternate domain names (CNAMEs) for the CloudFront distribution."
  type        = list(string)
  default     = []  # e.g., ["www.yourdomain.com"]
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate for SSL. Required if using custom domains."
  type        = string
  default     = ""  # Leave empty if using default CloudFront certificate
}

variable "logging_bucket" {
  description = "Name of the S3 bucket to store CloudFront access logs."
  type        = string
  default     = ""  # Leave empty to disable logging
}

variable "logging_prefix" {
  description = "Prefix for the CloudFront access logs."
  type        = string
  default     = "cloudfront-logs/"
}

variable "default_root_object" {
  description = "Default root object for the CloudFront distribution."
  type        = string
  default     = "index.html"
}
