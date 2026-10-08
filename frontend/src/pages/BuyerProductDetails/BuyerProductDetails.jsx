import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, Calendar, ShieldCheck, Heart, User, Building, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProductImage } from '../../utils/imageMapper';
import { sanitizeProduct } from '../../utils/dataCleaner';

export default function BuyerProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState('');

    const token = localStorage.getItem('fc_token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5002/api/marketplace/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.success) {
                    setProduct(sanitizeProduct(data.product));
                } else {
                    setError(data.message || "Product not found or unavailable.");
                }
            } catch (e) {
                setError("Network error fetching product details.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, token]);

    const handleAddToCart = async () => {
        if (!product || quantity <= 0) return;

        setAddingToCart(true);
        setCartSuccess('');

        try {
            const res = await fetch('http://localhost:5002/api/cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity
                })
            });
            const data = await res.json();
            if (data.success) {
                setCartSuccess('Item successfully added to your cart!');
                setTimeout(() => navigate('/cart'), 1500);
            } else {
                alert(data.message || 'Failed to add to cart.');
            }
        } catch (e) {
            alert('Failed to connect to cart system.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', color: 'var(--color-green-deep)', fontWeight: 600 }}>
                Loading product details...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ padding: '40px' }}>
                <Link to="/buyer/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                    <ArrowLeft size={20} /> Back to Marketplace
                </Link>
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '24px', borderRadius: '16px', fontWeight: 700 }}>
                    {error || "Product not found."}
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Link to="/buyer/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to Marketplace
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.5fr', gap: '32px' }}>
                {/* Left side: Image and Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ width: '100%', height: '350px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <img src={getProductImage(product.title)} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = '/images/pulses.jpg'; }} />
                        <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '12px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <Heart size={24} color="var(--color-green-medium)" />
                        </div>
                        <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'var(--color-green-primary)', color: 'white', padding: '6px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800 }}>
                            {product.category}
                        </div>
                    </div>
                </div>

                {/* Right side: Details */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2, margin: 0 }}>{product.title}</h1>
                        <ShieldCheck size={32} color="var(--color-green-primary)" style={{ flexShrink: 0 }} />
                    </div>

                    <div style={{ color: 'var(--color-green-primary)', fontSize: '2rem', fontWeight: 900, marginBottom: '24px' }}>
                        ₹{product.price} <span style={{ fontSize: '1.2rem', color: 'var(--color-green-dark)' }}>/ {product.unit}</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Produce Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Package size={20} color="var(--color-green-medium)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Available Quantity</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{product.quantity} {product.unit}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={20} color="var(--color-green-medium)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Harvest Date</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{product.harvestDate}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Building size={20} color="var(--color-green-medium)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Crop Variety</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{product.variety}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} color="var(--color-green-medium)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Farm Location</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 700 }}>{product.loc}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Description</h3>
                        <p style={{ color: 'var(--color-green-dark)', lineHeight: 1.6, fontSize: '1rem' }}>
                            {product.description}
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px dashed var(--color-green-light)', marginBottom: '32px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                            <User size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Listed By</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{product.farmer}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>Farm Size: {product.farmSize}</div>
                        </div>
                    </div>

                    {cartSuccess && (
                        <div style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700 }}>
                            {cartSuccess}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)', padding: '4px' }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-green-deep)' }}><Minus size={20} /></button>
                            <div style={{ padding: '0 24px', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-green-deep)' }}>{quantity}</div>
                            <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} style={{ padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-green-deep)' }}><Plus size={20} /></button>
                        </div>

                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-green-deep)', padding: '0 16px', minWidth: '120px' }}>
                            ₹{quantity * product.price}
                        </div>

                        <button onClick={handleAddToCart} disabled={addingToCart} style={{ flex: 1, padding: '16px', backgroundColor: 'var(--color-green-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: addingToCart ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <ShoppingCart size={20} /> {addingToCart ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
