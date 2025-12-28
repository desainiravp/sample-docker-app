Docker app with GitHub Actions → EC2 deployment.

You can place this file at the root of your repo.

# 🚀 Node.js Docker App – CI/CD with GitHub Actions & EC2

This project demonstrates a **simple Node.js application** containerized using Docker and deployed automatically to an **AWS EC2 instance** using **GitHub Actions CI/CD**.

------

## 📁 Project Structure



.
├── app.js
├── package.json
├── Dockerfile
└── README.md


---

## 🧩 Application Overview

- Node.js HTTP server
- Runs on port **3000**
- Displays runtime and deployment information
- Containerized using Docker
- Automatically deployed to EC2 on every push to `main`

---

## 🖥️ Prerequisites

### Local Machine
- Git
- Docker
- SSH client

### AWS
- AWS account
- EC2 instance (Ubuntu 22.04 recommended)

---

## ☁️ Step 1: Create EC2 Instance

1. Launch EC2 with:
   - OS: **Ubuntu 22.04**
   - Instance type: `t2.micro` / `t3.micro`
2. Security Group inbound rules:
   | Type | Port | Source |
   |----|----|----|
   | SSH | 22 | Your IP |
   | HTTP | 80 | 0.0.0.0/0 |

3. SSH into EC2:
```bash
ssh ubuntu@<EC2_PUBLIC_IP>

🐳 Step 2: Install Docker on EC2
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker


Add user to docker group:

sudo usermod -aG docker ubuntu
exit
ssh ubuntu@<EC2_PUBLIC_IP>


Verify:

docker ps

🔑 Step 3: Generate SSH Key for GitHub Actions

On your local machine:

ssh-keygen -t ed25519 -f github_ec2_key


This creates:

github_ec2_key → private key

github_ec2_key.pub → public key

🔐 Step 4: Add Public Key to EC2

On EC2:

mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys


Paste contents of:

cat github_ec2_key.pub


Set permissions:

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys


Test login:

ssh -i github_ec2_key ubuntu@<EC2_PUBLIC_IP>

🔒 Step 5: Configure GitHub Secrets

Go to:
GitHub Repo → Settings → Secrets → Actions

Add:

Secret Name	Value
DOCKER_USERNAME	Docker Hub username
DOCKER_PASSWORD	Docker Hub access token
SERVER_HOST	EC2 public IP
SERVER_USER	ubuntu
SERVER_SSH_KEY	contents of github_ec2_key
🐳 Step 6: Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY app.js .

EXPOSE 3000
CMD ["node", "app.js"]

🔁 Step 7: GitHub Actions CI/CD Pipeline

Create file:

.github/workflows/docker-deploy.yml

name: Node App Docker CI/CD

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Docker login
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login \
        -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

    - name: Build Docker image
      run: |
        docker build -t desainiravp/node-app:latest .

    - name: Push Docker image
      run: |
        docker push desainiravp/node-app:latest

    - name: Deploy to EC2
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          docker pull desainiravp/node-app:latest
          docker stop node-app || true
          docker rm node-app || true
          docker run -d \
            --name node-app \
            -p 80:3000 \
            --restart always \
            desainiravp/node-app:latest

▶️ Step 8: Deploy the Application

Commit and push:

git add .
git commit -m "Initial CI/CD setup"
git push origin main


GitHub Actions will:

Build Docker image

Push to Docker Hub

Deploy container on EC2

🌐 Step 9: Access the Application

Open browser:

http://<EC2_PUBLIC_IP>


Or via CLI:

curl http://<EC2_PUBLIC_IP>

🧪 Debugging Commands
docker ps
docker logs node-app
docker ps -a
