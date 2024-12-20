resource "cloudflare_record" "keycloak" {
  zone_id = var.cloudflare_zone_id
  name    = "sso"
  value   = aws_eip.keycloak.public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_zone_settings_override" "keycloak_settings" {
  zone_id = var.cloudflare_zone_id
  settings {
    ssl              = "strict"
    min_tls_version  = "1.2"
    always_use_https = "on"
    tls_1_3          = "on"
  }
}

resource "cloudflare_worker_route" "security_headers_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${local.kc_domain}/*"
  script_name = var.cloudflare_headers_worker
}

resource "cloudflare_page_rule" "keycloak_https" {
  zone_id = var.cloudflare_zone_id
  target  = "${local.kc_domain}/*"
  actions {
    always_use_https = true
  }
}

