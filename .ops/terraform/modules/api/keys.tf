resource "aws_key_pair" "api_key_pub" {
  key_name   = "${var.identifier_prefix}-api-key-pub-${var.environment}"
  public_key = file(var.api_ssh_public_key_path)

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-api-key-pub-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}
