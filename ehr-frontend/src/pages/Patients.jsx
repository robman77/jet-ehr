import { useEffect, useState } from 'react';
import { getPatients } from '../api';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState([]);

    useEffect(() => {
        getPatients().then(r => setPatients(r.data)).catch(() => { });
    }, []);

    const filtered = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    const bloodColors = {
        'A+': 'bg-red-50 text-red-700', 'A-': 'bg-red-50 text-red-700',
        'B+': 'bg-blue-50 text-blue-700', 'B-': 'bg-blue-50 text-blue-700',
        'O+': 'bg-green-50 text-green-700', 'O-': 'bg-green-50 text-green-700',
        'AB+': 'bg-purple-50 text-purple-700', 'AB-': 'bg-purple-50 text-purple-700',
    };

    return (
        <div className="min-h-screen" style={{ background: '#656667' }}>
            <div className="max-w-5xl mx-auto p-6">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Patients</h1>
                        <p className="text-sm text-gray-500 mt-1" style={{ color: '#d5d0d0' }}>
                            {patients.length} registered patients
                        </p>
                    </div>
                </div>

                <div className="relative mb-5" style={{ background: '#ffffff', borderColor: '#B5CDE8' }}>
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search patients by name..."
                        value={search} onChange={e => setSearch(e.target.value)} style={{ background: '#ffffff', borderColor: '#B5CDE8' }} />
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center" style={{ background: '#fffdfd', borderColor: '#B5CDE8' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#E6F1FB' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        </div>
                        <p className="text-gray-500 text-sm">No patients found</p>
                        <p className="text-gray-400 text-xs mt-1">Patients will appear here once registered</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-3 border-b border-gray-50 grid grid-cols-12 gap-4">
                            <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Patient</span>
                            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Blood type</span>
                            <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Allergies</span>
                            <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Contact</span>
                        </div>
                        {filtered.map((p, i) => (
                            <div key={p.id} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${i !== 0 ? 'border-t border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0" style={{ background: '#378ADD' }}>
                                        {p.name?.[0]?.toUpperCase() || 'P'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.email}</p>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${bloodColors[p.blood_type] || 'bg-gray-100 text-gray-600'}`}>
                                        {p.blood_type || '—'}
                                    </span>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-600">{p.allergies || 'None reported'}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-600">{p.phone || '—'}</p>
                                    <p className="text-xs text-gray-400">{p.date_of_birth || ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}