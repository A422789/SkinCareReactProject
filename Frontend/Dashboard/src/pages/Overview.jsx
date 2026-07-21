import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Users, ShoppingBag, DollarSign, Eye, AlertTriangle, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="rounded-2xl p-6 flex items-center justify-between"
    style={{
      backgroundColor: 'var(--surface)',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-light)'
    }}
  >
    <div>
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground-secondary)' }}>{title}</p>
      <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</h3>
    </div>
    <div className="p-4 rounded-full" style={{ backgroundColor: bgColor }}>
      <Icon className="w-6 h-6" style={{ color: iconColor }} />
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  const { language } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{label}</p>
        <p style={{ color: 'var(--gold)' }}>
          {language === 'ar' ? 'المبيعات: ' : 'Sales: '} 
          {payload[0].value.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
        </p>
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isRtl = language === 'ar';

  useEffect(() => {
    const fetchOverviewData = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [analyticsRes, ordersRes, messagesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/analytics/overview`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/orders`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/messages`, { headers })
        ]);

        if (analyticsRes.ok && ordersRes.ok && messagesRes.ok) {
          const analyticsData = await analyticsRes.json();
          const ordersData = await ordersRes.json();
          const messagesData = await messagesRes.json();

          setAnalytics(analyticsData);
          setOrders(ordersData);
          setMessages(messagesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader className="scale-150" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--foreground-muted)' }}>
          {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading overview dashboard...'}
        </p>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('overview')}</h1>
        <div
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--foreground-secondary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
        >
          {language === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          index={0}
          title={t('totalSales')}
          value={`${(analytics?.totalRevenue || 0).toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`}
          icon={DollarSign}
          bgColor="var(--success-bg)"
          iconColor="var(--success)"
        />
        <StatCard
          index={1}
          title={t('activeOrders')}
          value={(analytics?.totalOrders || 0).toLocaleString()}
          icon={ShoppingBag}
          bgColor="var(--info-bg)"
          iconColor="var(--info)"
        />
        <StatCard
          index={2}
          title={language === 'ar' ? 'إجمالي الزيارات' : 'Total Visits'}
          value={(analytics?.totalVisits || 0).toLocaleString()}
          icon={Eye}
          bgColor="var(--warning-bg)"
          iconColor="var(--gold)"
        />
        <StatCard
          index={3}
          title={t('customerMessages')}
          value={messages.length.toLocaleString()}
          icon={MessageSquare}
          bgColor="var(--destructive-bg)"
          iconColor="var(--destructive)"
        />
      </div>

      {/* Orders by Status */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-2xl p-6"
        style={{
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border-light)'
        }}
      >
        <h2 className="text-sm font-bold mb-4 font-serif uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
          {language === 'ar' ? 'ملخص حالة الطلبات' : 'Orders Status Summary'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--destructive-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>{pendingCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>{t('statusPending')}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--info-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>{processingCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>{t('statusProcessing')}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{shippedCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>{t('statusShipped')}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{deliveredCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>{t('statusDelivered')}</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--surface)',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border-light)'
          }}
        >
          <h2 className="text-lg font-bold mb-6 font-serif" style={{ color: 'var(--foreground)' }}>
            {language === 'ar' ? 'إجمالي المبيعات بمرور الوقت' : 'Revenue Over Time'}
          </h2>
          <div className="h-80" dir="ltr"> {/* Keep charts in LTR to maintain visual formatting of axes */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.salesData || []} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-secondary)' }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--foreground-secondary)', fontSize: 11 }}
                  dx={-4}
                  width={55}
                  domain={['auto', 'auto']}
                  padding={{ top: 20 }}
                  tickFormatter={(val) => {
                    if (val === 0) return '0';
                    const suffix = language === 'ar' ? ' ج' : ' EGP';
                    if (val >= 1000) return `${(val / 1000).toFixed(1)}k${suffix}`;
                    return `${val}${suffix}`;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--chart-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--chart-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
