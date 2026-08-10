import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, ShoppingBag, ShoppingCart, FileText, Bookmark, MessageSquare,
    CreditCard, BarChart2, Settings, Mic, Bell, User, Heart, MapPin,
    ArrowRight, Lightbulb, CheckCircle2, Package, Clock, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerDashboard() {
    const { lang, setLang, t } = useLanguage();

    // Desktop layout state
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Always open on desktop by default

    // Header component reused strictly for buyer
    const BuyerHeader = () => (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-green-very-light)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '6px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '8px' }}>
                        <Home size={22} color="var(--color-green-primary)" />
                    </div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>FarmChain Assist</h1>
                </div>
                <p style={{ color: 'var(--color-green-medium)', fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', marginLeft: '38px' }}>
                    {t('trusted_produce_tagline')}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '24px', display: 'flex', padding: '4px', border: '1px solid var(--color-green-very-light)' }}>
                    {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                        <button
                            key={l.id}
                            onClick={() => setLang(l.id)}
                            type="button"
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                backgroundColor: lang === l.id ? 'var(--color-white)' : 'transparent',
                                color: lang === l.id ? 'var(--color-green-deep)' : 'var(--color-green-dark)',
                                fontWeight: lang === l.id ? 700 : 500,
                                fontSize: '0.85rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: lang === l.id ? '0 1px 4px rgba(0,0,0,0.05)' : 'none'
                            }}>
                            {l.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Mic color="var(--color-green-primary)" size={22} /></button>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Bell color="var(--color-green-primary)" size={22} /></button>
                    <Link to="/buyer-profile" style={{ backgroundColor: 'var(--color-green-very-light)', padding: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex' }}><User color="var(--color-green-primary)" size={22} /></Link>
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
                width: '260px',
                backgroundColor: 'var(--color-white)',
                borderRight: '1px solid var(--color-green-very-light)',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 72px)',
                position: 'sticky',
                top: '72px',
                flexShrink: 0,
                padding: '24px 0'
            }}>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.map((item, idx) => (
                        <Link key={idx} to={item.path} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 32px',
                            backgroundColor: item.active ? 'var(--color-green-very-light)' : 'transparent',
                            borderRadius: '0 24px 24px 0',
                            marginRight: '16px',
                            textDecoration: 'none',
                            color: item.active ? 'var(--color-green-deep)' : 'var(--color-green-dark)',
                            fontWeight: item.active ? 700 : 500,
                            transition: 'background 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} color={item.active ? 'var(--color-green-primary)' : 'var(--color-green-medium)'} />
                                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                            </div>
                            {item.badge && (
                                <div style={{ backgroundColor: 'var(--color-green-primary)', color: 'var(--color-white)', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                                    {item.badge}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', marginTop: '24px', border: '1px solid var(--color-green-very-light)', margin: 'auto 20px 24px 20px' }}>
                    <h4 style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>{t('need_help')}</h4>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '16px' }}>
                        {t('support_desc')}
                    </p>
                    <button style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-primary)', borderRadius: '8px', color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                        {t('contact_support')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', flexDirection: 'column' }}>
            <BuyerHeader />

            <div style={{ display: 'flex', flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                <Sidebar />

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

                    {/* Greeting */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px' }}>{t('buyer_greeting')}</h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1rem', fontWeight: 500 }}>{t('buyer_overview_subtitle')}</p>
                    </div>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
                            <div style={{ padding: '12px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', height: 'fit-content' }}>
                                <ShoppingBag color="var(--color-green-primary)" size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('active_orders')}</div>
                                <div style={{ fontSize: '1.6rem', color: 'var(--color-green-deep)', fontWeight: 800, margin: '4px 0 8px' }}>5</div>
                                <Link to="/orders" style={{ fontSize: '0.8rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_all_orders')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
                            <div style={{ padding: '12px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', height: 'fit-content' }}>
                                <FileText color="var(--color-green-primary)" size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('active_contracts')}</div>
                                <div style={{ fontSize: '1.6rem', color: 'var(--color-green-deep)', fontWeight: 800, margin: '4px 0 8px' }}>3</div>
                                <Link to="/contracts" style={{ fontSize: '0.8rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_contracts')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
                            <div style={{ padding: '12px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', height: 'fit-content' }}>
                                <Bookmark color="var(--color-green-primary)" size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('watchlist_items')}</div>
                                <div style={{ fontSize: '1.6rem', color: 'var(--color-green-deep)', fontWeight: 800, margin: '4px 0 8px' }}>8</div>
                                <Link to="/watchlist" style={{ fontSize: '0.8rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_watchlist')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
                            <div style={{ padding: '12px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', height: 'fit-content' }}>
                                <span style={{ color: 'var(--color-green-primary)', fontWeight: 800, fontSize: '1.2rem' }}>₹</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('total_spent')}</div>
                                <div style={{ fontSize: '1.4rem', color: 'var(--color-green-deep)', fontWeight: 800, margin: '4px 0 8px' }}>₹2,45,680</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 500 }}>
                                    {t('this_month')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Dash Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(500px, 2fr)', gap: '24px', marginBottom: '24px' }}>

                        {/* Market Overview */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BarChart2 size={18} color="var(--color-green-primary)" /> {t('market_overview')}
                                </h3>
                                <Link to="/market-trends" style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_market_trends')} <ArrowRight size={14} />
                                </Link>
                            </div>

                            <h4 style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>{t('top_categories')}</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { name: t('grains'), count: '320+', icon: '🌾' },
                                    { name: t('pulses'), count: '180+', icon: '🫘' },
                                    { name: t('oilseeds'), count: '150+', icon: '🌻' },
                                    { name: t('spices'), count: '120+', icon: '🌶' },
                                    { name: t('fruits_veg'), count: '200+', icon: '🍎' },
                                ].map((cat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem' }}>
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
                                            <div style={{ color: 'var(--color-green-medium)', fontWeight: 500, fontSize: '0.8rem' }}>{cat.count} {t('listings')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommended */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Lightbulb size={20} color="var(--color-green-primary)" /> {t('recommended_for_you')}
                                </h3>
                                <Link to="/recommendations" style={{ fontSize: '0.85rem', color: 'var(--color-green-deep)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_all')} <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', flex: 1 }}>
                                {[
                                    { title: t('wheat'), price: '₹28/kg', qty: '5000 kg', loc: 'Mysore, Karnataka', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
                                    { title: t('pulses'), price: '₹110/kg', qty: '1000 kg', loc: 'Gulbarga, Karnataka', img: '/images/pulses.jpg' },
                                    { title: 'Groundnut', price: '₹52/kg', qty: '2500 kg', loc: 'Dharwad, Karnataka', img: '/images/groundnut.jpg' },
                                ].map((item, i) => (
                                    <div key={i} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                                            <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                                                <Heart size={16} color="var(--color-green-medium)" />
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{item.title}</div>
                                            <div style={{ color: 'var(--color-green-primary)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>{item.price}</div>
                                            <div style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', marginBottom: '4px' }}>{item.qty} available</div>
                                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                                                <MapPin size={12} /> {item.loc}
                                            </div>
                                        </div>
                                        <Link to="/details" style={{ textAlign: 'center', backgroundColor: 'var(--color-green-very-light)', color: 'var(--color-green-deep)', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {t('view_details')}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 3fr) minmax(300px, 1fr)', gap: '24px' }}>

                        {/* Recent Orders Table */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={20} color="var(--color-green-primary)" /> {t('recent_orders')}
                                </h3>
                                <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--color-green-deep)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t('view_all_orders')} <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-green-very-light)', color: 'var(--color-green-medium)', fontSize: '0.75rem', fontWeight: 700 }}>
                                            <th style={{ padding: '12px 8px' }}>{t('order_id')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('product')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('quantity')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('status')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('order_date')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('delivery_date')}</th>
                                            <th style={{ padding: '12px 8px' }}>{t('total')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: '#ORD12345', prod: t('wheat'), loc: 'Mysore', qty: '5000 kg', status: t('status_confirmed'), cBadge: '#E6F4E1', cText: '#168A4A', od: '20 May 2025', dd: '25 May 2025', total: '₹1,40,000' },
                                            { id: '#ORD12344', prod: t('pulses'), loc: 'Gulbarga', qty: '1000 kg', status: t('status_dispatched'), cBadge: '#E3F2FD', cText: '#1565C0', od: '18 May 2025', dd: '22 May 2025', total: '₹1,10,000' },
                                            { id: '#ORD12343', prod: 'Groundnut', loc: 'Dharwad', qty: '2000 kg', status: t('status_pending'), cBadge: '#FFF3E0', cText: '#E65100', od: '17 May 2025', dd: '23 May 2025', total: '₹1,04,000' },
                                        ].map((r, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--color-bg-lightest)' }}>
                                                <td style={{ padding: '16px 8px', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>{r.id}</td>
                                                <td style={{ padding: '16px 8px' }}>
                                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.9rem' }}>{r.prod}</div>
                                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.75rem' }}>{r.loc}</div>
                                                </td>
                                                <td style={{ padding: '16px 8px', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 500 }}>{r.qty}</td>
                                                <td style={{ padding: '16px 8px' }}>
                                                    <span style={{ backgroundColor: r.cBadge, color: r.cText, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 8px', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 500 }}>{r.od}</td>
                                                <td style={{ padding: '16px 8px', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 500 }}>{r.dd}</td>
                                                <td style={{ padding: '16px 8px', color: 'var(--color-green-deep)', fontSize: '0.9rem', fontWeight: 700 }}>{r.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Buyer Tools */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Settings size={20} color="var(--color-green-primary)" /> {t('buyer_tools')}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Link to="/alerts" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', paddingBottom: '16px', borderBottom: '1px solid var(--color-bg-lightest)' }}>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                                        <Bell color="var(--color-green-primary)" size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{t('price_alerts')}</div>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem' }}>{t('price_alerts_desc')}</div>
                                    </div>
                                    <ArrowRight size={16} color="var(--color-green-medium)" />
                                </Link>

                                <Link to="/quality" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', paddingBottom: '16px', borderBottom: '1px solid var(--color-bg-lightest)' }}>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                                        <ShieldCheck color="var(--color-green-primary)" size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{t('quality_standards')}</div>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem' }}>{t('quality_standards_desc')}</div>
                                    </div>
                                    <ArrowRight size={16} color="var(--color-green-medium)" />
                                </Link>

                                <Link to="/suppliers" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                                        <User color="var(--color-green-primary)" size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{t('trusted_suppliers')}</div>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem' }}>{t('trusted_suppliers_desc')}</div>
                                    </div>
                                    <ArrowRight size={16} color="var(--color-green-medium)" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}
