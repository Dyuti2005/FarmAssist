import React, { useState } from 'react';
import { Search, Send, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerMessages() {
    const { t } = useLanguage();

    // STATIC STATE: Real backend messages not yet supported
    const mockMessages = [
        {
            id: 'MSG-1',
            farmer: 'Sundaram (Nashik)',
            product: 'Organic Tomato',
            lastMessage: 'Yes, the next harvest is ready for pickup by Thursday.',
            timestamp: '10:42 AM',
            unread: true
        },
        {
            id: 'MSG-2',
            farmer: 'Ramesh Singh (Vidisha)',
            product: 'Premium Sharbati Wheat',
            lastMessage: 'The contract has been signed on my end. Awaiting your approval.',
            timestamp: 'Yesterday',
            unread: false
        },
        {
            id: 'MSG-3',
            farmer: 'Rajesh (Indore)',
            product: 'Black Cotton Soil Onion',
            lastMessage: 'Stock is currently out, but will notify when available.',
            timestamp: 'Oct 04',
            unread: false
        }
    ];

    const conversationHistory = {
        'MSG-1': [
            { sender: 'buyer', text: 'Hello, I saw your listing for Organic Tomatoes. Are they available for immediate dispatch?', time: '10:15 AM' },
            { sender: 'farmer', text: 'Yes, the next harvest is ready for pickup by Thursday.', time: '10:42 AM' }
        ],
        'MSG-2': [
            { sender: 'buyer', text: 'Hi Ramesh, regarding the Sharbati Wheat contract, when can you sign?', time: 'Yesterday 3:00 PM' },
            { sender: 'farmer', text: 'The contract has been signed on my end. Awaiting your approval.', time: 'Yesterday 5:30 PM' }
        ],
        'MSG-3': [
            { sender: 'buyer', text: 'Are the Black Cotton Soil Onions back in stock?', time: 'Oct 03 4:00 PM' },
            { sender: 'farmer', text: 'Stock is currently out, but will notify when available.', time: 'Oct 04 9:00 AM' }
        ]
    };

    const [selectedMsgId, setSelectedMsgId] = useState('MSG-1');
    const [chatHistories, setChatHistories] = useState(conversationHistory);
    const [inputText, setInputText] = useState('');

    const activeMsg = mockMessages.find(m => m.id === selectedMsgId);
    const activeHistory = chatHistories[selectedMsgId] || [];

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newEntry = {
            sender: 'buyer',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistories(prev => ({
            ...prev,
            [selectedMsgId]: [...(prev[selectedMsgId] || []), newEntry]
        }));
        setInputText('');
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{t('side_messages') || 'Messages'}</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Communicate directly with farmers and suppliers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2.5fr', gap: '24px', height: 'calc(100vh - 250px)', minHeight: '500px' }}>

                {/* Left Side: Message List */}
                <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--color-green-very-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '12px', padding: '8px 16px', border: '1px solid var(--color-green-very-light)' }}>
                            <Search size={18} color="var(--color-green-medium)" />
                            <input type="text" placeholder="Search messages..." style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px', width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {mockMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMsgId(msg.id)}
                                style={{ padding: '20px', borderBottom: '1px solid var(--color-green-very-light)', backgroundColor: selectedMsgId === msg.id ? 'var(--color-green-very-light)' : 'transparent', cursor: 'pointer', display: 'flex', gap: '16px', transition: 'background 0.2s' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                    <User size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 800 }}>{msg.farmer}</div>
                                        <div style={{ color: msg.unread ? 'var(--color-green-primary)' : 'var(--color-green-medium)', fontSize: '0.8rem', fontWeight: msg.unread ? 800 : 500 }}>{msg.timestamp}</div>
                                    </div>
                                    <div style={{ color: 'var(--color-green-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{msg.product}</div>
                                    <div style={{ color: msg.unread ? 'var(--color-green-deep)' : 'var(--color-green-dark)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: msg.unread ? 700 : 500 }}>
                                        {chatHistories[msg.id] && chatHistories[msg.id].length > 0 ? chatHistories[msg.id][chatHistories[msg.id].length - 1].text : msg.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Chat View Area */}
                {activeMsg ? (
                    <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-green-very-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <User size={24} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.2rem' }}>{activeMsg.farmer}</div>
                                <div style={{ color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 600 }}>{activeMsg.product}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#FDFDFD', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeHistory.map((line, idx) => (
                                <div key={idx} style={{
                                    alignSelf: line.sender === 'buyer' ? 'flex-start' : 'flex-end',
                                    backgroundColor: line.sender === 'buyer' ? 'var(--color-bg-lightest)' : 'var(--color-green-primary)',
                                    color: line.sender === 'buyer' ? 'var(--color-green-deep)' : 'white',
                                    padding: '16px',
                                    borderRadius: line.sender === 'buyer' ? '16px 16px 16px 0' : '16px 16px 0 16px',
                                    maxWidth: '70%',
                                    border: line.sender === 'buyer' ? '1px solid var(--color-green-very-light)' : 'none'
                                }}>
                                    <div style={{ fontSize: '0.95rem' }}>{line.text}</div>
                                    <div style={{ color: line.sender === 'buyer' ? 'var(--color-green-medium)' : 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: '8px', textAlign: 'right' }}>
                                        {line.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', borderRadius: '16px', padding: '12px 16px', border: '1px solid var(--color-green-very-light)', gap: '12px' }}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem' }}
                                />
                                <button onClick={handleSend} style={{ padding: '10px', backgroundColor: 'var(--color-green-primary)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-medium)' }}>
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}
