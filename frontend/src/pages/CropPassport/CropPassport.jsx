import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sprout, MapPin, Droplets, BookOpen, Activity, Tractor, CheckCircle2, ShieldCheck, ThermometerSun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function CropPassport() {
    const { t } = useLanguage();

    const [passportData, setPassportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('fc_token');
                if (!token) return setLoading(false);

                const pRes = await fetch('http://localhost:5002/api/farmers/me', { headers: { 'Authorization': `Bearer ${token}` } });
                const cRes = await fetch('http://localhost:5002/api/crops', { headers: { 'Authorization': `Bearer ${token}` } });

                if (pRes.ok && cRes.ok) {
                    const pData = await pRes.json();
                    const cData = await cRes.json();
                    const crop = cData.length > 0 ? cData[0] : null;
                    const passportDataDb = crop?.passports?.length > 0 ? crop.passports[0] : null;

                    setPassportData({
                        rawPassport: passportDataDb,
                        crop: crop ? crop.cropName : 'Premium Sharbati Wheat',
                        variety: crop ? crop.variety : 'Sujata (HI 1530)',
                        sowingDate: crop && crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : '15 Nov 2025',
                        harvestDate: crop && crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : '10 Apr 2026',
                        location: pData.farmLocation || 'Sehore, Madhya Pradesh',
                        farmSize: pData.farmSize ? `${pData.farmSize} Acres` : '5 Acres',
                        soilCondition: pData.soilType || 'Black Cotton Soil (High Moisture)',
                        irrigation: pData.irrigationType || 'Drip Irrigation (Active)',
                        fertilizer: 'Organic Compost, DAP Base',
                        healthStatus: t('dt_excellent') || 'Excellent Growth',
                        history: [
                            { date: '15 Nov 2025', action: t('cp_lc_1_title') || 'Seeds Sown', icon: Sprout },
                            { date: '10 Dec 2025', action: t('cp_lc_2_title') || 'First Irrigation', icon: Droplets },
                            { date: '05 Jan 2026', action: t('cp_lc_3_title') || 'Organic Fertilizer Applied', icon: ShieldCheck },
                            { date: '20 Feb 2026', action: t('cp_lc_4_title') || 'Health Inspection', icon: CheckCircle2 },
                        ]
                    });
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchData();
    }, [t]);

    const [verifying, setVerifying] = useState(false);

    const handleVerify = async () => {
        if (!passportData?.rawPassport?.id) return alert("No passport record found.");
        setVerifying(true);
        try {
            const token = localStorage.getItem('fc_token');
            const res = await fetch(`http://localhost:5002/api/crop-passports/${passportData.rawPassport.id}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setPassportData(prev => ({
                    ...prev,
                    rawPassport: {
                        ...prev.rawPassport,
                        blockchainStatus: data.data.blockchainStatus,
                        blockchainTransactionHash: data.data.blockchainTransactionHash,
                        blockchainNetwork: data.data.blockchainNetwork,
                        contractAddress: data.data.contractAddress,
                        dataHash: data.data.dataHash
                    }
                }));
            } else {
                alert(data.message || "Verification failed");
            }
        } catch (e) {
            console.error(e);
            alert("Verification failed");
        }
        setVerifying(false);
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-green-deep)', fontWeight: 600 }}>Loading passport data...</div>;

    // Add stub data if no passport exists
    let DISPLAY_DATA = passportData;
    if (!passportData || !passportData.crop) {
        DISPLAY_DATA = {
            rawPassport: { blockchainStatus: 'PENDING', contractAddress: '0x...', dataHash: '...' },
            crop: 'Premium Sharbati Wheat',
            variety: 'Sujata (HI 1530)',
            sowingDate: '15 Nov 2025',
            harvestDate: '10 Apr 2026',
            location: 'Sehore, Madhya Pradesh',
            farmSize: '5 Acres',
            soilCondition: 'Black Cotton Soil (High Moisture)',
            irrigation: 'Drip Irrigation (Active)',
            fertilizer: 'Organic Compost, DAP Base',
            healthStatus: 'Excellent Growth',
            history: [
                { date: '15 Nov 2025', action: 'Seeds Sown', icon: Sprout },
                { date: '10 Dec 2025', action: 'First Irrigation', icon: Droplets },
                { date: '05 Jan 2026', action: 'Organic Fertilizer Applied', icon: ShieldCheck },
                { date: '20 Feb 2026', action: 'Health Inspection', icon: CheckCircle2 },
            ]
        };
    }

    return (
        <div style={{ padding: '20px 40px 100px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', width: '100%', maxWidth: '1250px', margin: '0 auto', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back to Dashboard'}
                    </Link>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.1rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 4px 0' }}>
                            {t('cp_title') || 'My Crop Passport'} <ShieldCheck size={26} color="var(--color-green-primary)" />
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                            {t('cp_subtitle') || 'Complete traceability and history of your primary crop.'}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) minmax(350px, 1fr)', gap: '32px', alignItems: 'start', flex: 1 }}>

                {/* Left Column (Overview & Profile) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Section 1: Overview */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                <Sprout size={24} color="var(--color-green-primary)" />
                            </div>
                            <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_overview') || 'Crop Overview'}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('crop') || 'Crop Name'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DISPLAY_DATA.crop}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_variety') || 'Crop Variety'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DISPLAY_DATA.variety}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_planted') || 'Sowing Date'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DISPLAY_DATA.sowingDate}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('cp_harvested') || 'Expected Harvest Date'}</div>
                                <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{DISPLAY_DATA.harvestDate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Farm & Soil Profile */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                <MapPin size={24} color="var(--color-green-primary)" />
                            </div>
                            <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_farming_prac') || 'Farming Practices'}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-bg-lightest)', paddingBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tractor size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('location') || 'Location'} & {t('farm_size') || 'Size'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DISPLAY_DATA.location} • {DISPLAY_DATA.farmSize}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-bg-lightest)', paddingBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThermometerSun size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('dt_soil') || 'Soil Condition'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DISPLAY_DATA.soilCondition}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={18} color="var(--color-green-primary)" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700 }}>{t('dt_irrigation') || 'Irrigation'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 800 }}>{DISPLAY_DATA.irrigation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (History) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Section 3: Health & Timeline */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--color-green-very-light)', padding: '10px', borderRadius: '12px' }}>
                                    <Activity size={24} color="var(--color-green-primary)" />
                                </div>
                                <h2 style={{ margin: 0, color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800 }}>{t('cp_lifecycle') || 'Crop Lifecycle'}</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ backgroundColor: DISPLAY_DATA.rawPassport?.blockchainStatus === 'VERIFIED' ? '#E6F4E1' : '#FFF0E6', color: DISPLAY_DATA.rawPassport?.blockchainStatus === 'VERIFIED' ? '#168A4A' : '#D97706', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                                    Blockchain: {DISPLAY_DATA.rawPassport?.blockchainStatus || 'PENDING'}
                                </span>
                                {DISPLAY_DATA.rawPassport?.blockchainStatus !== 'VERIFIED' && (
                                    <button onClick={handleVerify} disabled={verifying} style={{ backgroundColor: 'var(--color-green-primary)', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', cursor: verifying ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: verifying ? 0.7 : 1 }}>
                                        {verifying ? 'Verifying...' : 'Verify on Blockchain'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '20px', marginTop: '16px' }}>
                            {/* Timeline line */}
                            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '20px', width: '2px', backgroundColor: 'var(--color-green-very-light)' }}></div>

                            {DISPLAY_DATA.history.map((record, index) => (
                                <div key={index} style={{ position: 'relative', display: 'flex', gap: '20px', marginBottom: index === DISPLAY_DATA.history.length - 1 ? 0 : '32px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, marginLeft: '-13px', marginTop: '4px', boxShadow: '0 0 0 4px var(--color-white)' }}>
                                        <record.icon size={14} color="white" />
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '12px' }}>
                                        <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{record.date}</div>
                                        <div style={{ color: 'var(--color-green-deep)', fontSize: '1rem', fontWeight: 700 }}>{record.action}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {DISPLAY_DATA.rawPassport?.blockchainStatus === 'VERIFIED' && (
                            <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', border: '1px solid var(--color-green-very-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <ShieldCheck size={20} color="var(--color-green-primary)" />
                                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-green-deep)', fontWeight: 800 }}>Blockchain Evidence</h3>
                                </div>
                                <div style={{ display: 'grid', gap: '12px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-green-medium)', fontWeight: 700 }}>Network:</span>
                                        <span style={{ color: 'var(--color-green-deep)', fontWeight: 800 }}>{DISPLAY_DATA.rawPassport.blockchainNetwork || 'Polygon Amoy'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-green-medium)', fontWeight: 700 }}>Contract:</span>
                                        <span style={{ color: 'var(--color-green-deep)', fontWeight: 800 }}>{DISPLAY_DATA.rawPassport.contractAddress}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-green-medium)', fontWeight: 700 }}>Data Hash:</span>
                                        <span style={{ color: 'var(--color-green-deep)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DISPLAY_DATA.rawPassport.dataHash}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-green-medium)', fontWeight: 700 }}>Transaction:</span>
                                        <a href={`https://amoy.polygonscan.com/tx/${DISPLAY_DATA.rawPassport.blockchainTransactionHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-green-primary)', fontWeight: 800, textDecoration: 'underline', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {DISPLAY_DATA.rawPassport.blockchainTransactionHash}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
