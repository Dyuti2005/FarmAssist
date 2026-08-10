import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/common/BottomNav';
import { useLanguage } from '../context/LanguageContext';

export default function MainLayout() {
    const { lang, setLang } = useLanguage();

    return (
        <div style={{ paddingBottom: '70px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)' }}>

            <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100 }}>
                <div style={{ backgroundColor: 'var(--color-green-very-light)', borderRadius: '24px', display: 'flex', overflow: 'hidden', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
                    {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                        <button
                            key={l.id}
                            onClick={() => setLang(l.id)}
                            type="button"
                            style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: lang === l.id ? 'var(--color-white)' : 'transparent', color: lang === l.id ? 'var(--color-green-deep)' : 'var(--color-green-dark)', fontWeight: lang === l.id ? 700 : 500, fontSize: '0.85rem', border: 'none', cursor: 'pointer', boxShadow: lang === l.id ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ paddingTop: '64px' }}>
                <Outlet />
            </div>

            <BottomNav />
        </div>
    );
}
