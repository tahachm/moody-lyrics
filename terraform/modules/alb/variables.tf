variable "vpc_id" {
  description = "The VPC ID where the ALB will be deployed"
  type        = string
}

variable "security_group_id" {
  description = "Security Group ID for the ALB"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for the ALB"
  type        = list(string)
}
