import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('dashboard-lang');
    return saved || 'en';
  });

  useEffect(() => {
    // Apply lang and dir attributes to html element
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('dashboard-lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key, variables = {}) => {
    const translationSet = translations[language] || translations['en'];
    let text = translationSet[key] || translations['en'][key] || key;

    // Replace variables (e.g., {name})
    Object.keys(variables).forEach((varKey) => {
      text = text.replace(`{${varKey}}`, variables[varKey]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
