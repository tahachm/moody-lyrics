variable "name_prefix" {
  description = "Prefix for the security group name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the security group will be created"
  type        = string
}