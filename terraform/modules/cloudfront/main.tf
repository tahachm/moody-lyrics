resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for accessing S3 bucket ${var.bucket_name}"
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name = "${var.bucket_name}.s3.amazonaws.com"
    origin_id   = "S3-${var.bucket_name}"
    
    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront Distribution for ${var.bucket_name}"
  default_root_object = var.default_root_object

  aliases = var.aliases  # Ensure this is empty for now

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Custom Error Response for SPA Routing
  custom_error_response {
    error_code            = 403
    response_page_path    = "/index.html"
    response_code         = 200
    error_caching_min_ttl = 0
  }

  # Price Class: Adjust based on your target audience regions
  price_class = "PriceClass_100"  # US, Canada, Europe

  # Viewer Certificate using default CloudFront certificate
  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2019"
  }

  # Logging Configuration (Optional)
  dynamic "logging_config" {
    for_each = var.logging_bucket != "" ? [1] : []
    content {
      bucket          = "${var.logging_bucket}.s3.amazonaws.com"
      include_cookies = false
      prefix          = var.logging_prefix
    }
  }

  # HTTP Version
  http_version = "http2"

  # Restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name        = "CloudFrontDistribution-${var.bucket_name}"
    Environment = "Production"
  }
}
