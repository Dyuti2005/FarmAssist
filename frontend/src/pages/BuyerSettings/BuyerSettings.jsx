import React from 'react';
import { User, Bell, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BuyerSettings() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('fc_auth');
        localStorage.removeItem('fc_role');
        navigate('/welcome');
    };

    return (
        <div style={{ paddingBottom: '40px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Settings</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage your preferences and account details.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Profile Settings */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                            <User size={22} color="var(--color-green-primary)" />
                        </div>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>Profile Information</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Full Name</label>
                            <input type="text" defaultValue="TechNexus Buyer" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-green-very-light)', outline: 'none', color: 'var(--color-green-deep)', fontWeight: 600 }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Business Name</label>
                            <input type="text" defaultValue="Nexus Agri-Tech Ltd" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-green-very-light)', outline: 'none', color: 'var(--color-green-deep)', fontWeight: 600 }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Email Address</label>
                            <input type="email" defaultValue="buyer@technexus.in" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-green-very-light)', outline: 'none', color: 'var(--color-green-deep)', fontWeight: 600 }} />
                        </div>
                    </div>
                    <button style={{ marginTop: '24px', backgroundColor: 'var(--color-green-primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                        Save Changes
                    </button>
                </div>

                {/* Notification Preferences */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                            <Bell size={22} color="var(--color-green-primary)" />
                        </div>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>Notification Preferences</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-green-primary)' }} />
                            <span style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>Order Updates & Shipping</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-green-primary)' }} />
                            <span style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>New Contract Approvals</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--color-green-primary)' }} />
                            <span style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>Marketing & Offers</span>
                        </label>
                    </div>
                </div>

                {/* Logout */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid #FFEBEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ color: '#D32F2F', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Log Out</h3>
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
