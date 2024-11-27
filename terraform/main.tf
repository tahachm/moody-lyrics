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

# Application Load Balancer
module "alb" {
  source              = "./modules/alb"
  vpc_id              = aws_vpc.app_vpc.id
  security_group_id   = module.security_group.alb_security_group_id
  public_subnet_ids   = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
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

# S3 Module
module "s3" {
  source             = "./modules/s3"
  bucket_name        = var.bucket_name
  oai_arn            = module.cloudfront.origin_access_identity_arn  # Pass OAI ARN from CloudFront
  alb_dns_name       = module.alb.alb_dns_name

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