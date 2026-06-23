import { useState } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const tabs = [
    { label: 'Symptom checker', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Drug interaction', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2h-4m-6 0h6' },
    { label: 'Visit summary', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

export default function AI() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [medications, setMedications] = useState('');
    const [notes, setNotes] = useState('');
    const [patientName, setPatientName] = useState('');

    const call = async () => {
        setLoading(true); setResult(''); setError('');
        try {
            let res;
            if (activeTab === 0) res = await API.post('/ai/symptoms', { symptoms, patientAge: age, patientGender: gender });
            else if (activeTab === 1) res = await API.post('/ai/drug-interaction', { medications: medications.split(',').map(m => m.trim()).filter(Boolean) });
            else res = await API.post('/ai/summary', { notes, patientName, doctorName: user.name });
            setResult(res.data.result);
        } catch { setError('Something went wrong. Make sure your API key is set and the backend is running.'); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen" style={{ background: '#444444' }}>
            <div className="max-w-3xl mx-auto p-6">

                <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: '#EEEDFE', color: '#534AB7' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        AI powered
                    </div>
                    <h1 className="text-2xl font-medium text-gray-900">AI Assistant</h1>
                    <p className="text-sm text-gray-500 mt-1" style={{ color: '#ccdbeb' }}>Clinical decision support · For doctor use only</p>
                </div>

                <div className="flex gap-2 mb-6">
                    {tabs.map((t, i) => (
                        <button key={i} onClick={() => { setActiveTab(i); setResult(''); setError(''); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${activeTab === i
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            style={activeTab === i ? { background: '#0C447C', borderColor: '#0C447C' } : {}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={t.icon} /></svg>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4" style={{ background: '#464444', borderColor: '#B5CDE8' }}>
                    {activeTab === 0 && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3" style={{ color: '#454545' }}>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Patient age  </label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="e.g. 35" value={age} onChange={e => setAge(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Gender</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={gender} onChange={e => setGender(e.target.value)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Symptoms</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-28 resize-none"
                                    placeholder="Describe the patient's symptoms in detail... e.g. fever for 3 days, headache, joint pain, fatigue"
                                    value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Medications </label>
                            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-28 resize-none"
                                placeholder="e.g. Warfarin, Aspirin, Ibuprofen"
                                value={medications} onChange={e => setMedications(e.target.value)} />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Patient name</label>
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#ccdbeb' }}>Doctor's raw notes</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"
                                    placeholder="Paste rough notes here... e.g. pt came in with chest pain, started 2 days ago, no fever, ECG normal"
                                    value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={call} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
                    style={{ background: loading ? '#85B7EB' : '#0C447C' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    {loading ? 'Analysing...' : 'Run AI analysis'}
                </button>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700" style={{ color: '#ccdbeb' }}>{error}</div>
                )}

                {result && (
                    <div className="mt-4 rounded-2xl p-5 border" style={{ background: '#444446', borderColor: '#AFA9EC' }}>
                        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: '#534AB7' }}>AI response</p>
                        <p className="text-sm leading-relaxed" style={{ color: '#ffffff', whiteSpace: 'pre-wrap' }}>{result}</p>
                        <p className="text-xs mt-4 pt-3 border-t" style={{ color: '#7F77DD', borderColor: '#AFA9EC' }}>
                            ⚠ Clinical decision support tool — always apply professional medical judgement.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}