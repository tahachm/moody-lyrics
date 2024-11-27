variable "region" {
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "lambda_function_name" {
  description = "Name of the Lambda function"
  default     = "lambdaHandler"
}

variable "lambda_zip_path" {
  description = "Path to the Lambda function ZIP file"
  default     = "../lambda_function/lambda_function.zip" # Adjust path if needed
}

variable "lambda_handler" {
  description = "Handler for the Lambda function"
  default     = "song_function.default"
}

variable "lambda_runtime" {
  description = "Runtime environment for the Lambda function"
  default     = "nodejs20.x"
}

variable "lambda_timeout" {
  description = "Timeout for the Lambda function in seconds"
  default     = 15
}

variable "db_host" {
  description = "Database host endpoint"
}

variable "db_port" {
  description = "Database port"
  default     = "5432"
}

variable "db_user" {
  description = "Database username"
}

variable "db_pass" {
  description = "Database password"
}

variable "db_name" {
  description = "Database name"
}
