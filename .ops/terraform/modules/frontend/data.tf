data "http" "cloudflare_origin_root_cert" {
  url = "https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem"
}
