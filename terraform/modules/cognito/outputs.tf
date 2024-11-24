output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.user_pool.id
}

output "app_client_id" {
  description = "Cognito App Client ID"
  value       = aws_cognito_user_pool_client.app_client.id
}
