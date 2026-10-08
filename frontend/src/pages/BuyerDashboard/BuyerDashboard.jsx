import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, ShoppingBag, ShoppingCart, FileText, Bookmark, MessageSquare,
    CreditCard, BarChart2, Settings, Mic, Bell, User, Heart, MapPin,
    ArrowRight, Lightbulb, CheckCircle2, Package, Clock, ShieldCheck, Scale, Navigation, Search
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { getProductImage } from '../../utils/imageMapper';
import { sanitizeProductsList } from '../../utils/dataCleaner';

export default function BuyerDashboard() {
    const { lang, setLang, t } = useLanguage();
    const { startListening, stopListening, isListening } = useVoiceInput();
    const [searchText, setSearchText] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const [buyerName, setBuyerName] = useState('');
    const [ordersCount, setOrdersCount] = useState('...');
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('fc_token');
            if (!token) return;
            try {
                // Fetch buyer profile
                const bRes = await fetch('http://localhost:5002/api/buyers/me', { headers: { 'Authorization': `Bearer ${token}` } });
                if (bRes.ok) {
                    const bData = await bRes.json();
                    if (bData?.buyer?.name) {
                        setBuyerName(bData.buyer.name.split(' ')[0]);
                    }
                }

                // Fetch Orders
                const oRes = await fetch('http://localhost:5002/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
                if (oRes.ok) {
                    const data = await oRes.json();
                    setOrdersCount(data.orders?.length || 0);
                } else {
                    setOrdersCount(0);
                }

                // Fetch Marketplace
                const pRes = await fetch('http://localhost:5002/api/marketplace', { headers: { 'Authorization': `Bearer ${token}` } });
                if (pRes.ok) {
                    const data = await pRes.json();
                    let san = sanitizeProductsList(data.products || []);
                    setRecommended(san.slice(0, 4));
                }
            } catch (e) {
                console.error('Buyer Dashboard fetch error:', e);
                setOrdersCount(0);
            }
        };
        fetchDashboardData();
    }, []);


    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Greeting */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{buyerName ? `${t('good_morning') || 'Good morning'}, ${buyerName}` : (t('buyer_greeting') || 'Good morning, Buyer')}</h1>
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
                        <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>3</div>
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
                        <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>2</div>
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
                        <div style={{ fontSize: '2.4rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>3</div>
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
                        <div style={{ fontSize: '2rem', color: 'var(--color-green-deep)', fontWeight: 800, lineHeight: 1, marginBottom: '12px' }}>₹55,000</div>
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
                        <div style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)' }}>{t('market_unavailable') || 'Live market metrics unavailable.'}</div>
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
                        <Link to="/marketplace" style={{ fontSize: '0.9rem', color: 'var(--color-green-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {t('view_all') || 'View All'} <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', flex: 1 }}>
                        {recommended.length === 0 ? (
                            <div style={{ color: 'var(--color-green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('no_recommendations') || 'No recommendations yet.'}</div>
                        ) : recommended.map((item) => (
                            <div key={item.id} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                                    <img src={getProductImage(item.title)} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = '/images/pulses.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <Heart size={16} color="var(--color-green-medium)" />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px', lineHeight: 1.2 }}>{item.title}</div>
                                    <div style={{ color: 'var(--color-green-primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '10px' }}>{item.price}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Package size={14} color="var(--color-green-medium)" /> {item.qty} {t('available') || 'available'}
                                        </div>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} color="var(--color-green-medium)" /> {item.loc}
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/buyer/marketplace/${item.id}`} style={{ width: '100%', textAlign: 'center', textDecoration: 'none', backgroundColor: 'var(--color-green-deep)', color: 'var(--color-white)', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'block' }}>
                                    {t('view_details') || 'View Details'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



        </div>
    );
}
