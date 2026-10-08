import React from 'react';
import { TrendingUp, Package, Tag, Layers, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerReports() {
    const { t } = useLanguage();

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_reports') || 'Procurement Reports'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>High-level insights into your buying patterns and costs.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="var(--color-green-primary)" />
                        </div>
                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Total Orders</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-green-deep)' }}>124</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={20} color="var(--color-green-primary)" />
                        </div>
                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Total Spent</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-green-deep)' }}>₹8.4L</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={20} color="var(--color-green-primary)" />
                        </div>
                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Completed</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-green-deep)' }}>118</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Layers size={20} color="var(--color-green-primary)" />
                        </div>
                        <div style={{ color: 'var(--color-green-dark)', fontWeight: 600 }}>Active Contracts</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-green-deep)' }}>6</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>Spending Overview (Yearly)</h3>
                    {/* Placeholder for Chart */}
                    <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '20px', borderBottom: '1px solid var(--color-green-very-light)', borderLeft: '1px solid var(--color-green-very-light)', paddingLeft: '8px' }}>
                        {[40, 60, 30, 80, 50, 90, 70, 110, 85, 120, 60, 95].map((height, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'var(--color-green-primary)', height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} title={`Month ${i + 1}`}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600 }}>
                        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>Top Commodities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { name: 'Sharbati Wheat', pct: 45 },
                            { name: 'Basmati Rice', pct: 25 },
                            { name: 'Organic Tomato', pct: 15 },
                            { name: 'Cotton', pct: 15 }
                        ].map((item, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-green-deep)', fontWeight: 600 }}>
                                    <span>{item.name}</span>
                                    <span>{item.pct}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: 'var(--color-green-primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
