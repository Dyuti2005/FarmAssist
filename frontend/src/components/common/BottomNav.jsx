import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bot, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BottomNav() {
    const { t } = useLanguage();
    const location = useLocation();

    const isFarmerDashboard = location.pathname === '/dashboard';

    const getNavItems = () => {
        return [
            { name: t('home_nav') || 'Home', path: '/dashboard', icon: Home },
            { name: t('crop_passport_title') || 'Crop Passport', path: '/crop-passport', icon: ShieldCheck },
            { name: t('ai_assist_nav') || 'AI Assist', path: '/assistant', icon: Bot },
            { name: t('profile_nav') || 'Profile', path: '/profile', icon: User }
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="bottom-nav-container" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-white)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '12px 0 24px 0',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
            borderTop: '1px solid var(--color-green-very-light)',
            zIndex: 1000
        }}>
            <style>
                {`
                @media (min-width: 768px) {
                    .bottom-nav-container {
                        display: none !important;
                    }
                }
                `}
            </style>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: isActive ? 'var(--color-green-deep)' : 'var(--color-green-medium)',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        gap: '4px'
                    })}
                >
                    {({ isActive }) => (
                        <>
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
}
