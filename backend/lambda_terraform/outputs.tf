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
