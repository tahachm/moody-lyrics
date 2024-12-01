output "asg_security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.ec2_sg.id
}

output "alb_security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.alb_sg.id
}

output "rds_security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.rds_sg.id
}

output "lambda_security_group_id" {
  value = aws_security_group.lambda_sg.id
}
