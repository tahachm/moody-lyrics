# moody-lyrics
Codebase for our AWS project in CS487 Cloud Development (LUMS)

How to Compile and run terraform code (Only Tested on Mac Automation Commands may differ on Windows)

make a .env file in frontend folder
cd terraform
terraform init
brew install openssl

CopyPaste these commands togather in the terminal and 3 files will be created inside the terraform folder:

openssl genrsa -out selfsigned.key 2048
openssl req -new -key selfsigned.key -out selfsigned.csr -subj "/CN=*.compute.amazonaws.com"
openssl x509 -req -days 365 -in selfsigned.csr -signkey selfsigned.key -out selfsigned.crt

terraform apply -auto-approve

Now you will get alb dns name copy paste it into browser and proceed the unsafe warning page so browser trusts https request from backend server
Now use the cloudfront url to access the frontend, signup and enjoy
