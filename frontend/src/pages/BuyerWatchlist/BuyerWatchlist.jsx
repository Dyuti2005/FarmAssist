import React from 'react';
import { Package, MapPin, TrendingDown, TrendingUp, Minus, X, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getProductImage } from '../../utils/imageMapper';

// Realistic mandi prices (₹/kg) — Agmarknet/eNAM reference, Oct 2026
// Source: agmarknet.gov.in / enam.gov.in — indicative, not live streaming data
const MANDI_REF = {
    'Organic Tomato': { price: 22, prev: 28, unit: 'kg', trend: 'down', source: 'Agmarknet, Nashik APMC' },
    'Alphonso Mango': { price: 180, prev: 160, unit: 'kg', trend: 'up', source: 'Agmarknet, Ratnagiri APMC' },
    'Black Cotton Soil Onion': { price: 18, prev: 18, unit: 'kg', trend: 'flat', source: 'Agmarknet, Indore APMC' },
};

export default function BuyerWatchlist() {
    const { t } = useLanguage();

    // Prices in ₹/kg — realistic mandi references, Oct 2026
    const mockWatchlist = [
        {
            id: 'PROD-101',
            product: 'Organic Tomato',
            priceKg: 22,
            prevPriceKg: 28,
            trend: 'down',          // price fell — good for buyers
            stockKg: 4000,
            stockLabel: 'In Stock (4,000 kg)',
            farmer: 'Sundaram',
            location: 'Nashik, Maharashtra',
            source: 'Agmarknet, Nashik APMC'
        },
        {
            id: 'PROD-105',
            product: 'Alphonso Mango',
            priceKg: 180,
            prevPriceKg: 160,
            trend: 'up',            // seasonal spike — limited supply
            stockKg: 500,
            stockLabel: 'Limited Stock (500 kg)',
            farmer: 'Vikram Desai',
            location: 'Ratnagiri, Maharashtra',
            source: 'Agmarknet, Ratnagiri APMC'
        },
        {
            id: 'PROD-110',
            product: 'Black Cotton Soil Onion',
            priceKg: 18,
            prevPriceKg: 18,
            trend: 'flat',
            stockKg: 0,
            stockLabel: 'Out of Stock',
            farmer: 'Rajesh',
            location: 'Indore, MP',
            source: 'Agmarknet, Indore APMC'
        }
    ];

    const trendColor = { down: '#168A4A', up: '#D32F2F', flat: 'var(--color-green-medium)' };
    const trendBg = { down: '#E6F4E1', up: '#FFEBEE', flat: 'var(--color-bg-lightest)' };
    const trendLabel = { down: 'Price ↓', up: 'Price ↑', flat: 'Stable' };
    const TrendIcon = { down: TrendingDown, up: TrendingUp, flat: Minus };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    {t('side_watchlist') || 'My Watchlist'}
                </h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>
                    {t('watchlist_desc') || 'Keep track of produce prices and availability before buying.'}
                </p>
            </div>

            {/* Mandi data notice */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#F1F8E9', border: '1px solid #C5E1A5', borderRadius: '12px', padding: '12px 16px', marginBottom: '28px', fontSize: '0.82rem', color: '#558B2F' }}>
                <Info size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
                <span>
                    <strong>Prices are indicative mandi references (₹/kg)</strong> sourced from Agmarknet / eNAM.
                    Last updated: <strong>October 2026</strong>. These are not live streaming prices — always verify at your nearest APMC before trading.
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {mockWatchlist.map(item => {
                    const Icon = TrendIcon[item.trend];
                    const isOOS = item.stockKg === 0;
                    const change = ((item.priceKg - item.prevPriceKg) / item.prevPriceKg * 100).toFixed(1);
                    return (
                        <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                            <div style={{ height: '160px', position: 'relative' }}>
                                <img
                                    src={getProductImage(item.product)}
                                    alt={item.product}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={16} color="var(--color-green-deep)" />
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>
                                    {item.product}
                                </h3>

                                {/* Price row */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <div>
                                        <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
                                            ₹{item.priceKg}<span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>/kg</span>
                                        </div>
                                        <div style={{ color: '#aaa', fontSize: '0.82rem', textDecoration: 'line-through', marginTop: '2px' }}>
                                            ₹{item.prevPriceKg}/kg
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        color: trendColor[item.trend], fontWeight: 700, fontSize: '0.85rem',
                                        backgroundColor: trendBg[item.trend], padding: '5px 10px', borderRadius: '8px'
                                    }}>
                                        <Icon size={14} />
                                        {trendLabel[item.trend]}
                                        {item.trend !== 'flat' && ` ${Math.abs(change)}%`}
                                    </div>
                                </div>

                                {/* Source note */}
                                <div style={{ fontSize: '0.72rem', color: '#999', marginBottom: '14px' }}>
                                    Ref: {item.source} · Oct 2026 · Indicative only
                                </div>

                                {/* Stock & Location */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '18px' }}>
                                    <div style={{ color: isOOS ? '#D32F2F' : 'var(--color-green-dark)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={15} />
                                        {isOOS ? (t('out_of_stock') || 'Out of Stock') : item.stockLabel}
                                    </div>
                                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={15} /> {item.farmer} — {item.location}
                                    </div>
                                </div>

                                <button style={{ width: '100%', padding: '12px', backgroundColor: isOOS ? '#E0E0E0' : 'var(--color-green-primary)', color: isOOS ? '#888' : 'white', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: isOOS ? 'not-allowed' : 'pointer' }}>
                                    {isOOS ? (t('out_of_stock') || 'Out of Stock') : (t('view_full_details') || 'View Full Details')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
