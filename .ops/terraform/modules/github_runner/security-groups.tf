resource "aws_security_group" "github_runner_sg" {
  name        = "${var.identifier_prefix}-github-runner-sg-${var.environment}"
  description = "Security group for the github runner"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github_runner-sg-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "github_runner_ingress_ssh" {
  count = length(var.allowed_cidr_blocks)
  security_group_id = aws_security_group.github_runner_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.allowed_cidr_blocks[count.index]
  description       = "Allow SSH access"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-ingress-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_all" {
  security_group_id = aws_security_group.github_runner_sg.id
  ip_protocol       = "-1"
  from_port         = -1
  to_port           = -1
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all outbound traffic"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-all-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_postgres" {
  security_group_id            = aws_security_group.github_runner_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = var.postgres_sg
  description                  = "Allow outbound traffic to Postgres instances"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-postgress-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_keycloak" {
  security_group_id            = aws_security_group.github_runner_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 443
  to_port                      = 443
  referenced_security_group_id = var.keycloak_sg
  description                  = "Allow outbound traffic to Keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-keycloak-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_keycloak_ssh" {
  security_group_id            = aws_security_group.github_runner_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 22
  to_port                      = 22
  referenced_security_group_id = var.keycloak_sg
  description                  = "Allow outbound ssh to Keycloak"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-keycloak-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_frontend_ssh" {
  security_group_id            = aws_security_group.github_runner_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 22
  to_port                      = 22
  referenced_security_group_id = var.frontend_sg
  description                  = "Allow outbound ssh to the frontend"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-frontend-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_vpc_security_group_egress_rule" "github_runner_egress_api_ssh" {
  security_group_id            = aws_security_group.github_runner_sg.id
  ip_protocol                  = "tcp"
  from_port                    = 22
  to_port                      = 22
  referenced_security_group_id = var.api_sg
  description                  = "Allow outbound ssh to the api"

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-sg-egress-api-ssh-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}

resource "aws_security_group_rule" "temp_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["${chomp(data.http.my_ip.response_body)}/32"]
  security_group_id = aws_security_group.github_runner_sg.id
}
