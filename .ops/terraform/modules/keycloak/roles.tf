resource "aws_iam_role" "keycloak_role" {
  name = "${var.identifier_prefix}-keycloak-ec2-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-role-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_instance_profile" "keycloak_profile" {
  name = "keycloak-instance-profile"
  role = aws_iam_role.keycloak_role.name

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-profile-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_role_policy" "keycloak_ssm_policy" {
  name = "keycloak-ssm-policy"
  role = aws_iam_role.keycloak_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:PutParameter",
          "kms:Encrypt"
        ]
        Resource = "*"
      }
    ]
  })
}

