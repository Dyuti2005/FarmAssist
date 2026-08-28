import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, ShoppingBag, ShoppingCart, FileText, Bookmark, MessageSquare,
    CreditCard, BarChart2, Settings, Mic, Bell, User, Heart, MapPin,
    ArrowRight, Lightbulb, CheckCircle2, Package, Clock, ShieldCheck, Scale, Navigation, Search
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceInput } from '../../hooks/useVoiceInput';

// --- MOCK DATA FOR UI DEVELOPMENT ---
// Replace these with API calls later
const DUMMY_MARKET_CATEGORIES = [
    { name: 'Grains', count: '1,240', icon: '🌾' },
    { name: 'Pulses', count: '850', icon: '🫘' },
    { name: 'Oilseeds', count: '620', icon: '🌻' },
    { name: 'Spices', count: '430', icon: '🌶' },
    { name: 'Fruits & Veg', count: '890', icon: '🍎' },
];

const DUMMY_RECOMMENDED = [
    { id: 1, title: 'Premium Sharbati Wheat', price: '₹32/kg', qty: '5,000 kg', loc: 'Sehore, MP', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Toor Dal (Pigeon Pea)', price: '₹125/kg', qty: '1,200 kg', loc: 'Gulbarga, KA', img: 'https://images.unsplash.com/photo-1585996843477-987d6928e08d?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Export Quality Guntur Chilli', price: '₹180/kg', qty: '800 kg', loc: 'Guntur, AP', img: 'https://images.unsplash.com/photo-1596644671424-d2e7d7db326e?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Raw Groundnut (Peanut)', price: '₹65/kg', qty: '2,500 kg', loc: 'Rajkot, GJ', img: 'https://images.unsplash.com/photo-1571407386001-f2f65a440eab?auto=format&fit=crop&w=600&q=80' }
];


// ------------------------------------
export default function BuyerDashboard() {
    const { lang, setLang, t } = useLanguage();
    const { startListening, stopListening, isListening } = useVoiceInput();
    const [searchText, setSearchText] = useState('');

    // Desktop layout state
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Always open on desktop by default

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

    const BuyerHeader = () => (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 40px',
            backgroundColor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-green-very-light)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: '72px'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px', display: 'flex' }}>
                        <Home size={24} color="var(--color-green-primary)" />
                    </div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>FarmChain Assist</h1>
                </div>
                <p style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600, margin: '2px 0 0 42px' }}>
                    {t('trusted_produce_tagline')}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '24px', display: 'flex', padding: '4px', border: '1px solid var(--color-green-very-light)' }}>
                    {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                        <button
                            key={l.id}
                            onClick={() => setLang(l.id)}
                            type="button"
                            style={{
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor: lang === l.id ? 'var(--color-white)' : 'transparent',
                                color: lang === l.id ? 'var(--color-green-deep)' : 'var(--color-green-dark)',
                                fontWeight: lang === l.id ? 700 : 500,
                                fontSize: '0.85rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: lang === l.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                transition: 'all 0.2s ease'
                            }}>
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
    );

    const Sidebar = () => {
        const menuItems = [
            { icon: Home, label: t('side_dashboard'), active: true, path: '/buyer-dashboard' },
            { icon: ShoppingBag, label: t('side_browse'), path: '/marketplace' },
            { icon: ShoppingCart, label: t('side_orders'), path: '/orders' },
            { icon: FileText, label: t('side_contracts'), path: '/contracts' },
            { icon: Bookmark, label: t('side_watchlist'), path: '/watchlist' },
            { icon: MessageSquare, label: t('side_messages'), badge: 2, path: '/messages' },
            { icon: CreditCard, label: t('side_payments'), path: '/payments' },
            { icon: BarChart2, label: t('side_reports'), path: '/reports' },
            { icon: Settings, label: t('side_settings'), path: '/settings' },
        ];

        return (
            <div style={{
                width: '280px',
                backgroundColor: 'var(--color-white)',
                borderRight: '1px solid var(--color-green-very-light)',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 72px)',
                position: 'sticky',
                top: '72px',
                flexShrink: 0,
                padding: '32px 0 24px'
            }}>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {menuItems.map((item, idx) => (
                        <Link key={idx} to={item.path} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 32px',
                            backgroundColor: item.active ? 'var(--color-green-very-light)' : 'transparent',
                            borderRight: item.active ? '4px solid var(--color-green-primary)' : '4px solid transparent',
                            textDecoration: 'none',
                            color: item.active ? 'var(--color-green-deep)' : 'var(--color-green-dark)',
                            fontWeight: item.active ? 700 : 500,
                            transition: 'all 0.2s ease',
                            opacity: item.active ? 1 : 0.8
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} color={item.active ? 'var(--color-green-primary)' : 'var(--color-green-medium)'} />
                                <span style={{ fontSize: '1rem' }}>{item.label}</span>
                            </div>
                            {item.badge && (
                                <div style={{ backgroundColor: 'var(--color-green-primary)', color: 'var(--color-white)', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                                    {item.badge}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', margin: 'auto 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <MessageSquare size={20} color="var(--color-green-primary)" />
                    </div>
                    <h4 style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>{t('need_help')}</h4>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '16px' }}>
                        {t('support_desc')}
                    </p>
                    <button style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-green-primary)', border: 'none', borderRadius: '8px', color: 'var(--color-white)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 2px 8px rgba(22, 138, 74, 0.2)' }}>
                        {t('contact_support')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', flexDirection: 'column' }}>
            <BuyerHeader />

            <div style={{ display: 'flex', flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                <Sidebar />

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>

                    {/* Greeting */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('buyer_greeting')}</h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>{t('buyer_overview_subtitle')}</p>
                    </div>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>{t('active_orders')}</div>
                                <div style={{ padding: '10px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px' }}>
                                    <ShoppingBag color="var(--color-green-primary)" size={20} />
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>5</div>
                                <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {t('view_all_orders')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>{t('active_contracts')}</div>
                                <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px' }}>
                                    <FileText color="var(--color-green-medium)" size={20} />
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>3</div>
                                <Link to="/contracts" style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {t('view_contracts')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>{t('watchlist_items')}</div>
                                <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px' }}>
                                    <Bookmark color="var(--color-green-medium)" size={20} />
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>8</div>
                                <Link to="/watchlist" style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {t('view_watchlist')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>{t('total_spent')}</div>
                                <div style={{ padding: '10px', backgroundColor: 'var(--color-green-primary)', borderRadius: '12px' }}>
                                    <span style={{ color: 'var(--color-white)', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>₹</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>₹2,45,680</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 500 }}>
                                    {t('this_month')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Dash Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px', marginBottom: '40px' }}>

                        {/* Market Overview */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BarChart2 size={20} color="var(--color-green-primary)" /> {t('market_overview') || 'Market Overview'}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                {DUMMY_MARKET_CATEGORIES.map((cat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: i < DUMMY_MARKET_CATEGORIES.length - 1 ? '1px solid var(--color-bg-lightest)' : 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                                                {cat.icon}
                                            </div>
                                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
                                        </div>
                                        <div style={{ color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '0.9rem', backgroundColor: 'var(--color-green-very-light)', padding: '2px 8px', borderRadius: '12px' }}>
                                            {cat.count}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-green-very-light)', border: 'none', borderRadius: '12px', color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                                {t('view_market_trends') || 'View Market Trends'} <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Recommended */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Lightbulb size={20} color="var(--color-green-primary)" /> {t('recommended_for_you') || 'Recommended for You'}
                                </h3>
                                <Link to="/recommendations" style={{ fontSize: '0.9rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_all') || 'View All'} <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1 }}>
                                {DUMMY_RECOMMENDED.map((item) => (
                                    <div key={item.id} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                                            <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <Heart size={16} color="var(--color-green-medium)" />
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px', lineHeight: 1.2 }}>{item.title}</div>
                                            <div style={{ color: 'var(--color-green-primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '10px' }}>{item.price}</div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Package size={14} color="var(--color-green-medium)" /> {item.qty} available
                                                </div>
                                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <MapPin size={14} color="var(--color-green-medium)" /> {item.loc}
                                                </div>
                                            </div>
                                        </div>
                                        <button style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--color-green-deep)', color: 'var(--color-white)', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                            {t('view_details') || 'View Details'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                </main>
            </div>
        </div>
    );
}
