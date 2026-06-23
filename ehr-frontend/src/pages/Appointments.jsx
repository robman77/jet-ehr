import { useEffect, useState } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api';

export default function Appointments() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ patient_id: '', doctor_id: user.id, date: '', time: '', reason: '' });

    const load = () => getAppointments().then(r => setAppointments(r.data)).catch(() => { });
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAppointment(form);
        setShowForm(false);
        setForm({ patient_id: '', doctor_id: user.id, date: '', time: '', reason: '' });
        load();
    };

    const updateStatus = async (id, status) => {
        await updateAppointment(id, { status });
        load();
    };

    const statusStyle = (s) => ({
        confirmed: 'bg-green-100 text-green-700',
        completed: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
    }[s] || 'bg-gray-100 text-gray-600');

    return (
        <div className="min-h-screen" style={{ background: '#656667' }}>
            <div className="max-w-5xl mx-auto p-6" style={{ background: '#656667' }}>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Appointments</h1>
                        <p className="text-sm text-gray-500 mt-1" style={{ color: '#d5d0d0' }}>
                            {appointments.length} total appointments
                        </p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                        style={{ background: '#0C447C' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Book appointment
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5" style={{ background: '#464444', borderColor: '#B5CDE8' }}>
                        <h2 className="text-base font-medium text-gray-800 mb-4">New appointment</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Patient ID</label>
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter patient ID" value={form.patient_id}
                                    onChange={e => setForm({ ...form, patient_id: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Date</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="date" value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Time</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="time" value={form.time}
                                        onChange={e => setForm({ ...form, time: e.target.value })} required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1" style={{ color: '#444444' }}>Reason for visit</label>
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="e.g. Routine checkup" value={form.reason}
                                    onChange={e => setForm({ ...form, reason: e.target.value })} />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#0C447C' }}>
                                    Book appointment
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ background: '#efe9e9', borderColor: '#B5CDE8' }}>
                    <div className="px-6 py-3 border-b border-gray-50 grid grid-cols-12 gap-4">
                        <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Patient</span>
                        <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</span>
                        <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Time</span>
                        <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Reason</span>
                        <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
                    </div>
                    {appointments.length === 0 ? (
                        <div className="p-16 text-center">
                            <p className="text-gray-400 text-sm">No appointments yet</p>
                        </div>
                    ) : appointments.map((a, i) => (
                        <div key={a.id} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${i !== 0 ? 'border-t border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                            <div className="col-span-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style={{ background: '#378ADD' }}>
                                    {a.patient_name?.[0] || 'P'}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{a.patient_name}</span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600">{a.date}</div>
                            <div className="col-span-2 text-sm text-gray-600">{a.time}</div>
                            <div className="col-span-3 text-sm text-gray-600">{a.reason || '—'}</div>
                            <div className="col-span-2 flex items-center gap-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle(a.status)}`}>
                                    {a.status}
                                </span>
                                {user.role === 'doctor' && a.status === 'pending' && (
                                    <button onClick={() => updateStatus(a.id, 'confirmed')}
                                        className="text-xs px-2 py-1 rounded-lg text-white" style={{ background: '#3B6D11' }}>
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}