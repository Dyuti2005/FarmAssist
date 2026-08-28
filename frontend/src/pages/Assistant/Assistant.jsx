import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Send, Mic, MicOff, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceInput } from '../../hooks/useVoiceInput';

const INITIAL_MESSAGES = [
    { sender: 'assistant', text: "Hello! I'm your Farm AI Assistant. I can see you're growing Wheat in Sehore. How can I help you today?", time: "09:00 AM" },
    { sender: 'farmer', text: "When is the best time to apply the next round of fertilizer?", time: "09:02 AM" },
    { sender: 'assistant', text: "Based on your Digital Twin data and the current growth stage, I recommend applying Jeevamrutha in 5 days. The weather forecast shows clear skies, which is perfect.", time: "09:02 AM" }
];

export default function Assistant() {
    const [msgInput, setMsgInput] = useState('');
    const { lang, t } = useLanguage();
    const { isListening, startListening, stopListening } = useVoiceInput();

    const SUGGESTED_QUESTIONS = [
        "What is the pest risk today?",
        "How much water does my field need?",
        "Are there any government schemes for wheat?"
    ];

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening((finalTranscript, interimTranscript) => {
                if (finalTranscript) {
                    setMsgInput((prev) => {
                        const space = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
                        return prev + space + finalTranscript;
                    });
                }
            });
        }
    };

    return (
        <div style={{ padding: '20px 40px 100px', minHeight: '100vh', backgroundColor: 'var(--color-bg-lightest)', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-dark)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                        <ArrowLeft size={18} /> {t('back_to_dashboard') || 'Back to Dashboard'}
                    </Link>
                    <div>
                        <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2.1rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 4px 0' }}>
                            Farm AI Assistant <Sparkles size={24} color="var(--color-green-primary)" />
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                            Get instant, expert farming advice strictly tailored to your soil, crops, and local weather.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(500px, 2.5fr)', gap: '32px', flex: 1, alignItems: 'start' }}>

                {/* Left Column: Info & Suggested */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>How it works</h3>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                            Your AI analyzes your digital twin data, weather patterns, and crop passport. Ask any question to get hyper-localized recommendations immediately.
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Suggested Questions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} onClick={() => setMsgInput(q)} style={{ textAlign: 'left', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', color: 'var(--color-green-primary)', padding: '16px 20px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', lineHeight: 1.4 }}>
                                    "{q}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Container */}
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', height: '700px' }}>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '32px 32px 16px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {INITIAL_MESSAGES.map((msg, index) => {
                            const isFarmer = msg.sender === 'farmer';
                            return (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isFarmer ? 'flex-end' : 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', maxWidth: '85%', flexDirection: isFarmer ? 'row-reverse' : 'row' }}>
                                        {!isFarmer && (
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '18px' }}>
                                                <Bot size={20} color="white" />
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isFarmer ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                backgroundColor: isFarmer ? 'var(--color-green-primary)' : 'var(--color-bg-lightest)',
                                                color: isFarmer ? 'var(--color-white)' : 'var(--color-green-deep)',
                                                padding: '16px 20px',
                                                borderRadius: '20px',
                                                borderBottomRightRadius: isFarmer ? '4px' : '20px',
                                                borderBottomLeftRadius: !isFarmer ? '4px' : '20px',
                                                fontSize: '1.05rem',
                                                lineHeight: 1.5,
                                                fontWeight: 500,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                            }}>
                                                {msg.text}
                                            </div>
                                            <div style={{ color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px', padding: '0 4px' }}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: '20px 32px', borderTop: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={toggleListening}
                            style={{ background: isListening ? 'rgba(211, 47, 47, 0.1)' : 'var(--color-bg-lightest)', border: isListening ? '1px solid #D32F2F' : '1px solid var(--color-green-very-light)', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: isListening ? '#D32F2F' : 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                        >
                            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <input
                            type="text"
                            placeholder={isListening ? (t('listening') || 'Listening...') : 'Ask your farm assistant...'}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            style={{ flex: 1, padding: '16px 24px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '30px', fontSize: '1.05rem', color: 'var(--color-green-deep)', outline: 'none' }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { setMsgInput(''); stopListening(); } }}
                        />

                        <button
                            onClick={() => { setMsgInput(''); stopListening(); }}
                            style={{ backgroundColor: 'var(--color-green-primary)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)' }}
                        >
                            <Send size={22} color="white" style={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
