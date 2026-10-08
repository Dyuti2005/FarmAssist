import React, { useState, useEffect } from 'react';
import { Package, Clock, ArrowRight, Expand } from 'lucide-react';

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [verifying, setVerifying] = useState({});

    const token = localStorage.getItem('fc_token');

    const verifyOnBlockchain = async (orderId) => {
        setVerifying(prev => ({ ...prev, [orderId]: true }));
        try {
            const res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}/blockchain-verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                alert("Order successfully verified on Polygon!");
                fetchOrders();
            } else {
                alert(data.message || "Failed to verify on blockchain.");
            }
        } catch (e) {
            alert("Error verifying on blockchain.");
        } finally {
            setVerifying(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5002/api/farmer/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            } else {
                setError('Failed to fetch orders.');
            }
        } catch (e) {
            setError('Network error loading orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const updateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
        setStatusUpdating(true);
        try {
            const res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders(); // Refresh order statuses via DB
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (e) {
            alert('Error updating status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return { bg: '#FFF3E0', color: '#E65100' };
            case 'CONFIRMED': return { bg: '#E6F4E1', color: '#168A4A' };
            case 'DISPATCHED': return { bg: '#E3F2FD', color: '#1565C0' };
            case 'COMPLETED': return { bg: '#F3E5F5', color: '#6A1B9A' };
            case 'CANCELLED':
            case 'REJECTED': return { bg: '#FFEBEE', color: '#D32F2F' };
            default: return { bg: '#F5F5F5', color: '#616161' };
        }
    };

    return (
        <div style={{ padding: '0 24px 40px 24px', width: '100%', maxWidth: '1250px', margin: '0 auto', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Order Management</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Process incoming marketplace requests mapping your listed produce.</p>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>Loading incoming orders...</div>
            ) : error ? (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '24px', borderRadius: '16px', fontWeight: 700 }}>{error}</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {(orders.length > 0 ? orders : [
                        { id: 'FC-ORD-8A391', status: 'PENDING', buyerName: 'AgriCorp Ltd.', date: '2026-03-12', totalValueForFarmer: 45000, items: [{ productName: 'Premium Wheat', quantity: 20, unit: 'Qtl' }], blockchainStatus: 'PENDING' },
                        { id: 'FC-ORD-9B432', status: 'CONFIRMED', buyerName: 'Local Mill Co.', date: '2026-03-10', totalValueForFarmer: 18000, items: [{ productName: 'Hybrid Tomato', quantity: 15, unit: 'Qtl' }], blockchainStatus: 'VERIFIED' }
                    ]).map((order) => {
                        const sStyle = getStatusStyle(order.status);
                        const isExpanded = expandedOrder === order.id;

                        // Identify allowed transitions
                        let availableAction = null;
                        if (order.status === 'PENDING') availableAction = 'CONFIRMED';
                        if (order.status === 'CONFIRMED') availableAction = 'DISPATCHED';
                        if (order.status === 'DISPATCHED') availableAction = 'COMPLETED';

                        return (
                            <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                                <div onClick={() => setExpandedOrder(isExpanded ? null : order.id)} style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) auto auto', gap: '24px', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? 'var(--color-bg-lightest)' : 'white' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--color-green-primary)' }}>ID: {order.id.slice(0, 8).toUpperCase()}</div>
                                            <div style={{ backgroundColor: sStyle.bg, color: sStyle.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                {order.status}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-green-deep)' }}>
                                            Requested by: {order.buyerName}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                            <Clock size={12} /> {new Date(order.date).toLocaleDateString()}
                                        </div>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.2rem', marginTop: '4px' }}>
                                            ₹{order.totalValueForFarmer}
                                        </div>
                                        <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block', padding: '4px 8px', borderRadius: '8px', backgroundColor: order.blockchainStatus === 'VERIFIED' ? '#E6F4E1' : '#F5F5F5', color: order.blockchainStatus === 'VERIFIED' ? '#168A4A' : '#616161' }}>
                                            Blockchain: {order.blockchainStatus || 'PENDING'}
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--color-green-medium)', display: 'flex', alignItems: 'center' }}>
                                        <Expand size={20} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '24px', borderTop: '1px solid var(--color-green-very-light)' }}>
                                        <h4 style={{ color: 'var(--color-green-deep)', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Items Requested</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {order.items.map((it, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-lightest)', padding: '16px', borderRadius: '12px' }}>
                                                    <span style={{ fontWeight: 800, color: 'var(--color-green-deep)' }}>{it.productName}</span>
                                                    <span style={{ fontWeight: 900, color: 'var(--color-green-primary)' }}>{it.quantity} {it.unit}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                            {order.blockchainStatus !== 'VERIFIED' && (
                                                <button disabled={verifying[order.id]} onClick={() => verifyOnBlockchain(order.id)} style={{ padding: '12px 24px', backgroundColor: '#FFF3E0', color: '#E65100', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                                    {verifying[order.id] ? 'Verifying...' : 'Verify on Polygon'}
                                                </button>
                                            )}
                                            {order.status === 'PENDING' && (
                                                <button disabled={statusUpdating} onClick={() => updateStatus(order.id, 'REJECTED')} style={{ padding: '12px 24px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                                    Reject Order
                                                </button>
                                            )}

                                            {availableAction && (
                                                <button disabled={statusUpdating} onClick={() => updateStatus(order.id, availableAction)} style={{ padding: '12px 32px', backgroundColor: 'var(--color-green-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    Mark as {availableAction} <ArrowRight size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
