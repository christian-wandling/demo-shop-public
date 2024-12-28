resource "aws_eip" "frontend" {
  instance = aws_instance.frontend.id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-frontend-eip-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}
