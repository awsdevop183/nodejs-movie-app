#!/bin/bash
# APP SERVER SETUP (Server 2)
# Run these commands one by one

# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 2. Check versions
node --version
npm --version

# 3. Install dependencies
npm install

# 4. ⚠️ IMPORTANT: Edit app.js and change DB_HOST to your database server's private IP
nano app.js

# 5. Start the app
node app.js

# App will run on http://<this-server-ip>:3000
