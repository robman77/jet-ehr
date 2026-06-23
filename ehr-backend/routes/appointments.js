const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    const appointments = db.prepare(`
    SELECT a.*, u.name as patient_name, d.name as doctor_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    JOIN users d ON a.doctor_id = d.id
  `).all();
    res.json(appointments);
});

router.post('/', auth, (req, res) => {
    const { patient_id, doctor_id, date, time, reason } = req.body;
    console.log('Booking appointment:', { patient_id, doctor_id, date, time, reason });
    try {
        const result = db.prepare(`
      INSERT INTO appointments (patient_id, doctor_id, date, time, reason)
      VALUES (?, ?, ?, ?, ?)
    `).run(patient_id, doctor_id, date, time, reason);
        res.json({ message: 'Appointment booked', id: result.lastInsertRowid });
    } catch (e) {
        console.error('APPOINTMENT ERROR:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', auth, (req, res) => {
    const { status, notes } = req.body;
    db.prepare('UPDATE appointments SET status=?, notes=? WHERE id=?')
        .run(status, notes, req.params.id);
    res.json({ message: 'Appointment updated' });
});

router.delete('/:id', auth, (req, res) => {
    db.prepare('DELETE FROM appointments WHERE id=?').run(req.params.id);
    res.json({ message: 'Appointment deleted' });
});

module.exports = router;