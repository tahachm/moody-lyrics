resource "aws_db_instance" "app_rds" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.4" # Replace with your desired PostgreSQL version
  instance_class       = "db.t3.micro"
  db_name                 = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  publicly_accessible  = true
  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = var.db_subnet_group

  skip_final_snapshot = true
  tags = {
    Name = "Music-App-RDS"
  }
}
