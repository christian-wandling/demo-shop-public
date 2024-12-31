resource "aws_security_group" "keycloak_sg" {
  name        = "${var.identifier_prefix}-keycloak-sg-${var.environment}"
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

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_https_allowed_ranges" {
  count             = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.keycloak_sg.id
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access from allowed ranges"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-https-allowed-ranges-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_https_cloudflare_ips" {
  count             = length(var.cloudflare_ips)
  security_group_id = aws_security_group.keycloak_sg.id
  cidr_ipv4         = var.cloudflare_ips[count.index]
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access from cloudflare"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-https-cloudflare-ips-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_ssh" {
  count = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.keycloak_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  description       = "Allow SSH access"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "keycloak_egress_postgres" {
  security_group_id            = aws_security_group.keycloak_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = var.postgres_sg
  description                  = "Allow outbound traffic to Postgres instances"

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

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_frontend" {
  security_group_id = aws_security_group.keycloak_sg.id
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  referenced_security_group_id = var.frontend_sg
  description       = "Allow traffic from frontend"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-frontend-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_github_runner" {
  security_group_id = aws_security_group.keycloak_sg.id
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  referenced_security_group_id = var.github_runner_sg
  description       = "Allow traffic from the github runner"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-github-runner-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "keycloak_ingress_github_runner_ssh" {
  security_group_id = aws_security_group.keycloak_sg.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  referenced_security_group_id = var.github_runner_sg
  description       = "Allow SSH from the github runner"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-sg-ingress-github-runner-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "keycloak_egress_frontend" {
  security_group_id            = aws_security_group.keycloak_sg.id
  ip_protocol                 = "tcp"
  from_port                   = 1024
  to_port                     = 65535
  referenced_security_group_id = var.frontend_sg
  description                 = "Allow response traffic to frontend"
}
