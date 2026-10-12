import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('shalaby_app_language');
        return (saved === 'ar' || saved === 'en') ? saved : 'en';
    });
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('shalaby_app_language', lang);
    };
    const toggleLanguage = () => {
        const nextLang = language === 'en' ? 'ar' : 'en';
        setLanguage(nextLang);
    };
    const isRTL = language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', language);
    }, [dir, language]);
    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
        isRTL,
        dir
    };
    return (<LanguageContext.Provider value={value}>
      <div dir={dir} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>);
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'en',
            setLanguage: () => { },
            toggleLanguage: () => { },
            t: translations.en,
            isRTL: false,
            dir: 'ltr',
        };
    }
    return context;
};
