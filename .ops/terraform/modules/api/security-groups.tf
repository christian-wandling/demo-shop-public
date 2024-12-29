resource "aws_security_group" "api_sg" {
  name        = "${var.identifier_prefix}-api-sg-${var.environment}"
  description = "Security group for Api server"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "api_ingress_https_allowed_ranges" {
  count             = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.api_sg.id
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access from allowed ranges"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-ingress-https-allowed-ranges-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "api_ingress_ssh" {
  count = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.api_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  description       = "Allow SSH access"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-ingress-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "api_ingress_frontend" {
  security_group_id = aws_security_group.api_sg.id
  ip_protocol       = "tcp"
  from_port         = 3000
  to_port           = 3000
  referenced_security_group_id = var.frontend_sg
  description       = "Allow traffic from frontend reverse proxy"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-ingress-frontend-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "api_egress_frontend" {
  security_group_id            = aws_security_group.api_sg.id
  ip_protocol                 = "tcp"
  from_port                   = 1024
  to_port                     = 65535
  referenced_security_group_id = var.frontend_sg
  description                 = "Allow response traffic to frontend"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-egress-frontend-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "api_egress_postgres" {
  security_group_id            = aws_security_group.api_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = var.postgres_sg
  description                  = "Allow outbound traffic to Postgres instances"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-egress-postgress-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "api_egress_all" {
  security_group_id = aws_security_group.api_sg.id
  ip_protocol       = "-1"
  from_port         = -1
  to_port           = -1
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all outbound traffic"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-sg-egress-all-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "api_egress_keycloak" {
  security_group_id            = aws_security_group.api_sg.id
  ip_protocol                 = "tcp"
  from_port                   = 443
  to_port                     = 443
  referenced_security_group_id = var.keycloak_sg
  description                 = "Allow traffic to keycloak"
}
