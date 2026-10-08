import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/common/BottomNav';
import { useLanguage } from '../context/LanguageContext';

import { NavLink } from 'react-router-dom';

export default function MainLayout({ children }) {
    const { lang, setLang, t } = useLanguage();

    const getNavItems = () => [
        { name: t('home_nav') || 'Home', path: '/dashboard' },
        { name: t('crop_passport_title') || 'Crop Passport', path: '/crop-passport' },
        { name: t('ai_assist_nav') || 'AI Assist', path: '/assistant' },
        { name: t('profile_nav') || 'Profile', path: '/profile' }
    ];

    const navItems = getNavItems();

    return (
        <div className="main-layout-container" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)' }}>
            <style>
                {`
                .main-layout-container { padding-bottom: 70px; }
                .desktop-nav { display: none; }
                @media (min-width: 768px) {
                    .main-layout-container { padding-bottom: 24px; padding-top: 80px; }
                    .desktop-nav {
                        display: flex;
                        position: fixed;
                        top: 0; left: 0; right: 0;
                        height: 70px;
                        background-color: var(--color-white);
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                        z-index: 99;
                        align-items: center;
                        padding: 0 24px;
                        justify-content: space-between;
                    }
                    .desktop-nav-links {
                        display: flex;
                        gap: 32px;
                    }
                    .lang-switcher-container {
                        position: static !important;
                    }
                }
                `}
            </style>

            <div className="desktop-nav">
                <div style={{ fontWeight: 900, color: 'var(--color-green-deep)', fontSize: '1.4rem' }}>FarmChain Assist</div>
                <div className="desktop-nav-links">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-green-primary)' : 'var(--color-green-dark)',
                                fontWeight: isActive ? 800 : 600,
                                fontSize: '1rem',
                                borderBottom: isActive ? '3px solid var(--color-green-primary)' : '3px solid transparent',
                                padding: '22px 0'
                            })}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                <div className="lang-switcher-container">
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', borderRadius: '24px', display: 'flex', overflow: 'hidden', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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
            </div>

            <div className="lang-switcher-container" style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100 }}>
                <style>{`@media (min-width: 768px) { .lang-switcher-container:not(.desktop-nav .lang-switcher-container) { display: none; } }`}</style>
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

            <div className="farmer-page-wrapper" style={{ paddingTop: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children || <Outlet />}
            </div>

            <BottomNav />
        </div>
    );
}
