output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.app_alb.dns_name
}

output "app_target_group_arn" {
  description = "ARN of the ALB Target Group"
  value       = aws_lb_target_group.app_target_group.arn
}
