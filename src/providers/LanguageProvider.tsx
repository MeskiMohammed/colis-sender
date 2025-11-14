import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/lib/i18n'

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};


const LanguageContext = createContext({} as LanguageContextType);

export const LanguageProvider = ({ children }:{children: React.ReactNode}) => {
  const [language, setLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => setLanguage(lng);
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
