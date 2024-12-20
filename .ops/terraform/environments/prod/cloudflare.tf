resource "cloudflare_worker_script" "security_headers" {
  name       = "security-headers"
  account_id = var.cloudflare_account_id

  tags = ["${var.project_name}-headers"]

  content = file("${path.module}/workers/worker.js")
}
