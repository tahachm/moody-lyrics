# AWS Provider Configuration
provider "aws" {
  region = var.region
}

# VPC
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "music-app-vpc"
  }
}

# Subnets
resource "aws_subnet" "private_subnet_1" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "music-app-private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = false

  tags = {
    Name = "music-app-private-subnet-2"
  }
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "music-app-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "music-app-public-subnet-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "app_igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "music-app-internet-gateway"
  }
}

# Public Route Table
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_igw.id
  }

  tags = {
    Name = "music-app-public-route-table"
  }
}

resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_route_table.id
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat_gw_eip" {
  vpc = true

  tags = {
    Name = "music-app-nat-eip"
  }
}

# NAT Gateway
resource "aws_nat_gateway" "app_nat_gw" {
  allocation_id = aws_eip.nat_gw_eip.id
  subnet_id     = aws_subnet.public_subnet_1.id

  tags = {
    Name = "music-app-nat-gateway"
  }
}

# Private Route Table
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.app_nat_gw.id
  }

  tags = {
    Name = "music-app-private-route-table"
  }
}

resource "aws_route_table_association" "private_subnet_1_association" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_association" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_route_table.id
}

# Database Subnet Group
resource "aws_db_subnet_group" "app_subnet_group" {
  name       = "music-app-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]

  tags = {
    Name = "Music-App-DB-Subnet-Group"
  }
}

# Security Groups
module "security_group" {
  source      = "./modules/security_group"
  name_prefix = "music-app-sg"
  vpc_id      = aws_vpc.app_vpc.id
}

resource "aws_acm_certificate" "self_signed" {
  private_key      = file("selfsigned.key")  # Path to private key
  certificate_body = file("selfsigned.crt") # Path to certificate
}

# Application Load Balancer
module "alb" {
  source              = "./modules/alb"
  vpc_id              = aws_vpc.app_vpc.id
  security_group_id   = module.security_group.alb_security_group_id
  public_subnet_ids   = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
  aws_acm_certificate = aws_acm_certificate.self_signed.arn
}

# Auto Scaling Group
module "asg" {
  source              = "./modules/asg"
  ami_id              = "ami-0453ec754f44f9a4a" # Amazon Linux 2023 AMI
  instance_type       = "t2.micro"
  security_group_id   = module.security_group.asg_security_group_id
  target_group_arn    = module.alb.app_target_group_arn
  app_repo_url        = "https://github.com/tahachm/moody-lyrics.git"
  private_subnet_ids  = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]

  rds_endpoint        = module.rds.rds_endpoint
  rds_database_name   = module.rds.rds_database_name
  rds_username        = module.rds.rds_username
  rds_password        = module.rds.rds_password
}

# RDS Module
module "rds" {
  source              = "./modules/rds"
  db_name             = "music_db"
  db_username         = "postgres"
  db_password         = "securepassword123"
  security_group_id   = module.security_group.rds_security_group_id
  db_subnet_group     = aws_db_subnet_group.app_subnet_group.name
  vpc_id              = aws_vpc.app_vpc.id
}

##################################################################

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_vpc_permissions" {
  name = "LambdaVpcPermissions"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:AssignPrivateIpAddresses",
          "ec2:UnassignPrivateIpAddresses"
        ],
        Resource = "*"
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
  function_name = "StoreLLMResponse"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout

  # Attach Lambda to VPC
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_group_ids = [module.security_group.lambda_security_group_id]
  }

  # Use the local file for the Lambda function code
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path) # Ensure updates are detected

  # Environment Variables
  environment {
    variables = {
      DB_HOST = split(":", module.rds.rds_endpoint)[0] # Extracts the host part
      DB_PORT = split(":", module.rds.rds_endpoint)[1] # Extracts the port part
      DB_USER = module.rds.rds_username
      DB_PASS = module.rds.rds_password
      DB_NAME = module.rds.rds_database_name
    }
  }

  # Ensure Lambda waits for RDS and Security Group creation
  depends_on = [
  module.security_group,
  module.rds
]

}


# CloudWatch Log Group for Lambda Logs
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.my_lambda_function.function_name}"
  retention_in_days = 7 # Adjust as needed
}

# API Gateway - HTTP API
resource "aws_apigatewayv2_api" "lambda_api" {
  name          = "music-app-api"
  protocol_type = "HTTP"

  description = "API Gateway for Music App Lambda function"
  
  cors_configuration {
    allow_origins     = ["*"] # Replace '*' with your frontend domain in production, e.g., "https://your-frontend-domain.com"
    allow_methods     = ["GET", "POST", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization"]
    expose_headers    = []
    max_age           = 3600
    allow_credentials = false
  }
}

# API Gateway Integration with Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.lambda_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.my_lambda_function.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"

}

# Define a Route
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "options_route" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "OPTIONS /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Deploy the API
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.lambda_api.id
  name        = "prod"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 500
    throttling_rate_limit  = 1000
  }
}

# Allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  # The source ARN should match the API and stage
  source_arn = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}

# Optional: Output the API URL
output "api_endpoint" {
  value = "${aws_apigatewayv2_api.lambda_api.api_endpoint}/${aws_apigatewayv2_stage.default_stage.name}"
  description = "The endpoint of the API Gateway"
}


##################################################################

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

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# S3 Module
module "s3" {
  source             = "./modules/s3"
  bucket_name        = "${var.bucket_name}-${random_string.bucket_suffix.result}"
  oai_arn            = module.cloudfront.origin_access_identity_arn  # Pass OAI ARN from CloudFront
  alb_dns_name       = module.alb.alb_dns_name
  lambda_url         = "${aws_apigatewayv2_api.lambda_api.api_endpoint}/${aws_apigatewayv2_stage.default_stage.name}"

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

########################################################################
