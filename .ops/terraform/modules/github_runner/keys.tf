resource "aws_key_pair" "github_runner_key_pub" {
  key_name   = "${var.identifier_prefix}-github-runner-key-pub-${var.environment}"
  public_key = file(var.github_runner_ssh_public_key_path)

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-key-pub-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}
