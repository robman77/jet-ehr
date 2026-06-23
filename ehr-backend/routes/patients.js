const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Get all patients (doctors only)
router.get('/', auth, (req, res) => {
    const patients = db.prepare(`
    SELECT p.*, u.name, u.email FROM patients p
    JOIN users u ON p.user_id = u.id
  `).all();
    res.json(patients);
});

// Get single patient
router.get('/:id', auth, (req, res) => {
    const patient = db.prepare(`
    SELECT p.*, u.name, u.email FROM patients p
    JOIN users u ON p.user_id = u.id WHERE p.id = ?
  `).get(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
});

// Create patient profile
router.post('/', auth, (req, res) => {
    const { user_id, date_of_birth, blood_type, allergies, phone, address } = req.body;
    const result = db.prepare(`
    INSERT INTO patients (user_id, date_of_birth, blood_type, allergies, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user_id, date_of_birth, blood_type, allergies, phone, address);
    res.json({ message: 'Patient created', id: result.lastInsertRowid });
});

// Update patient
router.put('/:id', auth, (req, res) => {
    const { date_of_birth, blood_type, allergies, phone, address } = req.body;
    db.prepare(`
    UPDATE patients SET date_of_birth=?, blood_type=?, allergies=?, phone=?, address=? WHERE id=?
  `).run(date_of_birth, blood_type, allergies, phone, address, req.params.id);
    res.json({ message: 'Patient updated' });
});

module.exports = router;