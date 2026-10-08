import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShoppingCart, Plus, Minus, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductImage } from '../../utils/imageMapper';
import { sanitizeProduct } from '../../utils/dataCleaner';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerCart() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    const token = localStorage.getItem('fc_token');

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5002/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Sanitize the nested product in each cart item
                const sanitizedCart = data.cart.map(item => {
                    if (item.product) {
                        return { ...item, product: sanitizeProduct(item.product) };
                    }
                    return item;
                });
                setCartItems(sanitizedCart);
            } else {
                setError(data.message || "Failed to load cart.");
            }
        } catch (e) {
            setError("Network error fetching cart.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (id, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty <= 0) return;

        try {
            const res = await fetch(`http://localhost:5002/api/cart/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newQty })
            });
            const data = await res.json();
            if (data.success) {
                fetchCart(); // Re-fetch to get nested product expansions automatically sync'd and sanitized
            } else {
                alert(data.message || "Failed to update quantity");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating quantity.");
        }
    };

    const removeItem = async (id) => {
        try {
            const res = await fetch(`http://localhost:5002/api/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setCartItems(cartItems.filter(item => item.id !== id));
            }
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) return;
        if (!window.confirm("Are you sure you want to place this order?")) return;

        setPlacingOrder(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:5002/api/orders`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setCartItems([]);
                alert("Order placed successfully!");
                navigate('/orders');
            } else {
                setError(data.message || "Failed to place order.");
            }
        } catch (e) {
            setError("Network error placing order.");
        } finally {
            setPlacingOrder(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Link to="/buyer/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> {t('continue_shopping') || 'Continue Shopping'}
            </Link>

            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShoppingCart size={36} color="var(--color-green-primary)" /> {t('my_cart') || 'My Cart'}
                </h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.1rem', fontWeight: 500 }}>{t('cart_desc') || 'Review your selected produce before organizing contracts.'}</p>
            </div>

            {error ? (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '24px', borderRadius: '16px', fontWeight: 700 }}>
                    {error}
                </div>
            ) : loading ? (
                <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>{t('loading_cart') || 'Loading cart items...'}</div>
            ) : cartItems.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '64px 32px', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--color-green-medium)' }}>
                    <Package size={48} color="var(--color-green-light)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', marginBottom: '8px' }}>{t('cart_empty') || 'Your cart is empty'}</h3>
                    <p style={{ color: 'var(--color-green-dark)', marginBottom: '24px' }}>{t('cart_empty_desc') || 'Browse the marketplace to find high-quality verified produce.'}</p>
                    <Link to="/buyer/marketplace" style={{ padding: '12px 32px', display: 'inline-block', backgroundColor: 'var(--color-green-primary)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
                        {t('explore_marketplace') || 'Explore Marketplace'}
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 2fr) 1fr', gap: '32px' }}>
                    {/* Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={getProductImage(item.product?.productName || item.product?.title)} alt={item.product?.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>{item.product?.productName || item.product?.title}</h3>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', marginBottom: '4px' }}>{t('listed_by') || 'Listed by'}: {item.product?.farmer}</div>
                                        <div style={{ color: 'var(--color-green-primary)', fontWeight: 700 }}>₹{item.priceAtAdd} / {t(item.product?.unit?.toLowerCase()) || item.product?.unit}</div>

                                        {item.product?.status !== 'AVAILABLE' && (
                                            <div style={{ color: '#D32F2F', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>{t('currently_unavailable') || 'Currently Unavailable'}</div>
                                        )}
                                        {item.product?.status === 'AVAILABLE' && item.quantity > item.product?.quantity && (
                                            <div style={{ color: '#E65100', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>{t('only_left')?.replace('{qty}', item.product?.quantity)?.replace('{unit}', (t(item.product?.unit?.toLowerCase()) || item.product?.unit)) || `Only ${item.product?.quantity} ${item.product?.unit} left`}</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                                        <button disabled={item.product?.status !== 'AVAILABLE'} onClick={() => updateQuantity(item.id, item.quantity, -1)} style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: item.product?.status !== 'AVAILABLE' ? 'not-allowed' : 'pointer', color: 'var(--color-green-deep)', opacity: item.product?.status !== 'AVAILABLE' ? 0.4 : 1 }}><Minus size={16} /></button>
                                        <div style={{ padding: '0 12px', fontWeight: 800, color: 'var(--color-green-deep)', opacity: item.product?.status !== 'AVAILABLE' ? 0.4 : 1 }}>{item.quantity} {item.product?.unit}</div>
                                        <button disabled={item.product?.status !== 'AVAILABLE' || item.quantity >= item.product?.quantity} onClick={() => updateQuantity(item.id, item.quantity, 1)} style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: (item.product?.status !== 'AVAILABLE' || item.quantity >= item.product?.quantity) ? 'not-allowed' : 'pointer', color: 'var(--color-green-deep)', opacity: (item.product?.status !== 'AVAILABLE' || item.quantity >= item.product?.quantity) ? 0.4 : 1 }}><Plus size={16} /></button>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-green-deep)', minWidth: '100px', textAlign: 'right' }}>
                                        ₹{item.subtotal}
                                    </div>
                                    <button onClick={() => removeItem(item.id)} style={{ padding: '8px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove Item">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Totals Summary */}
                    <div style={{ alignSelf: 'start', backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', position: 'sticky', top: '24px' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0' }}>{t('order_summary') || 'Order Summary'}</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-green-dark)', fontWeight: 600 }}>
                            <span>{t('subtotal') || 'Subtotal'} ({cartItems.length} {t('items') || 'items'})</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-green-very-light)', margin: '24px 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.4rem' }}>
                            <span>{t('total_estimate') || 'Total Estimate'}</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <button
                            disabled={placingOrder || cartItems.some(i => i.product?.status !== 'AVAILABLE' || i.quantity > i.product?.quantity)}
                            onClick={placeOrder}
                            style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-green-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: placingOrder || cartItems.some(i => i.product?.status !== 'AVAILABLE' || i.quantity > i.product?.quantity) ? 'not-allowed' : 'pointer' }}>
                            {placingOrder ? (t('processing') || 'Processing...') : (t('place_order') || 'Place Order')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
