resource "aws_iam_role" "keycloak_role" {
  name = "keycloak-ec2-role"

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
}

resource "aws_iam_instance_profile" "keycloak_profile" {
  name = "keycloak-instance-profile"
  role = aws_iam_role.keycloak_role.name
}

resource "aws_iam_role_policy" "ssm_policy" {
  name = "keycloak-ssm-policy"
  role = aws_iam_role.keycloak_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath",
          "ssm:DescribeParameters"
        ]
        Resource = "*"
      }
    ]
  })
}

