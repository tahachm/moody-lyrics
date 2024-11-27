# S3 Bucket for Static Website Hosting
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.bucket_name

  # Enable Static Website Hosting
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# Enable Block Public Access for the Bucket
resource "aws_s3_bucket_public_access_block" "frontend_bucket_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy to allow access only via CloudFront OAI
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          AWS = var.oai_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

resource "null_resource" "rebuild_frontend" {
  provisioner "local-exec" {
    command = <<EOT
      cd ${path.module}/../../../frontend && \
      echo "VITE_APP_BACKEND_URL=http://${var.alb_dns_name}" >> .env && \
      npm install && \
      npm run build
    EOT
  }
}

locals {
  predefined_file_map = {
    "file_0"= "index.html",
    "file_1"= "_redirects",
    "file_2"= "vite.svg",
    "file_3"= "logo.svg",
    "file_4"= "index.css",
    "file_5"= "index.js"
}
}


# Sync Build Files to S3
resource "aws_s3_bucket_object" "frontend_files" {
  depends_on = [null_resource.rebuild_frontend]
  for_each = local.predefined_file_map

  bucket  = aws_s3_bucket.frontend_bucket.id
  key     = each.value
  source  = "${path.module}/../../../frontend/dist/${each.value}"

  content_type = lookup(
    {
      "html"  = "text/html",
      "css"   = "text/css",
      "js"    = "application/javascript",
      "png"   = "image/png",
      "jpg"   = "image/jpeg",
      "jpeg"  = "image/jpeg",
      "gif"   = "image/gif",
      "svg"   = "image/svg+xml",
      "json"  = "application/json",
      "woff"  = "font/woff",
      "woff2" = "font/woff2",
      "ttf"   = "font/ttf",
      "eot"   = "application/vnd.ms-fontobject",
      "otf"   = "font/otf",
    },
    lower(element(split(".", each.value), length(split(".", each.value)) - 1)),  # Get the last part of the filename
    "text/html"  # Default Content-Type
  )
}

