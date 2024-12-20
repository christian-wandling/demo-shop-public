locals {
  cloudflare_ips = split("\n", trimspace(data.http.cloudflare_ips.response_body))
}
