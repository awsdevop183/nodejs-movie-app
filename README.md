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
vi app.js

# Start app
#node app.js



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

# Running Node.js App as a Service on AWS EC2

## Option 1: systemd service (Recommended for EC2)

### Step 1: Create a systemd service file
```bash
sudo nano /etc/systemd/system/myapp.service
```

### Step 2: Add this configuration
```ini
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ubuntu/nodejs-movie-app
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/myapp/output.log
StandardError=append:/var/log/myapp/error.log
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Step 3: Enable and start the service
```bash
# Create log directory
sudo mkdir -p /var/log/myapp
sudo chown ec2-user:ec2-user /var/log/myapp

# Reload systemd, enable and start service
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp

# Check status
sudo systemctl status myapp
```

### Useful systemd commands
```bash
# Stop the service
sudo systemctl stop myapp

# Restart the service
sudo systemctl restart myapp

# View logs
sudo journalctl -u myapp -f
```

---

## Option 2: PM2 (Popular for Node.js)

PM2 is designed for Node.js apps and includes clustering, monitoring, and zero-downtime reloads.

### Step 1: Install PM2 globally
```bash
npm install -g pm2
```

### Step 2: Start your app
```bash
pm2 start app.js --name myapp
```

### Step 3: Save PM2 configuration
```bash
pm2 save
```

### Step 4: Generate startup script
```bash
pm2 startup systemd
```

**Copy and run the command PM2 outputs** (it will look something like):
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

### Useful PM2 commands
```bash
# View running apps
pm2 list

# View logs
pm2 logs myapp

# Stop app
pm2 stop myapp

# Restart app
pm2 restart myapp

# Monitor resources
pm2 monit

# Delete app from PM2
pm2 delete myapp
```

---

## Notes for AMI + Load Balancer Setup

- Ensure your service starts on boot before creating the AMI
- Configure health check endpoints for your load balancer
- Update `WorkingDirectory` and `ExecStart` paths to match your actual app location
- For Ubuntu, use `ubuntu` instead of `ec2-user`
- Verify the Node.js path: `which node`
