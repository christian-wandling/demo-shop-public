resource "aws_key_pair" "keycloak_key_pub" {
  key_name   = "${var.identifier_prefix}-keycloak-key-pub-${var.environment}"
  public_key = file(var.keycloak_ssh_public_key_path)

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-key-pub-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}
