import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import AI from './pages/AI';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><Navbar /><Patients /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Navbar /><Appointments /></ProtectedRoute>} />
        <Route path="/prescriptions" element={<ProtectedRoute><Navbar /><Prescriptions /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><Navbar /><AI /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}