#!/bin/bash
# DATABASE SERVER SETUP (Server 1)
# Run these commands one by one

# 1. Install MySQL
sudo apt update
sudo apt install mysql-server -y

# 2. Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 3. Allow remote connections
sudo sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# 4. Run the SQL file
sudo mysql < movies.sql

# 5. Verify it worked
sudo mysql -e "SELECT * FROM moviesdb.movies;"

echo ""
echo "✅ Database Ready!"
echo "Note down this server's PRIVATE IP for the app server"
