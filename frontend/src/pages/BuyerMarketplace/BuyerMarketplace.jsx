import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, MapPin, Package, SlidersHorizontal, ShieldCheck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../../utils/imageMapper';
import { sanitizeProductsList } from '../../utils/dataCleaner';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerMarketplace() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Grains', 'Pulses', 'Spices', 'Oilseeds', 'Fruits & Veg'];

    useEffect(() => {
        const fetchMarketplace = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('fc_token');
                // Dynamically build URL with search parameters
                let url = `http://localhost:5002/api/marketplace?category=${encodeURIComponent(category)}`;
                if (search.trim()) {
                    url += `&search=${encodeURIComponent(search.trim())}`;
                }

                const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await res.json();
                if (data.success) {
                    setProducts(sanitizeProductsList(data.products));
                }
            } catch (e) {
                console.error("Fetch marketplace failed:", e);
            } finally {
                setLoading(false);
            }
        };

        // Add a slight debounce behavior to prevent over-fetching while typing
        const debounce = setTimeout(() => {
            fetchMarketplace();
        }, 300);
        return () => clearTimeout(debounce);
    }, [search, category]);

    const filtered = products;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('browse_produce') || 'Browse Produce'}</h1>
                    <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>{t('browse_produce_desc') || 'Discover quality agricultural produce direct from farmers.'}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-white)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Search color="var(--color-green-medium)" size={20} />
                    <input
                        type="text"
                        placeholder={t('search_produce_placeholder') || 'Search for wheat, rice, spices...'}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '0.95rem', color: 'var(--color-green-deep)' }}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px', color: 'var(--color-green-dark)', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <SlidersHorizontal size={18} /> {t('filters') || 'Filters'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setCategory(c)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: category === c ? 'none' : '1px solid var(--color-green-very-light)',
                            backgroundColor: category === c ? 'var(--color-green-primary)' : 'var(--color-white)',
                            color: category === c ? 'var(--color-white)' : 'var(--color-green-dark)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}>
                        {t(`cat_${c.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`) || c}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {loading ? <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>{t('loading_marketplace') || 'Loading marketplace...'}</div> :
                    filtered.length === 0 ? <div style={{ color: 'var(--color-green-dark)' }}>{t('no_marketplace_products') || 'No products found matching your active filters.'}</div> :
                        filtered.map(item => (
                            <div key={item.id} style={{ border: '1px solid var(--color-green-very-light)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', transition: 'transform 0.2s' }}>
                                <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                                    <img src={getProductImage(item.title)} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = '/images/pulses.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--color-green-primary)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                                        {t('grade') || 'Grade'}: {item.grade ? (t(`grade_${item.grade.toLowerCase()}`) || item.grade) : '-'}
                                    </div>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <Heart size={18} color="var(--color-green-medium)" />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>{item.category ? (t(`cat_${item.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`) || item.category) : '-'}</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.3 }}>{item.title}</div>
                                        {item.verified && <ShieldCheck size={18} color="var(--color-green-primary)" style={{ flexShrink: 0 }} title={t('verified_produce') || "Verified Produce"} />}
                                    </div>
                                    <div style={{ color: 'var(--color-green-primary)', fontWeight: 900, fontSize: '1.3rem', marginBottom: '16px' }}>{item.price}</div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '12px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                            <Package size={16} color="var(--color-green-medium)" /> {item.qty} {t('available') || 'available'}
                                        </div>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                            <MapPin size={16} color="var(--color-green-medium)" /> {item.loc}
                                        </div>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-green-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>F</div>
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.farmer}</span>
                                        </div>
                                        <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                            <Calendar size={16} color="var(--color-green-medium)" /> {t('harvest') || 'Harvest'}: {item.harvestDate}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link to={`/buyer/marketplace/${item.id}`} style={{ flex: 1, textAlign: 'center', backgroundColor: 'var(--color-white)', color: 'var(--color-green-deep)', padding: '10px', borderRadius: '10px', border: '2px solid var(--color-green-very-light)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s', textDecoration: 'none' }}>
                                        {t('view_details') || 'View Details'}
                                    </Link>
                                    <button style={{ flex: 1, textAlign: 'center', backgroundColor: 'var(--color-green-deep)', color: 'var(--color-white)', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                                        {t('buy_now') || 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
            </div>
        </div >
    );
}
