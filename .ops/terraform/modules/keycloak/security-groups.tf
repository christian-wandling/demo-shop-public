resource "aws_security_group" "keycloak_sg" {
  name = "${var.identifier_prefix}-keycloak-sg-${var.environment}"
  description = "Security group for Keycloak server"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_http" {
  count             = length(var.allowed_cidr)
  security_group_id = aws_security_group.keycloak_sg.id
  from_port         = 8080
  to_port           = 8080
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr[count.index]
  description       = "Allow HTTP access to Keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-http-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_https" {
  count             = length(var.allowed_cidr)
  security_group_id = aws_security_group.keycloak_sg.id
  from_port         = 8443
  to_port           = 8443
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr[count.index]
  description       = "Allow HTTPS access to Keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-https-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_ssh" {
  count             = length(var.allowed_cidr)
  security_group_id = aws_security_group.keycloak_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr[count.index]
  description       = "Allow SSH access"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-ssg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "keycloak_egress_postgres" {
  security_group_id = aws_security_group.keycloak_sg.id
  ip_protocol       = "tcp"
  from_port         = 5432
  to_port           = 5432
  referenced_security_group_id = var.postgres_sg
  description       = "Allow outbound traffic to Postgres instances"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-egress-postgress-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "keycloak_egress_all" {
  security_group_id = aws_security_group.keycloak_sg.id
  ip_protocol       = "-1"
  from_port         = -1
  to_port           = -1
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all outbound traffic"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-egress-all-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}
