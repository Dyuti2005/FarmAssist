import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Check, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { speakText } from '../../services/voice/speechService';

// Background aesthetic components copying the reference
const BackgroundHills = () => (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '35vh', pointerEvents: 'none', zIndex: 0 }}>
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            {/* Back hill */}
            <path d="M0,150 Q250,50 500,150 T1000,100 L1000,300 L0,300 Z" fill="var(--color-green-very-light)" opacity="0.7" />
            {/* House Silhouette on left hill */}
            <g opacity="0.15" fill="var(--color-green-deep)" transform="translate(80, 80)">
                <path d="M10,60 L50,25 L90,60 L90,90 L10,90 Z" />
                <rect x="65" y="15" width="10" height="25" />
                <path d="M50,15 L5,55 M50,15 L95,55" stroke="var(--color-green-deep)" strokeWidth="6" strokeLinecap="round" />
                <rect x="40" y="65" width="20" height="25" fill="var(--color-green-very-light)" />
                <rect x="20" y="60" width="10" height="10" fill="var(--color-green-very-light)" />
                <rect x="70" y="60" width="10" height="10" fill="var(--color-green-very-light)" />
            </g>
            {/* Mid hill */}
            <path d="M0,200 Q300,100 600,200 T1000,150 L1000,300 L0,300 Z" fill="var(--color-green-light)" opacity="0.6" />
            {/* Front hill */}
            <path d="M0,260 Q400,200 800,260 T1000,220 L1000,300 L0,300 Z" fill="var(--color-green-soft)" opacity="0.4" />
        </svg>
    </div>
);

const LeafDecoration = ({ top, left, right, bottom, rotate, scale = 1, opacity = 0.2 }) => (
    <svg viewBox="0 0 100 100" style={{ position: 'fixed', top, left, right, bottom, width: '150px', transform: `rotate(${rotate}deg) scale(${scale})`, pointerEvents: 'none', zIndex: 0, opacity, fill: 'var(--color-green-medium)' }}>
        <path d="M10,90 Q40,60 90,10 Q70,40 10,90 Z" />
        <path d="M10,90 Q30,70 50,50 Q40,70 10,90 Z" />
        <circle cx="95" cy="5" r="3" />
        <circle cx="5" cy="95" r="2" />
    </svg>
);

// Unique Leaf Icon matching reference image style
const CustomLeafIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22V12" stroke="var(--color-green-dark)" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12C12 12 7 7 7 12C7 17 12 22 12 22Z" fill="var(--color-green-primary)" />
        <path d="M12 12C12 12 17 7 17 12C17 17 12 22 12 22Z" fill="var(--color-green-medium)" />
        <path d="M12 7C12 7 9 3 9 7C9 11 12 14 12 14Z" fill="var(--color-green-primary)" />
        <path d="M12 7C12 7 15 3 15 7C15 11 12 14 12 14Z" fill="var(--color-green-medium)" />
    </svg>
);

export default function RoleSelection() {
    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();

    const [selectedRole, setSelectedRole] = useState(null);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [recognizedRole, setRecognizedRole] = useState(null);

    const recognitionRef = useRef(null);

    const getRecLang = () => {
        if (lang === 'kn') return 'kn-IN';
        if (lang === 'hi') return 'hi-IN';
        return 'en-IN';
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setTimeout(() => {
            navigate('/login?role=' + role);
        }, 600);
    };

    const speakPrompt = (text, callback) => {
        speakText(text, getRecLang(), callback);
    };

    const startListening = () => {
        setError(null);
        setRecognizedRole(null);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError(t('err_no_support'));
            return;
        }

        try {
            if (recognitionRef.current) recognitionRef.current.stop();
            const rec = new SpeechRecognition();
            rec.lang = getRecLang();
            rec.continuous = false;
            rec.interimResults = false;

            rec.onstart = () => setIsListening(true);
            rec.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                const farmerKeywords = ['farm', 'farmer', 'ರೈತ', 'ರೈತರು', 'ರೈತನು', 'किसान'];
                const buyerKeywords = ['buy', 'buyer', 'ಖರೀದಿದಾರ', 'ಖರೀದಿದಾರರು', 'खरीदार', 'खरीदने'];

                let detected = null;
                if (farmerKeywords.some(kw => transcript.includes(kw))) {
                    detected = 'farmer';
                } else if (buyerKeywords.some(kw => transcript.includes(kw))) {
                    detected = 'buyer';
                }

                if (detected) {
                    setRecognizedRole(detected);
                } else {
                    setError(t('err_not_understood'));
                }
                setIsListening(false);
            };
            rec.onerror = (e) => {
                setIsListening(false);
                if (e.error === 'not-allowed') {
                    setError(t('err_mic_req'));
                } else {
                    setError(t('err_not_understood'));
                }
            };
            rec.onend = () => setIsListening(false);
            recognitionRef.current = rec;
            rec.start();
        } catch (e) {
            setIsListening(false);
            setError(t('err_no_support'));
        }
    };

    const startVoiceFlow = () => {
        setIsVoiceActive(true);
        speakPrompt(t('say_farmer_or_buyer'), startListening);
    };

    const cancelVoice = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsVoiceActive(false);
    };

    const confirmVoiceRole = () => {
        if (recognizedRole) {
            cancelVoice();
            handleRoleSelect(recognizedRole);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>

            {/* Background Decor */}
            <BackgroundHills />
            <LeafDecoration top="-20px" left="-40px" rotate={45} scale={1.5} opacity={0.1} />
            <LeafDecoration top="20%" right="-50px" rotate={-45} scale={0.8} opacity={0.15} />
            <LeafDecoration bottom="40%" right="10px" rotate={-110} scale={0.8} opacity={0.12} />

            {/* Language Selector Top Right matched perfectly */}
            <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
                <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '6px', border: '1px solid var(--color-green-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    {[{ id: 'en', label: 'English' }, { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'hi', label: 'हिन्दी' }].map(l => (
                        <button key={l.id} onClick={() => setLang(l.id)} type="button" style={{ padding: '8px 24px', borderRadius: '24px', backgroundColor: lang === l.id ? 'var(--color-green-deep)' : 'transparent', color: lang === l.id ? 'var(--color-white)' : 'var(--color-green-deep)', fontWeight: lang === l.id ? 700 : 600, fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Centered Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 48px', position: 'relative', zIndex: 10, margin: '0 auto', width: '100%', maxWidth: '1100px' }}>

                {/* Title Block */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px', lineHeight: 1.2, maxWidth: '700px', margin: '0 auto' }}>
                        {t('choose_role_title')}
                    </h1>
                    <p style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 500, marginTop: '8px' }}>
                        {t('choose_role_subtitle')}
                    </p>
                </motion.div>

                {/* Cards Wrapper */}
                <div className="role-cards-wrapper" style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center', marginBottom: '48px' }}>

                    {/* FARMER CARD */}
                    <motion.div
                        onClick={() => handleRoleSelect('farmer')}
                        className="role-card"
                        whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 40px rgba(0, 90, 50, 0.12)' }}
                        whileTap={{ scale: 0.98 }}
                        animate={selectedRole === 'buyer' ? { opacity: 0, x: -30 } : selectedRole === 'farmer' ? { scale: 1.05 } : {}}
                        style={{
                            flex: '1', backgroundColor: 'var(--color-white)', borderRadius: '24px',
                            boxShadow: '0 12px 30px rgba(0, 90, 50, 0.08)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        {/* Top Aspect Ratio Box for Photo */}
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '85%', backgroundColor: 'var(--color-green-very-light)' }}>
                            <img src="/images/farmer.png" alt="Farmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

                            {/* Overlapping Wave SVG matched to photo bottom */}
                            <div style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%' }}>
                                <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
                                    <path d="M0,25 Q100,60 200,25 T400,25 L400,60 L0,60 Z" fill="var(--color-green-light)" opacity="0.7" />
                                    <path d="M0,35 Q100,70 200,35 T400,35 L400,60 L0,60 Z" fill="var(--color-white)" />
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Text Box */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '40px 24px 32px', textAlign: 'center', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                            {/* Centered Circular Icon on the wave */}
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', backgroundColor: 'var(--color-white)', borderRadius: '50%', border: '2px solid var(--color-green-very-light)', boxShadow: '0 4px 12px rgba(0,90,50,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                                <CustomLeafIcon />
                            </div>

                            <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.5px' }}>
                                {t('im_a_farmer')}
                            </h2>
                            <p style={{ color: 'var(--color-green-dark)', fontSize: '1rem', fontWeight: 500 }}>{t('grow_manage_farm')}</p>
                        </div>
                    </motion.div>

                    {/* BUYER CARD */}
                    <motion.div
                        onClick={() => handleRoleSelect('buyer')}
                        className="role-card"
                        whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 40px rgba(0, 90, 50, 0.12)' }}
                        whileTap={{ scale: 0.98 }}
                        animate={selectedRole === 'farmer' ? { opacity: 0, x: 30 } : selectedRole === 'buyer' ? { scale: 1.05 } : {}}
                        style={{
                            flex: '1', backgroundColor: 'var(--color-white)', borderRadius: '24px',
                            boxShadow: '0 12px 30px rgba(0, 90, 50, 0.08)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        {/* Top Aspect Ratio Box for Photo */}
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '85%', backgroundColor: 'var(--color-green-very-light)' }}>
                            <img src="/images/buyer.png" alt="Buyer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

                            {/* Overlapping Wave SVG matched to photo bottom */}
                            <div style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%' }}>
                                <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
                                    <path d="M0,25 Q100,60 200,25 T400,25 L400,60 L0,60 Z" fill="var(--color-green-light)" opacity="0.7" />
                                    <path d="M0,35 Q100,70 200,35 T400,35 L400,60 L0,60 Z" fill="var(--color-white)" />
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Text Box */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '40px 24px 32px', textAlign: 'center', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                            {/* Centered Circular Icon on the wave */}
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', backgroundColor: 'var(--color-white)', borderRadius: '50%', border: '2px solid var(--color-green-very-light)', boxShadow: '0 4px 12px rgba(0,90,50,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                                <ShoppingCart size={28} color="var(--color-green-dark)" strokeWidth={2.5} />
                            </div>

                            <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.5px' }}>
                                {t('im_a_buyer')}
                            </h2>
                            <p style={{ color: 'var(--color-green-dark)', fontSize: '1rem', fontWeight: 500 }}>{t('discover_buy_produce')}</p>
                        </div>
                    </motion.div>

                </div>

                {/* Microphone Action - Centered directly beneath following reference style */}
                <motion.button
                    onClick={startVoiceFlow}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px 36px',
                        backgroundColor: 'rgba(247, 252, 245, 0.9)', border: '2px dashed var(--color-green-medium)',
                        borderRadius: '40px', cursor: 'pointer', position: 'relative', zIndex: 10, backdropFilter: 'blur(8px)',
                        boxShadow: '0 6px 16px rgba(0, 90, 50, 0.05)', margin: '0 auto'
                    }}
                >
                    <Mic size={28} color="var(--color-green-deep)" strokeWidth={2.5} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem' }}>{t('speak_instead')}</div>
                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 500, fontSize: '0.9rem' }}>{t('say_farmer_or_buyer')}</div>
                    </div>
                </motion.button>
            </div>

            {/* Voice Overlay (remains unchanged for logic loop handling) */}
            <AnimatePresence>
                {isVoiceActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(247, 252, 245, 0.98)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <button onClick={cancelVoice} style={{ position: 'absolute', top: '24px', right: '24px', padding: '8px', color: 'var(--color-green-dark)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={32} /></button>
                        <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
                            {t('say_farmer_or_buyer')}
                        </h2>
                        <div onClick={() => speakPrompt(t('say_farmer_or_buyer'), startListening)} style={{ width: '120px', height: '120px', backgroundColor: isListening ? 'var(--color-green-primary)' : 'var(--color-white)', border: `4px solid ${isListening ? 'var(--color-green-primary)' : 'var(--color-green-light)'}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', cursor: 'pointer', transition: 'all 0.3s', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}>
                            <Mic size={48} color={isListening ? 'var(--color-white)' : 'var(--color-green-primary)'} />
                        </div>

                        {error && !isListening && (
                            <div style={{ color: '#D32F2F', textAlign: 'center' }}>
                                <AlertCircle size={24} style={{ margin: '0 auto 8px' }} />
                                <p>{error}</p>
                                <button onClick={() => speakPrompt(t('say_farmer_or_buyer'), startListening)} style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '12px', color: 'var(--color-green-deep)', fontWeight: 700, border: 'none', cursor: 'pointer' }}>{t('speak_again')}</button>
                            </div>
                        )}

                        {recognizedRole && !isListening && (
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 90, 50, 0.1)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-green-deep)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>
                                    {recognizedRole === 'farmer' ? t('you_selected_farmer') : t('you_selected_buyer')}
                                </p>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button onClick={() => speakPrompt(t('say_farmer_or_buyer'), startListening)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--color-green-primary)', backgroundColor: 'transparent', color: 'var(--color-green-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><RefreshCw size={18} style={{ marginRight: '8px' }} />{t('speak_again')}</button>
                                    <button onClick={confirmVoiceRole} style={{ flex: 1, padding: '16px', borderRadius: '12px', backgroundColor: 'var(--color-green-deep)', border: 'none', color: 'var(--color-white)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={18} style={{ marginRight: '8px' }} />{t('continue')}</button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .role-cards-wrapper { flex-direction: column; }
        .role-card { width: 100%; }
        @media (min-width: 768px) {
          .role-cards-wrapper { flex-direction: row !important; }
          .role-card { flex: 1; max-width: 450px; }
        }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(65, 171, 93, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(65, 171, 93, 0); } 100% { box-shadow: 0 0 0 0 rgba(65, 171, 93, 0); } }
      `}</style>
        </div>
    );
}
