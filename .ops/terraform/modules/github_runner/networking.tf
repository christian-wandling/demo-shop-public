resource "aws_eip" "github_runner" {
  instance = aws_instance.github_runner.id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-eip-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}
