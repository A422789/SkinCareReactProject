import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  ShoppingBag,
  AlertTriangle,
  Mail,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';
import { notificationsData } from '../data/mockData';

const NAV_ITEMS = [
  { path: '/', labelKey: 'overview', icon: LayoutDashboard },
  { path: '/products', labelKey: 'products', icon: Package },
  { path: '/orders', labelKey: 'orders', icon: ShoppingCart },
  { path: '/messages', labelKey: 'messages', icon: MessageSquare },
  { path: '/settings', labelKey: 'storeProfile', icon: Settings },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'order': return <ShoppingBag className="w-4 h-4" style={{ color: 'var(--gold)' }} />;
    case 'stock': return <AlertTriangle className="w-4 h-4" style={{ color: 'var(--destructive)' }} />;
    case 'message': return <Mail className="w-4 h-4" style={{ color: 'var(--info)' }} />;
    default: return <Bell className="w-4 h-4" style={{ color: 'var(--foreground-secondary)' }} />;
  }
};

const GOLD_THEMES = {
  classic: {
    name: 'classic',
    labelAr: 'كلاسيكي',
    labelEn: 'Classic',
    light: {
      gold: '#b08d57',
      light: '#d4bb92',
      dark: '#8c6b3d',
      shadow: '0 4px 14px rgba(176, 141, 87, 0.25)',
      goldText: '#fdfaf4'
    },
    dark: {
      gold: '#c9a164',
      light: '#e0c590',
      dark: '#a07a3e',
      shadow: '0 4px 14px rgba(201, 161, 100, 0.2)',
      goldText: '#1a1612'
    }
  },
  bright: {
    name: 'bright',
    labelAr: 'ذهبي فاقع',
    labelEn: 'Bright Gold',
    light: {
      gold: '#d4a31d',
      light: '#f3cf65',
      dark: '#a57c10',
      shadow: '0 4px 14px rgba(212, 163, 29, 0.25)',
      goldText: '#1a1612'
    },
    dark: {
      gold: '#f3c23d',
      light: '#fbe082',
      dark: '#bd8f16',
      shadow: '0 4px 14px rgba(243, 194, 61, 0.2)',
      goldText: '#1a1612'
    }
  },
  soft: {
    name: 'soft',
    labelAr: 'ذهبي هادئ',
    labelEn: 'Soft Gold',
    light: {
      gold: '#9e825a',
      light: '#c1ae92',
      dark: '#7a6341',
      shadow: '0 4px 14px rgba(158, 130, 90, 0.25)',
      goldText: '#fdfaf4'
    },
    dark: {
      gold: '#b29b7a',
      light: '#d1c3b0',
      dark: '#8c7454',
      shadow: '0 4px 14px rgba(178, 155, 122, 0.2)',
      goldText: '#1a1612'
    }
  },
  mono: {
    name: 'mono',
    labelAr: 'أبيض وأسود',
    labelEn: 'Monochrome',
    light: {
      gold: '#000000',
      light: '#666666',
      dark: '#000000',
      shadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
      goldText: '#ffffff'
    },
    dark: {
      gold: '#ffffff',
      light: '#dddddd',
      dark: '#ffffff',
      shadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
      goldText: '#000000'
    }
  }
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const fetchNotifications = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.alerts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
  }, []);

  const [goldTheme, setGoldTheme] = useState(() => {
    return localStorage.getItem('goldTheme') || 'classic';
  });

  const applyGoldTheme = (gTheme, curTheme) => {
    const selected = GOLD_THEMES[gTheme] || GOLD_THEMES.classic;
    const values = curTheme === 'dark' ? selected.dark : selected.light;
    
    document.documentElement.style.setProperty('--gold', values.gold);
    document.documentElement.style.setProperty('--gold-light', values.light);
    document.documentElement.style.setProperty('--gold-dark', values.dark);
    document.documentElement.style.setProperty('--shadow-gold', values.shadow);
    document.documentElement.style.setProperty('--input-focus', values.gold);
    document.documentElement.style.setProperty('--gold-text', values.goldText);

    if (gTheme === 'mono') {
      if (curTheme === 'dark') {
        document.documentElement.style.setProperty('--bg', '#000000');
        document.documentElement.style.setProperty('--bg-secondary', '#111111');
        document.documentElement.style.setProperty('--surface', '#161616');
        document.documentElement.style.setProperty('--border', '#333333');
        document.documentElement.style.setProperty('--border-light', '#222222');
        document.documentElement.style.setProperty('--foreground', '#ffffff');
        document.documentElement.style.setProperty('--foreground-secondary', '#aaaaaa');
        document.documentElement.style.setProperty('--foreground-muted', '#777777');
        document.documentElement.style.setProperty('--pearl', '#111111');
        document.documentElement.style.setProperty('--cream', '#000000');
        document.documentElement.style.setProperty('--input-bg', '#111111');
        document.documentElement.style.setProperty('--input-border', '#333333');
        document.documentElement.style.setProperty('--chart-primary', '#ffffff');
        document.documentElement.style.setProperty('--chart-secondary', '#aaaaaa');
        document.documentElement.style.setProperty('--chart-grid', '#222222');
      } else {
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--border', '#e5e5e5');
        document.documentElement.style.setProperty('--border-light', '#f0f0f0');
        document.documentElement.style.setProperty('--foreground', '#000000');
        document.documentElement.style.setProperty('--foreground-secondary', '#555555');
        document.documentElement.style.setProperty('--foreground-muted', '#888888');
        document.documentElement.style.setProperty('--pearl', '#f5f5f5');
        document.documentElement.style.setProperty('--cream', '#ffffff');
        document.documentElement.style.setProperty('--input-bg', '#ffffff');
        document.documentElement.style.setProperty('--input-border', '#e5e5e5');
        document.documentElement.style.setProperty('--chart-primary', '#000000');
        document.documentElement.style.setProperty('--chart-secondary', '#555555');
        document.documentElement.style.setProperty('--chart-grid', '#f0f0f0');
      }
    } else {
      const propertiesToClear = [
        '--bg', '--bg-secondary', '--surface', '--border', '--border-light',
        '--foreground', '--foreground-secondary', '--foreground-muted',
        '--pearl', '--cream', '--input-bg', '--input-border',
        '--chart-primary', '--chart-secondary', '--chart-grid'
      ];
      propertiesToClear.forEach(prop => document.documentElement.style.removeProperty(prop));
    }
  };

  useEffect(() => {
    applyGoldTheme(goldTheme, theme);
    localStorage.setItem('goldTheme', goldTheme);
  }, [goldTheme, theme]);

  const adminUserStr = localStorage.getItem('adminUser');
  const adminUserObj = adminUserStr ? JSON.parse(adminUserStr) : null;
  const avatarLetter = adminUserObj && adminUserObj.email ? adminUserObj.email[0].toUpperCase() : 'A';

  const isRtl = language === 'ar';
  const closedX = isRtl ? 300 : -300;
  const unreadCount = notifications.filter(n => !n.read).length;

  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionMinutesLeft, setSessionMinutesLeft] = useState(15);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const fetchProfile = async () => {
    setProfileOpen(true);
    setProfileLoading(true);
    setProfileError('');
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
      } else {
        setProfileError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error(err);
      setProfileError(language === 'ar' ? 'فشل الاتصال بالسيرفر.' : 'Server connection failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const tokenTimeStr = localStorage.getItem('adminTokenTime');
      if (!tokenTimeStr) {
        localStorage.setItem('adminTokenTime', Date.now().toString());
        return;
      }

      const tokenTime = parseInt(tokenTimeStr, 10);
      const elapsed = Date.now() - tokenTime;
      const twelveHours = 12 * 60 * 60 * 1000;
      const timeLeft = twelveHours - elapsed;

      // Show warning if time left <= 15 minutes (900,000 ms)
      const fifteenMinutes = 15 * 60 * 1000;
      if (timeLeft <= fifteenMinutes && timeLeft > 0) {
        setSessionMinutesLeft(Math.ceil(timeLeft / (60 * 1000)));
        setShowSessionWarning(true);
      } else if (timeLeft <= 0) {
        handleLogout();
      } else {
        setShowSessionWarning(false);
      }
    }, 10000); // check every 10 seconds

    return () => clearInterval(checkInterval);
  }, []);

  const extendSession = async () => {
    setIsRefreshingSession(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminTokenTime', Date.now().toString());
        setShowSessionWarning(false);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Session extension failed', err);
    } finally {
      setIsRefreshingSession(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/login');
    }
  };

  const markAllRead = async () => {
    const unreadMessages = notifications.filter(n => n.type === 'message' && !n.read);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await Promise.all(
        unreadMessages.map(notif => {
          const msgId = notif.id.replace('message-', '');
          return fetch(`${import.meta.env.VITE_API_URL}/messages/${msgId}/read`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ read: true })
          });
        })
      );
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notifications as read in backend', err);
    }
  };

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 lg:hidden"
            style={{ backgroundColor: 'var(--overlay)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: closedX }}
        animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : closedX) }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 start-0 z-30 w-64 lg:static lg:block flex flex-col"
        style={{ 
          backgroundColor: 'var(--surface)', 
          borderInlineEnd: '1px solid var(--border)',
          boxShadow: sidebarOpen ? 'var(--shadow-lg)' : 'none'
        }}
      >
        <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="HE Logo" style={{ height: '2.2rem', width: 'auto', objectFit: 'contain' }} />
            <span className="text-xl font-bold gold-3d font-serif">
              {t('adminTitle')}
            </span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} style={{ color: 'var(--foreground-secondary)' }}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--warning-bg)' : 'transparent',
                  color: isActive ? 'var(--gold)' : 'var(--foreground-secondary)',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                <Icon className="w-5 h-5" />
                {t(item.labelKey)}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors"
            style={{ color: 'var(--destructive)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header 
          className="flex items-center justify-between h-16 px-6 z-10"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderBottom: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: 'var(--foreground-secondary)' }}
              onClick={() => setSidebarOpen(true)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all"
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border)'
              }}
            >
              <Search className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="bg-transparent border-none outline-none text-sm w-64"
                style={{ color: 'var(--foreground)', '::placeholder': { color: 'var(--foreground-muted)' } }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full transition-all duration-300"
              style={{ 
                color: 'var(--gold)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={language === 'en' ? 'العربية' : 'English'}
            >
              <Languages className="w-5 h-5" />
            </button>

            {/* Gold Theme Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-light" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground-secondary)' }}>
                {language === 'ar' ? 'درجة الذهبي:' : 'Gold Shade:'}
              </span>
              <div className="flex items-center gap-1.5">
                {Object.values(GOLD_THEMES).map((gt) => {
                  const isActive = goldTheme === gt.name;
                  const previewColor = theme === 'dark' ? gt.dark.gold : gt.light.gold;
                  return (
                    <label key={gt.name} className="relative flex items-center justify-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="goldTheme" 
                        value={gt.name} 
                        checked={isActive} 
                        onChange={() => setGoldTheme(gt.name)} 
                        className="sr-only" 
                      />
                      <span 
                        className="w-4 h-4 rounded-full transition-transform duration-200 hover:scale-125" 
                        style={{ 
                          backgroundColor: previewColor,
                          border: isActive ? '2px solid var(--foreground)' : '1px solid var(--border)',
                          boxShadow: isActive ? `0 0 6px ${previewColor}` : 'none'
                        }} 
                      />
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                        {language === 'ar' ? gt.labelAr : gt.labelEn}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300"
              style={{ 
                color: 'var(--gold)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={theme === 'light' ? t('themeDark') : t('themeLight')}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                className="relative p-2 rounded-full transition-colors"
                style={{ color: 'var(--foreground-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span 
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse-gold"
                    style={{ backgroundColor: 'var(--gold)', border: '2px solid var(--surface)' }}
                  />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <h3 className="font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('notifications')}</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-xs font-medium transition-colors"
                          style={{ color: 'var(--gold)' }}
                        >
                          {t('markAllRead')}
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className="p-3 flex items-start gap-3 transition-colors cursor-pointer"
                          style={{ 
                            backgroundColor: notif.read ? 'transparent' : 'var(--warning-bg)',
                            borderBottom: '1px solid var(--border-light)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : 'var(--warning-bg)'}
                        >
                          <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--pearl)' }}>
                            <NotificationIcon type={notif.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug" style={{ color: 'var(--foreground)' }}>{notif.message}</p>
                            <span className="text-xs mt-1 block" style={{ color: 'var(--foreground-muted)' }}>{notif.time}</span>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div 
              onClick={fetchProfile}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold cursor-pointer ring-2 transition-transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                color: 'var(--surface)',
                ringColor: 'var(--surface)',
                boxShadow: 'var(--shadow)'
              }}
            >
              {profileData?.email ? profileData.email[0].toUpperCase() : avatarLetter}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {showSessionWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6 shadow-2xl text-center"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 25, 20, 0.95)' : 'rgba(253, 250, 244, 0.95)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 text-yellow-500">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">
                {isRtl ? 'قرب انتهاء الجلسة' : 'Session Expiring Soon'}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--foreground-secondary)' }}>
                {isRtl 
                  ? `ستنتهي صلاحية جلسة العمل الخاصة بك خلال ${sessionMinutesLeft} دقائق. هل تود تمديدها؟`
                  : `Your session will expire in ${sessionMinutesLeft} minutes. Would you like to extend it?`}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground-secondary)'
                  }}
                >
                  {isRtl ? 'تسجيل الخروج' : 'Logout'}
                </button>
                <button
                  onClick={extendSession}
                  disabled={isRefreshingSession}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-all text-white flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    opacity: isRefreshingSession ? 0.7 : 1,
                    cursor: isRefreshingSession ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isRefreshingSession ? (isRtl ? 'جاري التمديد...' : 'Extending...') : (isRtl ? 'تمديد الجلسة' : 'Extend Session')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setProfileOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 25, 20, 0.95)' : 'rgba(253, 250, 244, 0.95)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background blobs */}
              <div className="absolute top-[-20%] right-[-20%] w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl opacity-10" style={{ backgroundColor: 'var(--gold-light)' }}></div>
              <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl opacity-10" style={{ backgroundColor: 'var(--mauve)' }}></div>

              <div className="text-center relative z-10">
                <div 
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 text-3xl font-bold shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: 'var(--gold-text)',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  {profileData?.email ? profileData.email[0].toUpperCase() : avatarLetter}
                </div>

                <h3 className="text-2xl font-bold font-serif mb-6" style={{ color: 'var(--gold)' }}>
                  {t('profileTitle')}
                </h3>

                {profileLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <Loader className="scale-125" />
                    <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>{t('loadingProfile')}</p>
                  </div>
                ) : profileError ? (
                  <div className="py-6 text-center text-red-500 flex flex-col items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <p className="text-sm">{profileError}</p>
                  </div>
                ) : profileData ? (
                  <div className="space-y-4 text-start mb-8">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                      <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--foreground-muted)' }}>
                        {t('profileEmail')}
                      </span>
                      <span className="text-base font-medium break-all">{profileData.email}</span>
                    </div>

                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                      <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--foreground-muted)' }}>
                        {t('profileId')}
                      </span>
                      <span className="text-xs font-mono break-all">{profileData._id || profileData.id}</span>
                    </div>

                    {profileData.createdAt && (
                      <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                        <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--foreground-muted)' }}>
                          {t('profileJoined')}
                        </span>
                        <span className="text-sm font-medium">
                          {new Date(profileData.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}

                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: 'var(--gold-text)'
                  }}
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
