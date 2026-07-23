import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Camera, Send, MapPin, MessageCircle } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function ContactUsPage() {
  const { settings } = useSettings();
  const contactInfo = settings?.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 201) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { t, language } = useLanguage();

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      value: contactInfo.phone || storeSettings.contact.phone,
      link: `tel:${(contactInfo.phone || storeSettings.contact.phone).replace(/[^0-9+]/g, '')}`,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: contactInfo.whatsapp || storeSettings.contact.whatsapp,
      link: `https://wa.me/${(contactInfo.whatsapp || storeSettings.contact.whatsapp).replace(/[^0-9]/g, '')}`,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: contactInfo.email || storeSettings.contact.email,
      link: `mailto:${contactInfo.email || storeSettings.contact.email}`,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Camera,
      title: 'Instagram',
      value: contactInfo.instagram || storeSettings.contact.instagram,
      link: `https://instagram.com/${(contactInfo.instagram || storeSettings.contact.instagram).replace('@', '')}`,
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            {t('getInTouch')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {t('contactSubtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', textDecoration: 'none' }}
                >
                  <div className={`p-4 rounded-full ${method.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{t(method.title.toLowerCase())}</h3>
                    <p className="font-semibold" style={{ color: 'var(--foreground)', margin: 0 }}>{method.value}</p>
                  </div>
                </motion.a>
              );
            })}

            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-6 rounded-2xl shadow-sm"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground)' }}>
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{t('ourStore')}</h3>
                <p className="font-semibold" style={{ color: 'var(--foreground)', margin: 0 }}>
                  {contactInfo?.location?.[language] || contactInfo?.location?.en || contactInfo?.location}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            
            <h2 className="text-2xl font-bold mb-8 relative z-10" style={{ color: 'var(--foreground)' }}>{t('sendMessage')}</h2>
            
            {errorMsg && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm mb-6">
                {errorMsg}
              </div>
            )}

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-100 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('msgSentSuccess')}</h3>
                <p>{t('msgThankYou')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{t('fullNameLabel')}</label>
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl transition-all outline-none"
                      style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{t('emailLabel')}</label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl transition-all outline-none"
                      style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {t('phoneLabel')} <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <input 
                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl transition-all outline-none text-left"
                    style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder={t('phonePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{t('subjectLabel')}</label>
                  <input 
                    type="text" name="subject" required value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl transition-all outline-none"
                    style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{t('messageLabel')}</label>
                  <textarea 
                    name="message" required value={formData.message} onChange={handleChange} rows="5"
                    className="w-full px-4 py-3 rounded-xl transition-all outline-none resize-none"
                    style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="Write your message here..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                  style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer' }}
                >
                  {isSubmitting ? t('sendingButton') : t('sendButton')}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
