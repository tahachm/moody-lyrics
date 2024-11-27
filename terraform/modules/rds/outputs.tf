output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.app_rds.endpoint
}

output "rds_username" {
  description = "RDS username"
  value       = aws_db_instance.app_rds.username
}

output "rds_password" {
  description = "RDS password"
  value       = aws_db_instance.app_rds.password
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.app_rds.db_name
}
