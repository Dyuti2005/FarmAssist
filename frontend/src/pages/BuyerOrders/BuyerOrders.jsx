import React from 'react';
import { ArrowRight } from 'lucide-react';

const DUMMY_ORDERS = [
    { id: '#ORD-9021', date: '28 Aug 2026', prod: 'Premium Sharbati Wheat', qty: '2,000 kg', total: '₹64,000', status: 'Confirmed', statBg: '#E6F4E1', statColor: '#168A4A' },
    { id: '#ORD-9018', date: '26 Aug 2026', prod: 'Toor Dal (Pigeon Pea)', qty: '500 kg', total: '₹62,500', status: 'Dispatched', statBg: '#E3F2FD', statColor: '#1565C0' },
    { id: '#ORD-9005', date: '21 Aug 2026', prod: 'Kashmiri Saffron', qty: '2 kg', total: '₹5,00,000', status: 'Delivered', statBg: '#F3E5F5', statColor: '#6A1B9A' },
    { id: '#ORD-8991', date: '15 Aug 2026', prod: 'Raw Groundnut', qty: '1,500 kg', total: '₹97,500', status: 'Processing', statBg: '#FFF3E0', statColor: '#E65100' },
    { id: '#ORD-8980', date: '10 Aug 2026', prod: 'Organic Basmati Rice', qty: '3,000 kg', total: '₹3,30,000', status: 'Delivered', statBg: '#F3E5F5', statColor: '#6A1B9A' },
    { id: '#ORD-8975', date: '02 Aug 2026', prod: 'Black Gram (Urad Dal)', qty: '1,000 kg', total: '₹95,000', status: 'Delivered', statBg: '#F3E5F5', statColor: '#6A1B9A' },
];

export default function BuyerOrders() {
    return (
        <div style={{ paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>My Orders</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Track and manage your agricultural purchases.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {DUMMY_ORDERS.map((order, i) => (
                    <div key={i} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ color: 'var(--color-green-dark)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                                {order.id}
                            </div>
                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.15rem' }}>
                                {order.prod}
                            </div>
                            <div style={{ color: 'var(--color-green-medium)', fontWeight: 600, fontSize: '0.9rem' }}>
                                {order.qty}
                            </div>
                            <div style={{ color: 'var(--color-green-medium)', fontWeight: 500, fontSize: '0.85rem', marginTop: '4px' }}>
                                {order.date}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '12px' }}>
                            <span style={{ backgroundColor: order.statBg, color: order.statColor, padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                {order.status}
                            </span>

                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.2rem' }}>
                                    {order.total}
                                </div>
                                <button style={{ background: 'none', border: 'none', color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                                    View Details <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
