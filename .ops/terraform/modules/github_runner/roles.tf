resource "aws_iam_role" "github_runner_role" {
  name = "${var.identifier_prefix}-github-runner-role-${var.environment}"

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
      Name        = "${var.identifier_prefix}-github-runner-role-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_instance_profile" "github_runner_profile" {
  name = "${var.identifier_prefix}-github-runner-profile-${var.environment}"
  role = aws_iam_role.github_runner_role.name

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-profile-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "aws_iam_role_policy_attachment" "github_runner_deployment_policy_attachment" {
  role       = aws_iam_role.github_runner_role.name
  policy_arn = "arn:aws:iam::273354635589:policy/TerraformDeploymentPolicy"
}
