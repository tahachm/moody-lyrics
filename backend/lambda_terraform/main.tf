provider "aws" {
  region = var.region
}

# IAM Role for Lambda Execution
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach AWS Managed Policy for basic Lambda execution
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function
resource "aws_lambda_function" "my_lambda_function" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout

  # Use the local file for the Lambda function code
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path) # Ensure updates are detected

  # Environment Variables
  environment {
    variables = {
      DB_HOST = var.db_host
      DB_PORT = var.db_port
      DB_USER = var.db_user
      DB_PASS = var.db_pass
      DB_NAME = var.db_name
    }
  }
}

# CloudWatch Log Group for Lambda Logs
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.my_lambda_function.function_name}"
  retention_in_days = 7 # Adjust as needed
}
