import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mic, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import VoiceGuidedInput from '../../components/common/VoiceGuidedInput';
import { normalizeToDigits } from '../../services/voice/speechService';

// --- INLINE SVGs FOR LOGIN/REGISTER REDESIGN ---
const FarmerLandscapeSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 140" preserveAspectRatio="none" style={{ display: 'block' }}>
        <rect width="500" height="140" fill="var(--color-green-very-light)" />
        {/* Sun/Cloud */}
        <circle cx="430" cy="35" r="20" fill="var(--color-white)" opacity="0.7" />
        {/* Background Hills */}
        <path d="M0,70 Q125,30 250,70 T500,50 L500,140 L0,140 Z" fill="#C7E9C0" />
        {/* Mid Hills */}
        <path d="M-50,90 Q125,60 300,100 T550,80 L550,140 L-50,140 Z" fill="#A1D99B" />
        {/* Front Field */}
        <path d="M-20,110 Q160,85 350,120 T520,105 L520,140 L-20,140 Z" fill="#74C476" />

        {/* Trees */}
        <circle cx="70" cy="85" r="14" fill="#238B45" />
        <rect x="68" y="97" width="4" height="12" fill="#005A32" />
        <circle cx="90" cy="95" r="10" fill="#41AB5D" />

        {/* Tractor Silhouette */}
        <g transform="translate(180, 105) scale(0.65)" fill="#005A32">
            <rect x="10" y="10" width="25" height="15" rx="3" />
            <rect x="25" y="0" width="10" height="12" />
            {/* Outline Cabin */}
            <path d="M5,-12 L20,-12 M6,-12 L6,10 M18,-12 L18,10" stroke="#005A32" strokeWidth="2" fill="none" />
            {/* Wheels */}
            <circle cx="10" cy="25" r="8" fill="#238B45" />
            <circle cx="10" cy="25" r="4" fill="#E5F5E0" />

            <circle cx="32" cy="27" r="5" fill="#238B45" />
            <circle cx="32" cy="27" r="2" fill="#E5F5E0" />
            {/* Exhaust */}
            <rect x="29" y="-5" width="2" height="10" />
        </g>

        {/* Farm House */}
        <rect x="380" y="95" width="28" height="18" fill="var(--color-white)" />
        <polygon points="375,95 394,80 413,95" fill="#005A32" />
        <rect x="385" y="102" width="6" height="11" fill="#41AB5D" />
    </svg>
);

const BuyerLandscapeSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 140" preserveAspectRatio="none" style={{ display: 'block' }}>
        <rect width="500" height="140" fill="var(--color-green-very-light)" />
        {/* Background Hills */}
        <path d="M0,65 Q150,95 310,65 T500,85 L500,140 L0,140 Z" fill="#C7E9C0" />
        {/* Mid Hills */}
        <path d="M-20,105 Q180,65 370,105 T550,95 L550,140 L-20,140 Z" fill="#A1D99B" />
        {/* Front Field */}
        <path d="M-10,125 Q180,85 330,125 T520,110 L520,140 L-10,140 Z" fill="#74C476" />
        {/* Market Cart */}
        <rect x="300" y="95" width="46" height="22" fill="var(--color-white)" rx="3" />
        <polygon points="295,95 323,78 351,95" fill="#238B45" />
        <circle cx="310" cy="118" r="6" fill="#005A32" />
        <circle cx="336" cy="118" r="6" fill="#005A32" />
        <circle cx="305" cy="88" r="4" fill="var(--color-green-very-light)" />
        <circle cx="316" cy="88" r="4" fill="var(--color-green-very-light)" />
        <circle cx="327" cy="88" r="4" fill="var(--color-green-very-light)" />
        <circle cx="338" cy="88" r="4" fill="var(--color-green-very-light)" />
        {/* Trees */}
        <circle cx="100" cy="92" r="16" fill="#41AB5D" />
        <rect x="97" y="106" width="6" height="14" fill="#005A32" />
    </svg>
);

const BottomWaveDecor = () => (
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '15vh', pointerEvents: 'none', zIndex: 0 }}>
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d="M0,150 Q250,80 500,150 T1000,100 L1000,200 L0,200 Z" fill="var(--color-green-very-light)" opacity="0.6" />
            <path d="M0,180 Q300,110 600,180 T1000,130 L1000,200 L0,200 Z" fill="var(--color-green-light)" opacity="0.4" />
            <g opacity="0.1" transform="translate(850, 80) scale(1.5)">
                <path d="M10,90 Q40,60 90,10 Q70,40 10,90 Z" fill="var(--color-green-deep)" />
                <path d="M10,90 Q30,70 50,50 Q40,70 10,90 Z" fill="var(--color-green-deep)" />
            </g>
        </svg>
    </div>
);
const InputWrapper = ({ label, field, placeholder, isPassword = false, value, onChange, error }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-green-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
                {label}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                    type={isPassword && !showPassword ? "password" : "text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(field, e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: `2px solid ${error ? '#D32F2F' : (isFocused ? 'var(--color-green-primary)' : 'var(--color-green-light)')}`,
                        backgroundColor: 'var(--color-white)',
                        fontSize: '1rem',
                        color: 'var(--color-green-deep)',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', padding: '8px', color: 'var(--color-green-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && (
                <div style={{ color: '#D32F2F', fontSize: '0.85rem', marginTop: '6px', fontWeight: 600 }}>{error}</div>
            )}
        </div>
    );
};

export default function Auth({ defaultView = "login" }) {
    const { lang, setLang, t } = useLanguage();
    const [view, setView] = useState(defaultView);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'farmer'; // 'farmer' or 'buyer'

    // Form State
    const [formData, setFormData] = useState({ mobile: '', password: '', name: '', location: '' });
    const [errors, setErrors] = useState({});
    const [voiceWizardVisible, setVoiceWizardVisible] = useState(false);

    const handleValidation = () => {
        let newErrors = {};
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!formData.mobile) {
            newErrors.mobile = t('err_mobile_req');
        } else if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = t('err_mobile_invalid');
        }

        if (!formData.password) newErrors.password = t('err_pwd_req');
        if (view === 'register') {
            if (!formData.name) newErrors.name = t('err_name_req');
            if (!formData.location) newErrors.location = t('err_loc_req');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            localStorage.setItem('fc_auth', 'true');
            localStorage.setItem('fc_role', role);
            navigate(role === 'buyer' ? '/buyer-dashboard' : '/dashboard', { replace: true });
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            localStorage.setItem('fc_auth', 'true');
            localStorage.setItem('fc_role', role);
            navigate(role === 'buyer' ? '/buyer-dashboard' : '/onboarding', { replace: true });
        }
    };

    const updateForm = (field, val) => {
        let cleanVal = typeof val === 'string' ? val : "";
        if (field === 'mobile') {
            cleanVal = normalizeToDigits(cleanVal);
            if (cleanVal.length > 10) cleanVal = cleanVal.slice(0, 10);
        } else {
            cleanVal = cleanVal.trimStart();
        }
        setFormData(prev => ({ ...prev, [field]: cleanVal }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const voiceSteps = view === 'login'
        ? [{ promptKey: 'tts_ask_mobile', onFill: (val) => updateForm('mobile', val) }]
        : [
            { promptKey: 'tts_ask_name', onFill: (val) => updateForm('name', val) },
            { promptKey: 'tts_ask_mobile', onFill: (val) => updateForm('mobile', val) },
            { promptKey: 'tts_ask_location', onFill: (val) => updateForm('location', val) }
        ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', position: 'relative', overflowX: 'hidden' }}>

            {/* Global Top Nav for Auth */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', position: 'relative', zIndex: 20 }}>
                <Link to="/role-selection" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', fontWeight: 600 }}>
                    <ArrowLeft size={20} />
                    {t('change_role')}
                </Link>
                <div style={{ backgroundColor: 'var(--color-green-very-light)', borderRadius: '24px', display: 'flex', overflow: 'hidden', padding: '4px' }}>
                    {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                        <button key={l.id} onClick={() => setLang(l.id)} type="button" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: lang === l.id ? 'var(--color-white)' : 'transparent', color: lang === l.id ? 'var(--color-green-deep)' : 'var(--color-green-dark)', fontWeight: lang === l.id ? 700 : 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: lang === l.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* UNIFIED COMPACT AUTH LAYOUT */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: '540px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Header text changes based on view and role */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '1.9rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.5px' }}>
                        {view === 'login' ? (role === 'farmer' ? t('welcome_back') : t('buyer_login')) : (role === 'farmer' ? t('create_profile_title') : t('buyer_new'))}
                    </h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1rem', fontWeight: 500 }}>
                        {role === 'farmer'
                            ? (view === 'login' ? t('back_to_farm') : t('setup_digital_profile'))
                            : (view === 'login' ? t('find_fresh_produce') : t('find_fresh_produce'))}
                    </p>
                </div>

                {/* Agricultural Landscape Banner */}
                <div style={{ width: '100%', height: '140px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid var(--color-green-very-light)' }}>
                    {role === 'farmer' ? <FarmerLandscapeSVG /> : <BuyerLandscapeSVG />}
                </div>

                {/* Narrow Tabs */}
                <div style={{ display: 'flex', width: '100%', borderBottom: '2px solid var(--color-green-very-light)', marginBottom: '32px' }}>
                    <button onClick={() => setView('login')} style={{ flex: 1, padding: '12px', fontSize: '1rem', background: 'transparent', cursor: 'pointer', fontWeight: view === 'login' ? 700 : 600, border: 'none', borderBottom: view === 'login' ? '3px solid var(--color-green-primary)' : 'none', color: view === 'login' ? 'var(--color-green-deep)' : 'var(--color-green-medium)' }} type="button">
                        {role === 'farmer' ? t('farmer_login') : t('buyer_login')}
                    </button>
                    <button onClick={() => setView('register')} style={{ flex: 1, padding: '12px', fontSize: '1rem', background: 'transparent', cursor: 'pointer', fontWeight: view === 'register' ? 700 : 600, border: 'none', borderBottom: view === 'register' ? '3px solid var(--color-green-primary)' : 'none', color: view === 'register' ? 'var(--color-green-deep)' : 'var(--color-green-medium)' }} type="button">
                        {role === 'farmer' ? t('new_farmer') : t('buyer_new')}
                    </button>
                </div>

                <form onSubmit={view === 'login' ? handleLogin : handleRegister} style={{ width: '100%' }}>

                    {view === 'register' && (
                        <InputWrapper label={role === 'farmer' ? t('farmer_name') : 'Buyer Name'} field="name" placeholder={t('enter_name')} value={formData.name} onChange={updateForm} error={errors.name} />
                    )}

                    <InputWrapper label={t('mobile_number')} field="mobile" placeholder={t('enter_mobile')} value={formData.mobile} onChange={updateForm} error={errors.mobile} />

                    {view === 'register' && (
                        <InputWrapper label={t('location')} field="location" placeholder={t('enter_location')} value={formData.location} onChange={updateForm} error={errors.location} />
                    )}

                    {view === 'login' ? (
                        <InputWrapper label={t('password')} field="password" placeholder={t('enter_login_password')} isPassword={true} value={formData.password} onChange={updateForm} error={errors.password} />
                    ) : (
                        <InputWrapper label={t('password')} field="password" placeholder={t('enter_password')} isPassword={true} value={formData.password} onChange={updateForm} error={errors.password} />
                    )}

                    {view === 'login' && (
                        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                            <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-green-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{t('forgot_password')}</button>
                        </div>
                    )}

                    {/* Data Security Banner for Registration */}
                    {view === 'register' && (
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid var(--color-green-light)' }}>
                            <div style={{ flexShrink: 0, padding: '6px', backgroundColor: 'var(--color-white)', borderRadius: '50%', border: '1px solid var(--color-green-primary)' }}>
                                <ShieldCheck size={18} color="var(--color-green-primary)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>Your Data is Secure</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)' }}>We protect your information and help you grow with technology.</div>
                            </div>
                        </div>
                    )}

                    <motion.button whileHover={{ scale: 1.01, boxShadow: '0 6px 16px rgba(0, 90, 50, 0.25)' }} whileTap={{ scale: 0.99 }} type="submit" style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: 'var(--color-green-deep)', color: 'var(--color-white)', fontSize: '1.1rem', fontWeight: 700, transition: 'all 0.2s' }}>
                        {view === 'login' ? t('login_btn') : (role === 'farmer' ? t('create_profile_btn') : t('buyer_new'))}
                    </motion.button>
                </form>

                {/* Compact Voice Section with OR separator */}
                <div style={{ width: '100%', marginTop: '32px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', color: 'var(--color-green-medium)' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-green-light)' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-green-light)' }}></div>
                    </div>

                    <motion.button onClick={() => setVoiceWizardVisible(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="button" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', backgroundColor: 'var(--color-white)', padding: '16px', borderRadius: '16px', border: '2px solid var(--color-green-light)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <Mic size={24} color="var(--color-green-primary)" />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-green-deep)' }}>{t('speak_instead')}</div>
                            <div style={{ color: 'var(--color-green-dark)', fontWeight: 500, fontSize: '0.85rem' }}>{t('tap_and_tell')}</div>
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* Subtle Bottom Wave Decorative Element applied globally now */}
            <BottomWaveDecor />

            {voiceWizardVisible && (
                <VoiceGuidedInput
                    steps={voiceSteps}
                    onComplete={() => setVoiceWizardVisible(false)}
                    onCancel={() => setVoiceWizardVisible(false)}
                />
            )}
        </div>
    );
}
