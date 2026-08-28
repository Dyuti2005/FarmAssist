import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    Home, ShoppingBag, ShoppingCart, FileText, Bookmark, MessageSquare,
    CreditCard, BarChart2, Settings, Mic, Bell, User, Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInput } from '../hooks/useVoiceInput'; // 1. import custom hook

export default function BuyerLayout() {
    const { lang, setLang, t } = useLanguage();
    const location = useLocation();
    const { startListening, stopListening, isListening } = useVoiceInput();
    const [searchText, setSearchText] = useState('');

    // Active check function
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { icon: Home, label: t('side_dashboard') || 'Dashboard', path: '/buyer-dashboard' },
        { icon: ShoppingBag, label: t('side_browse') || 'Browse Produce', path: '/marketplace' },
        { icon: ShoppingCart, label: t('side_orders') || 'My Orders', path: '/orders' },
        { icon: FileText, label: t('side_contracts') || 'My Contracts', path: '/contracts' },
        { icon: Bookmark, label: t('side_watchlist') || 'My Watchlist', path: '/watchlist' },
        { icon: MessageSquare, label: t('side_messages') || 'Messages', badge: 2, path: '/messages' },
        { icon: CreditCard, label: t('side_payments') || 'Payments', path: '/payments' },
        { icon: BarChart2, label: t('side_reports') || 'Reports', path: '/reports' },
        { icon: Settings, label: t('side_settings') || 'Settings', path: '/settings' },
    ];

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening((finalTranscript) => {
                if (finalTranscript) {
                    setSearchText(prev => {
                        const space = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
                        return prev + space + finalTranscript;
                    });
                }
            });
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-green-very-light)', position: 'sticky', top: 0, zIndex: 50, height: '72px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px', display: 'flex' }}>
                            <Home size={24} color="var(--color-green-primary)" />
                        </div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>FarmChain Assist</h1>
                    </div>
                    <p style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600, margin: '2px 0 0 42px' }}>
                        {t('trusted_produce_tagline') || 'Your trusted source for verified agricultural produce'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '24px', display: 'flex', padding: '4px', border: '1px solid var(--color-green-very-light)' }}>
                        {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                            <button
                                key={l.id}
                                onClick={() => setLang(l.id)}
                                type="button"
                                style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: lang === l.id ? 'var(--color-white)' : 'transparent', color: lang === l.id ? 'var(--color-green-deep)' : 'var(--color-green-dark)', fontWeight: lang === l.id ? 700 : 500, fontSize: '0.85rem', border: 'none', cursor: 'pointer', boxShadow: lang === l.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s ease' }}>
                                {l.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', padding: '4px 12px', minWidth: '250px' }}>
                            <Search size={16} color="var(--color-green-medium)" />
                            <input
                                type="text"
                                placeholder={isListening ? (t('listening') || "Listening...") : (t('search_produce') || "Search produce...")}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '6px 12px', flex: 1, color: 'var(--color-green-deep)' }}
                            />
                            <button onClick={handleMicClick} style={{ background: isListening ? '#ffebee' : 'transparent', padding: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                <Mic color={isListening ? '#f44336' : "var(--color-green-primary)"} size={16} />
                            </button>
                        </div>
                        <button style={{ background: 'var(--color-bg-lightest)', padding: '8px', borderRadius: '50%', border: '1px solid var(--color-green-very-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell color="var(--color-green-primary)" size={18} /></button>
                        <Link to="/buyer-profile" style={{ backgroundColor: 'var(--color-green-primary)', padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(22, 138, 74, 0.2)' }}><User color="var(--color-white)" size={18} /></Link>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                <div style={{ width: '280px', backgroundColor: 'var(--color-white)', borderRight: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', position: 'sticky', top: '72px', flexShrink: 0, padding: '32px 0 24px' }}>
                    <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {menuItems.map((item, idx) => {
                            const isAct = isActive(item.path);
                            return (
                                <Link key={idx} to={item.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', backgroundColor: isAct ? 'var(--color-green-very-light)' : 'transparent', borderRight: isAct ? '4px solid var(--color-green-primary)' : '4px solid transparent', textDecoration: 'none', color: isAct ? 'var(--color-green-deep)' : 'var(--color-green-dark)', fontWeight: isAct ? 700 : 500, transition: 'all 0.2s ease', opacity: isAct ? 1 : 0.8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <item.icon size={22} strokeWidth={isAct ? 2.5 : 2} color={isAct ? 'var(--color-green-primary)' : 'var(--color-green-medium)'} />
                                        <span style={{ fontSize: '1rem' }}>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <div style={{ backgroundColor: 'var(--color-green-primary)', color: 'var(--color-white)', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                                            {item.badge}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
