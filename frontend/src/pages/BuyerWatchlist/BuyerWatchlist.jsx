import React from 'react';
import { Package, MapPin, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getProductImage } from '../../utils/imageMapper';

export default function BuyerWatchlist() {
    const { t } = useLanguage();

    // STATIC STATE: Replace with real API data when backend supports /api/watchlist
    const mockWatchlist = [
        {
            id: 'PROD-101',
            product: 'Organic Tomato',
            price: '₹1400',
            originalPrice: '₹1600',
            trend: 'down',
            availability: 'In Stock (40 Quintals)',
            farmer: 'Sundaram',
            location: 'Nashik, Maharashtra'
        },
        {
            id: 'PROD-105',
            product: 'Alphonso Mango',
            price: '₹12000',
            originalPrice: '₹11500',
            trend: 'up',
            availability: 'Limited Stock (5 Quintals)',
            farmer: 'Vikram',
            location: 'Ratnagiri, Maharashtra'
        },
        {
            id: 'PROD-110',
            product: 'Black Cotton Soil Onion',
            price: '₹2200',
            originalPrice: '₹2200',
            trend: 'flat',
            availability: 'Out of Stock',
            farmer: 'Rajesh',
            location: 'Indore, MP'
        }
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_watchlist') || 'My Watchlist'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>{t('watchlist_desc') || 'Keep track of produce prices and availability before buying.'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {mockWatchlist.map(item => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <div style={{ height: '160px', position: 'relative' }}>
                            <img src={getProductImage(item.product)} alt={item.product} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={16} color="var(--color-green-deep)" />
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{item.product}</h3>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.4rem' }}>{item.price}</div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', textDecoration: 'line-through' }}>{item.originalPrice}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.trend === 'down' ? '#168A4A' : item.trend === 'up' ? '#D32F2F' : 'var(--color-green-medium)', fontWeight: 700, fontSize: '0.9rem', backgroundColor: item.trend === 'down' ? '#E6F4E1' : item.trend === 'up' ? '#FFEBEE' : 'var(--color-bg-lightest)', padding: '4px 8px', borderRadius: '8px' }}>
                                    {item.trend === 'down' ? <TrendingDown size={14} /> : item.trend === 'up' ? <TrendingUp size={14} /> : '-'} {item.trend !== 'flat' && (t('trend') || 'Trend')}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                <div style={{ color: item.availability === 'Out of Stock' ? '#D32F2F' : 'var(--color-green-dark)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={16} /> {item.availability.includes('Out of Stock') ? (t('out_of_stock') || 'Out of Stock') : (t('in_stock') || 'In Stock')}
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={16} /> {item.farmer} — {item.location}
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-green-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                                {t('view_full_details') || 'View Full Details'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
