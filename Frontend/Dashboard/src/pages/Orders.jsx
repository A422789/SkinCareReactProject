import React, { useState } from 'react';
import { ordersData as initialOrders, productsData, paymentTypesData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Filter, X, Package, MapPin, Mail, ChevronDown, CheckCircle, FlaskConical, BookOpen, Phone, CreditCard, ClipboardList, Plus, Trash2, Edit2 } from 'lucide-react';

const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const [paymentTypes, setPaymentTypes] = useState(paymentTypesData);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPaymentName, setNewPaymentName] = useState('');
  const [editingPaymentIdx, setEditingPaymentIdx] = useState(null);
  const [editingPaymentName, setEditingPaymentName] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} updated to "${newStatus}"`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter(o => o.id !== orderId));
      showToast(`Order ${orderId} deleted successfully`);
    }
  };

  const handlePaymentTypeChange = (orderId, newPaymentType) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, paymentType: newPaymentType } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, paymentType: newPaymentType }));
    }
    showToast(`Payment type for Order ${orderId} updated to "${newPaymentType}"`);
  };

  // Payment type management handlers
  const handleAddPaymentType = (e) => {
    e.preventDefault();
    if (!newPaymentName.trim()) return;
    if (paymentTypes.some(p => p.toLowerCase() === newPaymentName.trim().toLowerCase())) {
      alert('Payment type already exists!');
      return;
    }
    setPaymentTypes([...paymentTypes, newPaymentName.trim()]);
    setNewPaymentName('');
  };

  const handleEditPaymentType = (idx) => {
    setEditingPaymentIdx(idx);
    setEditingPaymentName(paymentTypes[idx]);
  };

  const handleSavePaymentType = (idx) => {
    if (!editingPaymentName.trim()) return;
    const updated = [...paymentTypes];
    updated[idx] = editingPaymentName.trim();
    setPaymentTypes(updated);
    setEditingPaymentIdx(null);
  };

  const handleDeletePaymentType = (idx) => {
    if (window.confirm(`Are you sure you want to delete payment type "${paymentTypes[idx]}"?`)) {
      setPaymentTypes(paymentTypes.filter((_, i) => i !== idx));
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
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Orders Collection</h1>
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
            Payment Types
          </button>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--gold)' }}>
            {orders.length} Orders
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full outline-none text-sm bg-transparent"
              style={{ color: 'var(--foreground)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
            <select 
              className="outline-none text-sm bg-transparent font-medium cursor-pointer px-2 py-1 rounded-lg"
              style={{ color: 'var(--foreground-secondary)', border: '1px solid var(--border)' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Order ID</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Customer</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Date</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Total</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Status</th>
                <th className="p-4 font-medium text-sm text-right" style={{ color: 'var(--foreground-secondary)' }}>Actions</th>
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
                  <td className="p-4 font-medium text-sm" style={{ color: 'var(--gold)' }}>{order.id}</td>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{order.customer}</td>
                  <td className="p-4 text-sm" style={{ color: 'var(--foreground-secondary)' }}>{order.date}</td>
                  <td className="p-4 text-sm font-bold" style={{ color: 'var(--foreground)' }}>${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="appearance-none px-3 py-1 pr-7 text-xs rounded-full font-medium cursor-pointer outline-none border-none"
                        style={getStatusStyle(order.status)}
                      >
                        {STATUS_FLOW.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: 'inherit' }} />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center" style={{ color: 'var(--foreground-muted)' }}>No orders found matching your criteria.</div>
          )}
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
                <div>
                  <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Order {selectedOrder.id}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>{selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Customer Info */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4' }}>
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
                  <div className="p-3.5 rounded-xl border flex gap-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                    <ClipboardList className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--foreground-secondary)' }}>Delivery Note</h4>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{selectedOrder.deliveryNote}</p>
                    </div>
                  </div>
                )}

                {/* Status & Payment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Status:</span>
                    <span className="px-3 py-1 text-xs rounded-full font-medium" style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Payment:</span>
                    <select
                      value={selectedOrder.paymentType || ''}
                      onChange={(e) => handlePaymentTypeChange(selectedOrder.id, e.target.value)}
                      className="px-3 py-1 text-xs rounded-full font-medium cursor-pointer outline-none border"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {paymentTypes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                      {paymentTypes.length === 0 && (
                        <option value="">No payment methods</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Package className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Order Items
                  </h3>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-light)' }}>
                    {selectedOrder.items?.map((item, i) => {
                      const product = productsData.find(p => p.name === item.name);
                      return (
                        <div key={i} style={{ borderBottom: i < selectedOrder.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                          <div className="flex items-center justify-between p-3 text-sm">
                            <div>
                              <span className="font-medium" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                              <span className="ml-2" style={{ color: 'var(--foreground-muted)' }}>×{item.qty}</span>
                              {product?.tagline && (
                                <p className="text-xs mt-0.5 italic" style={{ color: 'var(--gold)' }}>{product.tagline}</p>
                              )}
                            </div>
                            <span className="font-medium flex-shrink-0" style={{ color: 'var(--foreground)' }}>${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                          {product && (product.ingredients || product.howToUse) && (
                            <div className="px-3 pb-3 space-y-2">
                              {product.ingredients && (
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <p className="text-xs font-medium flex items-center gap-1.5 mb-1" style={{ color: 'var(--foreground-secondary)' }}>
                                    <FlaskConical className="w-3 h-3" style={{ color: 'var(--gold)' }} /> Ingredients
                                  </p>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{product.ingredients}</p>
                                </div>
                              )}
                              {product.howToUse && (
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <p className="text-xs font-medium flex items-center gap-1.5 mb-1" style={{ color: 'var(--foreground-secondary)' }}>
                                    <BookOpen className="w-3 h-3" style={{ color: 'var(--gold)' }} /> How to Use
                                  </p>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{product.howToUse}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between p-3 font-bold text-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <span style={{ color: 'var(--foreground)' }}>Total</span>
                      <span style={{ color: 'var(--gold)' }}>${selectedOrder.total.toFixed(2)}</span>
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
                <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Manage Payment Types</h2>
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
                    placeholder="New payment type name..."
                    value={newPaymentName}
                    onChange={(e) => setNewPaymentName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl outline-none transition-all text-sm"
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
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4', boxShadow: 'var(--shadow-gold)' }}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>

                {/* Payment Types List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {paymentTypes.map((pay, idx) => (
                    <div
                      key={pay}
                      className="p-3 rounded-xl flex items-center justify-between gap-3 text-sm font-medium"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      {editingPaymentIdx === idx ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingPaymentName}
                            onChange={(e) => setEditingPaymentName(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg outline-none transition-all text-xs"
                            style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground)' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePaymentType(idx)}
                            className="px-3 py-1 rounded-lg text-xs"
                            style={{ backgroundColor: 'var(--gold)', color: '#fdfaf4' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span style={{ color: 'var(--foreground)' }}>{pay}</span>
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
                    <p className="text-center py-4 text-xs" style={{ color: 'var(--foreground-muted)' }}>No payment types added yet.</p>
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
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
