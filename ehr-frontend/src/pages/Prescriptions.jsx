import { useEffect, useState } from 'react';
import { getPrescriptions, createPrescription } from '../api';

export default function Prescriptions() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [prescriptions, setPrescriptions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [patientIdInput, setPatientIdInput] = useState('');
    const [form, setForm] = useState({ patient_id: '', doctor_id: user.id, medication: '', dosage: '', frequency: '', start_date: '', end_date: '' });

    const load = (pid) => {
        if (pid) getPrescriptions(pid).then(r => setPrescriptions(r.data)).catch(() => { });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        load(patientIdInput);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPrescription(form);
        setShowForm(false);
        load(form.patient_id);
    };

    return (
        <div className="min-h-screen" style={{ background: '#656667' }}>
            <div className="max-w-5xl mx-auto p-6">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Prescriptions</h1>
                        <p className="text-sm text-gray-500 mt-1" style={{ color: '#d5d0d0' }}>
                            Search by patient ID to view their prescriptions
                        </p>
                    </div>
                    {user.role === 'doctor' && (
                        <button onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
                            style={{ background: '#0C447C' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            New prescription
                        </button>
                    )}
                </div>

                <form onSubmit={handleSearch} className="flex gap-3 mb-5">
                    <input className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter patient ID to load their prescriptions..."
                        value={patientIdInput} onChange={e => setPatientIdInput(e.target.value)} />
                    <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#0C447C' }}>
                        Search
                    </button>
                </form>

                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5" style={{ background: '#464444', borderColor: '#B5CDE8' }}>
                        <h2 className="text-base font-medium text-gray-800 mb-4">New prescription</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Patient ID</label>
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Patient ID" value={form.patient_id}
                                    onChange={e => setForm({ ...form, patient_id: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Medication</label>
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="e.g. Amoxicillin" value={form.medication}
                                    onChange={e => setForm({ ...form, medication: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Dosage</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="e.g. 500mg" value={form.dosage}
                                        onChange={e => setForm({ ...form, dosage: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Frequency</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="e.g. Twice daily" value={form.frequency}
                                        onChange={e => setForm({ ...form, frequency: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Start date</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="date" value={form.start_date}
                                        onChange={e => setForm({ ...form, start_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>End date</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="date" value={form.end_date}
                                        onChange={e => setForm({ ...form, end_date: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#0C447C' }}>
                                    Save prescription
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200" style={{ color: '#444444' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {prescriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center" style={{ background: '#464444', borderColor: '#B5CDE8' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#EEEDFE' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4m-6 0h6" /></svg>
                        </div>
                        <p className="text-gray-500 text-sm">No prescriptions loaded</p>
                        <p className="text-gray-400 text-xs mt-1">Enter a patient ID above and click Search</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {prescriptions.map(p => (
                            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEEDFE' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4m-6 0h6" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-gray-800">{p.medication}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{p.dosage} · {p.frequency}</p>
                                            <p className="text-xs text-gray-400 mt-1">Prescribed by Dr. {p.doctor_name} · {p.start_date} → {p.end_date || 'ongoing'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}