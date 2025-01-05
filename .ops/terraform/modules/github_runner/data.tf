data "github_actions_registration_token" "runner" {
  repository = var.github_repo
}

data "http" "my_ip" {
  url = "https://api.ipify.org"
}
