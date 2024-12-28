resource "aws_eip" "keycloak" {
  instance = aws_instance.keycloak.id

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-eip-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform"
    },
    var.additional_tags
  )
}
