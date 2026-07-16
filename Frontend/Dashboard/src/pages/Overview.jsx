import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Users, ShoppingBag, DollarSign, Eye, AlertTriangle, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { overviewAnalytics, ordersData, productsData, messagesData } from '../data/mockData';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

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
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{label}</p>
        <p style={{ color: 'var(--gold)' }}>Sales: ${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return { backgroundColor: 'var(--success-bg)', color: 'var(--success)' };
      case 'Processing': return { backgroundColor: 'var(--info-bg)', color: 'var(--info)' };
      case 'Shipped': return { backgroundColor: 'var(--warning-bg)', color: 'var(--gold)' };
      case 'Pending': return { backgroundColor: 'var(--destructive-bg)', color: 'var(--destructive)' };
      default: return { backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' };
    }
  };

  const pendingCount = ordersData.filter(o => o.status === 'Pending').length;
  const processingCount = ordersData.filter(o => o.status === 'Processing').length;
  const shippedCount = ordersData.filter(o => o.status === 'Shipped').length;
  const deliveredCount = ordersData.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Dashboard Overview</h1>
        <div
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--foreground-secondary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
        >
          Last 7 Days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          index={0}
          title="Total Revenue"
          value={`$${overviewAnalytics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          bgColor="var(--success-bg)"
          iconColor="var(--success)"
        />
        <StatCard
          index={1}
          title="Total Orders"
          value={overviewAnalytics.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          bgColor="var(--info-bg)"
          iconColor="var(--info)"
        />
        <StatCard
          index={2}
          title="Total Visits"
          value={overviewAnalytics.totalVisits.toLocaleString()}
          icon={Eye}
          bgColor="var(--warning-bg)"
          iconColor="var(--gold)"
        />
        <StatCard
          index={3}
          title="Total Messages"
          value={messagesData.length.toLocaleString()}
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
        <h2 className="text-sm font-bold mb-4 font-serif uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Orders Status Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--destructive-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>{pendingCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>Pending</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--info-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>{processingCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>Processing</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{shippedCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>Shipped</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--border-light)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{deliveredCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--foreground-secondary)' }}>Delivered</p>
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
          <h2 className="text-lg font-bold mb-6 font-serif" style={{ color: 'var(--foreground)' }}>Revenue Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewAnalytics.salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-secondary)' }} dx={-10} tickFormatter={(val) => `$${val}`} />
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
