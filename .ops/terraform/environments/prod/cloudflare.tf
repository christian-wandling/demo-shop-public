resource "cloudflare_worker_script" "security_headers" {
  name       = "security-headers"
  account_id = var.cloudflare_account_id

  tags = ["${var.project_name}-headers"]

  content = templatefile("workers/worker.js.tftpl", {
    domain = var.cloudflare_domain_name
  })
}

resource "cloudflare_zone_settings_override" "zone_settings" {
  zone_id = var.cloudflare_zone_id

  settings {
    ssl = "strict"
  }
}

resource "cloudflare_record" "cdn" {
  zone_id = var.cloudflare_zone_id
  name    = "cdn"
  value   = aws_s3_bucket.cdn.bucket_regional_domain_name
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_page_rule" "always_user_https" {
  zone_id = var.cloudflare_zone_id
  target  = "*.${var.cloudflare_domain_name}/*"
  actions {
    always_use_https = true
  }
}

resource "cloudflare_ruleset" "cache_rules" {
  zone_id     = var.cloudflare_zone_id
  name        = "cdn_cache"
  description = "Cache rules for CDN content"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules {
    action = "set_cache_settings"
    action_parameters {
      edge_ttl {
        mode    = "override_origin"
        default = 2592000
        status_code_ttl {
          status_code = 200
          value       = 2592000
        }
        status_code_ttl {
          status_code_range {
            from = 201
            to   = 299
          }
          value = 2592000
        }
      }
      cache = true
    }
    expression  = "(http.host eq \"${local.cdn_address}\")"
    description = "Cache static content"
    enabled     = true
  }
}
