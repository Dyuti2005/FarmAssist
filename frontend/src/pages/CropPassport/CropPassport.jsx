import React from 'react';
import { ArrowLeft, Sprout, MapPin, Droplets, BookOpen, Activity, Tractor, CheckCircle2, ShieldCheck, ThermometerSun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function CropPassport() {
    const { t } = useLanguage();

    const DUMMY_PASSPORT_DATA = {
        crop: 'Premium Sharbati Wheat', // Dynamic data typically wouldn't be translated or comes from API
        variety: 'Sujata (HI 1530)',
        sowingDate: '15 Nov 2025',
        harvestDate: '10 Apr 2026',
        location: 'Sehore, Madhya Pradesh',
        farmSize: '5 Acres',
        soilCondition: 'Black Cotton Soil (High Moisture)',
        irrigation: 'Drip Irrigation (Active)',
        fertilizer: 'Organic Compost, DAP Base',
        healthStatus: t('dt_excellent') || 'Excellent Growth',
        history: [
            { date: '15 Nov 2025', action: t('cp_lc_1_title') || 'Seeds Sown', icon: Sprout },
            { date: '10 Dec 2025', action: t('cp_lc_2_title') || 'First Irrigation', icon: Droplets },
            { date: '05 Jan 2026', action: t('cp_lc_3_title') || 'Organic Fertilizer Applied', icon: ShieldCheck },
            { date: '20 Feb 2026', action: t('cp_lc_4_title') || 'Health Inspection', icon: CheckCircle2 },
        ]
    };

    return (
        <div style={{ padding: '20px 40px 100px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back to Dashboard'}
                    </Link>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.1rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 4px 0' }}>
                            {t('cp_title') || 'My Crop Passport'} <ShieldCheck size={26} color="var(--color-green-primary)" />
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                            {t('cp_subtitle') || 'Complete traceability and history of your primary crop.'}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) minmax(350px, 1fr)', gap: '32px', alignItems: 'start', flex: 1 }}>

                {/* Left Column (Overview & Profile) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Section 1: Overview */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                <Sprout size={24} color="var(--color-green-primary)" />
                            </div>
                            <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_overview') || 'Crop Overview'}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('crop') || 'Crop Name'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.crop}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_variety') || 'Crop Variety'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.variety}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_planted') || 'Sowing Date'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.sowingDate}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_harvested') || 'Expected Harvest Date'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.harvestDate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Farm & Soil Profile */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                <MapPin size={24} color="var(--color-green-primary)" />
                            </div>
                            <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_farming_prac') || 'Farming Practices'}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-bg-lightest)', paddingBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tractor size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('location') || 'Location'} & {t('farm_size') || 'Size'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.location} • {DUMMY_PASSPORT_DATA.farmSize}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-bg-lightest)', paddingBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThermometerSun size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('dt_soil') || 'Soil Condition'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.soilCondition}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('dt_irrigation') || 'Irrigation'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DUMMY_PASSPORT_DATA.irrigation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (History) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Section 3: Health & Timeline */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                    <Activity size={24} color="var(--color-green-primary)" />
                                </div>
                                <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_lifecycle') || 'Crop Lifecycle'}</h2>
                            </div>
                            <span style={{ backgroundColor: '#E6F4E1', color: '#168A4A', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                                {t('status') || 'Status'}: {DUMMY_PASSPORT_DATA.healthStatus}
                            </span>
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '20px', marginTop: '16px' }}>
                            {/* Timeline line */}
                            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '20px', width: '2px', backgroundColor: 'var(--color-green-very-light)' }}></div>

                            {DUMMY_PASSPORT_DATA.history.map((record, index) => (
                                <div key={index} style={{ position: 'relative', display: 'flex', gap: '20px', marginBottom: index === DUMMY_PASSPORT_DATA.history.length - 1 ? 0 : '32px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, marginLeft: '-13px', marginTop: '4px', boxShadow: '0 0 0 4px var(--color-white)' }}>
                                        <record.icon size={14} color="white" />
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{record.date}</div>
                                        <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 700 }}>{record.action}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
