import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/');
    } else {
      setError('Invalid credentials. Hint: admin@admin.com / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: 'var(--gold-light)' }}></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: 'var(--mauve)' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: 'var(--gold)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl w-full max-w-md rounded-3xl p-8 z-10"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(37, 32, 25, 0.85)' : 'rgba(253, 250, 244, 0.85)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)'
        }}
      >
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{ 
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <Lock className="w-8 h-8" style={{ color: '#fdfaf4' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-serif" style={{ color: 'var(--foreground)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--foreground-secondary)' }}>Sign in to SkinCare Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-xl text-sm text-center font-medium"
              style={{ 
                backgroundColor: 'var(--destructive-bg)', 
                color: 'var(--destructive)',
                border: '1px solid var(--destructive)'
              }}
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5" style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all outline-none"
                placeholder="admin@admin.com"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all outline-none"
                placeholder="••••••••"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: '#fdfaf4',
              boxShadow: 'var(--shadow-gold)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
