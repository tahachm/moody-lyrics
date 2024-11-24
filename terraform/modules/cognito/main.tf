resource "aws_cognito_user_pool" "user_pool" {
  name = "moody-lyrics-user-pool"

  # Email Configuration
  auto_verified_attributes = ["email"] # Enable automatic email verification
  
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT" # Use Cognito's default email service
  }

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  user_pool_id = aws_cognito_user_pool.user_pool.id
  name         = "moody-lyrics-app-client"

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]
}
