import React from 'react';
import { CreditCard, Download, ExternalLink } from 'lucide-react';

const DUMMY_PAYMENTS = [
    { id: 'TXN-902144', orderId: '#ORD-9021', date: '28 Aug 2026', crop: 'Premium Sharbati Wheat', amount: '₹64,000', method: 'UPI / PhonePe', status: 'Completed', statBg: '#E6F4E1', statColor: '#168A4A' },
    { id: 'TXN-901855', orderId: '#ORD-9018', date: '26 Aug 2026', crop: 'Toor Dal (Pigeon Pea)', amount: '₹62,500', method: 'Net Banking (HDFC)', status: 'Completed', statBg: '#E6F4E1', statColor: '#168A4A' },
    { id: 'TXN-899122', orderId: '#ORD-8991', date: '15 Aug 2026', crop: 'Raw Groundnut', amount: '₹97,500', method: 'Debit Card', status: 'Processing', statBg: '#FFF3E0', statColor: '#E65100' },
];

export default function BuyerPayments() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Payments & Billing</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Securely manage your transaction history and invoices.</p>
                </div>
                <button style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-green-primary)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-green-primary)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '16px' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green-primary)' }}>₹</span>
                    </div>
                    <div>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Spent This Month</div>
                        <div style={{ color: 'var(--color-green-deep)', fontSize: '1.8rem', fontWeight: 900 }}>₹2,45,680</div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '16px' }}>
                        <CreditCard size={24} color="var(--color-green-primary)" />
                    </div>
                    <div>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Active Methods</div>
                        <div style={{ color: 'var(--color-green-deep)', fontSize: '1.4rem', fontWeight: 800 }}>2 Saved Cards</div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px' }}>Transaction History</h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-green-very-light)', color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>
                                <th style={{ padding: '0 16px 16px' }}>Transaction ID & Date</th>
                                <th style={{ padding: '0 16px 16px' }}>Order Ref & Crop</th>
                                <th style={{ padding: '0 16px 16px' }}>Method</th>
                                <th style={{ padding: '0 16px 16px' }}>Status</th>
                                <th style={{ padding: '0 16px 16px', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DUMMY_PAYMENTS.map((r, i) => (
                                <tr key={i} style={{ borderBottom: i < DUMMY_PAYMENTS.length - 1 ? '1px solid var(--color-bg-lightest)' : 'none' }}>
                                    <td style={{ padding: '20px 16px' }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{r.id}</div>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600 }}>{r.date}</div>
                                    </td>
                                    <td style={{ padding: '20px 16px' }}>
                                        <div style={{ color: 'var(--color-green-primary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>{r.orderId}</div>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>{r.crop}</div>
                                    </td>
                                    <td style={{ padding: '20px 16px' }}>
                                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 700, fontSize: '0.9rem' }}>{r.method}</div>
                                    </td>
                                    <td style={{ padding: '20px 16px' }}>
                                        <span style={{ backgroundColor: r.statBg, color: r.statColor, padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block' }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 16px', textAlign: 'right' }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 900, marginBottom: '6px' }}>{r.amount}</div>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--color-green-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            Invoice <ExternalLink size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
