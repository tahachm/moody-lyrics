 resource "aws_lb" "app_alb" {
  name               = "music-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.public_subnet_ids  # Use the variable

  tags = {
    Name = "Music-App-ALB"
  }
}


resource "aws_lb_target_group" "app_target_group" {
  name        = "music-app-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    interval            = 100  # Increase interval between checks
    timeout             = 60  # Increase timeout for app response
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "Music-App-Target-Group"
  }
}


resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_target_group.arn
  }

  tags = {
    Name = "Music-App-Listener"
  }
}