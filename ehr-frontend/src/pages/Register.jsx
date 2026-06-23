import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            navigate('/login');
        } catch {
            setError('Registration failed. Email may already exist.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
                <h1 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h1>
                <p className="text-gray-500 mb-6">Join the EHR system</p>
                {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Full name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Email" type="email" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Password" type="password" value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <select className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                    <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800">
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}