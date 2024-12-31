resource "aws_security_group" "frontend_sg" {
  name        = "${var.identifier_prefix}-frontend-sg-${var.environment}"
  description = "Security group for Frontend server"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_http_allowed_ranges" {
  count             = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.frontend_sg.id
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  description       = "Allow HTTP access from allowed ranges"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-http-allowed-ranges-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_https_allowed_ranges" {
  count             = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.frontend_sg.id
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access from allowed ranges"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-https-allowed-ranges-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_ssh" {
  count = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.frontend_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  description       = "Allow SSH access"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "frontend_egress_all" {
  security_group_id = aws_security_group.frontend_sg.id
  ip_protocol       = "-1"
  from_port         = -1
  to_port           = -1
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all outbound traffic"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-egress-all-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_api" {
  security_group_id = aws_security_group.frontend_sg.id
  ip_protocol       = "tcp"
  from_port         = 1024
  to_port           = 65535
  referenced_security_group_id = var.api_sg
  description       = "Allow traffic from api"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-api-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "frontend_egress_api" {
  security_group_id            = aws_security_group.frontend_sg.id
  ip_protocol                 = "tcp"
  from_port                   = 3000
  to_port                     = 3000
  referenced_security_group_id = var.api_sg
  description                 = "Allow traffic to api"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-egress-api-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "frontend_egress_keycloak" {
  security_group_id            = aws_security_group.frontend_sg.id
  ip_protocol                 = "tcp"
  from_port                   = 443
  to_port                     = 443
  referenced_security_group_id = var.keycloak_sg
  description                 = "Allow traffic to keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-egress-keycloak-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_http_cloudflare_ips" {
  count             = length(var.cloudflare_ips)
  security_group_id = aws_security_group.frontend_sg.id
  cidr_ipv4         = var.cloudflare_ips[count.index]
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  description       = "Allow HTTP access from cloudflare"
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_https_cloudflare_ips" {
  count             = length(var.cloudflare_ips)
  security_group_id = aws_security_group.frontend_sg.id
  cidr_ipv4         = var.cloudflare_ips[count.index]
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access from cloudflare"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-https-cloudflare-ips-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_ingress_rule" "frontend_ingress_github_runner_ssh" {
  security_group_id = aws_security_group.frontend_sg.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  referenced_security_group_id = var.github_runner_sg
  description       = "Allow SSH from the github runner"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-sg-ingress-github-runner-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}
