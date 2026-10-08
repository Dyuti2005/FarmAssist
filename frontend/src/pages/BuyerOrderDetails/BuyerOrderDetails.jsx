import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getProductImage } from '../../utils/imageMapper';
import { cleanString } from '../../utils/dataCleaner';

const staticOrders = {
    'FC-ORD-2026-001': {
        id: 'FC-ORD-2026-001',
        createdAt: '2026-10-09T01:41:52+05:30',
        status: 'CONFIRMED',
        totalAmount: 12000,
        items: [
            { id: 'itm-1', productName: 'Export Grade Grapes', variety: 'Thompson Seedless', priceAtOrder: 120, unit: 'KG', quantity: 100, subtotal: 12000 }
        ]
    },
    'FC-ORD-2026-002': {
        id: 'FC-ORD-2026-002',
        createdAt: '2026-10-08T10:00:00+05:30',
        status: 'PROCESSING',
        totalAmount: 25000,
        items: [
            { id: 'itm-2', productName: 'Alphonso Mango', variety: 'Ratnagiri', priceAtOrder: 500, unit: 'Dozen', quantity: 50, subtotal: 25000 }
        ]
    },
    'FC-ORD-2026-003': {
        id: 'FC-ORD-2026-003',
        createdAt: '2026-10-05T14:30:00+05:30',
        status: 'DELIVERED',
        totalAmount: 18000,
        items: [
            { id: 'itm-3', productName: 'Kashmiri Apples', variety: 'Red Delicious', priceAtOrder: 180, unit: 'KG', quantity: 100, subtotal: 18000 }
        ]
    }
};

export default function BuyerOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [payment, setPayment] = useState(null);
    const [fetchingPayment, setFetchingPayment] = useState(false);
    const [blockchainData, setBlockchainData] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id && id.startsWith('FC-ORD-2026')) {
                setOrder(staticOrders[id]);
                if (staticOrders[id].status === 'DELIVERED') {
                    setPayment({ id: 'PAY-FC-1234', status: 'PAID' });
                    setBlockchainData({ network: 'Polygon Amoy Testnet', transactionHash: '0xabc123fc...' });
                }
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('fc_token');
                const res = await fetch(`http://localhost:5002/api/orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setOrder(data.order);

                    // Fetch payment status
                    setFetchingPayment(true);
                    const pRes = await fetch(`http://localhost:5002/api/payments/order/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const pData = await pRes.json();
                    if (pData.success) {
                        setPayment(pData.payment);
                    }
                    setFetchingPayment(false);

                    // Fetch blockchain status
                    const bRes = await fetch(`http://localhost:5002/api/orders/${id}/blockchain-verification`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const bData = await bRes.json();
                    if (bData.success && bData.verification.status) {
                        setBlockchainData(bData.verification);
                    }

                } else {
                    setError('Order not found.');
                }
            } catch (e) {
                setError('Network error loading order.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const verifyOnBlockchain = async () => {
        if (id.startsWith('FC-ORD-2026')) {
            setTimeout(() => {
                setBlockchainData({ network: 'Polygon Amoy Testnet', transactionHash: '0x' + Math.random().toString(16).slice(2) + 'fc1234' });
                alert("Order successfully verified on Polygon!");
            }, 1000);
            return;
        }

        try {
            const token = localStorage.getItem('fc_token');
            const res = await fetch(`http://localhost:5002/api/orders/${id}/blockchain-verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBlockchainData(data.verification);
                alert("Order successfully verified on Polygon!");
            } else {
                alert(data.message || "Failed to verify on blockchain.");
            }
        } catch (e) {
            alert("Error verifying on blockchain.");
        }
    };

    const openRazorpay = (paymentData, key_id, amount) => {
        const token = localStorage.getItem('fc_token');
        const options = {
            key: key_id,
            amount: Math.round(amount * 100),
            currency: "INR",
            name: "FarmChain Assist",
            description: `Order Payment for ${order.id}`,
            order_id: paymentData.razorpayOrderId,
            handler: async function (response) {
                try {
                    const verifyRes = await fetch('http://localhost:5002/api/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderId: order.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setPayment(prev => ({ ...prev, status: 'PAID' }));
                        alert("Payment verified and successful!");
                    } else {
                        alert(verifyData.message || "Payment verification failed.");
                    }
                } catch (e) {
                    alert("Error verifying payment.");
                }
            },
            prefill: {
                name: "FarmChain Buyer",
                email: "buyer@farmchain.com",
                contact: "9999999999"
            },
            theme: { color: "#168A4A" }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert("Payment failed: " + response.error.description);
        });
        rzp1.open();
    };

    const initPayment = async () => {
        if (id.startsWith('FC-ORD-2026')) {
            alert("Payment flow simulates success for this record.");
            setPayment({ id: 'PAY-FC-MOCK', status: 'PAID' });
            return;
        }

        try {
            const token = localStorage.getItem('fc_token');
            const res = await fetch(`http://localhost:5002/api/payments/order/${id}/create`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPayment(data.payment);
                openRazorpay(data.payment, data.key_id, data.payment.amount);
            } else {
                alert(data.message || "Failed to initialize payment");
            }
        } catch (e) {
            alert("Error initializing payment");
        }
    };

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

    if (loading) return <div style={{ fontWeight: 600, color: 'var(--color-green-deep)' }}>Loading...</div>;

    if (error || !order) return (
        <div style={{ padding: '24px' }}>
            <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}><ArrowLeft size={20} /> Back to Orders</Link>
            <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '24px', borderRadius: '16px', fontWeight: 700 }}>{error}</div>
        </div>
    );

    const sStyle = getStatusStyle(order.status);

    return (
        <div style={{ paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to Orders
            </Link>

            <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-green-very-light)', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>Order Details</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-green-dark)' }}>
                            <span style={{ fontWeight: 800 }}>ID: {order.id}</span>
                            <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Calendar size={16} /> {new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: sStyle.bg, color: sStyle.color, padding: '8px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
                        {order.status}
                    </div>
                </div>

                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Items Ordered</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={getProductImage(cleanString(item.productName))} alt={cleanString(item.productName)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{cleanString(item.productName)}</h4>
                                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem' }}>Variety: {item.variety}</div>
                                    <div style={{ color: 'var(--color-green-primary)', fontWeight: 700, marginTop: '8px' }}>₹{item.priceAtOrder} / {item.unit}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: 'var(--color-green-dark)', fontSize: '1.1rem', marginBottom: '8px' }}>{item.quantity} {item.unit}</div>
                                <div style={{ fontWeight: 900, color: 'var(--color-green-deep)', fontSize: '1.2rem' }}>₹{item.subtotal}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-green-very-light)', paddingTop: '24px', marginBottom: '24px' }}>
                    <span style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.4rem' }}>Total Amount</span>
                    <span style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.8rem' }}>₹{order.totalAmount}</span>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>Payment Status</h3>

                    {fetchingPayment ? (
                        <div style={{ color: 'var(--color-green-dark)' }}>Checking payment status...</div>
                    ) : payment ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Payment ID: {payment.id}</div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px', color: payment.status === 'PAID' ? 'var(--color-green-primary)' : 'var(--color-green-deep)' }}>
                                    Status: {payment.status}
                                </div>
                            </div>
                            {payment.status === 'PENDING' && (
                                <button onClick={initPayment} style={{ padding: '12px 24px', backgroundColor: 'var(--color-green-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                    Pay Now
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>No payment initialized yet.</div>
                            <button onClick={initPayment} style={{ padding: '12px 24px', backgroundColor: 'var(--color-green-deep)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                Pay Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Blockchain Verification Box */}
                <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginTop: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-green-deep)', marginBottom: '24px' }}>Polygon Blockchain Verification</h2>

                    {blockchainData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Network</div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{blockchainData.network}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Transaction Hash</div>
                                <div style={{ fontWeight: 600, color: '#168A4A', wordBreak: 'break-all' }}>
                                    <a href={`https://amoy.polygonscan.com/tx/${blockchainData.transactionHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-green-primary)', textDecoration: 'none' }}>
                                        {blockchainData.transactionHash}
                                    </a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#168A4A', fontWeight: 600 }}>
                                <CheckCircle size={20} /> Verified Immaculately
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Not verified on Polygon yet.</div>
                            <button onClick={verifyOnBlockchain} style={{ padding: '12px 24px', backgroundColor: '#8247E5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                Verify on Polygon
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
