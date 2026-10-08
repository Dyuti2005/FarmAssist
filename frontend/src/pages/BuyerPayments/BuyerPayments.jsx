import React from 'react';
import { CreditCard, Download, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerPayments() {
    const { t } = useLanguage();

    // STATIC STATE: Currently no standalone /api/payments backend, using mock presentation
    const mockPayments = [
        {
            id: 'PAY-89240',
            orderId: 'ORD-5892',
            date: '2026-10-09',
            amount: '₹28,500',
            method: 'Razorpay (Test)',
            status: 'COMPLETED'
        },
        {
            id: 'PAY-89102',
            orderId: 'ORD-5810',
            date: '2026-09-28',
            amount: '₹14,200',
            method: 'Net Banking',
            status: 'COMPLETED'
        },
        {
            id: 'PAY-88950',
            orderId: 'ORD-5744',
            date: '2026-09-15',
            amount: '₹45,000',
            method: 'UPI',
            status: 'PROCESSING'
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { bg: '#E6F4E1', color: '#168A4A', icon: <CheckCircle size={16} /> };
            case 'PROCESSING': return { bg: '#FFF3E0', color: '#E65100', icon: <Calendar size={16} /> };
            default: return { bg: '#F3F4F6', color: '#374151', icon: null };
        }
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_payments') || 'Payments & Billing'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Securely manage your transaction history and invoices.</p>
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-lightest)', borderBottom: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>Recent Transactions</h3>
                    <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '10px', color: 'var(--color-green-deep)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Download CSV
                    </button>
                </div>

                <div style={{ padding: '0 24px' }}>
                    {mockPayments.map((payment, index) => {
                        const s = getStatusStyle(payment.status);
                        return (
                            <div key={payment.id} style={{ padding: '24px 0', borderBottom: index < mockPayments.length - 1 ? '1px solid var(--color-green-very-light)' : 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', alignItems: 'center', gap: '16px' }}>
                                <div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '4px' }}>{payment.id}</div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600 }}>Ref: {payment.orderId}</div>
                                </div>
                                <div style={{ color: 'var(--color-green-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} /> {payment.date}
                                </div>
                                <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.1rem' }}>
                                    {payment.amount}
                                </div>
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: s.bg, color: s.color, padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                                        {s.icon} {payment.status}
                                    </div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{payment.method}</div>
                                </div>
                                <div>
                                    <button style={{ padding: '8px', backgroundColor: 'var(--color-bg-lightest)', border: 'none', borderRadius: '8px', color: 'var(--color-green-deep)', cursor: 'pointer' }} title="View Invoice">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
