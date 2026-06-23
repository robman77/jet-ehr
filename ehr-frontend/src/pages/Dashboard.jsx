import { useEffect, useState } from 'react';
import { getPatients, getAppointments } from '../api';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (user.role === 'doctor') getPatients().then(r => setPatients(r.data)).catch(() => { });
        getAppointments().then(r => setAppointments(r.data)).catch(() => { });
    }, []);

    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === today);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const statusColor = (s) => ({
        confirmed: 'bg-green-100 text-green-700',
        completed: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
    }[s] || 'bg-gray-100 text-gray-600');

    return (
        <div className="min-h-screen" style={{ background: '#656667' }}>
            <div className="max-w-5xl mx-auto p-6 w-full">

                <div className="mb-6">
                    <h1 className="text-2xl font-medium text-gray-900">{greeting}, {user.role === 'doctor' ? 'Dr.' : ''} {user.name} 👋</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: '#ffffff' }}>
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {user.role === 'doctor' && (
                        <div className="rounded-2xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#666a6e' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: '#E6F1FB' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total patients</p>
                            <p className="text-3xl font-medium mt-1" style={{ color: '#185FA5' }}>{patients.length}</p>
                        </div>
                    )}
                    <div className="rounded-2xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#B5CDE8' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: '#EAF3DE' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today's appointments</p>
                        <p className="text-3xl font-medium mt-1" style={{ color: '#3B6D11' }}>{todayAppts.length}</p>
                    </div>
                    <div className="rounded-2xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#B5CDE8' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: '#EEEDFE' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0_0-2-2h-4m-6_0h6" /></svg>
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">All appointments</p>
                        <p className="text-3xl font-medium mt-1" style={{ color: '#534AB7' }}>{appointments.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#B5CDE8' }}>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ borderColor: '#B5CDE8' }}>
                        <h2 className="font-medium text-gray-800">Recent appointments</h2>
                        <span className="text-xs text-gray-400">{appointments.length} total</span>
                    </div>
                    {appointments.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-gray-400 text-sm">No appointments yet</p>
                        </div>
                    ) : (
                        <div>
                            {appointments.slice(0, 6).map((a, i) => (
                                <div key={a.id} className={`px-6 py-4 flex items-center justify-between ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style={{ background: '#378ADD' }}>
                                            {a.patient_name?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{a.patient_name}</p>
                                            <p className="text-xs text-gray-400">{a.date} at {a.time} {a.reason ? `· ${a.reason}` : ''}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}