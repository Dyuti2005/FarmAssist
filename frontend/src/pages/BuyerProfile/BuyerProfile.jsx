import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, User, MapPin, Building, Phone, Mail, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('fc_token');
                const res = await fetch('http://localhost:5002/api/buyers/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setProfile(data.buyer);
                }
            } catch (e) {
                console.error("Failed to load profile:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div style={{ padding: '40px', color: 'var(--color-green-deep)', fontWeight: 600 }}>Loading profile...</div>;

    const b = profile || {};

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Buyer Profile</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage your business information and purchasing preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                {/* Left Column Profile Card */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: 'var(--color-green-very-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '4px solid var(--color-green-light)' }}>
                        <User size={50} color="var(--color-green-primary)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.5rem', fontWeight: 800 }}>{b.name || 'Setup your profile'}</h2>
                        <ShieldCheck size={20} color="var(--color-green-primary)" />
                    </div>
                    <p style={{ color: 'var(--color-green-medium)', fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>Verified Buyer</p>

                    <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-green-light)', margin: '16px 0' }}></div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Building size={20} color="var(--color-green-medium)" />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Organization</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{b.companyName || 'Not Set'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Phone size={20} color="var(--color-green-medium)" />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Phone</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{b.phone || 'Not Set'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Mail size={20} color="var(--color-green-medium)" />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Email</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{b.email || 'Not Set'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MapPin size={20} color="var(--color-green-medium)" />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Location</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{b.location || 'Not Set'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingCart size={22} color="var(--color-green-primary)" /> Purchasing Preferences
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600, marginBottom: '4px' }}>Buyer Type</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{b.businessType || 'Food Processing / Wholesale'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600, marginBottom: '4px' }}>Typical Purchase Volume</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>50–100 tonnes/month</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600, marginBottom: '4px' }}>Preferred Language</div>
                                <div style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>English</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-medium)', fontWeight: 600, marginBottom: '4px' }}>Preferred Crops</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                    {['Wheat', 'Rice', 'Maize', 'Pulses'].map(crop => (
                                        <span key={crop} style={{ backgroundColor: 'var(--color-green-very-light)', color: 'var(--color-green-dark)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                                            {crop}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Account Security</h3>
                            <p style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', fontWeight: 500 }}>Log out of your buyer account safely.</p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('fc_auth');
                                localStorage.removeItem('fc_role');
                                localStorage.removeItem('fc_token');
                                window.location.href = '/role-selection';
                            }}
                            style={{
                                backgroundColor: 'white', border: '2px solid #FF5252', color: '#FF5252',
                                padding: '10px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(255, 82, 82, 0.1)'
                            }}>
                            <LogOut size={18} /> LOG OUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
