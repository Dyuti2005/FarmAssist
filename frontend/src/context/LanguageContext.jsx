import React, { createContext, useState, useContext } from 'react';
import { translations } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('farmchain_language') || 'en';
    });

    const handleSetLang = (newLang) => {
        localStorage.setItem('farmchain_language', newLang);
        setLang(newLang);
    };

    const t = (key) => {
        if (translations[lang] && translations[lang][key]) {
            return translations[lang][key];
        }
        return undefined; // return undefined so `t('x') || 'English'` works instead of returning 'x'
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
