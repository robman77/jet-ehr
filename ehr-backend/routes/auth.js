const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Register
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashed = bcrypt.hashSync(password, 10);
    try {
        const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, email, hashed, role || 'patient');
        res.json({ message: 'User registered', userId: result.lastInsertRowid });
    } catch (e) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password))
        return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

module.exports = router;