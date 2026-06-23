const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/:patientId', auth, (req, res) => {
    const prescriptions = db.prepare(`
    SELECT pr.*, u.name as doctor_name
    FROM prescriptions pr
    JOIN users u ON pr.doctor_id = u.id
    WHERE pr.patient_id = ?
  `).all(req.params.patientId);
    res.json(prescriptions);
});

router.post('/', auth, (req, res) => {
    const { patient_id, doctor_id, medication, dosage, frequency, start_date, end_date } = req.body;
    const result = db.prepare(`
    INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, frequency, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(patient_id, doctor_id, medication, dosage, frequency, start_date, end_date);
    res.json({ message: 'Prescription created', id: result.lastInsertRowid });
});

router.put('/:id', auth, (req, res) => {
    const { medication, dosage, frequency, end_date } = req.body;
    db.prepare('UPDATE prescriptions SET medication=?, dosage=?, frequency=?, end_date=? WHERE id=?')
        .run(medication, dosage, frequency, end_date, req.params.id);
    res.json({ message: 'Prescription updated' });
});

module.exports = router;