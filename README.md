# 🌙 Moody Lyrics 🎵

This project demonstrates a scalable, cloud-native web application deployed on **AWS**, integrating **LLMs** and **real-time analytics** to recommend songs based on user mood. It leverages **Terraform** for infrastructure automation, adheres to best practices in **high availability**, **scalability**, and **security**, and provides a seamless experience for both users and developers.


## 🏗️ Cloud Architecture  

**Cloud Components:**  
- 🖥️ **Frontend**:  
  - ReactJS SPA hosted on **S3**  
  - Global delivery via **CloudFront**  
  - Cognito User Authentication  
- ⚙️ **Backend**:  
  - EC2 instances (Flask API) in Auto Scaling Groups behind an ALB  
  - Serverless AWS Lambda for LLM data parsing and database integration  
- 🗄️ **Database**:  
  - PostgreSQL on Amazon RDS (Multi-AZ for High Availability)  
- 🔒 **Security**:  
  - Cognito for authentication and MFA  
  - IAM Roles following least privilege principle  
  - VPC with private subnets for EC2 and RDS  
- 📊 **Monitoring**:  
  - CloudWatch logs for Lambda, EC2, and API Gateway  
- ☁️ **Infrastructure as Code (IaC)**:  
  - Terraform for provisioning and configuration  

Following is the architecture diagram:

<img src="./Screenshot 2025-03-21 at 5.21.17 AM.png" alt="Architecture Diagram" width="500"/>

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
