import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { speakText, normalizeToDigits } from '../../services/voice/speechService';
import { useVoiceInput } from '../../hooks/useVoiceInput';

export default function VoiceGuidedInput({ steps, onComplete, onCancel }) {
    const { lang, t } = useLanguage();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [recognizedText, setRecognizedText] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    const { isListening, error, startListening, stopListening } = useVoiceInput();

    const activeStep = steps[currentStepIndex];

    const getRecLang = () => {
        if (lang === 'kn') return 'kn-IN';
        if (lang === 'hi') return 'hi-IN';
        return 'en-IN';
    };

    const speakPrompt = (text, callback) => {
        speakText(text, getRecLang(), callback);
    };

    const handleStartStep = () => {
        setValidationError("");
        setRecognizedText("");
        setIsPrompting(true);
        speakPrompt(t(activeStep.promptKey), () => {
            setIsPrompting(false);
            startListening(
                (finalTranscript, interimTranscript) => {
                    const combined = (finalTranscript + ' ' + interimTranscript).trim();
                    if (combined) {
                        setRecognizedText(combined);
                    }
                },
                null,
                (completeTranscript) => {
                    if (completeTranscript) {
                        setRecognizedText(completeTranscript);
                    }
                }
            );
        });
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            handleStartStep();
        }
    };

    useEffect(() => {
        handleStartStep();
        return () => {
            stopListening();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, [currentStepIndex, lang]);

    const handleConfirm = () => {
        let finalValue = recognizedText;

        if (activeStep.promptKey === 'tts_ask_mobile' || activeStep.promptKey === 'tts_ask_phone') {
            const digits = normalizeToDigits(recognizedText);

            // Extract the last 10 digits if more exist, or exactly 10.
            // Often people say +91 or zero before it.
            let validMobile = digits;
            if (validMobile.length > 10 && validMobile.startsWith('91')) {
                validMobile = validMobile.slice(-10);
            }
            if (validMobile.length > 10 && validMobile.startsWith('0')) {
                validMobile = validMobile.slice(-10);
            }

            if (validMobile.length !== 10) {
                setValidationError(t('err_mobile_incomplete') || "I may not have heard exactly 10 digits. Please speak again clearly.");
                return;
            }

            finalValue = validMobile; // Ensure form saves exactly 10 pure digits
        }

        setValidationError("");
        activeStep.onFill(finalValue);

        if (currentStepIndex < steps.length - 1) {
            setRecognizedText("");
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const pulseStyle = isListening ? {
        animation: 'pulse 1.5s infinite',
        boxShadow: '0 0 0 0 rgba(65, 171, 93, 0.7)'
    } : {};

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(247, 252, 245, 0.98)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <button onClick={onCancel} style={{ position: 'absolute', top: '24px', right: '24px', padding: '8px', color: 'var(--color-green-dark)' }}>
                <X size={32} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: 'var(--color-green-deep)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                    {t(activeStep.promptKey)}
                </h2>
                <p style={{ color: 'var(--color-green-medium)' }}>
                    {currentStepIndex + 1} / {steps.length}
                </p>
            </div>

            <div
                onClick={toggleListening}
                style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: isListening ? 'var(--color-green-primary)' : 'var(--color-white)',
                    border: `4px solid ${isListening ? 'var(--color-green-primary)' : 'var(--color-green-light)'}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...pulseStyle
                }}
            >
                <Mic size={48} color={isListening ? 'var(--color-white)' : 'var(--color-green-primary)'} />
            </div>

            {isPrompting && (
                <div style={{ color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '24px', textAlign: 'center' }}>
                    Assistant is speaking...
                </div>
            )}

            {isListening && (
                <div style={{ color: 'var(--color-green-primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '24px', textAlign: 'center' }}>
                    {t('listening') || 'Listening...'}
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-green-dark)', marginTop: '4px' }}>
                        Speak now...
                    </div>
                </div>
            )}

            {isListening && recognizedText && (
                <div style={{ backgroundColor: 'var(--color-white)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-green-light)', fontStyle: 'italic', color: 'var(--color-green-medium)', marginBottom: '16px' }}>
                    "{recognizedText}"
                </div>
            )}

            {error && !isListening && !recognizedText && (
                <div style={{ color: '#D32F2F', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={24} />
                    <p>{error}</p>
                    <button onClick={handleStartStep} style={{ color: 'var(--color-green-deep)', fontWeight: 700, marginTop: '8px', padding: '8px 16px', backgroundColor: 'var(--color-green-very-light)', borderRadius: '8px' }}>
                        {t('speak_again')}
                    </button>
                </div>
            )}

            {validationError && (
                <div style={{ color: '#D32F2F', textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
                    {validationError}
                </div>
            )}

            {recognizedText && !isListening && (
                <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 90, 50, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('you_said')}</p>
                    <input
                        type="text"
                        value={recognizedText}
                        onChange={(e) => setRecognizedText(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: 'var(--color-green-deep)',
                            border: '2px solid var(--color-green-primary)',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            textAlign: 'center',
                            backgroundColor: 'var(--color-bg-lightest)'
                        }}
                    />

                    <p style={{ color: 'var(--color-green-dark)', fontWeight: 600, marginBottom: '24px' }}>
                        Is this correct?
                    </p>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            type="button"
                            onClick={handleStartStep}
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--color-green-primary)', backgroundColor: 'transparent', color: 'var(--color-green-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.9rem' }}
                        >
                            <RefreshCw size={18} /> {t('speak_again')}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', backgroundColor: 'var(--color-green-deep)', border: 'none', color: 'var(--color-white)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.9rem' }}
                        >
                            <Check size={18} /> {t('correct')}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(65, 171, 93, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(65, 171, 93, 0); }
          100% { box-shadow: 0 0 0 0 rgba(65, 171, 93, 0); }
        }
      `}</style>
        </div>
    );
}
