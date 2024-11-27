variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "oai_arn" {
  description = "The ARN of the CloudFront Origin Access Identity."
  type        = string
}

variable "alb_dns_name" {
  description = "The DNS name of the deployed ALB."
  type        = string
}
