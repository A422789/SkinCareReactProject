import React, { useState } from 'react';
import { storeSettings } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Store, Mail, Phone, Camera, MessageCircle, Sparkles, CheckCircle, Star, Trash2, MessageSquare, Plus, Edit2, X, MapPin } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const LanguageToggle = ({ lang, setLang }) => (
  <div className="flex rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
    <button
      type="button"
      onClick={() => setLang('en')}
      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
      style={lang === 'en' ? { backgroundColor: 'var(--surface)', color: 'var(--gold)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--foreground-muted)' }}
    >
      EN
    </button>
    <button
      type="button"
      onClick={() => setLang('ar')}
      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${lang === 'ar' ? 'bg-white shadow-sm' : 'text-gold'}`}
      style={lang === 'ar' ? { backgroundColor: 'var(--surface)', color: 'var(--gold)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--foreground-muted)' }}
    >
      العربية
    </button>
  </div>
);

const SectionCard = ({ icon: Icon, title, delay = 0, lang = 'en', langToggle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="rounded-2xl overflow-hidden"
    style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}
  >
    <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
        <h2 className="text-lg font-bold font-serif" style={{ color: 'var(--foreground)' }}>{title}</h2>
      </div>
      {langToggle}
    </div>
    <div className="p-6 space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  </motion.div>
);

export default function Settings() {
  const [settings, setSettings] = useState(storeSettings);
  const [generalLang, setGeneralLang] = useState('en');
  const [heroLang, setHeroLang] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e, section) => {
    if (section === 'contact') {
      setSettings({
        ...settings,
        contact: { ...settings.contact, [e.target.name]: e.target.value }
      });
    } else if (section === 'about') {
      setSettings({
        ...settings,
        about: { ...settings.about, [e.target.name]: e.target.value }
      });
    } else if (section === 'hero') {
      setSettings({
        ...settings,
        hero: { ...settings.hero, [e.target.name]: e.target.value }
      });
    } else {
      setSettings({ ...settings, [e.target.name]: e.target.value });
    }
  };

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  const handleOpenTestimonialModal = (testimonial = null) => {
    if (testimonial) {
      setActiveTestimonial(testimonial);
    } else {
      setActiveTestimonial({
        id: Date.now(),
        type: 'text',
        author: '',
        quote: '',
        rating: 5,
        screenshotUrl: ''
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e) => {
    e.preventDefault();
    const exists = settings.testimonials?.some(t => t.id === activeTestimonial.id);
    let updatedList = [];
    if (exists) {
      updatedList = settings.testimonials.map(t => t.id === activeTestimonial.id ? activeTestimonial : t);
    } else {
      updatedList = [...(settings.testimonials || []), activeTestimonial];
    }
    setSettings({ ...settings, testimonials: updatedList });
    setIsTestimonialModalOpen(false);
    setActiveTestimonial(null);
  };

  const handleRemoveTestimonial = (id) => {
    setSettings({
      ...settings,
      testimonials: settings.testimonials.filter((t) => t.id !== id),
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings saved successfully!');
    }, 800);
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--foreground)',
  };

  const inputFocusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; },
    onBlur: (e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; },
  };



  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Store Profile</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Details */}
        <SectionCard 
          icon={Store} 
          title="General Information"
          lang={generalLang}
          langToggle={<LanguageToggle lang={generalLang} setLang={setGeneralLang} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {generalLang === 'ar' ? 'اسم المتجر (اختياري)' : 'Store Name'}
              </label>
              <input 
                type="text" 
                name={generalLang === 'ar' ? 'nameAr' : 'name'} 
                value={generalLang === 'ar' ? (settings.nameAr || '') : settings.name} 
                onChange={handleChange} 
                required={generalLang !== 'ar'}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div>
              <ImageUpload
                label="Store Logo"
                value={settings.logoUrl}
                onChange={(val) => setSettings({ ...settings, logoUrl: val })}
                compact
              />
            </div>
          </div>
          {/* Section 1: Intro (Title + Subtitle) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
              {generalLang === 'ar' ? 'القسم 1: المقدمة' : 'Section 1: Intro'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                  {generalLang === 'ar' ? 'عنوان المقدمة' : 'Intro Title'}
                </label>
                <input 
                  type="text" 
                  name={generalLang === 'ar' ? 'sec1TitleAr' : 'sec1Title'} 
                  value={generalLang === 'ar' ? (settings.about?.sec1TitleAr || '') : (settings.about?.sec1Title || '')} 
                  onChange={(e) => handleChange(e, 'about')} 
                  required={generalLang !== 'ar'}
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                  {generalLang === 'ar' ? 'وصف المقدمة' : 'Intro Description'}
                </label>
                <textarea 
                  name={generalLang === 'ar' ? 'sec1SubtitleAr' : 'sec1Subtitle'} 
                  value={generalLang === 'ar' ? (settings.about?.sec1SubtitleAr || '') : (settings.about?.sec1Subtitle || '')} 
                  onChange={(e) => handleChange(e, 'about')} 
                  rows="2" 
                  required={generalLang !== 'ar'}
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" style={inputStyle} {...inputFocusHandlers} />
              </div>
            </div>
          </div>

          {/* Section 2: Heritage (Left Image + Text Right) */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
              {generalLang === 'ar' ? 'القسم 2: التراث (الصورة يسار)' : 'Section 2: Heritage (Image Left)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                    {generalLang === 'ar' ? 'عنوان التراث' : 'Heritage Title'}
                  </label>
                  <input 
                    type="text" 
                    name={generalLang === 'ar' ? 'sec2TitleAr' : 'sec2Title'} 
                    value={generalLang === 'ar' ? (settings.about?.sec2TitleAr || '') : (settings.about?.sec2Title || '')} 
                    onChange={(e) => handleChange(e, 'about')} 
                    required={generalLang !== 'ar'}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                    {generalLang === 'ar' ? 'وصف التراث' : 'Heritage Description'}
                  </label>
                  <textarea 
                    name={generalLang === 'ar' ? 'sec2SubtitleAr' : 'sec2Subtitle'} 
                    value={generalLang === 'ar' ? (settings.about?.sec2SubtitleAr || '') : (settings.about?.sec2Subtitle || '')} 
                    onChange={(e) => handleChange(e, 'about')} 
                    rows="3" 
                    required={generalLang !== 'ar'}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>
              <div>
                <ImageUpload
                  label="Heritage Image"
                  value={settings.about?.sec2ImageUrl || ''}
                  onChange={(val) => setSettings({ ...settings, about: { ...settings.about, sec2ImageUrl: val } })}
                  compact
                />
              </div>
            </div>
          </div>

          {/* Section 3: Philosophy (Image Right + Text Left) */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
              {generalLang === 'ar' ? 'القسم 3: الفلسفة (الصورة يمين)' : 'Section 3: Philosophy (Image Right)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                    {generalLang === 'ar' ? 'عنوان الفلسفة' : 'Philosophy Title'}
                  </label>
                  <input 
                    type="text" 
                    name={generalLang === 'ar' ? 'sec3TitleAr' : 'sec3Title'} 
                    value={generalLang === 'ar' ? (settings.about?.sec3TitleAr || '') : (settings.about?.sec3Title || '')} 
                    onChange={(e) => handleChange(e, 'about')} 
                    required={generalLang !== 'ar'}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                    {generalLang === 'ar' ? 'وصف الفلسفة' : 'Philosophy Description'}
                  </label>
                  <textarea 
                    name={generalLang === 'ar' ? 'sec3SubtitleAr' : 'sec3Subtitle'} 
                    value={generalLang === 'ar' ? (settings.about?.sec3SubtitleAr || '') : (settings.about?.sec3Subtitle || '')} 
                    onChange={(e) => handleChange(e, 'about')} 
                    rows="3" 
                    required={generalLang !== 'ar'}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>
              <div>
                <ImageUpload
                  label="Philosophy Image"
                  value={settings.about?.sec3ImageUrl || ''}
                  onChange={(val) => setSettings({ ...settings, about: { ...settings.about, sec3ImageUrl: val } })}
                  compact
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Hero Banner */}
        <SectionCard 
          icon={Sparkles} 
          title="Hero Banner" 
          delay={0.05}
          lang={heroLang}
          langToggle={<LanguageToggle lang={heroLang} setLang={setHeroLang} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {heroLang === 'ar' ? 'عنوان البانر الرئيسي' : 'Hero Title'}
              </label>
              <textarea 
                name={heroLang === 'ar' ? 'titleAr' : 'title'} 
                value={heroLang === 'ar' ? (settings.hero.titleAr || '') : settings.hero.title} 
                onChange={(e) => handleChange(e, 'hero')} 
                rows="2"
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {heroLang === 'ar' ? 'العنوان الفرعي للبانر' : 'Hero Subtitle'}
              </label>
              <input 
                type="text" 
                name={heroLang === 'ar' ? 'subtitleAr' : 'subtitle'} 
                value={heroLang === 'ar' ? (settings.hero.subtitleAr || '') : settings.hero.subtitle} 
                onChange={(e) => handleChange(e, 'hero')}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Left Floating Product Image"
              value={settings.hero.leftBottleUrl}
              onChange={(val) => setSettings({ ...settings, hero: { ...settings.hero, leftBottleUrl: val } })}
            />
            <ImageUpload
              label="Right Floating Product Image"
              value={settings.hero.rightBottleUrl}
              onChange={(val) => setSettings({ ...settings, hero: { ...settings.hero, rightBottleUrl: val } })}
            />
          </div>
          {/* Live Preview */}
          <div className="rounded-xl overflow-hidden relative p-8 flex items-center justify-between gap-6"
            style={{
              border: '1px solid var(--border)',
              background: 'radial-gradient(ellipse at top, rgba(212,187,146,0.15), var(--surface) 70%)'
            }}>
            <div className="max-w-[50%] flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: 'var(--gold)' }}>The Art of Radiance</span>
              <h3 className="text-xl font-bold font-serif leading-tight" style={{ color: 'var(--foreground)' }}>{settings.hero.title || 'Hero Title'}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>{settings.hero.subtitle || 'Hero subtitle'}</p>
            </div>
            <div className="flex items-end justify-center gap-3 w-[45%] h-28 relative">
              {settings.hero.leftBottleUrl && (
                <img src={settings.hero.leftBottleUrl} alt="Left Preview" className="w-[45%] h-full object-cover rounded-xl shadow-lg rotate-[-3deg]" style={{ border: '1px solid var(--border-light)' }} />
              )}
              {settings.hero.rightBottleUrl && (
                <img src={settings.hero.rightBottleUrl} alt="Right Preview" className="w-[40%] h-[85%] object-cover rounded-xl shadow-lg rotate-[3deg]" style={{ border: '1px solid var(--border-light)' }} />
              )}
            </div>
          </div>
        </SectionCard>

        {/* Testimonials */}
        <SectionCard icon={MessageSquare} title="Customer Testimonials" delay={0.08}>
          <div className="space-y-4">
            {(settings.testimonials || []).map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl flex items-center justify-between gap-4"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4' }}>
                    {testimonial.type === 'screenshot' ? 'IMG' : (testimonial.author?.charAt(0) || 'U')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                      {testimonial.type === 'screenshot' ? 'Review Image (Screenshot)' : testimonial.author}
                    </h4>
                    <p className="text-xs truncate max-w-md mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      {testimonial.type === 'screenshot' ? 'Visual chat screenshot review' : testimonial.quote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenTestimonialModal(testimonial)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--foreground-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(testimonial.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--foreground-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleOpenTestimonialModal()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed transition-colors text-sm font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Plus className="w-4 h-4" /> Add New Testimonial
            </button>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard icon={Mail} title="Contact Information" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> Support Email
              </label>
              <input type="email" name="email" value={settings.contact.email} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> Phone Number
              </label>
              <input type="text" name="phone" value={settings.contact.phone} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <MessageCircle className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> WhatsApp
              </label>
              <input type="text" name="whatsapp" value={settings.contact.whatsapp} onChange={(e) => handleChange(e, 'contact')}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Camera className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> Instagram Handle
              </label>
              <input type="text" name="instagram" value={settings.contact.instagram || ''} onChange={(e) => handleChange(e, 'contact')}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <MapPin className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> Location / Address
              </label>
              <input type="text" name="location" value={settings.contact.location || ''} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: '#fdfaf4',
              boxShadow: 'var(--shadow-gold)',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Testimonial Add/Edit Modal */}
      <AnimatePresence>
        {isTestimonialModalOpen && activeTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={() => setIsTestimonialModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-lg relative z-10 overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>
                  {settings.testimonials?.some(t => t.id === activeTestimonial.id) ? 'Edit Review' : 'Add New Review'}
                </h2>
                <button onClick={() => setIsTestimonialModalOpen(false)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="p-6 space-y-6">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="modal-type"
                      checked={activeTestimonial.type !== 'screenshot'}
                      onChange={() => setActiveTestimonial({ ...activeTestimonial, type: 'text', screenshotUrl: '' })}
                      className="w-4 h-4"
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    <span style={{ color: 'var(--foreground)' }}>Text Review</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="modal-type"
                      checked={activeTestimonial.type === 'screenshot'}
                      onChange={() => setActiveTestimonial({ ...activeTestimonial, type: 'screenshot', author: '', quote: '', rating: 5 })}
                      className="w-4 h-4"
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    <span style={{ color: 'var(--foreground)' }}>Screenshot Image Only</span>
                  </label>
                </div>

                {activeTestimonial.type === 'screenshot' ? (
                  <ImageUpload
                    label="Customer Review Screenshot"
                    value={activeTestimonial.screenshotUrl}
                    onChange={(val) => setActiveTestimonial({ ...activeTestimonial, screenshotUrl: val })}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Customer Name</label>
                        <input
                          type="text"
                          value={activeTestimonial.author}
                          onChange={(e) => setActiveTestimonial({ ...activeTestimonial, author: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm"
                          style={inputStyle}
                          {...inputFocusHandlers}
                          placeholder="e.g. Amira K."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Rating (Stars)</label>
                        <select
                          value={activeTestimonial.rating}
                          onChange={(e) => setActiveTestimonial({ ...activeTestimonial, rating: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }}
                        >
                          {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>{star} Stars</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Comment / Review Quote</label>
                      <textarea
                        value={activeTestimonial.quote}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, quote: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none"
                        style={inputStyle}
                        {...inputFocusHandlers}
                        placeholder="What did the customer say?"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-5 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' }}>Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4', boxShadow: 'var(--shadow-gold)' }}>
                    Save Review
                  </button>
                </div>
              </form>
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
