import React, { useState } from 'react';
import { User, Bell, Shield, LogOut, Globe, Moon, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerSettings() {
    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('fc_token');
        navigate('/welcome');
    };

    return (
        <div style={{ paddingBottom: '40px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_settings') || 'Settings'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage your preferences and account details.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Account Settings */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--color-green-very-light)' }}>
                    <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <User size={24} color="var(--color-green-primary)" /> Account Preferences
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-green-very-light)' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '1.05rem' }}>Language</div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', marginTop: '4px' }}>Choose your preferred language for the interface.</div>
                            </div>
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="en">English</option>
                                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                <option value="hi">हिंदी (Hindi)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-green-very-light)' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '1.05rem' }}>Push Notifications</div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', marginTop: '4px' }}>Receive alerts for contracts and orders.</div>
                            </div>
                            <div
                                onClick={() => setNotifications(!notifications)}
                                style={{ width: '48px', height: '24px', backgroundColor: notifications ? 'var(--color-green-primary)' : '#E0E0E0', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                            >
                                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: notifications ? '26px' : '2px', transition: '0.3s' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '1.05rem' }}>Two-Factor Authentication</div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', marginTop: '4px' }}>Enhanced account security.</div>
                            </div>
                            <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '8px', color: 'var(--color-green-deep)', fontWeight: 700, cursor: 'pointer' }}>
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid #FFEBEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ color: '#D32F2F', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>Log Out</h3>
                        <p style={{ color: '#D32F2F', opacity: 0.8, fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>End your current session securely.</p>
                    </div>
                    <button onClick={handleLogout} style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
