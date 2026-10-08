import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Send, Mic, MicOff, Bot, Volume2, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

const getInitialMessages = (t) => [
    { sender: 'assistant', text: t('assistant_initial') || "Hello! I'm your Farm AI Assistant. I have reviewed your farm's digital twin. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
];

export default function Assistant() {
    const [msgInput, setMsgInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newChatLang, setNewChatLang] = useState('en');
    const { lang, t } = useLanguage();
    const { isListening, error: voiceError, startListening, stopListening } = useVoiceInput();
    const { isSpeaking, activeMessageId, error: speechError, speak, stopSpeech, clearError } = useSpeechSynthesis();

    const SUGGESTED_QUESTIONS = [
        t('suggested_q1') || "What is the pest risk today?",
        t('suggested_q2') || "How much water does my field need?",
        t('suggested_q3') || "Are there any government schemes for wheat?"
    ];

    const loadConversation = async (id) => {
        setLoading(true);
        setActiveConvId(id);
        stopSpeech();
        const token = localStorage.getItem('fc_token');
        try {
            const res = await fetch(`http://localhost:5002/api/ai/conversations/${id}/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages.map(m => ({
                    id: m.id,
                    sender: m.sender.toLowerCase(),
                    text: m.content,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const deleteConversation = async (id) => {
        const token = localStorage.getItem('fc_token');
        try {
            const res = await fetch(`http://localhost:5002/api/ai/conversations/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                setConversations(prev => prev.filter(c => c.id !== id));
                if (activeConvId === id) {
                    setActiveConvId(null);
                    setMessages([]);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchConvs = async () => {
            const token = localStorage.getItem('fc_token');
            try {
                const res = await fetch('http://localhost:5002/api/ai/conversations', { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data.conversations);
                    if (data.conversations.length > 0) {
                        loadConversation(data.conversations[0].id);
                    } else {
                        // Create initial default conversation to map to
                        const newRes = await fetch('http://localhost:5002/api/ai/conversations', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: 'General Farm Chat' })
                        });
                        const newData = await newRes.json();
                        if (newData.success) {
                            setConversations([newData.conversation]);
                            setActiveConvId(newData.conversation.id);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchConvs();
    }, []);

    const originalInputRef = useRef('');

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            const activeConv = conversations.find(c => c.id === activeConvId);
            const overrideLang = activeConv ? activeConv.language : newChatLang;

            // Save what was typed so far
            originalInputRef.current = msgInput.trim();

            startListening(
                (finalTranscript, interimTranscript) => {
                    const currentStr = (finalTranscript + ' ' + interimTranscript).trim();
                    if (currentStr) {
                        const space = originalInputRef.current ? ' ' : '';
                        setMsgInput(originalInputRef.current + space + currentStr);
                    }
                },
                overrideLang,
                (completeTranscript) => {
                    const currentStr = completeTranscript.trim();
                    if (currentStr) {
                        const space = originalInputRef.current ? ' ' : '';
                        setMsgInput(originalInputRef.current + space + currentStr);
                    }
                }
            );
        }
    };

    const handleSend = async (forcedText = null) => {
        const textToSubmit = forcedText !== null ? forcedText : msgInput;
        if (!textToSubmit.trim() || loading || !activeConvId) return;

        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Optimistically add farmer message
        const newMessages = [...messages, { sender: 'farmer', text: textToSubmit, time: timeString }];
        setMessages(newMessages);
        if (forcedText === null) setMsgInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('fc_token');
            const res = await fetch(`http://localhost:5002/api/ai/conversations/${activeConvId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: textToSubmit })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setMessages(prev => [...prev, { sender: 'assistant', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            } else {
                setMessages(prev => [...prev, { sender: 'assistant', text: data.message || t('ai_error') || "I encountered an error connecting to my neural network.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            }
        } catch (e) {
            console.error("AI Fetch error:", e);
            setMessages(prev => [...prev, { sender: 'assistant', text: t('ai_network_error') || "Network error occurred while reaching the farm assistant.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setLoading(false);
        }
    };

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
                            {t('ai_assistant_title') || 'Farm AI Assistant'} <Sparkles size={24} color="var(--color-green-primary)" />
                        </h1>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                            {t('ai_assistant_subtitle') || 'Get instant, expert farming advice strictly tailored to your soil, crops, and local weather.'}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(500px, 2.5fr)', gap: '32px', flex: 1, alignItems: 'start' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>{t('how_it_works') || 'How it works'}</h3>
                        <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                            {t('how_it_works_desc') || 'Your AI analyzes your digital twin data, weather patterns, and crop passport. Ask any question to get hyper-localized recommendations immediately.'}
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t('recent_chats') || 'Recent Chats'}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select
                                    value={newChatLang}
                                    onChange={(e) => setNewChatLang(e.target.value)}
                                    style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--color-green-very-light)', fontSize: '0.8rem', color: 'var(--color-green-dark)', backgroundColor: 'var(--color-bg-lightest)', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="en">EN</option>
                                    <option value="kn">ಕನ್ನಡ</option>
                                    <option value="hi">हिन्दी</option>
                                </select>
                                <button onClick={() => {
                                    setActiveConvId(null);
                                    setMessages([]);
                                    const createNew = async () => {
                                        const token = localStorage.getItem('fc_token');
                                        const res = await fetch('http://localhost:5002/api/ai/conversations', {
                                            method: 'POST',
                                            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ title: `Chat ${new Date().toLocaleDateString()}`, language: newChatLang })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setConversations(prev => [data.conversation, ...prev]);
                                            setActiveConvId(data.conversation.id);
                                        }
                                    };
                                    createNew();
                                }} style={{ border: 'none', background: 'transparent', color: 'var(--color-green-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>+ {t('new_chat') || 'New'}</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                            {conversations.map((c, i) => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', backgroundColor: activeConvId === c.id ? 'var(--color-green-primary)' : 'var(--color-bg-lightest)', color: activeConvId === c.id ? 'white' : 'var(--color-green-dark)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-green-very-light)' }}>
                                    <div onClick={() => loadConversation(c.id)} style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {c.title}
                                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>{c.language ? c.language.toUpperCase() : 'EN'}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} style={{ background: 'transparent', border: 'none', color: activeConvId === c.id ? 'rgba(255,255,255,0.7)' : '#D32F2F', cursor: 'pointer', padding: '4px' }}>x</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-green-very-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: 'var(--color-green-deep)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>{t('suggested_questions') || 'Suggested Questions'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} onClick={() => handleSend(q)} disabled={loading} style={{ textAlign: 'left', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', color: 'var(--color-green-primary)', padding: '16px 20px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', width: '100%', lineHeight: 1.4, opacity: loading ? 0.6 : 1 }}>
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
                        {messages.map((msg, index) => {
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px', padding: '0 4px' }}>
                                                {msg.time}
                                                {!isFarmer && (
                                                    <button
                                                        onClick={() => {
                                                            if (isSpeaking && activeMessageId === (msg.id || index)) stopSpeech();
                                                            else {
                                                                const activeConv = conversations.find(c => c.id === activeConvId);
                                                                const langCode = activeConv ? activeConv.language : newChatLang;
                                                                speak(msg.text, langCode, (msg.id || index));
                                                            }
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: (isSpeaking && activeMessageId === (msg.id || index)) ? '#D32F2F' : 'var(--color-green-primary)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                                                    >
                                                        {(isSpeaking && activeMessageId === (msg.id || index)) ? <Square size={14} fill="currentColor" /> : <Volume2 size={16} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', maxWidth: '85%', flexDirection: 'row' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '18px' }}>
                                        <Bot size={20} color="white" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div style={{ backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-medium)', padding: '16px 20px', borderRadius: '20px', borderBottomLeftRadius: '4px', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500 }}>
                                            {t('thinking_about_farm') || 'Thinking about your farm...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    {(voiceError || speechError) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '8px 32px', fontSize: '0.85rem', fontWeight: 600, borderTop: '1px solid #FFCDD2' }}>
                            <span>{voiceError || speechError}</span>
                            {speechError && <button onClick={clearError} style={{ background: 'transparent', border: 'none', color: '#D32F2F', cursor: 'pointer' }}>x</button>}
                        </div>
                    )}
                    <div style={{ padding: '20px 32px', borderTop: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={toggleListening}
                            style={{ background: isListening ? 'rgba(211, 47, 47, 0.1)' : 'var(--color-bg-lightest)', border: isListening ? '1px solid #D32F2F' : '1px solid var(--color-green-very-light)', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: isListening ? '#D32F2F' : 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                        >
                            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <input
                            type="text"
                            placeholder={isListening ? (t('listening') || 'Listening...') : (t('ask_assistant_placeholder') || 'Ask your farm assistant...')}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            disabled={loading}
                            style={{ flex: 1, padding: '16px 24px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '30px', fontSize: '1.05rem', color: 'var(--color-green-deep)', outline: 'none', opacity: loading ? 0.6 : 1 }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { handleSend(); stopListening(); } }}
                        />

                        <button
                            onClick={() => { handleSend(); stopListening(); }}
                            disabled={loading}
                            style={{ backgroundColor: loading ? 'var(--color-green-medium)' : 'var(--color-green-primary)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(22, 138, 74, 0.2)', transition: 'background-color 0.2s' }}
                        >
                            <Send size={22} color="white" style={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
