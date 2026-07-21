import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = React.useState(true);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('adminToken');
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

      if (!token || !isLoggedIn) {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsValidating(false);
        } else {
          localStorage.removeItem('isAdminLoggedIn');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/login');
        }
      } catch (err) {
        console.error('Token validation failed', err);
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
      }
    };

    checkToken();
  }, [navigate]);

  if (isValidating) {
    return (
      <div className="h-screen w-screen flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--gold) transparent var(--gold) transparent' }}></div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="register" element={<Register />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
