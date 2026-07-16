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
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { notificationsData } from '../data/mockData';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/settings', label: 'Store Profile', icon: Settings },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'order': return <ShoppingBag className="w-4 h-4" style={{ color: 'var(--gold)' }} />;
    case 'stock': return <AlertTriangle className="w-4 h-4" style={{ color: 'var(--destructive)' }} />;
    case 'message': return <Mail className="w-4 h-4" style={{ color: 'var(--info)' }} />;
    default: return <Bell className="w-4 h-4" style={{ color: 'var(--foreground-secondary)' }} />;
  }
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -300) }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-30 w-64 lg:static lg:block flex flex-col"
        style={{ 
          backgroundColor: 'var(--surface)', 
          borderRight: '1px solid var(--border)',
          boxShadow: sidebarOpen ? 'var(--shadow-lg)' : 'none'
        }}
      >
        <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span className="text-xl font-bold gold-3d font-serif">
            SkinCare Admin
          </span>
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
                {item.label}
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
            Logout
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
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-64"
                style={{ color: 'var(--foreground)', '::placeholder': { color: 'var(--foreground-muted)' } }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
                    className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <h3 className="font-bold font-serif" style={{ color: 'var(--foreground)' }}>Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-xs font-medium transition-colors"
                          style={{ color: 'var(--gold)' }}
                        >
                          Mark all read
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
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold cursor-pointer ring-2"
              style={{ 
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                color: 'var(--surface)',
                ringColor: 'var(--surface)',
                boxShadow: 'var(--shadow)'
              }}
            >
              A
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
    </div>
  );
}
