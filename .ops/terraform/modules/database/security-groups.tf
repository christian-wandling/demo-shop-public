resource "aws_db_subnet_group" "postgres" {
  name = "${var.identifier_prefix}-postgres-subnet-group-${var.environment}"
  subnet_ids = [var.subnet_id_1, var.subnet_id_2]

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-postgres-subnet-group-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_security_group" "postgres_sg" {
  name        = "${var.identifier_prefix}-postgres-sg-${var.environment}"
  description = "Security group for PostgreSQL RDS"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-postgres-sg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "postgres_ingress_terraform" {
  count = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.postgres_sg.id
  from_port         = 5432
  to_port           = 5432
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  description       = "PostgreSQL access from Terraform environment"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-postres-ingres-terraform-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "postgres_ingres_keycloak" {
  security_group_id            = aws_security_group.postgres_sg.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = var.keycloak_sg
  description                  = "PostgreSQL access from Keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-postres-ingres-keycloak-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}
