import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(form);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch {
            setError('Invalid email or password. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#042C53' }}>
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#E6F1FB' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </div>
                    <h1 className="text-xl font-medium text-gray-900 mb-1">MediRecord EHR</h1>
                    <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Email address</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                type="email" placeholder="you@example.com"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Password</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                type="password" placeholder="••••••••"
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        </div>
                        <button
                            className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-colors mt-2"
                            style={{ background: loading ? '#85B7EB' : '#0C447C' }}
                            disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-5">
                        No account?{' '}
                        <Link to="/register" className="font-medium" style={{ color: '#185FA5' }}>Create one</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: '#0C447C' }}>
                <h2 className="text-3xl font-medium text-white mb-4">Modern healthcare, simplified</h2>
                <p className="text-blue-200 text-base leading-relaxed mb-8">Manage patients, appointments, and prescriptions — with AI-powered clinical decision support built right in.</p>
                {[
                    'AI symptom checker & diagnosis support',
                    'Drug interaction alerts',
                    'Automated visit summaries',
                    'Patient records & prescription management',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#185FA5' }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2"><polyline points="2,6 5,9 10,3" /></svg>
                        </div>
                        <span className="text-blue-100 text-sm">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}