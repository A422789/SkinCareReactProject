import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const { language } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [settingsRes, productsRes, categoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/settings`),
        fetch(`${import.meta.env.VITE_API_URL}/products`),
        fetch(`${import.meta.env.VITE_API_URL}/categories`)
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error fetching global storefront data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();

    const hasVisited = sessionStorage.getItem('site_visited');
    if (!hasVisited) {
      fetch(`${import.meta.env.VITE_API_URL}/analytics/visit`, { method: 'POST' })
        .then(() => sessionStorage.setItem('site_visited', 'true'))
        .catch(err => console.error('Visit registration failed:', err));
    }
  }, []);

  useEffect(() => {
    if (settings) {
      const storeName = settings.name?.[language] || settings.name?.en || 'HE SkinCare';
      document.title = storeName;
    }
  }, [settings, language]);

  return (
    <SettingsContext.Provider value={{ settings, products, categories, isLoading, refetchSettings: fetchGlobalData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
