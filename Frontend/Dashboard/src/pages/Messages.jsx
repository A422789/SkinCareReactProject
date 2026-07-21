import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Trash2, X, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const { language, t } = useLanguage();

  const showToastMsg = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(m => ({
          id: m._id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          read: m.read,
          replied: m.replied,
          replyText: m.replyText,
          replyDate: m.replyDate ? new Date(m.replyDate).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US') : ''
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: true })
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmMsg = language === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Delete this message?';
    if (window.confirm(confirmMsg)) {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
            setShowReply(false);
          }
          showToastMsg(language === 'ar' ? 'تم حذف الرسالة بنجاح' : 'Message deleted successfully');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setShowReply(false);
    setReplyText('');
    if (!msg.read) handleMarkAsRead(msg.id);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyText })
      });
      const data = await response.json();
      if (response.ok) {
        const updated = data.updatedMessage;
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id 
            ? { 
                ...m, 
                replied: true, 
                replyText: updated.replyText, 
                replyDate: new Date(updated.replyDate).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US') 
              } 
            : m
        ));
        setSelectedMessage(prev => ({
          ...prev,
          replied: true,
          replyText: updated.replyText,
          replyDate: new Date(updated.replyDate).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')
        }));
        setShowReply(false);
        setReplyText('');
        showToastMsg(language === 'ar' ? `تم إرسال الرد إلى ${selectedMessage.name}` : `Reply sent to ${selectedMessage.name}`);
      } else {
        alert(data.message || (language === 'ar' ? 'فشل إرسال الرد' : 'Failed to send reply'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('messagesManagement')}</h1>
        <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--gold)' }}>
          {messages.filter(m => !m.read).length} {t('unread')}
        </div>
      </div>

      <div className="rounded-2xl flex-1 flex overflow-hidden" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
        {/* Messages List */}
        <div className={`w-full lg:w-1/3 flex flex-col ${selectedMessage ? 'hidden lg:flex' : 'flex'}`} style={{ borderInlineEnd: '1px solid var(--border-light)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-2 p-2 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <Search className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
              <input 
                type="text" 
                placeholder={t('searchMessages')} 
                className="w-full outline-none text-sm bg-transparent text-start"
                style={{ color: 'var(--foreground)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader className="scale-110" />
                <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  {language === 'ar' ? 'جاري تحميل الرسائل...' : 'Loading messages...'}
                </span>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => openMessage(msg)}
                  className="p-4 cursor-pointer transition-colors text-start"
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    borderInlineStart: selectedMessage?.id === msg.id ? '4px solid var(--gold)' : '4px solid transparent',
                    backgroundColor: selectedMessage?.id === msg.id ? 'var(--warning-bg)' : 'transparent'
                  }}
                  onMouseEnter={(e) => { if (selectedMessage?.id !== msg.id) e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; }}
                  onMouseLeave={(e) => { if (selectedMessage?.id !== msg.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm" style={{ color: msg.read ? 'var(--foreground-secondary)' : 'var(--foreground)', fontWeight: msg.read ? 400 : 700 }}>{msg.name}</h3>
                    <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{msg.date}</span>
                  </div>
                  <p className="text-sm truncate" style={{ color: msg.read ? 'var(--foreground-muted)' : 'var(--gold)', fontWeight: msg.read ? 400 : 500 }}>
                    {msg.subject}
                  </p>
                  {msg.replied && (
                    <span className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: 'var(--success)' }}>
                      <CheckCircle className="w-3 h-3" /> {language === 'ar' ? 'تم الرد' : 'Replied'}
                    </span>
                  )}
                </div>
              ))
            )}
            {!isLoading && filteredMessages.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>{t('noData')}</div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className={`w-full lg:w-2/3 flex flex-col ${!selectedMessage ? 'hidden lg:flex' : 'flex'}`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {selectedMessage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
              <div className="p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-4 text-start">
                  <button className="lg:hidden p-2 -ms-2" style={{ color: 'var(--foreground-secondary)' }} onClick={() => { setSelectedMessage(null); setShowReply(false); }}>
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--gold-text)' }}>
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{selectedMessage.name}</h2>
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {selectedMessage.email} {selectedMessage.phone && `• ${selectedMessage.phone}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  title={language === 'ar' ? 'حذف' : 'Delete'}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto text-start" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 font-serif" style={{ color: 'var(--foreground)' }}>{selectedMessage.subject}</h3>
                  <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{selectedMessage.date}</p>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--foreground-secondary)' }}>
                  {selectedMessage.message}
                </div>

                {/* Show previous reply if exists */}
                {selectedMessage.replied && selectedMessage.replyText && (
                  <div className="mt-6 p-4 rounded-xl text-start" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>{language === 'ar' ? 'ردك' : 'Your Reply'}</span>
                      <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>• {selectedMessage.replyDate}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedMessage.replyText}</p>
                  </div>
                )}

                {/* Reply area */}
                <AnimatePresence>
                  {showReply && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden text-start"
                    >
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--foreground)' }}>
                          {language === 'ar' ? `الرد على ${selectedMessage.name}` : `Reply to ${selectedMessage.name}`}
                        </label>
                        <textarea
                          rows="4"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={language === 'ar' ? 'اكتب ردك هنا...' : 'Type your reply...'}
                          className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm resize-none text-start"
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground)' }}
                          onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button 
                            onClick={() => { setShowReply(false); setReplyText(''); }}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' }}
                          >
                            {t('cancel')}
                          </button>
                          <button 
                            onClick={handleSendReply}
                            disabled={!replyText.trim() || isSendingReply}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            style={{ 
                              background: (replyText.trim() && !isSendingReply) ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--pearl)',
                              color: (replyText.trim() && !isSendingReply) ? 'var(--gold-text)' : 'var(--foreground-muted)',
                              boxShadow: (replyText.trim() && !isSendingReply) ? 'var(--shadow-gold)' : 'none',
                              cursor: (replyText.trim() && !isSendingReply) ? 'pointer' : 'not-allowed'
                            }}
                          >
                            {isSendingReply ? (
                              <>
                                <Loader />
                                <span>{language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 rtl:rotate-180" /> 
                                <span>{language === 'ar' ? 'إرسال الرد' : 'Send Reply'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!showReply && (
                <div className="p-4 text-end" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setShowReply(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ms-auto"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      color: 'var(--gold-text)',
                      boxShadow: 'var(--shadow-gold)'
                    }}
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" /> {language === 'ar' ? 'رد' : 'Reply'}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--foreground-muted)' }}>
              <Mail className="w-16 h-16 mb-4" style={{ color: 'var(--border)' }} />
              <p>{language === 'ar' ? 'اختر رسالة لقراءتها' : 'Select a message to read'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
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
