import React, { useState } from 'react';
import { Search, Filter, Heart, MapPin, Package, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRODUCE_DATA = [
    { id: 1, title: 'Premium Sharbati Wheat', category: 'Grains', price: '₹32/kg', qty: '5,000 kg', loc: 'Sehore, MP', farmer: 'Ramesh Patel', grade: 'A+', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Toor Dal (Pigeon Pea)', category: 'Pulses', price: '₹125/kg', qty: '1,200 kg', loc: 'Gulbarga, KA', farmer: 'Basappa Gowda', grade: 'A', img: 'https://images.unsplash.com/photo-1585996843477-987d6928e08d?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Export Quality Guntur Chilli', category: 'Spices', price: '₹180/kg', qty: '800 kg', loc: 'Guntur, AP', farmer: 'Subba Reddy', grade: 'Premium', img: 'https://images.unsplash.com/photo-1596644671424-d2e7d7db326e?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Raw Groundnut (Peanut)', category: 'Oilseeds', price: '₹65/kg', qty: '2,500 kg', loc: 'Rajkot, GJ', farmer: 'Vikram Singh', grade: 'A', img: 'https://images.unsplash.com/photo-1571407386001-f2f65a440eab?auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: 'Organic Basmati Rice', category: 'Grains', price: '₹110/kg', qty: '3,000 kg', loc: 'Karnal, HR', farmer: 'Jaswinder Sandhu', grade: 'Export', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { id: 6, title: 'Black Gram (Urad Dal)', category: 'Pulses', price: '₹95/kg', qty: '1,500 kg', loc: 'Latur, MH', farmer: 'Anandrao Deshmukh', grade: 'A', img: 'https://images.unsplash.com/photo-1575852579169-c0953bf62d6b?auto=format&fit=crop&w=600&q=80' }
];

export default function BuyerMarketplace() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const categories = ['All', 'Grains', 'Pulses', 'Spices', 'Oilseeds', 'Fruits & Veg'];

    const filtered = PRODUCE_DATA.filter(p =>
        (category === 'All' || p.category === category) &&
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Browse Produce</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Discover quality agricultural produce direct from farmers.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-white)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Search color="var(--color-green-medium)" size={20} />
                    <input
                        type="text"
                        placeholder="Search for wheat, rice, spices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '0.95rem', color: 'var(--color-green-deep)' }}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px', color: 'var(--color-green-dark)', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <SlidersHorizontal size={18} /> Filters
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setCategory(c)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: category === c ? 'none' : '1px solid var(--color-green-very-light)',
                            backgroundColor: category === c ? 'var(--color-green-primary)' : 'var(--color-white)',
                            color: category === c ? 'var(--color-white)' : 'var(--color-green-dark)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}>
                        {c}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filtered.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', transition: 'transform 0.2s' }}>
                        <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                            <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--color-green-primary)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                                Grade: {item.grade}
                            </div>
                            <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <Heart size={18} color="var(--color-green-medium)" />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>{item.category}</div>
                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.3 }}>{item.title}</div>
                            <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.3rem', marginBottom: '16px' }}>{item.price}</div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '12px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <Package size={16} color="var(--color-green-medium)" /> {item.qty} available
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <MapPin size={16} color="var(--color-green-medium)" /> {item.loc}
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-green-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>F</div>
                                    {item.farmer}
                                </div>
                            </div>
                        </div>
                        <button style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--color-green-deep)', color: 'var(--color-white)', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
