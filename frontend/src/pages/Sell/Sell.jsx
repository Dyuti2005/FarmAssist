import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Plus, Edit2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sell() {
    const { t } = useLanguage();

    const mockListings = [
        { id: 1, crop: t('wheat') || 'Wheat', variety: 'Sharbati', quantity: 50, price: 2100, status: 'Active' },
        { id: 2, crop: t('tomato') || 'Tomato', variety: 'Hybrid', quantity: 20, price: 1500, status: 'Sold' }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1250px', margin: '0 auto', padding: '24px 24px 100px 24px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '12px', fontWeight: 600 }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back'}
                    </Link>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 800 }}>{t('sell_crop') || 'Sell Crop'}</h1>
                    <p style={{ color: 'var(--color-green-medium)', fontWeight: 500, marginTop: '4px' }}>{t('list_harvest') || 'Manage your market listings'}</p>
                </div>
                <button style={{ backgroundColor: 'var(--color-green-primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)' }}>
                    <Plus size={20} /> {t('new_listing') || 'New Listing'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {mockListings.map(item => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>{item.crop}</h3>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 500 }}>{item.variety}</div>
                            </div>
                            <span style={{ backgroundColor: item.status === 'Active' ? 'var(--color-green-very-light)' : '#E0E0E0', color: item.status === 'Active' ? 'var(--color-green-deep)' : '#666', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {item.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'var(--color-bg-lightest)', padding: '16px', borderRadius: '12px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>QUANTITY</div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem' }}>{item.quantity} Qtl</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)', fontWeight: 600 }}>PRICE / QTL</div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem' }}>₹{item.price}</div>
                            </div>
                        </div>
                        <button style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--color-green-primary)', color: 'var(--color-green-primary)', padding: '10px', borderRadius: '10px', fontWeight: 700, display: 'flex', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                            <Edit2 size={18} /> Edit Listing
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
