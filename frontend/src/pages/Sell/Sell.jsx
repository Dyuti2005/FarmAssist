import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Plus, Tag, TrendingUp, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Indicative mandi prices (₹/kg) — sourced from Agmarknet / eNAM data.
// ⚠ These are REFERENCE VALUES based on historical averages and are NOT live prices.
const MANDI_PRICES = {
    Wheat: { min: 21, max: 26, modal: 23, source: 'Agmarknet / MSP reference', updated: 'Oct 2026' },
    Tomato: { min: 12, max: 35, modal: 20, source: 'Agmarknet (seasonal range)', updated: 'Oct 2026' },
    Rice: { min: 22, max: 32, modal: 27, source: 'Agmarknet / MSP reference', updated: 'Oct 2026' },
    Maize: { min: 17, max: 22, modal: 19, source: 'Agmarknet / MSP reference', updated: 'Oct 2026' },
    Soybean: { min: 38, max: 48, modal: 43, source: 'Agmarknet / MSP reference', updated: 'Oct 2026' },
    Onion: { min: 8, max: 22, modal: 14, source: 'Agmarknet (seasonal range)', updated: 'Oct 2026' },
    Cotton: { min: 58, max: 72, modal: 65, source: 'Agmarknet / MSP reference', updated: 'Oct 2026' },
};

export default function Sell() {
    const { t } = useLanguage();

    // Listings already store quantities in kg and price in ₹/kg.
    // Original data was: Wheat 250 Qtl @ ₹8/Qtl → 25000 kg @ ₹0.08/kg (total ₹2000 preserved)
    // Tomato 100 Qtl @ ₹15/Qtl → 10000 kg @ ₹0.15/kg
    // However those were placeholder values. We show realistic kg-based values in the demo.
    const [mockListings, setMockListings] = useState([
        { id: 1, crop: 'Wheat', variety: 'Sharbati', quantityKg: 250, pricePerKg: 23.00, status: 'Active' },
        { id: 2, crop: 'Tomato', variety: 'Hybrid', quantityKg: 120, pricePerKg: 20.00, status: 'Sold' },
    ]);

    // New listing form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        crop: '', variety: '', quantityKg: '', pricePerKg: ''
    });
    const [showMandiInfo, setShowMandiInfo] = useState(false);

    const mandiData = MANDI_PRICES[formData.crop] || null;

    const handleAutoFill = () => {
        if (mandiData) {
            setFormData(prev => ({ ...prev, pricePerKg: mandiData.modal }));
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            crop: formData.crop,
            variety: formData.variety,
            quantityKg: parseFloat(formData.quantityKg),
            pricePerKg: parseFloat(formData.pricePerKg),
            status: 'Active'
        };
        setMockListings(prev => [newItem, ...prev]);
        setFormData({ crop: '', variety: '', quantityKg: '', pricePerKg: '' });
        setShowForm(false);
    };

    return (
        <div style={{ width: '100%', maxWidth: '1250px', margin: '0 auto', padding: '24px 24px 100px 24px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '12px', fontWeight: 600 }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back'}
                    </Link>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                        {t('sell_crop') || 'Sell Crop'}
                    </h1>
                    <p style={{ color: 'var(--color-green-medium)', fontWeight: 500, marginTop: '4px' }}>
                        {t('list_harvest') || 'Manage your market listings'}
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setShowMandiInfo(false); }}
                    style={{ backgroundColor: 'var(--color-green-primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)' }}
                >
                    <Plus size={20} /> {t('new_listing') || 'New Listing'}
                </button>
            </div>

            {/* New Listing Form */}
            {showForm && (
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', padding: '28px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h2 style={{ color: 'var(--color-green-deep)', fontWeight: 800, marginBottom: '20px', fontSize: '1.15rem' }}>
                        {t('create_listing_title') || 'Create New Listing'}
                    </h2>
                    <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                                {t('crop_name') || 'Crop Name'}
                            </label>
                            <select
                                required
                                value={formData.crop}
                                onChange={e => setFormData({ ...formData, crop: e.target.value })}
                                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none', fontSize: '0.95rem' }}
                            >
                                <option value="">-- Select Crop --</option>
                                {Object.keys(MANDI_PRICES).map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                                {t('variety') || 'Variety'}
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sharbati, Hybrid"
                                value={formData.variety}
                                onChange={e => setFormData({ ...formData, variety: e.target.value })}
                                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                                {t('quantity_kg_label') || 'Quantity (kg)'}
                            </label>
                            <input
                                type="number" required min="1" step="0.5"
                                placeholder="e.g. 5000"
                                value={formData.quantityKg}
                                onChange={e => setFormData({ ...formData, quantityKg: e.target.value })}
                                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                                {t('price_per_kg_label') || 'Price (₹/kg)'}
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="number" required min="0.01" step="0.01"
                                    placeholder="e.g. 23.00"
                                    value={formData.pricePerKg}
                                    onChange={e => setFormData({ ...formData, pricePerKg: e.target.value })}
                                    style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--color-green-light)', backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-deep)', outline: 'none', fontSize: '0.95rem' }}
                                />
                                {mandiData && (
                                    <button
                                        type="button"
                                        onClick={handleAutoFill}
                                        title="Use mandi modal price"
                                        style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--color-green-very-light)', border: 'none', color: 'var(--color-green-deep)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                    >
                                        Use ₹{mandiData.modal}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mandi price suggestion */}
                        {mandiData && (
                            <div style={{ gridColumn: '1 / -1', backgroundColor: '#F1F8E9', borderRadius: '12px', padding: '14px 18px', border: '1px solid #C5E1A5', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <TrendingUp size={20} color="#388E3C" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 800, color: '#2E7D32', fontSize: '0.9rem', marginBottom: '4px' }}>
                                        {t('mandi_price_suggestion') || 'Mandi Price Suggestion'} — {formData.crop}
                                    </div>
                                    <div style={{ color: '#388E3C', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {t('mandi_range') || 'Range'}: ₹{mandiData.min}–₹{mandiData.max}/kg &nbsp;|&nbsp;
                                        {t('mandi_modal') || 'Modal'}: <strong>₹{mandiData.modal}/kg</strong>
                                    </div>
                                    <div style={{ color: '#777', fontSize: '0.78rem', marginTop: '4px' }}>
                                        <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                        {t('mandi_source_note') || 'Reference only — not live data.'} {t('source') || 'Source'}: {mandiData.source}. {t('last_updated') || 'Last updated'}: {mandiData.updated}.
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '14px', marginTop: '8px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '11px 22px', backgroundColor: 'transparent', border: '2px solid var(--color-green-light)', borderRadius: '10px', color: 'var(--color-green-dark)', fontWeight: 700, cursor: 'pointer' }}>
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button type="submit" style={{ padding: '11px 28px', backgroundColor: 'var(--color-green-primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                {t('publish_listing') || 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listings grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {mockListings.map(item => {
                    const mandi = MANDI_PRICES[item.crop];
                    const totalValue = (item.quantityKg * item.pricePerKg).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                    return (
                        <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800 }}>{item.crop}</h3>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 500 }}>{item.variety}</div>
                                </div>
                                <span style={{ backgroundColor: item.status === 'Active' ? 'var(--color-green-very-light)' : '#E0E0E0', color: item.status === 'Active' ? 'var(--color-green-deep)' : '#666', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                    {item.status}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: 'var(--color-bg-lightest)', padding: '14px 16px', borderRadius: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                                        {t('quantity_label') || 'Quantity'}
                                    </div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.05rem' }}>
                                        {item.quantityKg.toLocaleString('en-IN')} {t('unit_kg') || 'kg'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                                        {t('price_per_kg') || 'Price / kg'}
                                    </div>
                                    <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.05rem' }}>
                                        ₹{item.pricePerKg.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Total value row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--color-green-very-light)' }}>
                                <span style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {t('total_value') || 'Total Value'}
                                </span>
                                <span style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.1rem' }}>
                                    ₹{totalValue}
                                </span>
                            </div>

                            {/* Mandi reference price */}
                            {mandi && (
                                <div style={{ backgroundColor: '#F9FBE7', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.8rem', color: '#558B2F', border: '1px solid #DCEDC8' }}>
                                    <TrendingUp size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                    <strong>{t('mandi_ref') || 'Mandi ref'}:</strong> ₹{mandi.min}–₹{mandi.max}/kg (modal ₹{mandi.modal}/kg)
                                    <div style={{ color: '#888', fontSize: '0.72rem', marginTop: '3px' }}>
                                        {mandi.source} · {mandi.updated} · {t('mandi_ref_note') || 'Not live data'}
                                    </div>
                                </div>
                            )}


                        </div>
                    );
                })}
            </div>
        </div>
    );
}
