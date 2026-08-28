import React from 'react';
import { FileText, MapPin, Calendar, ExternalLink } from 'lucide-react';

const DUMMY_CONTRACTS = [
    { id: 'CON-2026-A1', crop: 'Organic Basmati Rice', farmer: 'Jaswinder Sandhu', loc: 'Karnal, HR', qty: '10,000 kg', price: '₹105/kg', period: 'Sep 2026 - Dec 2026', status: 'Active', statBg: '#E6F4E1', statColor: '#168A4A' },
    { id: 'CON-2026-B4', crop: 'Red Onion', farmer: 'Santosh Patil', loc: 'Nashik, MH', qty: '15,000 kg', price: '₹22/kg', period: 'Oct 2026 - Jan 2027', status: 'Pending', statBg: '#FFF3E0', statColor: '#E65100' },
    { id: 'CON-2026-C2', crop: 'Premium Sharbati Wheat', farmer: 'Ramesh Patel', loc: 'Sehore, MP', qty: '8,000 kg', price: '₹32/kg', period: 'Oct 2026 - Mar 2027', status: 'Active', statBg: '#E6F4E1', statColor: '#168A4A' },
    { id: 'CON-2026-D9', crop: 'Raw Groundnut', farmer: 'Vikram Singh', loc: 'Rajkot, GJ', qty: '5,500 kg', price: '₹63/kg', period: 'Jul 2026 - Sep 2026', status: 'Expiring Soon', statBg: '#FFEBEE', statColor: '#D32F2F' },
    { id: 'CON-2025-X9', crop: 'Black Gram (Urad)', farmer: 'Anandrao Deshmukh', loc: 'Latur, MH', qty: '5,000 kg', price: '₹90/kg', period: 'Mar 2025 - Jun 2025', status: 'Completed', statBg: '#F3E5F5', statColor: '#6A1B9A' }
];

export default function BuyerContracts() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>My Contracts</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage your long-term farming agreements.</p>
                </div>
                <button style={{ backgroundColor: 'var(--color-green-primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)' }}>
                    + Draft New Contract
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {DUMMY_CONTRACTS.map((c, i) => (
                    <div key={i} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px' }}>
                                    <FileText size={22} color="var(--color-green-primary)" />
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.05rem' }}>{c.id}</div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600 }}>{c.status}</div>
                                </div>
                            </div>
                            <span style={{ backgroundColor: c.statBg, color: c.statColor, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                {c.status}
                            </span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Target Crop</div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.15rem' }}>{c.crop}</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--color-bg-lightest)', padding: '16px', borderRadius: '12px' }}>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.75rem', fontWeight: 700 }}>Quantity</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem' }}>{c.qty}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.75rem', fontWeight: 700 }}>Agreed Price</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem' }}>{c.price}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-green-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>F</div>
                                    {c.farmer}
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <MapPin size={16} color="var(--color-green-medium)" /> {c.loc}
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <Calendar size={16} color="var(--color-green-medium)" /> {c.period}
                                </div>
                            </div>
                        </div>

                        <button style={{ marginTop: '24px', width: '100%', padding: '12px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-primary)', borderRadius: '10px', color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            View Contract <ExternalLink size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
