resource "aws_db_instance" "postgres" {
  identifier        = "${var.identifier_prefix}-postgres-${var.environment}"
  engine            = "postgres"
  engine_version    = "17.2"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"
  port              = 5432

  db_name  = data.aws_ssm_parameter.app_db_name.value
  username = data.aws_ssm_parameter.db_username.value
  password = data.aws_ssm_parameter.db_password.value

  db_subnet_group_name = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  parameter_group_name = aws_db_parameter_group.postgres.name


  skip_final_snapshot                 = true
  publicly_accessible                 = true
  monitoring_interval = 0  # Disable enhanced monitoring
  performance_insights_enabled = false

  # Free tier settings
  multi_az                            = false
  storage_encrypted                   = false
  deletion_protection                 = false

  # Backup settings
  backup_retention_period = 1 # Minimum required
  backup_window      = "03:00-04:00"
  maintenance_window = "Mon:04:00-Mon:05:00"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-postgres-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_db_parameter_group" "postgres" {
  family = "postgres17"
  name   = "${var.identifier_prefix}-postgres-params-${var.environment}"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-parameter-group-postgres-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}


