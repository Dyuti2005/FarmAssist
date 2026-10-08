import React from 'react';
import { ArrowLeft, Search, Package, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Buy() {
    const { t } = useLanguage();

    const mockInputs = [
        { id: 1, name: 'DAP Fertilizer', brand: 'IFFCO', price: 1350, type: 'Fertilizer', distance: '2 km away' },
        { id: 2, name: 'Wheat Seeds HD-2967', brand: 'NSC', price: 950, type: 'Seeds', distance: '5 km away' },
        { id: 3, name: 'Tractor Rental', brand: 'Local Farm Services', price: 800, type: 'Equipment', distance: '1.5 km away' }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1250px', margin: '0 auto', padding: '24px 24px 100px 24px', boxSizing: 'border-box' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back'}
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 800 }}>{t('buy_inputs') || 'Buy Inputs'}</h1>
                <div style={{ display: 'flex', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px', padding: '8px 16px', alignItems: 'center', width: '100%', maxWidth: '350px' }}>
                    <Search size={20} color="var(--color-green-medium)" />
                    <input type="text" placeholder="Search seeds, fertilizers..." style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '1rem', color: 'var(--color-green-deep)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {mockInputs.map(item => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-green-primary)', backgroundColor: 'var(--color-green-very-light)', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>{item.type}</span>
                                <h3 style={{ margin: '12px 0 4px 0', color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>{item.name}</h3>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', fontWeight: 500 }}>{item.brand}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
                            <MapPin size={16} /> {item.distance}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.4rem' }}>
                                ₹{item.price}
                            </div>
                            <button style={{ backgroundColor: 'var(--color-green-primary)', color: 'var(--color-white)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={18} /> Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
