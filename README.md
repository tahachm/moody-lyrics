# 🌙 Moody Lyrics 🎵
Codebase for our **AWS project** in **CS487 Cloud Development (LUMS)**.

This project provisions multiple AWS resources using **Terraform**, including an **RDS database**, **Lambda functions**, an **Application Load Balancer (ALB)**, and more. Once deployed, you can use the generated URLs to access the backend and frontend services.

---

## 🛠️ How to Compile and Run Terraform Code
> _Only tested on **Mac**. Automation commands may differ on **Windows**._

### Pre-requisites
- **Terraform** installed ([Install Guide](https://developer.hashicorp.com/terraform/downloads))  
- **OpenSSL** (for generating SSL certificates):  
  ```bash
  brew install openssl
- **AWS CLI** configured with appropriate permissions (EC2, RDS, Lambda, ALB, IAM, CloudFront, etc.)

### Steps To Deploy Infrastructure
- Create a .env file inside the frontend folder
- Navigate to the Terraform directory and initialize Terraform
```bash
  terraform init
```
- Generate Self-Signed Certificates
```bash
openssl genrsa -out selfsigned.key 2048
openssl req -new -key selfsigned.key -out selfsigned.csr -subj "/CN=*.compute.amazonaws.com"
openssl x509 -req -days 365 -in selfsigned.csr -signkey selfsigned.key -out selfsigned.crt
```
- Apply the Terraform Configuration
```bash
terraform apply -auto-approve
```

Once deployment is successful, Terraform will output critical information about the deployed AWS resources.
You’ll need these to access backend APIs, frontend websites, and more.

### Terraform Outputs

| Output  | Description |
| ------------- |:-------------:|
| rds_endpoint      | 	The endpoint URL of the RDS Database.|
| rds_username      | 	The master username for the RDS Database.     |
| rds_password      | The master password for the RDS Database (This is marked as sensitive and won't display directly unless explicitly requested).     |
| rds_database_name     | The name of the RDS Database.     |
| alb_dns_name      | The DNS name of the Application Load Balancer (ALB).|
| lambda_arn      | The ARN of the deployed AWS Lambda Function.    |
| lambda_invoke_arn| The Invoke ARN used to trigger the AWS Lambda Function.|
| lambda_role_arn      |The IAM Role ARN for Lambda's execution role.|
| cloudfront_domain_name      | The domain name of the CloudFront distribution.|


### Accessing the application

- Open the alb_dns_name URL in your browser and proceed with the unsafe warning page so browser trusts https request from backend server
- Now use the cloudfront url to access the frontend, signup and enjoy.
