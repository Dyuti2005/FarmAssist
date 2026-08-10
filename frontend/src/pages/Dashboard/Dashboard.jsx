import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, Sun, Leaf, ShoppingBag, ShieldCheck, ShoppingCart, Activity, MapPin, Bell, User, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Dashboard() {
    const { t } = useLanguage();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', paddingBottom: '120px' }}>

            {/* 1. HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 800 }}>{t('good_morning')}, Ram</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', fontWeight: 500, marginTop: '4px' }}>{t('farm_overview_subtitle')}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)' }}>
                        <Mic color="var(--color-green-primary)" size={22} />
                    </div>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <Leaf color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('primary_crop')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('wheat')}</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <MapPin color="var(--color-green-primary)" size={20} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('farm_size')}</div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('acres_5')}</div>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>

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

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--color-green-light)', flexShrink: 0 }}>
                            <Leaf size={32} color="var(--color-green-primary)" />
                        </div>

                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('crop')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('optimal')}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('soil')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('moist')}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('health')}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('health_98')}</div>
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
                                {t('insight_placeholder')}
                            </p>
                        </div>
                        <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 107, 60, 0.08)' }}>
                            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=300&q=80" alt="Farm Insight" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. MAIN ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
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
            </div>
        </div>
    );
}
