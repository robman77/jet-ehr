import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{ background: '#0C447C' }} className="px-6 h-14 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#185FA5' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
                <span className="text-white font-medium text-base">MediRecord</span>
            </div>

            <div className="flex items-center gap-1">
                {[
                    { path: '/dashboard', label: 'Dashboard' },
                    ...(user.role === 'doctor' ? [{ path: '/patients', label: 'Patients' }] : []),
                    ...(user.role === 'doctor' ? [{ path: '/ai', label: 'AI Assistant' }] : []),
                    { path: '/appointments', label: 'Appointments' },
                    { path: '/prescriptions', label: 'Prescriptions' },
                ].map(({ path, label }) => (
                    <Link key={path} to={path}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive(path)
                                ? 'bg-blue-600 text-white'
                                : 'text-blue-200 hover:text-white hover:bg-blue-700'
                            }`}>
                        {label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: '#185FA5' }}>
                    {initials}
                </div>
                <span className="text-blue-200 text-sm">{user.name}</span>
                <button onClick={logout}
                    className="text-xs px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-700 transition-colors">
                    Sign out
                </button>
            </div>
        </nav>
    );
}