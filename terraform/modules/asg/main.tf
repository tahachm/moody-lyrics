resource "aws_launch_template" "app_lt" {
  name          = "music-app-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type
  vpc_security_group_ids = [var.security_group_id]

  user_data = base64encode(<<-EOF
#!/bin/bash
sudo yum update -y
sudo yum install -y git python3 python3-pip
export DB_HOST='${var.rds_endpoint}'
export DB_NAME='${var.rds_database_name}'
export DB_USER='${var.rds_username}'
export DB_PASSWORD='${var.rds_password}'
sudo yum install git -y
sudo git clone ${var.app_repo_url} /home/ec2-user/music-app
cd /home/ec2-user/music-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
nohup python run.py > /home/ec2-user/music-app.log 2>&1 &
EOF
  )

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "Music-App-Instance"
    }
  }
}


resource "aws_autoscaling_group" "app_asg" {
  launch_template {
    id      = aws_launch_template.app_lt.id
    version = "$Latest"
  }

  vpc_zone_identifier  = var.private_subnet_ids
  target_group_arns    = [var.target_group_arn]

  min_size = 1
  max_size = 2
  desired_capacity = 1

  health_check_type         = "ELB"
  health_check_grace_period = 300
}

