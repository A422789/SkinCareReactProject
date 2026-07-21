import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ email: '', password: '', confirmPassword: '' });
    setIsLoading(true);

    const errors = {};
    if (!email) {
      errors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (password.length < 6) {
      errors.password = language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = language === 'ar' ? 'يرجى تأكيد كلمة المرور' : 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast(t('registerSuccess'));
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setError(data.message || t('emailExists'));
      }
    } catch (err) {
      console.error(err);
      setError(language === 'ar' ? 'فشل الاتصال بالسيرفر. يرجى التحقق من تشغيل السيرفر.' : 'Connection to server failed. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 relative overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg)' }}>
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
            <User className="w-8 h-8" style={{ color: 'var(--gold-text)' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-serif" style={{ color: 'var(--foreground)' }}>{t('registerTitle')}</h1>
          <p style={{ color: 'var(--foreground-secondary)' }}>{t('registerSubtitle')}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            <label className="block text-sm font-medium mb-2 text-start" style={{ color: 'var(--foreground)' }}>{t('emailLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5" style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full ps-11 pe-4 py-3 rounded-xl text-sm transition-all outline-none text-start"
                placeholder="admin@admin.com"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: fieldErrors.email ? '1px solid var(--destructive)' : '1px solid var(--input-border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => { e.target.style.borderColor = fieldErrors.email ? 'var(--destructive)' : 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.email ? 'var(--destructive)' : 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-start mt-1 text-red-500 font-medium">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-start" style={{ color: 'var(--foreground)' }}>{t('passwordLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full ps-11 pe-12 py-3 rounded-xl text-sm transition-all outline-none text-start"
                placeholder="••••••••"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: fieldErrors.password ? '1px solid var(--destructive)' : '1px solid var(--input-border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => { e.target.style.borderColor = fieldErrors.password ? 'var(--destructive)' : 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.password ? 'var(--destructive)' : 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-4 flex items-center"
                style={{ color: 'var(--foreground-muted)' }}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-start mt-1 text-red-500 font-medium">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-start" style={{ color: 'var(--foreground)' }}>{t('confirmPasswordLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full ps-11 pe-12 py-3 rounded-xl text-sm transition-all outline-none text-start"
                placeholder="••••••••"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: fieldErrors.confirmPassword ? '1px solid var(--destructive)' : '1px solid var(--input-border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => { e.target.style.borderColor = fieldErrors.confirmPassword ? 'var(--destructive)' : 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.confirmPassword ? 'var(--destructive)' : 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 end-0 pe-4 flex items-center"
                style={{ color: 'var(--foreground-muted)' }}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-start mt-1 text-red-500 font-medium">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98] mt-2"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: 'var(--gold-text)',
              boxShadow: 'var(--shadow-gold)',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.opacity = '1'; }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                <span>{language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...'}</span>
              </div>
            ) : (
              <>
                <span>{t('registerBtn')}</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => navigate('/settings')}
              className="text-xs transition-colors font-semibold"
              style={{ color: 'var(--gold)' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--success)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
          >
            <CheckCircle className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
