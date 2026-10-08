import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, Sun, Leaf, ShoppingBag, ShieldCheck, ShoppingCart, Activity, MapPin, Bell, User, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Dashboard() {
    const { t } = useLanguage();

    const [farmerData, setFarmerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('fc_token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const pRes = await fetch('http://localhost:5002/api/farmers/me', { headers: { 'Authorization': `Bearer ${token}` } });
                const cRes = await fetch('http://localhost:5002/api/crops', { headers: { 'Authorization': `Bearer ${token}` } });
                if (pRes.ok && cRes.ok) {
                    const profile = await pRes.json();
                    const crops = await cRes.json();

                    let twin = null;
                    let insight = null;

                    if (crops.length > 0) {
                        try {
                            const tRes = await fetch(`http://localhost:5002/api/digital-twin/${crops[0].id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                            if (tRes.ok) twin = await tRes.json();

                            const iRes = await fetch(`http://localhost:5002/api/digital-twin/${crops[0].id}/insights`, { headers: { 'Authorization': `Bearer ${token}` } });
                            if (iRes.ok) {
                                const iData = await iRes.json();
                                if (iData.success && iData.insights.length > 0) {
                                    insight = iData.insights[0].insight;
                                }
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    setFarmerData({ profile, crops, twin, insight });
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-green-deep)', fontWeight: 600 }}>{t('loading_dashboard') || 'Loading dashboard...'}</div>;

    const firstName = farmerData?.profile?.user?.name ? farmerData.profile.user.name.split(' ')[0] : t('farmer') || 'Farmer';
    const primaryCrop = farmerData?.crops?.length > 0 ? farmerData.crops[0].cropName : t('wheat') || 'Wheat';
    const farmSize = farmerData?.profile?.farmSize ? `${farmerData.profile.farmSize} ${t('acres') || 'Acres'}` : t('acres_5') || '5 Acres';


    return (
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 120px 24px', boxSizing: 'border-box' }}>

            {/* 1. HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 800 }}>{t('good_morning')}, {firstName}</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', fontWeight: 500, marginTop: '4px' }}>{t('farm_overview_subtitle')}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link to="/assistant" style={{ backgroundColor: 'var(--color-white)', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', display: 'flex' }}>
                        <Mic color="var(--color-green-primary)" size={22} />
                    </Link>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)' }}>
                        <Bell color="var(--color-green-primary)" size={22} />
                    </div>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)' }}>
                        <User color="var(--color-green-primary)" size={22} />
                    </div>
                </div>
            </header>

            {/* 2. FARM STATUS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <Leaf color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('primary_crop')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{primaryCrop}</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <MapPin color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('farm_size')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmSize}</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <Sun color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('season')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('kharif')}</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <ShieldCheck color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('farm_status')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('healthy')}</div>
                </div>
            </div>

            {/* DESKTOP SPLIT: Digital Twin & Insight */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', marginBottom: '32px' }}>

                {/* 3. DIGITAL TWIN - PREVIEW ONLY */}
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0, 90, 50, 0.04)', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '4px' }}>{t('my_digital_twin')}</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('digital_profile_subtitle')}</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '12px', borderRadius: '50%' }}>
                            <Activity color="var(--color-green-primary)" size={24} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--color-green-light)', flexShrink: 0 }}>
                            <Leaf size={32} color="var(--color-green-primary)" />
                        </div>

                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: '8px' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('crop')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{primaryCrop}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('soil')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmerData?.twin?.soilStatus || t('data_not_available') || 'Data not available'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('health')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmerData?.twin?.healthScore ? `${farmerData.twin.healthScore}%` : t('data_not_available') || 'Data not available'}</div>
                            </div>
                        </div>
                    </div>

                    <Link to="/digital-twin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-green-deep)', borderRadius: '12px', color: 'var(--color-white)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0, 90, 50, 0.15)', marginTop: 'auto' }}>
                        <span>{t('view_digital_twin')}</span>
                        <ArrowRight size={20} color="var(--color-white)" />
                    </Link>
                </div>

                {/* TODAY'S FARM INSIGHT + NEW CROP INSIGHTS ACTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '16px', padding: '24px', borderLeft: '4px solid var(--color-green-primary)', borderTop: '1px solid var(--color-green-very-light)', borderRight: '1px solid var(--color-green-very-light)', borderBottom: '1px solid var(--color-green-very-light)', flex: 1, display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '12px' }}>
                                {t('todays_insight')}
                            </h2>
                            <p style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                                {farmerData?.insight || t('insight_fallback') || "Data not available. Please verify crop information in your passport."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. MAIN ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <Link to="/sell" style={{ backgroundColor: 'var(--color-white)', padding: '24px 20px', borderRadius: '16px', color: 'var(--color-green-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', transition: 'transform 0.2s' }}>
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '14px', borderRadius: '12px' }}>
                        <ShoppingBag size={26} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t('sell_crop')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('list_harvest')}</div>
                    </div>
                </Link>

                <Link to="/buy" style={{ backgroundColor: 'var(--color-white)', padding: '24px 20px', borderRadius: '16px', color: 'var(--color-green-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', transition: 'transform 0.2s' }}>
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '14px', borderRadius: '12px' }}>
                        <ShoppingCart size={26} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t('buy_inputs')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('find_seeds')}</div>
                    </div>
                </Link>

                <Link to="/assistant" style={{ backgroundColor: 'var(--color-white)', padding: '24px 20px', borderRadius: '16px', color: 'var(--color-green-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', transition: 'transform 0.2s' }}>
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '14px', borderRadius: '12px' }}>
                        <Mic size={26} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t('ai_assistant_title')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('ask_assistant')}</div>
                    </div>
                </Link>

                <Link to="/crop-passport" style={{ backgroundColor: 'var(--color-white)', padding: '24px 20px', borderRadius: '16px', color: 'var(--color-green-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', transition: 'transform 0.2s' }}>
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '14px', borderRadius: '12px' }}>
                        <ShieldCheck size={26} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t('crop_passport_title')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('view_crop_history')}</div>
                    </div>
                </Link>

                <Link to="/farmer-orders" style={{ backgroundColor: 'var(--color-white)', padding: '24px 20px', borderRadius: '16px', color: 'var(--color-green-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', transition: 'transform 0.2s' }}>
                    <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '14px', borderRadius: '12px' }}>
                        <ShoppingBag size={26} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t('my_orders') || 'My Orders'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('view_sales') || 'View Sales'}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
