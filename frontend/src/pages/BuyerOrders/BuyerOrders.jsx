import React, { useState, useEffect } from 'react';
import { ArrowRight, Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const staticOrders = [
    {
        id: 'FC-ORD-2026-001',
        previewName: 'Export Grade Grapes',
        itemCount: 1,
        status: 'CONFIRMED',
        date: '2026-10-09',
        totalAmount: 12000,
    },
    {
        id: 'FC-ORD-2026-002',
        previewName: 'Alphonso Mango',
        itemCount: 1,
        status: 'PROCESSING',
        date: '2026-10-08',
        totalAmount: 25000,
    },
    {
        id: 'FC-ORD-2026-003',
        previewName: 'Kashmiri Apples',
        itemCount: 1,
        status: 'DELIVERED',
        date: '2026-10-05',
        totalAmount: 18000,
    }
];

export default function BuyerOrders() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState(staticOrders);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('fc_token');
                const res = await fetch(`http://localhost:5002/api/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setOrders([...staticOrders, ...data.orders]);
                } else {
                    console.error('Failed to fetch orders.');
                }
            } catch (e) {
                setError('Network error loading orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return { bg: '#FFF3E0', color: '#E65100' };
            case 'CONFIRMED': return { bg: '#E6F4E1', color: '#168A4A' };
            case 'PROCESSING': return { bg: '#E3F2FD', color: '#1565C0' };
            case 'DELIVERED':
            case 'COMPLETED': return { bg: '#F3E5F5', color: '#6A1B9A' };
            case 'CANCELLED':
            case 'REJECTED': return { bg: '#FFEBEE', color: '#D32F2F' };
            default: return { bg: '#E3F2FD', color: '#1565C0' };
        }
    };

    return (
        <div style={{ paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('my_orders') || 'My Orders'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>{t('track_orders_desc') || 'Track and manage your agricultural purchases.'}</p>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>{t('loading_orders') || 'Loading orders...'}</div>
            ) : error ? (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '24px', borderRadius: '16px', fontWeight: 700 }}>{error}</div>
            ) : orders.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '64px 32px', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--color-green-medium)' }}>
                    <Package size={48} color="var(--color-green-light)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', marginBottom: '8px' }}>{t('no_orders') || 'No Orders Found'}</h3>
                    <p style={{ color: 'var(--color-green-dark)' }}>{t('no_orders_desc') || "You haven't placed any orders yet."}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order) => {
                        const sStyle = getStatusStyle(order.status);
                        return (
                            <div key={order.id} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--color-green-primary)' }}>
                                            {order.id.slice(0, 8).toUpperCase()}
                                        </div>
                                        <div style={{ backgroundColor: sStyle.bg, color: sStyle.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-green-deep)' }}>
                                        {order.previewName} {order.itemCount > 1 ? `+ ${order.itemCount - 1} items` : ''}
                                    </div>
                                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('total_value') || 'Total Value'}</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-green-deep)' }}>₹{order.totalAmount}</div>
                                    </div>
                                    <Link to={`/buyer/orders/${order.id}`} style={{ backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', padding: '12px', borderRadius: '50%', textDecoration: 'none', border: '2px solid var(--color-green-very-light)', display: 'flex' }}>
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
