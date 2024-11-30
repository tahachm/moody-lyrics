# moody-lyrics
Codebase for our AWS project in CS487 Cloud Development (LUMS)


How to run backend with SSL

cd into terraform folder
brew install openssl(mac)/install openssl in windows(https://slproweb.com/products/Win32OpenSSL.html)

CopyPaste these commands togather in the terminal and 3 files will be created inside the terraform folder:

openssl genrsa -out selfsigned.key 2048
openssl req -new -key selfsigned.key -out selfsigned.csr -subj "/CN=*.compute.amazonaws.com"
openssl x509 -req -days 365 -in selfsigned.csr -signkey selfsigned.key -out selfsigned.crt

terraform apply -auto-approve