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

# Step 1: Rebuild the frontend
resource "null_resource" "rebuild_frontend" {
  provisioner "local-exec" {
    command = "cd ${path.module}/../../../frontend && npm run build"
  }
}

# Step 2: Generate the file list after the build
resource "null_resource" "generate_fileset" {
  provisioner "local-exec" {
    command = "python3 ${path.module}/generate_fileset.py"
  }

  # Ensure the build process completes first
  depends_on = [null_resource.rebuild_frontend]
}

# Step 3: Read the generated file list
data "local_file" "dynamic_fileset" {
  filename = "${path.module}/fileset.json"

  # Ensure the fileset is generated before reading
  depends_on = [null_resource.generate_fileset]
}

# Step 4: Decode the file list
locals {
  dynamic_fileset = jsondecode(data.local_file.dynamic_fileset.content)
}

# Step 5: Upload files to S3
resource "aws_s3_bucket_object" "frontend_files" {
  for_each = local.dynamic_fileset

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
    lower(element(split(".", each.value), length(split(".", each.value)) - 1)),
    "text/html"  # Default Content-Type
  )
}
