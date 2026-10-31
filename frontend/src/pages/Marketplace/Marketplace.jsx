import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Package, DollarSign, TrendingUp, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Indicative mandi prices (₹/kg) — reference only, not live data
const MANDI_PRICES = {
    wheat: { min: 21, max: 26, modal: 23, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    rice: { min: 22, max: 32, modal: 27, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    maize: { min: 17, max: 22, modal: 19, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    tomato: { min: 12, max: 35, modal: 20, source: 'Agmarknet (seasonal)', updated: 'Oct 2026' },
    onion: { min: 8, max: 22, modal: 14, source: 'Agmarknet (seasonal)', updated: 'Oct 2026' },
    potato: { min: 10, max: 18, modal: 13, source: 'Agmarknet (seasonal)', updated: 'Oct 2026' },
    soybean: { min: 38, max: 48, modal: 43, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    cotton: { min: 58, max: 72, modal: 65, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    mustard: { min: 50, max: 60, modal: 55, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
    chickpea: { min: 48, max: 58, modal: 53, source: 'Agmarknet / MSP ref', updated: 'Oct 2026' },
};

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Add product form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        quantity: '',
        price: '',
        unit: 'kg'
    });

    // Error state
    const [error, setError] = useState(null);

    const token = localStorage.getItem('fc_token');

    const fetchMyProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5002/api/products/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (e) {
            console.error("Failed to fetch products", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchMyProducts();
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const res = await fetch('http://localhost:5002/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName: formData.productName,
                    quantity: parseFloat(formData.quantity),
                    price: parseFloat(formData.price),
                    unit: formData.unit
                })
            });

            const data = await res.json();
            if (data.success) {
                setFormData({ productName: '', quantity: '', price: '', unit: 'kg' });
                setShowForm(false);
                fetchMyProducts();
            } else {
                setError(data.message || 'Failed to create listing');
            }
        } catch (e) {
            setError('Network error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            const res = await fetch(`http://localhost:5002/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
        try {
            const res = await fetch(`http://localhost:5002/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
            }
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    return (
        <div style={{ padding: '40px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', width: '100%', maxWidth: '1250px', margin: '0 auto', boxSizing: 'border-box' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Produce Listings</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage crops you are selling on the marketplace. Quantities and prices are in <strong>kg</strong> and <strong>₹/kg</strong>.</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-green-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)' }}>
                        <Plus size={20} /> Add New Listing
                    </button>
                )}
            </div>

            {error && (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700 }}>
                    {error}
                </div>
            )}

            {showForm && (
                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', marginBottom: '32px' }}>
                    <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Create Marketplace Listing</h2>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px' }}>Product/Crop Name</label>
                            <input type="text" required value={formData.productName} onChange={e => setFormData({ ...formData, productName: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none' }} placeholder="e.g. Premium Basmati Rice" />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px' }}>Available Quantity</label>
                            <input type="number" required min="1" step="0.5" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none' }} placeholder="Total amount" />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px' }}>Unit</label>
                            <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="tonnes">Tonnes (t)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px' }}>Price per kg (₹)</label>
                            <input type="number" required min="0.01" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none' }} placeholder="e.g. 23.00" />
                        </div>

                        {/* Mandi price reference panel */}
                        {(() => {
                            const key = formData.productName.toLowerCase().trim();
                            const found = Object.entries(MANDI_PRICES).find(([k]) => key.includes(k));
                            if (!found) return null;
                            const [cropKey, mp] = found;
                            return (
                                <div style={{ gridColumn: '1 / -1', backgroundColor: '#F1F8E9', borderRadius: '12px', padding: '14px 18px', border: '1px solid #C5E1A5', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <TrendingUp size={20} color="#388E3C" style={{ marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#2E7D32', fontSize: '0.9rem', marginBottom: '4px' }}>Mandi Price Reference — {cropKey.charAt(0).toUpperCase() + cropKey.slice(1)}</div>
                                        <div style={{ color: '#388E3C', fontSize: '0.85rem', fontWeight: 600 }}>Range: ₹{mp.min}–₹{mp.max}/kg &nbsp;|&nbsp; Modal: <strong>₹{mp.modal}/kg</strong></div>
                                        <div style={{ color: '#777', fontSize: '0.78rem', marginTop: '4px' }}>
                                            <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                            Reference only — not live data. Source: {mp.source}. Last updated: {mp.updated}.
                                        </div>
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, price: mp.modal }))} style={{ marginTop: '8px', padding: '5px 14px', backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: '8px', color: '#2E7D32', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                                            Use Modal Price ₹{mp.modal}/kg
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '2px solid var(--color-green-light)', borderRadius: '12px', color: 'var(--color-green-dark)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" disabled={saving} style={{ padding: '12px 32px', backgroundColor: 'var(--color-green-primary)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                                {saving ? 'Saving...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>Loading listings...</div>
            ) : products.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '64px 32px', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--color-green-medium)' }}>
                    <Package size={48} color="var(--color-green-light)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', marginBottom: '8px' }}>No Listings Found</h3>
                    <p style={{ color: 'var(--color-green-dark)', marginBottom: '0' }}>You haven't listed any produce on the marketplace yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {products.map(p => (
                        <div key={p.id} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>{p.productName}</h3>
                                <div style={{
                                    padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                                    backgroundColor: p.status === 'AVAILABLE' ? 'rgba(22, 138, 74, 0.1)' : 'rgba(0,0,0,0.05)',
                                    color: p.status === 'AVAILABLE' ? 'var(--color-green-primary)' : 'var(--color-green-dark)'
                                }}>
                                    {p.status}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', fontWeight: 600 }}>
                                    <Package size={18} color="var(--color-green-medium)" /> {p.quantity} {p.unit}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', fontWeight: 600 }}>
                                    <DollarSign size={18} color="var(--color-green-medium)" /> ₹{p.price} / {p.unit}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--color-green-very-light)', paddingTop: '16px' }}>
                                <button onClick={() => handleToggleStatus(p.id, p.status)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-dark)', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                                    {p.status === 'AVAILABLE' ? 'Hide' : 'Make Available'}
                                </button>
                                <button onClick={() => handleDelete(p.id)} style={{ padding: '10px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Listing">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
