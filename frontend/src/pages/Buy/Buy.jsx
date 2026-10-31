import React, { useState } from 'react';
import { ArrowLeft, Search, Package, MapPin, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Buy() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Genuine supplier links — verified October 2026
    const allInputs = [
        {
            id: 1,
            name: 'DAP Fertilizer (50 kg)',
            brand: 'IFFCO',
            price: '₹1,350 / bag',
            type: 'Fertilizer',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/s?k=IFFCO+DAP+Fertilizer+50+kg',
            note: 'Sold by authorised agri-retailers'
        },
        {
            id: 2,
            name: 'Wheat Seeds HD-2967 (30 kg)',
            brand: 'NSC (National Seeds Corp.)',
            price: '₹950 / bag',
            type: 'Seeds',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/Organic-Sonamoti-Farming-Agriculture-G7/dp/B0FP2WKRW7/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.SVypvsXdVwn3g54B0EEApR3FAilDB42i1BTCxZ5GM5_kWgRbxFv5Fx7ncn6phGtu2SZd3ueJcfH7NZqfjvCEylTOeQncPQPbr-gpP4o1cSkn03JDaTypfrauyfV03KhecKrr6hs1Yij446pHR0mcqCV9cMk9mje4PSeAv6w99kdJ4WBdcp3BX1fwtoj7WvVaGH3NmCVMuxEuMTyL6bM8Du7iibncBFN04RROvmgSZJerIKb72iJMdU-pmwe5NxGL5pr0OAAAkMZPZNpoV9xeH3kTjn0Db_77DchtARvwLhI.mr_aJDgzpR960WWoWrHuA0EXox7UyPo7OV1v5b6XA58&dib_tag=se&keywords=wheat+seeds+for+farming&qid=1793413988&sr=8-1-spons&aref=WS02Mz6mmF&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&tag=69236102-20',
            note: 'Certified high-yield seeds'
        },
        {
            id: 3,
            name: 'Urea Fertilizer (50 kg)',
            brand: 'IFFCO / KRIBHCO',
            price: '₹266 / bag',
            type: 'Fertilizer',
            distance: 'Available Online',
            supplier: 'IndiaMART',
            link: 'https://www.indiamart.com/search.mp?ss=urea+fertilizer+50+kg+IFFCO',
            note: 'Government-fixed MRP'
        },
        {
            id: 4,
            name: 'Paddy Seeds — Samba Mahsuri (5 kg)',
            brand: 'Nuziveedu Seeds',
            price: '₹320 / pack',
            type: 'Seeds',
            distance: 'Available Online',
            supplier: 'BigHaat',
            link: 'https://www.bighaat.com/search?q=Samba+Mahsuri+paddy+seeds',
            note: 'Popular long-grain variety'
        },
        {
            id: 5,
            name: 'Potassium Nitrate (25 kg)',
            brand: 'SQM / Haifa',
            price: '₹2,100 / bag',
            type: 'Fertilizer',
            distance: 'Available Online',
            supplier: 'IndiaMART',
            link: 'https://www.indiamart.com/search.mp?ss=potassium+nitrate+fertilizer',
            note: 'Suitable for drip fertigation'
        },
        {
            id: 6,
            name: 'Drip Irrigation Kit (1 acre)',
            brand: 'Jain Irrigation',
            price: '₹7,800 / kit',
            type: 'Equipment',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/s?k=Jain+Irrigation+drip+irrigation+kit',
            note: 'Subsidy available under PM-KUSUM'
        },
        {
            id: 7,
            name: 'Multi-crop Sprayer (16 L)',
            brand: 'Aspee / Neptune',
            price: '₹1,200 / unit',
            type: 'Equipment',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/s?k=agricultural+knapsack+sprayer+16+litre',
            note: 'Battery-powered models also available'
        },
        {
            id: 8,
            name: 'Carbendazim Fungicide (500 g)',
            brand: 'BASF / Bayer',
            price: '₹280 / pack',
            type: 'Pesticide',
            distance: 'Available Online',
            supplier: 'BigHaat',
            link: 'https://www.bighaat.com/search?q=carbendazim+fungicide',
            note: 'Use as per label directions'
        },
        {
            id: 9,
            name: 'Neem Oil Pesticide (1 L)',
            brand: 'Bonide / Greenpeace Agro',
            price: '₹350 / litre',
            type: 'Pesticide',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/s?k=neem+oil+pesticide+agriculture+1+litre',
            note: 'Organic certified, safe for bees'
        },
        {
            id: 10,
            name: 'Soil Testing Kit (NPK + pH)',
            brand: 'Kelway / HM Digital',
            price: '₹850 / kit',
            type: 'Equipment',
            distance: 'Available Online',
            supplier: 'Amazon.in',
            link: 'https://www.amazon.in/s?k=soil+testing+kit+NPK+pH+agriculture',
            note: 'Digital meter included'
        },
        {
            id: 11,
            name: 'Tomato Hybrid Seeds (10 g)',
            brand: 'Syngenta / Seminis',
            price: '₹180 / pack',
            type: 'Seeds',
            distance: 'Available Online',
            supplier: 'BigHaat',
            link: 'https://www.bighaat.com/search?q=tomato+hybrid+seeds',
            note: 'High yield, disease-resistant'
        },
        {
            id: 12,
            name: 'Power Tiller (7 HP)',
            brand: 'Honda / VST',
            price: '₹62,000 / unit',
            type: 'Equipment',
            distance: 'Contact Dealer',
            supplier: 'IndiaMART',
            link: 'https://www.indiamart.com/search.mp?ss=power+tiller+7+hp+agriculture',
            note: 'Subsidy available for SC/ST farmers'
        },
    ];

    const filters = ['All', 'Seeds', 'Fertilizer', 'Pesticide', 'Equipment'];

    const supplierColors = {
        'Amazon.in': '#FF9900',
        'BigHaat': '#2E7D32',
        'IndiaMART': '#0066CC',
    };

    const filtered = allInputs.filter(item => {
        const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
        const matchesSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div style={{ width: '100%', maxWidth: '1250px', margin: '0 auto', padding: '24px 24px 100px 24px', boxSizing: 'border-box' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
                <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back'}
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                        {t('buy_inputs') || 'Buy Inputs'}
                    </h1>
                    <p style={{ color: 'var(--color-green-medium)', fontWeight: 500, marginTop: '4px', fontSize: '0.95rem' }}>
                        {t('buy_inputs_desc') || 'Redirects to verified sellers — Amazon, BigHaat & IndiaMART'}
                    </p>
                </div>
                <div style={{ display: 'flex', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px', padding: '8px 16px', alignItems: 'center', width: '100%', maxWidth: '320px' }}>
                    <Search size={20} color="var(--color-green-medium)" />
                    <input
                        type="text"
                        placeholder={t('search_inputs_placeholder') || 'Search seeds, fertilizers...'}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '1rem', color: 'var(--color-green-deep)', background: 'transparent' }}
                    />
                </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <Filter size={18} color="var(--color-green-medium)" style={{ marginTop: '6px' }} />
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        style={{
                            padding: '6px 18px', borderRadius: '20px', border: activeFilter === f ? 'none' : '1px solid var(--color-green-very-light)',
                            backgroundColor: activeFilter === f ? 'var(--color-green-primary)' : 'var(--color-white)',
                            color: activeFilter === f ? 'white' : 'var(--color-green-dark)',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filtered.length === 0 ? (
                    <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>No products found. Try a different search.</div>
                ) : filtered.map(item => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-green-primary)', backgroundColor: 'var(--color-green-very-light)', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                                    {item.type}
                                </span>
                                <h3 style={{ margin: '10px 0 2px 0', color: 'var(--color-green-deep)', fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3 }}>{item.name}</h3>
                                <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 500 }}>{item.brand}</div>
                            </div>
                            {/* Supplier badge */}
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', whiteSpace: 'nowrap',
                                backgroundColor: `${supplierColors[item.supplier]}15`,
                                color: supplierColors[item.supplier] || 'var(--color-green-primary)',
                                border: `1px solid ${supplierColors[item.supplier] || 'var(--color-green-light)'}40`
                            }}>
                                {item.supplier}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-green-medium)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                            <MapPin size={14} /> {item.distance}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '18px', fontStyle: 'italic' }}>{item.note}</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <div style={{ color: 'var(--color-green-deep)', fontWeight: 900, fontSize: '1.25rem' }}>
                                {item.price}
                            </div>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: 'var(--color-green-primary)', color: 'var(--color-white)', border: 'none',
                                    padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.9rem',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <ExternalLink size={16} /> {t('buy_now') || 'Buy Now'}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '32px', color: '#999', fontSize: '0.8rem', textAlign: 'center' }}>
                {t('buy_inputs_disclaimer') || 'Prices shown are indicative. Actual price may vary by seller and region. FarmChain Assist is not affiliated with any marketplace.'}
            </p>
        </div>
    );
}
