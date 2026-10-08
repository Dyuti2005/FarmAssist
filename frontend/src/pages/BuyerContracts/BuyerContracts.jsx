import React, { useState } from 'react';
import { FileText, MapPin, Calendar, ExternalLink, ShieldCheck, ArrowLeft, Download, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BuyerContracts() {
    const { t } = useLanguage();
    const [selectedContract, setSelectedContract] = useState(null);

    // STATIC STATE: Replace with real API data when backend supports /api/contracts
    const mockContracts = [
        {
            id: 'CT-2026-9042',
            product: 'Premium Sharbati Wheat',
            quantity: '500 Quintals',
            farmer: 'Ramesh Singh',
            location: 'Vidisha, MP',
            startDate: '2026-08-10',
            endDate: '2026-11-10',
            status: 'ACTIVE',
            pricePerUnit: '₹2,100',
            totalValue: '₹10,50,000',
            terms: 'Payment terms: 30% advance, 70% upon delivery and quality inspection. Moisture content must be <12%. Delivery to nearest APMC yard or designated warehouse.',
            progress: 60
        },
        {
            id: 'CT-2026-8812',
            product: 'Basmati Rice (Export Grade)',
            quantity: '300 Quintals',
            farmer: 'Anil Kumar',
            location: 'Karnal, Haryana',
            startDate: '2026-07-15',
            endDate: '2026-10-15',
            status: 'PENDING_SIGNATURE',
            pricePerUnit: '₹4,500',
            totalValue: '₹13,50,000',
            terms: 'Payment terms: 50% advance, 50% upon delivery. Strict quality grading required for export variant.',
            progress: 10
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return { bg: '#E6F4E1', color: '#168A4A', label: 'Active', icon: <CheckCircle size={16} /> };
            case 'PENDING_SIGNATURE': return { bg: '#FFF3E0', color: '#E65100', label: 'Pending Signature', icon: <Clock size={16} /> };
            case 'COMPLETED': return { bg: '#E3F2FD', color: '#1565C0', label: 'Completed', icon: <CheckCircle size={16} /> };
            default: return { bg: '#F3F4F6', color: '#374151', label: status, icon: null };
        }
    };

    const handleDownloadPDF = (contract) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(22, 138, 74); // Green color
        doc.text("AGRICULTURAL PRODUCE PURCHASE AGREEMENT", pageWidth / 2, 20, { align: "center" });

        // Subtext
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 26, { align: "center" });

        doc.setDocumentProperties({
            title: `Contract_${contract.id}`,
        });

        // Agreement Meta
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Agreement Number: ${contract.id}`, 14, 40);
        doc.text(`Date of Agreement: ${contract.startDate}`, 14, 46);

        // Main Sections
        let currentY = 56;

        // Buyer & Farmer details table
        autoTable(doc, {
            startY: currentY,
            head: [['Buyer Details', 'Farmer/Supplier Details']],
            body: [
                ['FarmChain Registered Buyer', contract.farmer],
                ['Authorized Representative', `Location: ${contract.location}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [22, 138, 74] }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Product Specifications
        doc.setFont("helvetica", "bold");
        doc.text("Product Specifications", 14, currentY);
        currentY += 6;

        autoTable(doc, {
            startY: currentY,
            head: [['Product', 'Quantity', 'Price per Unit', 'Total Contract Value']],
            body: [
                [contract.product, contract.quantity, contract.pricePerUnit, contract.totalValue]
            ],
            theme: 'grid',
            headStyles: { fillColor: [22, 138, 74] }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Terms and Conditions Section
        doc.setFont("helvetica", "bold");
        doc.text("Terms & Conditions", 14, currentY);
        doc.setFont("helvetica", "normal");

        const contractTerms = [
            `1. Contract Period: ${contract.startDate} to ${contract.endDate}`,
            "2. Delivery Terms: Delivery to nearest APMC yard or designated warehouse as strictly agreed.",
            `3. Payment Terms: ${contract.terms}`,
            "4. Quality Specifications: Must strictly adhere to the grading standards agreed.",
            "5. Inspection / Acceptance: The buyer reserves the right to inspect the quality before finalizing the handover.",
            "6. Cancellation / Termination: Either party may terminate if a fundamental breach is committed.",
            "7. Dispute Resolution: Arbitration under jurisdiction of the platform's governing laws.",
            "8. General Terms: This digital smart-contract framework is legally binding on the platform."
        ];

        doc.setFontSize(10);
        currentY += 8;

        contractTerms.forEach(term => {
            const lines = doc.splitTextToSize(term, pageWidth - 28);
            if (currentY + (lines.length * 5) > 280) {
                doc.addPage();
                currentY = 20;
            }
            doc.text(lines, 14, currentY);
            currentY += (lines.length * 5) + 3;
        });

        // Signatures
        currentY += 15;
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.text("Signatures", 14, currentY);

        currentY += 15;
        doc.setLineWidth(0.5);

        // Buyer Sign Line
        doc.line(14, currentY, 80, currentY);
        // Farmer Sign Line
        doc.line(120, currentY, 186, currentY);

        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.text("Authorized Buyer Signature", 14, currentY);
        doc.text("Farmer/Supplier Signature", 120, currentY);

        currentY += 8;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, currentY);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, currentY);

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 285, { align: 'right' });
            doc.text("Confidential - FarmChain Assist Digital Contracts", pageWidth / 2, 285, { align: 'center' });
        }

        // Save
        doc.save(`FarmChain_Agreement_${contract.id}.pdf`);
    };

    if (selectedContract) {
        const s = getStatusStyle(selectedContract.status);
        return (
            <div style={{ paddingBottom: '40px' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setSelectedContract(null)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={20} color="var(--color-green-deep)" />
                    </button>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {t('contract_specs') || 'Contract Specs'}
                            <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {s.icon} {t(`status_${s.label.toLowerCase().replace(/ /g, '_')}`) || s.label}
                            </span>
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0 }}>{t('reviewing_agreement') || 'Reviewing agreement'} {selectedContract.id}</p>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid var(--color-green-very-light)', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{selectedContract.product}</h2>
                            <div style={{ color: 'var(--color-green-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={18} color="var(--color-green-primary)" /> {t('verified_agreement') || 'Verified Framework Agreement'}
                            </div>
                        </div>
                        <button onClick={() => handleDownloadPDF(selectedContract)} style={{ padding: '10px 20px', backgroundColor: 'var(--color-green-very-light)', border: 'none', borderRadius: '12px', color: 'var(--color-green-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Download size={18} /> {t('download_pdf') || 'Download PDF'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>{t('partner_entity') || 'Partner Entity'}</div>
                            <div style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{selectedContract.farmer}</div>
                            <div style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><MapPin size={16} /> {selectedContract.location}</div>
                        </div>
                        <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>{t('commitment') || 'Commitment'}</div>
                            <div style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{selectedContract.quantity}</div>
                            <div style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', fontWeight: 600 }}>{t('period') || 'Period'}: {selectedContract.startDate} {t('to') || 'to'} {selectedContract.endDate}</div>
                        </div>
                        <div style={{ backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>{t('financials') || 'Financials'}</div>
                            <div style={{ color: 'var(--color-green-deep)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{selectedContract.totalValue}</div>
                            <div style={{ color: 'var(--color-green-dark)', fontSize: '0.95rem', fontWeight: 600 }}>{selectedContract.pricePerUnit} / {t('quintal') || 'Quintal'}</div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-very-light)', borderRadius: '16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>{t('terms_conditions') || 'Terms & Conditions'}</h3>
                        <p style={{ color: 'var(--color-green-dark)', lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}>
                            {selectedContract.terms}
                        </p>
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                        {selectedContract.status === 'PENDING_SIGNATURE' && (
                            <button onClick={() => alert('Agreement signed successfully!')} style={{ padding: '12px 24px', backgroundColor: 'var(--color-green-primary)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}>
                                {t('sign_agreement') || 'Sign Agreement'}
                            </button>
                        )}
                        <button onClick={() => setSelectedContract(null)} style={{ padding: '12px 24px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-green-medium)', borderRadius: '12px', color: 'var(--color-green-deep)', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}>
                            {t('close') || 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_contracts') || 'My Contracts'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Manage your long-term farming agreements and procurements.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {mockContracts.map(contract => {
                    const s = getStatusStyle(contract.status);
                    return (
                        <div key={contract.id} style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{ color: 'var(--color-green-deep)', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{contract.product}</h3>
                                        <div style={{ backgroundColor: s.bg, color: s.color, padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {s.icon} {t(`status_${s.label.toLowerCase().replace(/ /g, '_')}`) || s.label}
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--color-green-dark)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                        <FileText size={16} /> {t('contract_id') || 'Contract ID'}: {contract.id}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedContract(contract)} style={{ padding: '8px 16px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '10px', color: 'var(--color-green-deep)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {t('view_agreement') || 'View Agreement'} <ExternalLink size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', backgroundColor: 'var(--color-bg-lightest)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-green-very-light)' }}>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{t('target_quantity') || 'Target Quantity'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{contract.quantity}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{t('partner_farmer') || 'Partner Farmer'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800 }}>{contract.farmer}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{t('location') || 'Location'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} color="var(--color-green-primary)" /> {contract.location}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{t('period') || 'Period'}</div>
                                    <div style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={16} color="var(--color-green-primary)" /> {contract.startDate}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
