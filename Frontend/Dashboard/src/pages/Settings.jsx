import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Store, Mail, Phone, Camera, MessageCircle, Sparkles, CheckCircle, Star, Trash2, MessageSquare, Plus, Edit2, X, MapPin, UserPlus, AlertTriangle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

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

const SectionCard = ({ icon: Icon, title, delay = 0, children }) => (
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
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </motion.div>
);

export default function Settings() {
  const [settings, setSettings] = useState({
    logoUrl: '',
    name: '',
    nameAr: '',
    contact: { email: '', phone: '', whatsapp: '', instagram: '', location: '' },
    about: {
      sec1Title: '', sec1TitleAr: '', sec1Subtitle: '', sec1SubtitleAr: '',
      sec2Title: '', sec2TitleAr: '', sec2Subtitle: '', sec2SubtitleAr: '', sec2ImageUrl: '',
      sec3Title: '', sec3TitleAr: '', sec3Subtitle: '', sec3SubtitleAr: '', sec3ImageUrl: ''
    },
    hero: {
      title: '', titleAr: '', subtitle: '', subtitleAr: '',
      leftBottleUrl: '', rightBottleUrl: ''
    },
    testimonials: []
  });
  const [generalLang, setGeneralLang] = useState('en');
  const [heroLang, setHeroLang] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { language, t } = useLanguage();

  const fetchSettings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const flatSettings = {
          logoUrl: data.logoUrl || '',
          name: data.name?.en || '',
          nameAr: data.name?.ar || '',
          contact: {
            email: data.contact?.email || '',
            phone: data.contact?.phone || '',
            whatsapp: data.contact?.whatsapp || '',
            instagram: data.contact?.instagram || '',
            location: data.contact?.location || '',
          },
          about: {
            sec1Title: data.about?.sec1Title?.en || '',
            sec1TitleAr: data.about?.sec1Title?.ar || '',
            sec1Subtitle: data.about?.sec1Subtitle?.en || '',
            sec1SubtitleAr: data.about?.sec1Subtitle?.ar || '',
            sec2Title: data.about?.sec2Title?.en || '',
            sec2TitleAr: data.about?.sec2Title?.ar || '',
            sec2Subtitle: data.about?.sec2Subtitle?.en || '',
            sec2SubtitleAr: data.about?.sec2Subtitle?.ar || '',
            sec2ImageUrl: data.about?.sec2ImageUrl || '',
            sec3Title: data.about?.sec3Title?.en || '',
            sec3TitleAr: data.about?.sec3Title?.ar || '',
            sec3Subtitle: data.about?.sec3Subtitle?.en || '',
            sec3SubtitleAr: data.about?.sec3Subtitle?.ar || '',
            sec3ImageUrl: data.about?.sec3ImageUrl || '',
          },
          hero: {
            title: data.hero?.title?.en || '',
            titleAr: data.hero?.title?.ar || '',
            subtitle: data.hero?.subtitle?.en || '',
            subtitleAr: data.hero?.subtitle?.ar || '',
            leftBottleUrl: data.hero?.leftBottleUrl || '',
            rightBottleUrl: data.hero?.rightBottleUrl || '',
          },
          testimonials: data.testimonials || []
        };
        setSettings(flatSettings);
      }
    } catch (err) {
      console.error(err);
      showToast(language === 'ar' ? 'حدث خطأ أثناء تحميل الإعدادات' : 'Error loading settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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

    const sanitized = { ...activeTestimonial };
    if (sanitized.type === 'screenshot') {
      sanitized.author = '';
      sanitized.quote = '';
      sanitized.rating = 5;
    } else {
      sanitized.screenshotUrl = '';
    }

    const exists = settings.testimonials?.some(t => t.id === sanitized.id);
    let updatedList = [];
    if (exists) {
      updatedList = settings.testimonials.map(t => t.id === sanitized.id ? sanitized : t);
    } else {
      updatedList = [...(settings.testimonials || []), sanitized];
    }
    setSettings({ ...settings, testimonials: updatedList });
    setIsTestimonialModalOpen(false);
    setActiveTestimonial(null);
  };

  const handleRemoveTestimonial = (id) => {
    const confirmMsg = language === 'ar' ? 'هل أنت متأكد من حذف هذه المراجعة؟' : 'Are you sure you want to delete this review?';
    if (window.confirm(confirmMsg)) {
      setSettings({
        ...settings,
        testimonials: settings.testimonials.filter((t) => t.id !== id),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('adminToken');
    const payload = {
      logoUrl: settings.logoUrl,
      name: {
        en: settings.name,
        ar: settings.nameAr
      },
      contact: settings.contact,
      about: {
        sec1Title: { en: settings.about.sec1Title, ar: settings.about.sec1TitleAr },
        sec1Subtitle: { en: settings.about.sec1Subtitle, ar: settings.about.sec1SubtitleAr },
        sec2Title: { en: settings.about.sec2Title, ar: settings.about.sec2TitleAr },
        sec2Subtitle: { en: settings.about.sec2Subtitle, ar: settings.about.sec2SubtitleAr },
        sec2ImageUrl: settings.about.sec2ImageUrl,
        sec3Title: { en: settings.about.sec3Title, ar: settings.about.sec3TitleAr },
        sec3Subtitle: { en: settings.about.sec3Subtitle, ar: settings.about.sec3SubtitleAr },
        sec3ImageUrl: settings.about.sec3ImageUrl,
      },
      hero: {
        title: { en: settings.hero.title, ar: settings.hero.titleAr },
        subtitle: { en: settings.hero.subtitle, ar: settings.hero.subtitleAr },
        leftBottleUrl: settings.hero.leftBottleUrl,
        rightBottleUrl: settings.hero.rightBottleUrl,
      },
      testimonials: settings.testimonials
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showToast(t('settingsSavedMsg'), 'success');
        await fetchSettings();
      } else {
        const errData = await response.json().catch(() => ({}));
        showToast(errData.message || (language === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(language === 'ar' ? 'حدث خطأ في الاتصال بالسيرفر' : 'Failed to connect to the server', 'error');
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader className="scale-150" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--foreground-muted)' }}>
          {language === 'ar' ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-start" style={{ color: 'var(--foreground)' }}>{t('storeSettings')}</h1>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-sm"
          style={{
            backgroundColor: 'var(--pearl)',
            color: 'var(--gold)',
            border: '1px solid var(--border)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--pearl)'; }}
        >
          <UserPlus className="w-4 h-4" />
          {t('registerTitle')}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Details */}
        <SectionCard
          icon={Store}
          title={language === 'ar' ? 'المعلومات العامة' : 'General Information'}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* English Column (Left) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                {language === 'ar' ? 'بيانات المتجر (إنجليزي - إجباري)' : 'Store Details (English - Required)'}
              </h4>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Store Name</label>
                <input
                  type="text"
                  name="name"
                  value={settings.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
            </div>

            {/* Arabic Column (Right) */}
            <div className="space-y-4" dir="rtl">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                {language === 'ar' ? 'بيانات المتجر (عربي - اختياري / ترجمة تلقائية)' : 'Store Details (Arabic - Optional)'}
              </h4>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>اسم المتجر (اختياري)</label>
                <input
                  type="text"
                  name="nameAr"
                  value={settings.nameAr || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <ImageUpload
              label={language === 'ar' ? 'شعار المتجر' : 'Store Logo'}
              value={settings.logoUrl}
              onChange={(val) => setSettings({ ...settings, logoUrl: val })}
              compact
            />
          </div>

          {/* Section 1: Intro (Title + Subtitle) */}
          <div className="pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* English Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  Section 1: Intro (English - Required)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Intro Title</label>
                  <input
                    type="text"
                    name="sec1Title"
                    value={settings.about?.sec1Title || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Intro Description</label>
                  <textarea
                    name="sec1Subtitle"
                    value={settings.about?.sec1Subtitle || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>

              {/* Arabic Column */}
              <div className="space-y-4" dir="rtl">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  القسم 1: المقدمة (عربي - اختياري)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>عنوان المقدمة (اختياري)</label>
                  <input
                    type="text"
                    name="sec1TitleAr"
                    value={settings.about?.sec1TitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>وصف المقدمة (اختياري)</label>
                  <textarea
                    name="sec1SubtitleAr"
                    value={settings.about?.sec1SubtitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Heritage */}
          <div className="pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* English Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  Section 2: Heritage (English - Required)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Heritage Title</label>
                  <input
                    type="text"
                    name="sec2Title"
                    value={settings.about?.sec2Title || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Heritage Description</label>
                  <textarea
                    name="sec2Subtitle"
                    value={settings.about?.sec2Subtitle || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>

              {/* Arabic Column */}
              <div className="space-y-4" dir="rtl">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  القسم 2: التراث (عربي - اختياري)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>عنوان قسم التراث (اختياري)</label>
                  <input
                    type="text"
                    name="sec2TitleAr"
                    value={settings.about?.sec2TitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>وصف قسم التراث (اختياري)</label>
                  <textarea
                    name="sec2SubtitleAr"
                    value={settings.about?.sec2SubtitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <ImageUpload
                label={language === 'ar' ? 'صورة قسم التراث' : 'Heritage Image'}
                value={settings.about?.sec2ImageUrl || ''}
                onChange={(val) => setSettings({ ...settings, about: { ...settings.about, sec2ImageUrl: val } })}
                compact
              />
            </div>
          </div>

          {/* Section 3: Philosophy */}
          <div className="pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* English Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  Section 3: Philosophy (English - Required)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Philosophy Title</label>
                  <input
                    type="text"
                    name="sec3Title"
                    value={settings.about?.sec3Title || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Philosophy Description</label>
                  <textarea
                    name="sec3Subtitle"
                    value={settings.about?.sec3Subtitle || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    required
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>

              {/* Arabic Column */}
              <div className="space-y-4" dir="rtl">
                <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                  القسم 3: الفلسفة (عربي - اختياري)
                </h4>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>عنوان قسم الفلسفة (اختياري)</label>
                  <input
                    type="text"
                    name="sec3TitleAr"
                    value={settings.about?.sec3TitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>وصف قسم الفلسفة (اختياري)</label>
                  <textarea
                    name="sec3SubtitleAr"
                    value={settings.about?.sec3SubtitleAr || ''}
                    onChange={(e) => handleChange(e, 'about')}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <ImageUpload
                label={language === 'ar' ? 'صورة قسم الفلسفة' : 'Philosophy Image'}
                value={settings.about?.sec3ImageUrl || ''}
                onChange={(val) => setSettings({ ...settings, about: { ...settings.about, sec3ImageUrl: val } })}
                compact
              />
            </div>
          </div>
        </SectionCard>

        {/* Hero Banner */}
        <SectionCard
          icon={Sparkles}
          title={language === 'ar' ? 'بانر الهيرو الرئيسي' : 'Hero Banner'}
          delay={0.05}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* English Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                Hero Banner (English - Required)
              </h4>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Hero Title</label>
                <textarea
                  name="title"
                  value={settings.hero.title || ''}
                  onChange={(e) => handleChange(e, 'hero')}
                  rows="2"
                  required
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Hero Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={settings.hero.subtitle || ''}
                  onChange={(e) => handleChange(e, 'hero')}
                  required
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
            </div>

            {/* Arabic Column */}
            <div className="space-y-4" dir="rtl">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-2 border-b border-light text-start" style={{ color: 'var(--gold)' }}>
                بانر الهيرو (عربي - اختياري)
              </h4>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>عنوان البانر الرئيسي (اختياري)</label>
                <textarea
                  name="titleAr"
                  value={settings.hero.titleAr || ''}
                  onChange={(e) => handleChange(e, 'hero')}
                  rows="2"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
              <div className="space-y-2 text-start">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>العنوان الفرعي للبانر (اختياري)</label>
                <input
                  type="text"
                  name="subtitleAr"
                  value={settings.hero.subtitleAr || ''}
                  onChange={(e) => handleChange(e, 'hero')}
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <ImageUpload
              label={language === 'ar' ? 'صورة المنتج العائمة لليسار' : 'Left Floating Product Image'}
              value={settings.hero.leftBottleUrl}
              onChange={(val) => setSettings({ ...settings, hero: { ...settings.hero, leftBottleUrl: val } })}
            />
            <ImageUpload
              label={language === 'ar' ? 'صورة المنتج العائمة لليمين' : 'Right Floating Product Image'}
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
            <div className="max-w-[50%] flex flex-col gap-2 text-start">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: 'var(--gold)' }}>
                {language === 'ar' ? 'فن النضارة والجمال' : 'The Art of Radiance'}
              </span>
              <h3 className="text-xl font-bold font-serif leading-tight" style={{ color: 'var(--foreground)' }}>
                {language === 'ar' ? (settings.hero.titleAr || settings.hero.title) : settings.hero.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                {language === 'ar' ? (settings.hero.subtitleAr || settings.hero.subtitle) : settings.hero.subtitle}
              </p>
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
        <SectionCard icon={MessageSquare} title={language === 'ar' ? 'آراء ومراجعات العملاء' : 'Customer Testimonials'} delay={0.08}>
          <div className="space-y-4">
            {(settings.testimonials || []).map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl flex items-center justify-between gap-4 text-start"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4' }}>
                    {testimonial.type === 'screenshot' ? 'IMG' : (testimonial.author?.charAt(0) || 'U')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                      {testimonial.type === 'screenshot'
                        ? (language === 'ar' ? 'صورة مراجعة (لقطة شاشة)' : 'Review Image (Screenshot)')
                        : testimonial.author}
                    </h4>
                    <p className="text-xs truncate max-w-md mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      {testimonial.type === 'screenshot'
                        ? (language === 'ar' ? 'لقطة شاشة لمحادثة مراجعة مرئية' : 'Visual chat screenshot review')
                        : testimonial.quote}
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
              <Plus className="w-4 h-4" /> {language === 'ar' ? 'إضافة مراجعة عميل جديدة' : 'Add New Testimonial'}
            </button>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard icon={Mail} title={language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'} delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> {language === 'ar' ? 'البريد الإلكتروني للدعم' : 'Support Email'}
              </label>
              <input type="email" name="email" value={settings.contact.email} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input type="text" name="phone" value={settings.contact.phone} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <MessageCircle className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> {language === 'ar' ? 'الواتساب' : 'WhatsApp'}
              </label>
              <input type="text" name="whatsapp" value={settings.contact.whatsapp} onChange={(e) => handleChange(e, 'contact')}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Camera className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> {language === 'ar' ? 'رابط حساب إنستغرام' : 'Instagram Handle'}
              </label>
              <input type="text" name="instagram" value={settings.contact.instagram || ''} onChange={(e) => handleChange(e, 'contact')}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <MapPin className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} /> {language === 'ar' ? 'العنوان / الموقع' : 'Location / Address'}
              </label>
              <input type="text" name="location" value={settings.contact.location || ''} onChange={(e) => handleChange(e, 'contact')} required
                className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all mb-3"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: 'var(--gold-text)',
              boxShadow: 'var(--shadow-gold)',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? (
              <>
                <Loader />
                <span>{t('saving')}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{t('save')}</span>
              </>
            )}
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
                  {settings.testimonials?.some(t => t.id === activeTestimonial.id)
                    ? (language === 'ar' ? 'تعديل المراجعة' : 'Edit Review')
                    : (language === 'ar' ? 'إضافة مراجعة جديدة' : 'Add New Review')}
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
                    <span style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'مراجعة نصية' : 'Text Review'}</span>
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
                    <span style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'مراجعة لقطة شاشة فقط' : 'Screenshot Image Only'}</span>
                  </label>
                </div>

                {activeTestimonial.type === 'screenshot' ? (
                  <ImageUpload
                    label={language === 'ar' ? 'لقطة شاشة لمراجعة العميل' : 'Customer Review Screenshot'}
                    value={activeTestimonial.screenshotUrl}
                    onChange={(val) => setActiveTestimonial({ ...activeTestimonial, screenshotUrl: val })}
                  />
                ) : (
                  <div className="space-y-4 text-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'اسم العميل' : 'Customer Name'}</label>
                        <input
                          type="text"
                          value={activeTestimonial.author}
                          onChange={(e) => setActiveTestimonial({ ...activeTestimonial, author: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start"
                          style={inputStyle}
                          {...inputFocusHandlers}
                          placeholder="e.g. Amira K."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'التقييم (بالنجوم)' : 'Rating (Stars)'}</label>
                        <select
                          value={activeTestimonial.rating}
                          onChange={(e) => setActiveTestimonial({ ...activeTestimonial, rating: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm cursor-pointer"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }}
                        >
                          {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>{star} {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'التعليق / نص المراجعة' : 'Comment / Review Quote'}</label>
                      <textarea
                        value={activeTestimonial.quote}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, quote: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start"
                        style={inputStyle}
                        {...inputFocusHandlers}
                        placeholder={language === 'ar' ? 'ماذا قال العميل عن المتجر أو المنتج؟' : 'What did the customer say?'}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-5 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' }}>{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--gold-text)', boxShadow: 'var(--shadow-gold)' }}>
                    {language === 'ar' ? 'حفظ المراجعة' : 'Save Review'}
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
            className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: toast.type === 'error' ? 'var(--destructive)' : 'var(--success)', 
              boxShadow: 'var(--shadow-lg)', 
              border: `1px solid ${toast.type === 'error' ? 'var(--destructive)' : 'var(--border)'}` 
            }}
          >
            {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
