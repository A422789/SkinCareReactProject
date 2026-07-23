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
      
      const resolvedLocation = settings.contact?.location?.[language] || settings.contact?.location?.en || settings.contact?.location;
      console.log("Resolved Location before rendering:", resolvedLocation);
    }
  }, [settings, language]);

  const [translatedCategories, setTranslatedCategories] = useState([]);

  // Client-side dynamic translator helper
  const translateToArabicClient = async (text) => {
    if (!text || typeof text !== 'string' || !text.trim()) return '';
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data[0]) return data[0].map(x => x[0]).join('');
      }
      return text;
    } catch (err) {
      console.error('Client translation failed:', err);
      return text;
    }
  };

  useEffect(() => {
    const translateAllCategories = async () => {
      if (!categories || categories.length === 0) return;

      if (language === 'ar') {
        const translatedList = await Promise.all(
          categories.map(async (cat) => {
            const currentName = typeof cat.name === 'object' ? (cat.name.ar || cat.name.en) : cat.name;
            const currentDescription = typeof cat.description === 'object' ? (cat.description.ar || cat.description.en) : cat.description;
            
            const translatedName = await translateToArabicClient(currentName);
            const translatedDesc = currentDescription ? await translateToArabicClient(currentDescription) : '';

            return {
              ...cat,
              name: translatedName,
              description: translatedDesc
            };
          })
        );
        setTranslatedCategories(translatedList);
      } else {
        // En translation fallback
        const formattedList = categories.map((cat) => ({
          ...cat,
          name: typeof cat.name === 'object' ? (cat.name.en || cat.name.ar) : cat.name,
          description: typeof cat.description === 'object' ? (cat.description.en || cat.description.ar) : cat.description
        }));
        setTranslatedCategories(formattedList);
      }
    };

    translateAllCategories();
  }, [categories, language]);

  return (
    <SettingsContext.Provider value={{ settings, products, categories: translatedCategories, isLoading, refetchSettings: fetchGlobalData }}>
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
