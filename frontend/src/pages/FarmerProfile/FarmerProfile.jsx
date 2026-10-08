import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, MapPin, Globe, Award, LogOut, ShieldCheck, Edit2, Leaf, Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function FarmerProfile() {
    const { t, lang } = useLanguage();

    const [farmerData, setFarmerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('fc_token');
                const pRes = await fetch('http://localhost:5002/api/farmers/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!pRes.ok) throw new Error('Failed to fetch profile');
                const pData = await pRes.json();

                const cRes = await fetch('http://localhost:5002/api/crops', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const cData = await cRes.json();

                setFarmerData({
                    name: pData.user?.name || "Farmer",
                    phone: pData.user?.phone || "",
                    location: pData.farmLocation || "Not set",
                    farmSize: pData.farmSize ? `${pData.farmSize} Acres` : "Not set",
                    primaryCrop: cData.length > 0 ? cData[0].cropName : "No crops",
                    language: pData.user?.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : pData.user?.language === 'hi' ? 'Hindi (हिन्दी)' : 'English',
                    // Fallback to current year if createdAt doesn't exist on user directly (though prisma adds it)
                    joinDate: "Joined " + (pData.user?.createdAt ? new Date(pData.user.createdAt).getFullYear() : '2024'),
                    certification: t('fp_verified_badge') || "Verified Organic Farmer"
                });
            } catch (e) {
                setErrorMsg('Unable to load farmer data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [t]);

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-green-deep)', fontWeight: 600 }}>Loading farmer data...</div>;
    if (errorMsg) return <div style={{ padding: '60px', textAlign: 'center', color: 'red', fontSize: '1.2rem', fontWeight: 600 }}>{errorMsg}</div>;

    return (
        <div style={{ padding: '32px 40px 100px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', width: '100%', maxWidth: '1250px', margin: '0 auto', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

            {/* Header */}
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back to Dashboard'}
                    </Link>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.4rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 8px 0' }}>
                            {t('pr_title') || 'My Profile'} <User size={28} color="var(--color-green-primary)" />
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                            {t('pr_manage') || 'Manage your personal and farm information'}
                        </p>
                    </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-primary)', color: 'var(--color-green-primary)', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,138,74,0.08)', transition: 'all 0.2s', height: 'fit-content' }}>
                    <Edit2 size={18} /> {t('pr_edit') || 'Edit Profile'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Top Row: Profile & Account */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.5fr)', gap: '32px', alignItems: 'start' }}>

                    {/* Profile Card */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '40px 24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '4px solid var(--color-white)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <User size={44} color="var(--color-green-primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-green-deep)', fontWeight: 800, margin: '0 0 6px 0' }}>{farmerData.name}</h2>
                        <div style={{ color: 'var(--color-green-medium)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '24px' }}>{farmerData.joinDate}</div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#E6F4E1', color: '#168A4A', padding: '10px 20px', borderRadius: '24px', fontWeight: 800, fontSize: '0.9rem' }}>
                            <Award size={18} /> {t('pr_verified') || "Verified Farmer"}
                        </div>
                    </div>

                    {/* Account Info */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>{t('pr_act_info') || 'Account Information'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ padding: '10px', backgroundColor: 'var(--color-white)', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><Phone size={20} color="var(--color-green-primary)" /></div>
                                    <div>
                                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '2px' }}>{t('pr_phone') || 'Phone Number'}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{farmerData.phone}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ padding: '10px', backgroundColor: 'var(--color-white)', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><Globe size={20} color="var(--color-green-primary)" /></div>
                                    <div>
                                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '2px' }}>{t('language') || 'Language'}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{farmerData.language}</div>
                                    </div>
                                </div>
                                <button style={{ border: 'none', background: 'var(--color-white)', padding: '8px 16px', borderRadius: '8px', color: 'var(--color-green-primary)', fontWeight: 800, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>{t('pr_change') || 'Change'}</button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ padding: '10px', backgroundColor: 'var(--color-white)', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><ShieldCheck size={20} color="var(--color-green-primary)" /></div>
                                    <div>
                                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '2px' }}>{t('pr_sec_status') || 'Account Security'}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('pr_verified_sec') || 'Verified & Secured'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Farm Info */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>{t('pr_farm_info') || 'Farm Information'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><Tractor size={24} color="var(--color-green-primary)" /></div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 700, marginBottom: '4px' }}>{t('farm_size') || 'Farm Size'}</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmerData.farmSize}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><Leaf size={24} color="var(--color-green-primary)" /></div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 700, marginBottom: '4px' }}>{t('primary_crop') || 'Primary Crop'}</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmerData.primaryCrop}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><MapPin size={24} color="var(--color-green-primary)" /></div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 700, marginBottom: '4px' }}>{t('pr_primary_loc') || 'Farm Location'}</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{farmerData.location}</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Logout Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                        onClick={() => {
                            localStorage.removeItem('fc_auth');
                            localStorage.removeItem('fc_role');
                            localStorage.removeItem('fc_token');
                            window.location.href = '/role-selection';
                        }}
                        style={{
                            backgroundColor: '#FFF5F5', border: '1px solid #FFCDCD', color: '#E53E3E',
                            padding: '16px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 800,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px',
                            transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(229, 62, 62, 0.05)'
                        }}>
                        <LogOut size={20} /> {t('pr_logout') || 'Log Out'}
                    </button>
                </div>

            </div>
        </div>
    );
}
