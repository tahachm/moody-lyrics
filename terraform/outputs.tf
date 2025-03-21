output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.rds_endpoint
}

output "rds_username" {
  description = "RDS username"
  value       = module.rds.rds_username
}

output "rds_password" {
  description = "RDS password"
  value       = module.rds.rds_password
  sensitive = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = module.rds.rds_database_name
}

output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = module.alb.alb_dns_name
}

output "lambda_arn" {
  value       = aws_lambda_function.my_lambda_function.arn
  description = "The ARN of the deployed Lambda function"
}

output "lambda_invoke_arn" {
  value       = aws_lambda_function.my_lambda_function.invoke_arn
  description = "The invoke ARN for the Lambda function"
}

output "lambda_role_arn" {
  value       = aws_iam_role.lambda_exec_role.arn
  description = "The ARN of the Lambda execution role"
}
