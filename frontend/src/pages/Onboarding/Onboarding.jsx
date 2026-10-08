import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Onboarding() {
    const { t, lang, setLanguage } = useLanguage();
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        farmLocation: "Sehore, Madhya Pradesh",
        farmSize: "5",
        soilType: "black_cotton",
        irrigationType: "drip"
    });

    const [cropData, setCropData] = useState({
        cropName: "Premium Sharbati Wheat",
        variety: "Sharbati 306",
        sowingDate: "2023-11",
        expectedHarvestDate: "2024-03",
        quantity: 1000,
        status: "PLANTED"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleNext = async () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            setIsSubmitting(true);
            setErrorMsg('');
            try {
                const token = localStorage.getItem('fc_token');
                if (!token) throw new Error('Not authenticated');

                // 1. Update Profile
                const profileRes = await fetch('http://localhost:5002/api/farmers/me', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(profileData)
                });
                if (!profileRes.ok) throw new Error('Failed to save profile');

                // 2. Create Primary Crop
                const cropRes = await fetch('http://localhost:5002/api/crops', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        cropName: cropData.cropName,
                        variety: cropData.variety,
                        sowingDate: cropData.sowingDate ? `${cropData.sowingDate}-01T00:00:00Z` : null,
                        expectedHarvestDate: cropData.expectedHarvestDate ? `${cropData.expectedHarvestDate}-01T00:00:00Z` : null,
                        quantity: 1000,
                        status: "PLANTED"
                    })
                });
                if (!cropRes.ok) throw new Error('Failed to save crop');

                navigate('/dashboard');
            } catch (err) {
                setErrorMsg(err.message);
                setIsSubmitting(false);
            }
        }
    };

    const steps = [
        { title: t('ob_step1') || "01 — PROFILE", label: t('ob_step1_label') || "Basic Profile" },
        { title: t('ob_step2') || "02 — FARM", label: t('ob_step2_label') || "Farm Details" },
        { title: t('ob_step3') || "03 — CROP", label: t('ob_step3_label') || "Primary Crop" },
        { title: t('ob_step4') || "04 — PREFERENCES", label: t('ob_step4_label') || "Preferences" }
    ];

    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: '12px',
        border: '1px solid var(--color-green-very-light)',
        backgroundColor: 'var(--color-bg-lightest)',
        color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 600,
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block', fontSize: '0.95rem', fontWeight: 800,
        color: 'var(--color-green-dark)', marginBottom: '10px'
    };

    return (
        <div style={{ backgroundColor: 'var(--color-bg-lightest)', minHeight: '100vh', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '2.4rem', marginBottom: '12px' }}>{t('ob_setup_title') || "Profile Setup"}</h2>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>{t('ob_setup_subtitle') || "Tell us about your farm to personalize insights."}</p>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
                    {steps.map((s, idx) => (
                        <div key={idx} style={{ flex: 1 }}>
                            <div style={{
                                height: '8px',
                                backgroundColor: idx < step ? 'var(--color-green-primary)' : 'var(--color-white)',
                                border: idx >= step ? '1px solid var(--color-green-very-light)' : 'none',
                                borderRadius: '4px',
                                marginBottom: '16px',
                                transition: 'all 0.3s ease'
                            }} />
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: idx < step ? 'var(--color-green-deep)' : 'var(--color-green-medium)', letterSpacing: '0.05em' }}>
                                {s.title}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '48px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid var(--color-green-very-light)' }}>
                    <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px' }}>{steps[step - 1].label}</h3>

                    {step === 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '32px' }}>
                            <div>
                                <label style={labelStyle}>{t('ob_farmer_name') || "Farmer Name"}</label>
                                <input style={{ ...inputStyle, backgroundColor: '#F8FAF8', color: 'var(--color-green-medium)' }} value="Ram Singh" readOnly />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_language') || "Preferred Language"}</label>
                                <select style={inputStyle} value={lang} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="en">English</option>
                                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                    <option value="hi">हिन्दी (Hindi)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '32px' }}>
                            <div>
                                <label style={labelStyle}>{t('ob_location') || "Farm Location"}</label>
                                <input style={inputStyle} value={profileData.farmLocation} onChange={(e) => setProfileData({ ...profileData, farmLocation: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_farm_size') || "Farm Size"}</label>
                                <select style={inputStyle} value={profileData.farmSize} onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}>
                                    <option value="5">{t('ob_opt_acres5') || "5 Acres"}</option>
                                    <option value="10">{t('ob_opt_acres10') || "10 Acres"}</option>
                                    <option value="15">{t('ob_opt_acres15') || "15 Acres"}</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_soil_type') || "Soil Type"}</label>
                                <select style={inputStyle} value={profileData.soilType} onChange={(e) => setProfileData({ ...profileData, soilType: e.target.value })}>
                                    <option value="black_cotton">{t('ob_opt_black_cotton') || "Black Cotton Soil"}</option>
                                    <option value="alluvial">{t('ob_opt_alluvial') || "Alluvial Soil"}</option>
                                    <option value="red_laterite">{t('ob_opt_red_laterite') || "Red Laterite Soil"}</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_irrigation') || "Irrigation Method"}</label>
                                <select style={inputStyle} value={profileData.irrigationType} onChange={(e) => setProfileData({ ...profileData, irrigationType: e.target.value })}>
                                    <option value="drip">{t('ob_opt_drip') || "Drip Irrigation"}</option>
                                    <option value="rainfed">{t('ob_opt_rainfed') || "Rainfed"}</option>
                                    <option value="canal">{t('ob_opt_canal') || "Canal Irrigation"}</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '32px' }}>
                            <div>
                                <label style={labelStyle}>{t('ob_primary_crop') || "Primary Crop"}</label>
                                <input style={inputStyle} value={cropData.cropName} onChange={(e) => setCropData({ ...cropData, cropName: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_crop_variety') || "Crop Variety"}</label>
                                <input style={inputStyle} value={cropData.variety} onChange={(e) => setCropData({ ...cropData, variety: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_sowing_date') || "Sowing Date"}</label>
                                <input type="month" style={inputStyle} value={cropData.sowingDate} onChange={(e) => setCropData({ ...cropData, sowingDate: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_harvest_date') || "Expected Harvest Date"}</label>
                                <input type="month" style={inputStyle} value={cropData.expectedHarvestDate} onChange={(e) => setCropData({ ...cropData, expectedHarvestDate: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '32px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>{t('ob_notif_pref') || "Notification Preference"}</label>
                                <select style={inputStyle} defaultValue="whatsapp">
                                    <option value="whatsapp">{t('ob_opt_wa') || "WhatsApp"}</option>
                                    <option value="sms">{t('ob_opt_sms') || "SMS"}</option>
                                    <option value="in_app">{t('ob_opt_inapp') || "In-App Alerts"}</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_insights_del') || "Insights Delivery"}</label>
                                <select style={inputStyle} defaultValue="weekly">
                                    <option value="weekly">{t('ob_opt_weekly') || "Weekly Report"}</option>
                                    <option value="daily">{t('ob_opt_daily') || "Daily Summary"}</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>{t('ob_insights_focus') || "Insights Focus"}</label>
                                <select style={inputStyle} defaultValue="weather">
                                    <option value="weather">{t('ob_opt_weather') || "Weather & Alerts"}</option>
                                    <option value="market">{t('ob_opt_market') || "Market Prices"}</option>
                                    <option value="pest">{t('ob_opt_pest') || "Pest Alerts"}</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px', gap: '16px' }}>
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                style={{
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-green-dark)',
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginRight: 'auto'
                                }}
                            >
                                {t('back') || "Back"}
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            style={{
                                padding: '16px 48px',
                                borderRadius: '16px',
                                backgroundColor: isSubmitting ? 'var(--color-green-medium)' : 'var(--color-green-deep)',
                                color: 'var(--color-white)',
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                border: 'none',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                boxShadow: '0 8px 24px rgba(0, 90, 50, 0.15)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSubmitting ? 'Saving...' : (step < 4 ? (t('ob_continue') || "Continue") : (t('ob_finish') || "Finish"))}
                        </button>
                    </div>
                    {errorMsg && <div style={{ color: 'red', marginTop: '16px', textAlign: 'right' }}>{errorMsg}</div>}

                </div>
            </div>
        </div>
    );
}
