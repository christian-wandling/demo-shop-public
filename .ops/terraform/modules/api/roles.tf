resource "aws_iam_role" "api_role" {
  name = "${var.identifier_prefix}-api-ec2-role-${var.environment}"

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
      Name        = "${var.identifier_prefix}-api-role-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_instance_profile" "api_profile" {
  name = "api-instance-profile"
  role = aws_iam_role.api_role.name

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-profile-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_role_policy" "api_ssm_policy" {
  name = "api-ssm-policy"
  role = aws_iam_role.api_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })
}

