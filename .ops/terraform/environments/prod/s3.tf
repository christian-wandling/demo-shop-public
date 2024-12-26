resource "aws_s3_bucket" "cdn"  {
  bucket = local.cdn_address

  tags = merge(
    {
      Name        = "${var.project_name}-s3-demo-shop-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    }
  )
}


resource "aws_s3_bucket_versioning" "demo_shop" {
  bucket = aws_s3_bucket.cdn.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "demo_shop" {
  bucket = aws_s3_bucket.cdn.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "demo_shop" {
  bucket = aws_s3_bucket.cdn.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [
      "https://${module.frontend.frontend_address}",
      "https://${local.cdn_address}",
      "http://localhost:3000"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "demo_shop_public_read" {
  bucket = aws_s3_bucket.cdn.id
  depends_on = [aws_s3_bucket_public_access_block.demo_shop]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.cdn.arn}/*"
        Condition = {
          IpAddress = {
            "aws:SourceIp": local.cloudflare_ips
          }
        }
      },
      {
        Sid       = "AllowIAMUserAccess"
        Effect    = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"]
        Resource = [
          aws_s3_bucket.cdn.arn,
          "${aws_s3_bucket.cdn.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_s3_bucket_public_access_block" "demo_shop" {
  bucket = aws_s3_bucket.cdn.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
