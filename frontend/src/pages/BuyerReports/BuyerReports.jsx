import React from 'react';
import { TrendingUp, Package, Tag, Layers } from 'lucide-react';

export default function BuyerReports() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Procurement Reports</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>High-level insights into your buying patterns and costs.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Spent (YTD)</div>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px' }}><TrendingUp size={20} color="var(--color-green-primary)" /></div>
                    </div>
                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>₹14,50,000</div>
                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>+12% vs last year</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Volume</div>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px' }}><Package size={20} color="var(--color-green-primary)" /></div>
                    </div>
                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>42,500 kg</div>
                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>Across 15 orders</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Top Category</div>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px' }}><Layers size={20} color="var(--color-green-primary)" /></div>
                    </div>
                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>Grains</div>
                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>65% of total volume</div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg. Price Paid</div>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '10px' }}><Tag size={20} color="var(--color-green-primary)" /></div>
                    </div>
                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>₹34 / kg</div>
                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.85rem', fontWeight: 600 }}>Consistent with market rates</div>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Detailed Analytics Coming Soon</h3>
                <p style={{ color: 'var(--color-green-dark)', maxWidth: '500px', lineHeight: 1.6 }}>We are building powerful visual charts to help you track market trends and analyze your savings over time.</p>
            </div>
        </div>
    );
}
