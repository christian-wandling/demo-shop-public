output "keycloak_sg" {
  description = "The keycloak server security group"
  value       = aws_security_group.keycloak_sg.id
}

output "keycloak_address" {
  description = "The address of the keycloak server"
  value       = local.kc_domain
}

output "keycloak_private_ip" {
  description = "The private ip of the keycloak server"
  value       = aws_eip.keycloak.private_ip
}

output "keycloak_realm_public_key" {
  description = "The public key of the keycloak realm"
  value = data.keycloak_realm_keys.keycloak_realm_keys.keys[0].public_key
  sensitive   = true
}
