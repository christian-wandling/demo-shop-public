resource "aws_iam_role" "frontend_role" {
  name = "${var.identifier_prefix}-frontend-ec2-role-${var.environment}"

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
      Name        = "${var.identifier_prefix}-frontend-role-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_instance_profile" "frontend_profile" {
  name = "frontend-instance-profile"
  role = aws_iam_role.frontend_role.name

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-profile-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_role_policy" "frontend_ssm_policy" {
  name = "frontend-ssm-policy"
  role = aws_iam_role.frontend_role.name

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

