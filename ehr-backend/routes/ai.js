const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function ask(prompt) {
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
    });
    return response.choices[0].message.content;
}

// Temporary test route
router.get('/test', async (req, res) => {
    try {
        const text = await ask('Say hello in one sentence.');
        res.json({ result: text });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// Symptom Checker
router.post('/symptoms', auth, async (req, res) => {
    const { symptoms, patientAge, patientGender } = req.body;
    try {
        const text = await ask(`You are a clinical decision support assistant helping a doctor.
    
Patient info: ${patientAge} year old ${patientGender}.
Symptoms reported: ${symptoms}

Please provide:
1. Top 3 possible conditions (with brief explanation for each)
2. Recommended immediate actions
3. Tests or investigations to consider
4. Red flag symptoms to watch for

Keep your response clear and structured. Always remind the doctor this is a support tool, not a final diagnosis.`);
        res.json({ result: text });
    } catch (e) {
        console.error('AI ERROR:', e);
        res.status(500).json({ error: 'AI request failed: ' + e.message });
    }
});

// Drug Interaction Checker
router.post('/drug-interaction', auth, async (req, res) => {
    const { medications } = req.body;
    try {
        const text = await ask(`You are a pharmacology assistant helping a doctor check for drug interactions.

Medications to check: ${medications.join(', ')}

Please provide:
1. Any known interactions between these medications (severity: mild / moderate / severe)
2. What the interaction causes
3. Recommended action (monitor, avoid, adjust dose, etc.)
4. Safe alternatives if any severe interactions exist

If no interactions are found, confirm it is safe. Always note this is a support tool.`);
        res.json({ result: text });
    } catch (e) {
        console.error('AI ERROR:', e);
        res.status(500).json({ error: 'AI request failed: ' + e.message });
    }
});

// Visit Summary Generator
router.post('/summary', auth, async (req, res) => {
    const { notes, patientName, doctorName } = req.body;
    try {
        const text = await ask(`You are a medical documentation assistant. Convert the following rough doctor notes into a clean, professional clinical visit summary.

Patient: ${patientName}
Doctor: ${doctorName}
Raw notes: ${notes}

Write a structured summary with these sections:
- Chief Complaint
- History of Present Illness
- Assessment
- Plan

Use professional medical language. Keep it concise and accurate to the notes provided.`);
        res.json({ result: text });
    } catch (e) {
        console.error('AI ERROR:', e);
        res.status(500).json({ error: 'AI request failed: ' + e.message });
    }
});

module.exports = router;