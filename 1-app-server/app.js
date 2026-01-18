const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());

// ⚠️ CHANGE THIS to your Database Server's Private IP
const DB_HOST = '10.0.1.100';

// Database connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: 'appuser',
    password: 'password123',
    database: 'moviesdb'
});

db.connect(err => {
    if (err) {
        console.log('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to Database Server');
    }
});

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

app.listen(3000, () => {
    console.log('🎬 Movies App running on http://localhost:3000');
});
