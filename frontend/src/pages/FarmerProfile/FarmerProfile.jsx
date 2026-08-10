import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Placeholder = ({ title }) => (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={20} /> Back
        </Link>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center', border: '1px solid var(--color-green-very-light)' }}>
            <h1 style={{ color: 'var(--color-green-deep)', marginBottom: '8px' }}>{title}</h1>
            <p style={{ color: 'var(--color-green-medium)' }}>Coming Soon. UI placeholder.</p>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button
                onClick={() => {
                    localStorage.removeItem('fc_auth');
                    localStorage.removeItem('fc_role');
                    window.location.href = '/role-selection';
                }}
                style={{
                    backgroundColor: 'white', border: '1px solid #FF5252', color: '#FF5252',
                    padding: '12px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 2px 8px rgba(255, 82, 82, 0.1)'
                }}>
                <LogOut size={20} /> LOG OUT
            </button>
        </div>
    </div>
);

export default function FarmerProfile() { return <Placeholder title="Farmer Profile" />; }
