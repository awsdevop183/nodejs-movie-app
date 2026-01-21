const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());

// ⚠️ CHANGE THIS to your Database Server's Private IP
const DB_HOST = '192.168.1.31';

// Database connection with auto-reconnect
let db;

function connectDB() {
    db = mysql.createConnection({
        host: DB_HOST,
        user: 'appuser',
        password: 'password123',
        database: 'moviesdb'
    });

    db.connect(err => {
        if (err) {
            console.log('❌ Database connection failed. Retrying in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            console.log('✅ Connected to Database Server');
        }
    });

    // Handle connection loss
    db.on('error', err => {
        console.log('❌ Database error:', err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            console.log('🔄 Reconnecting to database...');
            connectDB();
        }
    });
}

// Start connection
connectDB();

// Serve frontend
app.use(express.static('public'));

// API: Get all movies
app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API: Add movie
app.post('/api/movies', (req, res) => {
    const { title, genre, year, rating } = req.body;
    db.query(
        'INSERT INTO movies (title, genre, year, rating) VALUES (?, ?, ?, ?)',
        [title, genre, year, rating],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, title, genre, year, rating });
        }
    );
});

// API: Delete movie
app.delete('/api/movies/:id', (req, res) => {
    db.query('DELETE FROM movies WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
});

// Listen on all interfaces (0.0.0.0) for EC2 public access
app.listen(3000, '0.0.0.0', () => {
    console.log('🎬 Movies App running on http://0.0.0.0:3000');
});