import React from 'react';
import { ArrowLeft, Leaf, MapPin, Sun, ShieldCheck, Activity, Info, Droplets, FlaskConical, Bug, ChevronRight, CheckCircle2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function DigitalTwin() {
    const { t } = useLanguage();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px', fontFamily: 'Inter, sans-serif' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'var(--color-green-deep)' }}>
                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', border: '1px solid var(--color-green-very-light)', display: 'flex' }}>
                        <ArrowLeft size={20} />
                    </div>
                </Link>
                <div style={{ marginLeft: '16px' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--color-green-deep)' }}>{t('digital_twin_title') || 'My Digital Twin'}</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-green-dark)', fontWeight: 500 }}>{t('dt_subtitle') || "Your farm's complete digital profile"}</p>
                </div>
            </div>

            {/* Top Stats Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--color-white)', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '50%' }}>
                        <Leaf color="var(--color-green-primary)" size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('primary_crop') || 'Primary Crop'}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('wheat') || 'Wheat'}</div>
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--color-white)', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '50%' }}>
                        <MapPin color="var(--color-green-primary)" size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('farm_size') || 'Farm Size'}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('acres_5') || '5 Acres'}</div>
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--color-white)', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '50%' }}>
                        <Sun color="var(--color-green-primary)" size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('season') || 'Season'}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('kharif') || 'Kharif'}</div>
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--color-white)', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '50%' }}>
                        <ShieldCheck color="var(--color-green-primary)" size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>{t('farm_status') || 'Farm Status'}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>{t('healthy') || 'Healthy'}</div>
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '160px', backgroundColor: 'var(--color-white)', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', justifyContent: 'flex-end', paddingRight: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', fontWeight: 600 }}>Digital Twin Status</div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-green-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-green-primary)', borderRadius: '50%', display: 'inline-block' }}></span> {t('dt_active') || 'Active'}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)', gap: '24px', marginBottom: '24px' }}>
                {/* Main Visual & Connectivity Diagram */}
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, position: 'relative' }}>
                        <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_glance') || 'My Farm at a Glance'}</h2>
                        <Info size={14} color="var(--color-green-medium)" />
                    </div>

                    <div style={{ display: 'flex', flex: 1, position: 'relative', minHeight: '380px', overflow: 'hidden', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '45%', zIndex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center left' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, transparent, var(--color-white))' }}></div>
                        </div>

                        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent', zIndex: 2, paddingRight: '48px', paddingBottom: '24px' }}>
                            <div style={{ position: 'relative', width: '280px', height: '280px', marginRight: '32px' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90px', height: '90px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '50%', border: '2px solid var(--color-green-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, boxShadow: '0 8px 24px rgba(0, 107, 60, 0.1)' }}>
                                    <Leaf size={42} color="var(--color-green-primary)" />
                                </div>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', borderRadius: '50%', border: '1px dashed var(--color-green-light)', zIndex: 1 }}></div>

                                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translate(-50%, 0)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><Sun size={18} color="#D9A000" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', whiteSpace: 'nowrap' }}>{t('dt_weather') || 'Weather'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', whiteSpace: 'nowrap' }}>24°C | Clear</div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', top: '25%', left: '-20px', transform: 'translate(0, -50%)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', textAlign: 'right', whiteSpace: 'nowrap' }}>{t('dt_soil') || 'Soil'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', textAlign: 'right', whiteSpace: 'nowrap' }}>Good pH 6.5</div>
                                    </div>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><Activity size={18} color="#8D6E63" /></div>
                                </div>

                                <div style={{ position: 'absolute', top: '25%', right: '-25px', transform: 'translate(0, -50%)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><Droplets size={18} color="#29B6F6" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', whiteSpace: 'nowrap' }}>{t('dt_irrigation') || 'Irrigation'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', whiteSpace: 'nowrap' }}>Optimal</div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '25%', left: '-20px', transform: 'translate(0, 50%)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', textAlign: 'right', whiteSpace: 'nowrap' }}>{t('dt_nutrients') || 'Nutrients'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', textAlign: 'right', whiteSpace: 'nowrap' }}>Balanced</div>
                                    </div>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><FlaskConical size={18} color="var(--color-green-primary)" /></div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '25%', right: '-25px', transform: 'translate(0, 50%)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><Bug size={18} color="#66BB6A" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', whiteSpace: 'nowrap' }}>{t('dt_pest_risk') || 'Pest Risk'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', whiteSpace: 'nowrap' }}>Low</div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translate(-50%, 0)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }}>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--color-green-very-light)' }}><Heart size={18} color="var(--color-green-primary)" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-green-deep)', whiteSpace: 'nowrap' }}>{t('dt_farm_health') || 'Farm Health'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', whiteSpace: 'nowrap' }}>Excellent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: '0 0 24px', fontWeight: 800, alignSelf: 'flex-start' }}>{t('dt_health_score') || 'Farm Health Score'}</h2>

                        <div style={{ position: 'relative', width: '180px', height: '90px', overflow: 'hidden', marginBottom: '16px' }}>
                            <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '16px solid var(--color-bg-lightest)', borderTopColor: 'var(--color-green-primary)', borderRightColor: 'var(--color-green-primary)', transform: 'rotate(-45deg)', position: 'absolute', top: 0, left: 0 }}></div>
                            <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%, 0)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-green-deep)', lineHeight: 1 }}>92%</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-green-primary)', fontWeight: 700, marginTop: '2px' }}>{t('dt_excellent') || 'Excellent'}</div>
                            </div>
                        </div>

                        <div style={{ width: '100%', backgroundColor: 'var(--color-bg-lightest)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>
                                {t('dt_good_work') || 'Your farm is in excellent condition. Keep up the good work!'}
                            </div>
                            <Leaf size={28} color="var(--color-green-primary)" />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_recent_activity') || 'Recent Farm Activity'}</h2>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-green-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>{t('view_all') || 'View All'} <ChevronRight size={14} /></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '6px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}><Activity size={16} color="#8D6E63" /></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>{t('dt_soil_test') || 'Soil Test Completed'}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)' }}>18 May 2025</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '6px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}><Droplets size={16} color="#29B6F6" /></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>{t('dt_irrigation_logged') || 'Irrigation Logged'}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)' }}>17 May 2025</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '6px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}><FlaskConical size={16} color="var(--color-green-primary)" /></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>{t('dt_fert_added') || 'Fertilizer Added'}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)' }}>15 May 2025</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '6px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '8px' }}><Bug size={16} color="#66BB6A" /></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>{t('dt_pest_mon') || 'Pest Monitoring'}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)' }}>14 May 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Farm Timeline */}
            <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '24px 32px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_timeline') || 'Farm Timeline'}</h2>
                    <Info size={14} color="var(--color-green-medium)" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '24px', left: '4%', right: '4%', height: '2px', backgroundColor: 'var(--color-green-very-light)', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', top: '24px', left: '4%', width: '45%', height: '2px', backgroundColor: 'var(--color-green-primary)', zIndex: 2 }}></div>

                    {[
                        { label: t('dt_land_prep') || 'Land Preparation', date: '10 Jun', icon: <Leaf size={16} />, active: false, passed: true },
                        { label: t('dt_sowing') || 'Sowing', date: '20 Jun', icon: <Leaf size={16} />, active: false, passed: true },
                        { label: t('dt_irrigation') || 'Irrigation', date: '05 Jul', icon: <Droplets size={16} />, active: false, passed: true },
                        { label: t('dt_fert_added') || 'Fertilization', date: '20 Jul', icon: <FlaskConical size={16} />, active: false, passed: true },
                        { label: t('dt_growth') || 'Growth Stage', date: '15 Aug', icon: <Sun size={20} />, active: true, passed: false },
                        { label: t('dt_flowering') || 'Flowering', date: t('dt_upcoming') || 'Upcoming', icon: <Sun size={16} />, active: false, passed: false, future: true },
                        { label: t('dt_harvest') || 'Harvesting', date: t('dt_upcoming') || 'Upcoming', icon: <Sun size={16} />, active: false, passed: false, future: true },
                        { label: t('dt_post_harvest') || 'Post Harvest', date: t('dt_upcoming') || 'Upcoming', icon: <Sun size={16} />, active: false, passed: false, future: true }
                    ].map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3, width: '12%' }}>
                            <div style={{
                                width: step.active ? '48px' : '40px',
                                height: step.active ? '48px' : '40px',
                                backgroundColor: step.active ? 'var(--color-white)' : 'var(--color-white)',
                                border: step.active ? '2px solid var(--color-green-primary)' : step.passed ? '1.5px solid var(--color-green-primary)' : '1.5px solid var(--color-green-very-light)',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: step.active ? '0 4px 12px rgba(22, 138, 74, 0.2)' : 'none',
                                color: step.future ? 'var(--color-green-medium)' : 'var(--color-green-primary)'
                            }}>
                                {step.icon}
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: step.active ? 800 : 700, color: step.future ? 'var(--color-green-medium)' : 'var(--color-green-deep)', textAlign: 'center' }}>
                                {step.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)', fontWeight: 500, marginTop: '2px' }}>
                                {step.date}
                            </div>
                            {step.active && (
                                <div style={{ backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-primary)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 800, marginTop: '6px', border: '1px solid var(--color-green-light)' }}>
                                    {t('dt_current_stage') || 'Current Stage'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Insight Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_soil_health') || 'Soil Health'}</h2>
                        <Info size={14} color="var(--color-green-medium)" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', marginBottom: '20px' }}>Last tested: 18 May 2025</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%' }}>
                                <FlaskConical size={14} color="var(--color-green-primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>{t('dt_ph') || 'pH Level'}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>6.5</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-primary)', width: '60px', textAlign: 'right' }}>Good</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%' }}>
                                <Leaf size={14} color="var(--color-green-primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>{t('dt_om') || 'Organic Matter'}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>2.1%</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-primary)', width: '60px', textAlign: 'right' }}>Good</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%' }}>
                                <Activity size={14} color="var(--color-green-primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>{t('dt_npk') || 'NPK Ratio'}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>14 : 32 : 18</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-primary)', width: '60px', textAlign: 'right' }}>Balanced</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%' }}>
                                <Droplets size={14} color="var(--color-green-primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>{t('dt_moisture') || 'Moisture'}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-green-deep)' }}>18%</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-primary)', width: '60px', textAlign: 'right' }}>Optimal</div>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_weather_fc') || 'Weather Forecast'}</h2>
                            <Info size={14} color="var(--color-green-medium)" />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-green-deep)', backgroundColor: 'var(--color-bg-lightest)', padding: '4px 12px', borderRadius: '12px' }}>5 Days ▾</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-deep)', fontWeight: 700, marginBottom: '24px' }}>Sehore, Madhya Pradesh</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-green-very-light)', paddingTop: '16px' }}>
                        {[
                            { d: 'Today', i: <Sun size={24} color="#D9A000" />, temp: '24°C', desc: 'Clear' },
                            { d: 'Wed', i: <Droplets size={24} color="var(--color-green-medium)" />, temp: '26°C', desc: 'Cloudy' },
                            { d: 'Thu', i: <Droplets size={24} color="#29B6F6" />, temp: '23°C', desc: 'Rain' },
                            { d: 'Fri', i: <Sun size={24} color="#D9A000" />, temp: '25°C', desc: 'Clear' },
                            { d: 'Sat', i: <Droplets size={24} color="var(--color-green-medium)" />, temp: '24°C', desc: 'Cloudy' },
                        ].map((w, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-green-dark)' }}>{w.d}</div>
                                {w.i}
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-green-deep)', marginTop: '4px' }}>{w.temp}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-green-medium)' }}>{w.desc}</div>
                                {i !== 4 && <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-green-very-light)', position: 'absolute', transform: 'translateX(35px)' }}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-lightest)', borderRadius: '24px', padding: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-green-primary)', borderRadius: '50%' }}></div>
                        <h2 style={{ fontSize: '1.05rem', color: 'var(--color-green-deep)', margin: 0, fontWeight: 800 }}>{t('dt_smart_rec') || 'Smart Recommendations'}</h2>
                        <Info size={14} color="var(--color-green-medium)" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-medium)', marginBottom: '20px' }}>Based on your farm data</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <CheckCircle2 color="var(--color-green-primary)" size={16} style={{ marginTop: '2px' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-green-deep)', fontWeight: 600, lineHeight: 1.5 }}>{t('dt_rec_1')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <CheckCircle2 color="var(--color-green-primary)" size={16} style={{ marginTop: '2px' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-green-deep)', fontWeight: 600, lineHeight: 1.5 }}>{t('dt_rec_2')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <CheckCircle2 color="var(--color-green-primary)" size={16} style={{ marginTop: '2px' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-green-deep)', fontWeight: 600, lineHeight: 1.5 }}>{t('dt_rec_3')}</div>
                        </div>
                    </div>

                    <button style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '12px', color: 'var(--color-green-deep)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        {t('dt_view_all_rec') || 'View All Recommendations'}
                    </button>
                </div>
            </div>
        </div>
    );
}
