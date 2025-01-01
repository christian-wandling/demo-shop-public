resource "cloudflare_access_rule" "ip_rule" {
  zone_id = var.cloudflare_zone_id
  notes   = "Allow specific IP or range"
  mode    = "whitelist"

  configuration {
    target = "ip"
    value  = aws_eip.github_runner.public_ip
  }
}
