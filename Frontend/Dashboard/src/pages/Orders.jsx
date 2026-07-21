import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Filter, X, Package, MapPin, Mail, ChevronDown, CheckCircle, FlaskConical, BookOpen, Phone, CreditCard, ClipboardList, Plus, Trash2, Edit2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPaymentName, setNewPaymentName] = useState('');
  const [editingPaymentIdx, setEditingPaymentIdx] = useState(null);
  const [editingPaymentName, setEditingPaymentName] = useState('');

  const { language, t } = useLanguage();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-types`);
      if (response.ok) {
        const data = await response.json();
        setPaymentTypes(data);
        return data;
      }
    } catch (err) {
      console.error('Failed to fetch payment types:', err);
    }
    return [];
  };

  const fetchOrders = async (currentPayments = paymentTypes) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(o => {
          return {
            id: o.orderId,
            dbId: o._id,
            customer: o.customer?.name || '',
            email: o.customer?.email || '',
            phone: o.customer?.phone || '',
            date: new Date(o.date || o.createdAt).toISOString().split('T')[0],
            total: o.totalPrice,
            status: o.status,
            address: `${o.customer?.address || ''}, ${o.customer?.city || ''}`,
            deliveryNote: o.customer?.notes || '',
            paymentType: o.paymentType?.name || (currentPayments.find(p => p._id === o.paymentType || p.id === o.paymentType)?.name || ''),
            paymentTypeId: o.paymentType?._id || o.paymentType,
            items: (o.orderItems || []).map(item => {
              const prod = item.product || {};
              return {
                productId: prod._id,
                name: prod.name?.en || prod.name || 'Unknown Product',
                nameAr: prod.name?.ar || '',
                tagline: prod.tagline?.en || '',
                taglineAr: prod.tagline?.ar || '',
                ingredients: prod.ingredients?.en || '',
                ingredientsAr: prod.ingredients?.ar || '',
                howToUse: prod.howToUse?.en || '',
                howToUseAr: prod.howToUse?.ar || '',
                image: prod.image || '',
                qty: item.quantity,
                price: item.price
              };
            })
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const pts = await fetchPaymentTypes();
        await fetchOrders(pts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('adminToken');
    const orderObj = orders.find(o => o.id === orderId);
    if (!orderObj) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderObj.dbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        showToast(language === 'ar' ? `تم تحديث الطلب ${orderId} إلى "${t('status' + newStatus)}"` : `Order ${orderId} updated to "${newStatus}"`);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    const orderObj = orders.find(o => o.id === orderId);
    if (!orderObj) return;

    const confirmMsg = language === 'ar' ? `هل أنت متأكد من حذف الطلب ${orderId}؟` : `Delete order ${orderId}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderObj.dbId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
        showToast(language === 'ar' ? `تم حذف الطلب ${orderId} بنجاح` : `Order ${orderId} deleted successfully`);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const handlePaymentTypeChange = async (orderId, newPaymentTypeId) => {
    const token = localStorage.getItem('adminToken');
    const orderObj = orders.find(o => o.id === orderId);
    if (!orderObj) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderObj.dbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentType: newPaymentTypeId })
      });
      if (response.ok) {
        const updatedFromDB = await response.json();
        const updatedPaymentName = updatedFromDB.paymentType?.name || '';
        setOrders(orders.map(o => o.id === orderId ? { ...o, paymentType: updatedPaymentName, paymentTypeId: newPaymentTypeId } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, paymentType: updatedPaymentName, paymentTypeId: newPaymentTypeId }));
        }
        showToast(language === 'ar' ? `تم تحديث وسيلة الدفع للطلب ${orderId}` : `Payment type for Order ${orderId} updated`);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update payment type');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  // Payment type management handlers
  const handleAddPaymentType = async (e) => {
    e.preventDefault();
    if (!newPaymentName.trim()) return;
    if (paymentTypes.some(p => p.name.toLowerCase() === newPaymentName.trim().toLowerCase())) {
      alert(language === 'ar' ? 'وسيلة الدفع هذه موجودة بالفعل!' : 'Payment type already exists!');
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    const id = newPaymentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, name: newPaymentName.trim() })
      });
      if (response.ok) {
        const newPay = await response.json();
        setPaymentTypes([...paymentTypes, newPay]);
        setNewPaymentName('');
        showToast(language === 'ar' ? 'تمت إضافة وسيلة الدفع بنجاح.' : 'Payment type added successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to add payment type');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const handleEditPaymentType = (idx) => {
    setEditingPaymentIdx(idx);
    setEditingPaymentName(paymentTypes[idx].name);
  };

  const handleSavePaymentType = async (idx) => {
    if (!editingPaymentName.trim()) return;
    const payToUpdate = paymentTypes[idx];
    const token = localStorage.getItem('adminToken');
    const id = editingPaymentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-types/${payToUpdate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, name: editingPaymentName.trim() })
      });
      if (response.ok) {
        const updatedPay = await response.json();
        const updated = [...paymentTypes];
        updated[idx] = updatedPay;
        setPaymentTypes(updated);
        setEditingPaymentIdx(null);
        showToast(language === 'ar' ? 'تم تعديل وسيلة الدفع بنجاح.' : 'Payment type updated successfully.');
        fetchOrders(updated);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update payment type');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const handleDeletePaymentType = async (idx) => {
    const payToDelete = paymentTypes[idx];
    const token = localStorage.getItem('adminToken');
    const confirmMsg = language === 'ar' ? `هل أنت متأكد من حذف وسيلة الدفع "${payToDelete.name}"؟` : `Are you sure you want to delete payment type "${payToDelete.name}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment-types/${payToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updated = paymentTypes.filter((_, i) => i !== idx);
        setPaymentTypes(updated);
        showToast(language === 'ar' ? 'تم حذف وسيلة الدفع بنجاح.' : 'Payment type deleted successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete payment type');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Delivered': return { backgroundColor: 'var(--success-bg)', color: 'var(--success)' };
      case 'Processing': return { backgroundColor: 'var(--info-bg)', color: 'var(--info)' };
      case 'Shipped': return { backgroundColor: 'var(--warning-bg)', color: 'var(--gold)' };
      case 'Pending': return { backgroundColor: 'var(--destructive-bg)', color: 'var(--destructive)' };
      case 'Cancelled': return { backgroundColor: 'var(--destructive-bg)', color: 'var(--destructive)' };
      default: return { backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('orderManagement')}</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm"
            style={{ 
              backgroundColor: 'var(--pearl)',
              color: 'var(--gold)',
              border: '1px solid var(--border)'
            }}
          >
            <CreditCard className="w-4 h-4" />
            {language === 'ar' ? 'طرق الدفع' : 'Payment Types'}
          </button>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--gold)' }}>
            {orders.length} {language === 'ar' ? 'طلب' : 'Orders'}
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
            <input 
              type="text" 
              placeholder={t('searchOrders')} 
              className="w-full outline-none text-sm bg-transparent text-start"
              style={{ color: 'var(--foreground)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
            <div className="relative inline-block">
              <select 
                className="appearance-none outline-none text-sm bg-transparent font-medium cursor-pointer ps-3 pe-8 py-1.5 rounded-xl transition-all"
                style={{ 
                  color: 'var(--foreground-secondary)', 
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-light)'; }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Pending" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('statusPending')}</option>
                <option value="Processing" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('statusProcessing')}</option>
                <option value="Shipped" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('statusShipped')}</option>
                <option value="Delivered" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('statusDelivered')}</option>
                <option value="Cancelled" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('statusCancelled')}</option>
              </select>
              <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--foreground-muted)' }} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('orderId')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('customer')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('date')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('total')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('status')}</th>
                <th className="p-4 font-medium text-sm text-end" style={{ color: 'var(--foreground-secondary)' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  key={order.id} 
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="p-4 font-medium text-sm text-start" style={{ color: 'var(--gold)' }}>{order.id}</td>
                  <td className="p-4 text-sm font-medium text-start" style={{ color: 'var(--foreground)' }}>{order.customer}</td>
                  <td className="p-4 text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{order.date}</td>
                  <td className="p-4 text-sm font-bold text-start" style={{ color: 'var(--foreground)' }}>{order.total.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</td>
                  <td className="p-4 text-start">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="appearance-none ps-3 pe-7 py-1 text-xs rounded-full font-medium cursor-pointer outline-none border-none transition-all"
                        style={getStatusStyle(order.status)}
                      >
                        {STATUS_FLOW.map(s => (
                          <option key={s} value={s} style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{t('status' + s)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute end-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: 'inherit' }} />
                    </div>
                  </td>
                  <td className="p-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => setSelectedOrder(order)}
                        title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => handleDeleteOrder(order.id)}
                        title={language === 'ar' ? 'حذف الطلب' : 'Delete Order'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader className="scale-150" />
              <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--foreground-muted)' }}>
                {language === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--foreground-muted)' }}>{t('noData')}</div>
          ) : null}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={() => setSelectedOrder(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-lg relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div className="text-start">
                  <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('orderDetails')} {selectedOrder.id}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>{selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-start">
                {/* Customer Info */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--gold-text)' }}>
                    {selectedOrder.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{selectedOrder.customer}</p>
                    <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      <Mail className="w-3 h-3" /> {selectedOrder.email}
                    </div>
                    {selectedOrder.phone && (
                      <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                        <Phone className="w-3 h-3" /> {selectedOrder.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      <MapPin className="w-3 h-3" /> {selectedOrder.address}
                    </div>
                  </div>
                </div>

                {/* Delivery Note */}
                {selectedOrder.deliveryNote && (
                  <div className="p-3.5 rounded-xl border flex gap-3 text-start" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                    <ClipboardList className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--foreground-secondary)' }}>{language === 'ar' ? 'ملاحظة التوصيل' : 'Delivery Note'}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{selectedOrder.deliveryNote}</p>
                    </div>
                  </div>
                )}

                {/* Status & Payment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>{t('status')}:</span>
                    <span className="px-3 py-1 text-xs rounded-full font-medium" style={getStatusStyle(selectedOrder.status)}>{t('status' + selectedOrder.status)}</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>{language === 'ar' ? 'الدفع' : 'Payment'}:</span>
                    <div className="relative inline-block">
                      <select
                        value={selectedOrder.paymentTypeId || selectedOrder.paymentType || ''}
                        onChange={(e) => handlePaymentTypeChange(selectedOrder.id, e.target.value)}
                        className="appearance-none ps-3 pe-7 py-1 text-xs rounded-full font-medium cursor-pointer outline-none border transition-all"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                      >
                        {paymentTypes.map(p => (
                          <option key={p._id} value={p._id} style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{p.name}</option>
                        ))}
                        {paymentTypes.length === 0 && (
                          <option value="" style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>{language === 'ar' ? 'لا توجد وسائل دفع' : 'No payment methods'}</option>
                        )}
                      </select>
                      <ChevronDown className="absolute end-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: 'var(--foreground-muted)' }} />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Package className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {t('orderItems')}
                  </h3>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-light)' }}>
                    {selectedOrder.items?.map((item, i) => {
                      const hasDetails = item.ingredients || item.ingredientsAr || item.howToUse || item.howToUseAr;
                      return (
                        <div key={i} style={{ borderBottom: i < selectedOrder.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                          <div className="flex items-center justify-between p-3 text-sm">
                            <div>
                              <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                                {language === 'ar' ? (item.nameAr || item.name) : item.name}
                              </span>
                              <span className="mx-2" style={{ color: 'var(--foreground-muted)' }}>×{item.qty}</span>
                              {(language === 'ar' ? item.taglineAr : item.tagline) && (
                                <p className="text-xs mt-0.5 italic" style={{ color: 'var(--gold)' }}>
                                  {language === 'ar' ? item.taglineAr : item.tagline}
                                </p>
                              )}
                            </div>
                            <span className="font-medium flex-shrink-0" style={{ color: 'var(--foreground)' }}>{(item.price * item.qty).toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                          </div>
                          {hasDetails && (
                            <div className="px-3 pb-3 space-y-2">
                              {(language === 'ar' ? item.ingredientsAr : item.ingredients) && (
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <p className="text-xs font-medium flex items-center gap-1.5 mb-1" style={{ color: 'var(--foreground-secondary)' }}>
                                    <FlaskConical className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {t('ingredients')}
                                  </p>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                                    {language === 'ar' ? item.ingredientsAr : item.ingredients}
                                  </p>
                                </div>
                              )}
                              {(language === 'ar' ? item.howToUseAr : item.howToUse) && (
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <p className="text-xs font-medium flex items-center gap-1.5 mb-1" style={{ color: 'var(--foreground-secondary)' }}>
                                    <BookOpen className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {t('howToUse')}
                                  </p>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                                    {language === 'ar' ? item.howToUseAr : item.howToUse}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between p-3 font-bold text-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <span style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                      <span style={{ color: 'var(--gold)' }}>{selectedOrder.total.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Types Management Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={() => setIsPaymentModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-md relative z-10 overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'طرق الدفع' : 'Manage Payment Types'}</h2>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Add Payment Type Form */}
                <form onSubmit={handleAddPaymentType} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'طريقة دفع جديدة...' : 'New payment type name...'}
                    value={newPaymentName}
                    onChange={(e) => setNewPaymentName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl outline-none transition-all text-sm text-start"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--foreground)'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--gold-text)', boxShadow: 'var(--shadow-gold)' }}
                  >
                    <Plus className="w-4 h-4" /> {language === 'ar' ? 'إضافة' : 'Add'}
                  </button>
                </form>

                {/* Payment Types List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {paymentTypes.map((pay, idx) => (
                    <div
                      key={pay._id || pay.id || idx}
                      className="p-3 rounded-xl flex items-center justify-between gap-3 text-sm font-medium"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      {editingPaymentIdx === idx ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingPaymentName}
                            onChange={(e) => setEditingPaymentName(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg outline-none transition-all text-xs text-start"
                            style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground)' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePaymentType(idx)}
                            className="px-3 py-1 rounded-lg text-xs"
                            style={{ backgroundColor: 'var(--gold)', color: 'var(--gold-text)' }}
                          >
                            {language === 'ar' ? 'حفظ' : 'Save'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <span style={{ color: 'var(--foreground)' }}>{pay.name}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditPaymentType(idx)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--foreground-muted)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePaymentType(idx)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--foreground-muted)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {paymentTypes.length === 0 && (
                    <p className="text-center py-4 text-xs" style={{ color: 'var(--foreground-muted)' }}>{language === 'ar' ? 'لا توجد طرق دفع مضافة بعد.' : 'No payment types added yet.'}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'var(--success)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <CheckCircle className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
