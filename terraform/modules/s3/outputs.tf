# terraform/modules/s3/outputs.tf

output "frontend_bucket_name" {
  description = "Name of the frontend S3 bucket."
  value       = aws_s3_bucket.frontend_bucket.bucket
}

output "frontend_bucket_arn" {
  description = "ARN of the frontend S3 bucket."
  value       = aws_s3_bucket.frontend_bucket.arn
}