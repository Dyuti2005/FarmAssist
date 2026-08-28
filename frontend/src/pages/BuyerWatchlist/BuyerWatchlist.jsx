import React from 'react';
import { Package, MapPin, TrendingDown, TrendingUp, X } from 'lucide-react';

const DUMMY_WATCHLIST = [
    { id: 1, title: 'Export Quality Guntur Chilli', price: '₹180/kg', qty: '800 kg', loc: 'Guntur, AP', trend: 'down', trendVal: '-2.5%', img: 'https://images.unsplash.com/photo-1596644671424-d2e7d7db326e?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Toor Dal (Pigeon Pea)', price: '₹125/kg', qty: '1,200 kg', loc: 'Gulbarga, KA', trend: 'up', trendVal: '+1.2%', img: 'https://images.unsplash.com/photo-1585996843477-987d6928e08d?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Premium Sharbati Wheat', price: '₹32/kg', qty: '5,000 kg', loc: 'Sehore, MP', trend: 'down', trendVal: '-0.5%', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' }
];

export default function BuyerWatchlist() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>My Watchlist</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Keep track of produce prices and availability before buying.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {DUMMY_WATCHLIST.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '16px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                            <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <X size={18} color="var(--color-green-medium)" />
                            </button>
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px', lineHeight: 1.3 }}>{item.title}</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Current Price</div>
                                    <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.4rem' }}>{item.price}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: item.trend === 'up' ? '#FFF3E0' : '#E6F4E1', color: item.trend === 'up' ? '#E65100' : '#168A4A', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                    {item.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {item.trendVal}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', flex: 1 }}>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <Package size={16} color="var(--color-green-medium)" /> {item.qty} available
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <MapPin size={16} color="var(--color-green-medium)" /> {item.loc}
                                </div>
                            </div>

                            <button style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-green-very-light)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                                View Details & Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
