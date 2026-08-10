import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            navigate('/dashboard');
        }
    };

    const steps = [
        { title: "01 — PROFILE", label: "Basic Profile" },
        { title: "02 — FARM", label: "Farm Details" },
        { title: "03 — CROP", label: "Primary Crop" },
        { title: "04 — PREFERENCES", label: "Preferences" }
    ];

    return (
        <div style={{ backgroundColor: 'var(--color-bg-lightest)', minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <h2 style={{ color: 'var(--color-green-deep)', fontWeight: 800 }}>Profile Setup</h2>
                <p style={{ color: 'var(--color-green-dark)' }}>Tell us about your farm to personalize insights.</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {steps.map((s, idx) => (
                    <div key={idx} style={{ flex: 1 }}>
                        <div style={{
                            height: '4px',
                            backgroundColor: idx < step ? 'var(--color-green-primary)' : 'var(--color-green-very-light)',
                            borderRadius: '2px',
                            marginBottom: '8px'
                        }} />
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: idx < step ? 'var(--color-green-deep)' : 'var(--color-green-medium)' }}>
                            {s.title}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--color-green-very-light)' }}>
                <h3 style={{ color: 'var(--color-green-dark)', marginBottom: '24px' }}>{steps[step - 1].label}</h3>
                {/* Placeholder UI for form fields */}
                <div style={{ height: '48px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '8px', marginBottom: '16px', opacity: 0.5 }}></div>
                <div style={{ height: '48px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '8px', marginBottom: '16px', opacity: 0.5 }}></div>
                <div style={{ height: '48px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '8px', opacity: 0.5 }}></div>
            </div>

            <button
                onClick={handleNext}
                style={{
                    marginTop: '32px',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-green-deep)',
                    color: 'var(--color-white)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0, 90, 50, 0.2)'
                }}
            >
                {step < 4 ? 'CONTINUE' : 'FINISH'}
            </button>
        </div>
    );
}
