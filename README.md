# 🎬 Movies App - Simple Two-Server Setup

## Architecture
```
[Browser] --> [Server 1: Web Server] --> [Server 2: Database Server]
                 (Node.js:3000)              (MySQL:3306)
```

## What You Need
- 2 EC2 instances (Ubuntu)
- Both in same VPC

---
## Step 1: Setup App Server

SSH into Server 1:
```bash
ssh -i key.pem ubuntu@<app-server-ip>
```

Run these commands:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Copy app files and install
npm install

# ⚠️ Edit app.js - change DB_HOST to Database Server's PRIVATE IP
nano app.js

# Start app
node app.js
```

**Security Group:** Allow port 3000 from anywhere

---

## Step 2: Setup Database Server

SSH into Server 2:
```bash
ssh -i key.pem ubuntu@<database-server-ip>
```

Run these commands:
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server -y

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Allow remote connections
sudo sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# Create database (copy movies.sql content)
sudo mysql < movies.sql

# Verify
sudo mysql -e "SELECT * FROM moviesdb.movies;"
```

**Security Group:** Allow port 3306 from App Server IP

---



## Step 3: Test

Open browser: `http://<app-server-public-ip>:3000`

---

## Files
```
1-database-server/
  ├── movies.sql    # Database schema + sample data
  └── setup.sh      # Setup commands

2-app-server/
  ├── app.js        # Node.js backend (EDIT DB_HOST!)
  ├── package.json  # Dependencies
  ├── public/
  │   └── index.html  # Frontend
  └── setup.sh      # Setup commands
```

---

## Troubleshooting

**Can't connect to database?**
```bash
# On App Server, test connection:
mysql -h <db-private-ip> -u appuser -p moviesdb
# Password: password123
```

**App not starting?**
```bash
# Check if port 3000 is in use:
sudo lsof -i :3000
```
