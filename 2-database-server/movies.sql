-- Run this on DATABASE SERVER (Server 1)

CREATE DATABASE moviesdb;
USE moviesdb;

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    genre VARCHAR(100),
    year INT,
    rating DECIMAL(3,1)
);

INSERT INTO movies (title, genre, year, rating) VALUES
('The Dark Knight', 'Action', 2008, 9.0),
('Inception', 'Sci-Fi', 2010, 8.8),
('Titanic', 'Romance', 1997, 7.9),
('The Avengers', 'Action', 2012, 8.0),
('Forrest Gump', 'Drama', 1994, 8.8);

-- Create user for remote access
CREATE USER 'appuser'@'%' IDENTIFIED BY 'password123';
GRANT ALL ON moviesdb.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
