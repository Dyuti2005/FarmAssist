import React, { useState } from 'react';
import { Search, Send, User } from 'lucide-react';

const DUMMY_CONVERSATIONS = [
    {
        id: 1,
        name: 'Anandrao Deshmukh',
        crop: 'Black Gram',
        time: '10:45 AM',
        date: 'Today',
        unread: 2,
        thread: [
            { sender: 'buyer', time: '10:00 AM', text: 'Hi Anandrao, I am interested in your Black Gram listing.' },
            { sender: 'farmer', time: '10:05 AM', text: 'Hello! Thanks for reaching out. Yes, I have 5,000 kg available right now in Latur.' },
            { sender: 'buyer', time: '10:15 AM', text: 'Great. If I procure the entire 5,000 kg, can you manage the delivery to Pune?' },
            { sender: 'farmer', time: '10:30 AM', text: 'We can arrange the truck, but transport costs will be extra.' },
            { sender: 'buyer', time: '10:35 AM', text: 'How much extra per kg?' },
            { sender: 'farmer', time: '10:45 AM', text: 'Yes, the transport cost is included in the price if we negotiate to ₹92/kg instead of ₹90. Let me know if that works.' }
        ]
    },
    {
        id: 2,
        name: 'Tariq Ahmed',
        crop: 'Kashmiri Saffron',
        time: '09:30 AM',
        date: 'Today',
        unread: 0,
        thread: [
            { sender: 'buyer', time: 'Yesterday, 04:00 PM', text: 'Hello Tariq, is the Grade A Saffron still available for the agreed price?' },
            { sender: 'farmer', time: 'Yesterday, 04:30 PM', text: 'Yes sir, I have set aside the 2 kg for you.' },
            { sender: 'buyer', time: 'Yesterday, 05:00 PM', text: 'Perfect. Could you please share the GI tag certificate and quality report before I raise the contract?' },
            { sender: 'farmer', time: '09:30 AM', text: 'I will send the quality certificate by tomorrow morning.' }
        ]
    },
    {
        id: 3,
        name: 'Basappa Gowda',
        crop: 'Toor Dal',
        time: '04:15 PM',
        date: 'Yesterday',
        unread: 0,
        thread: [
            { sender: 'buyer', time: '25 Aug, 10:00 AM', text: 'Hi Basappa, please confirm once the payment for order #ORD-9018 is received.' },
            { sender: 'farmer', time: '25 Aug, 11:15 AM', text: 'Payment received successfully. I will start the bagging process today.' },
            { sender: 'buyer', time: '26 Aug, 09:00 AM', text: 'Excellent. When can you dispatch it?' },
            { sender: 'farmer', time: '26 Aug, 04:15 PM', text: 'Your order has been dispatched via truck MH-12-AB-3456. The driver will reach your warehouse by tomorrow evening.' }
        ]
    },
    {
        id: 4,
        name: 'Ramesh Patel',
        crop: 'Sharbati Wheat',
        time: '11:20 AM',
        date: '26 Aug',
        unread: 1,
        thread: [
            { sender: 'buyer', time: '24 Aug, 02:00 PM', text: 'Hello Ramesh. The Sharbati Wheat samples tested very well in our lab.' },
            { sender: 'farmer', time: '24 Aug, 03:00 PM', text: 'Thank you! We take pride in our quality.' },
            { sender: 'buyer', time: '25 Aug, 11:00 AM', text: 'I want to initiate a contract for 5,000 kg at ₹32/kg as discussed.' },
            { sender: 'farmer', time: '25 Aug, 05:00 PM', text: 'There has been a slight delay in our local harvesting due to rain.' },
            { sender: 'farmer', time: '26 Aug, 11:20 AM', text: 'Can we reduce the contract quantity to 4,500 kg? I want to make sure I deliver only the best quality to you.' }
        ]
    }
];

export default function BuyerMessages() {
    const [activeId, setActiveId] = useState(null);
    const [msgInput, setMsgInput] = useState('');

    const activeChat = DUMMY_CONVERSATIONS.find(c => c.id === activeId);

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--color-green-deep)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Messages</h1>
                <p style={{ color: 'var(--color-green-dark)', fontSize: '1.05rem', fontWeight: 500 }}>Communicate directly with farmers and suppliers.</p>
            </div>

            <div style={{ flex: 1, backgroundColor: 'var(--color-white)', borderRadius: '20px', border: '1px solid var(--color-green-very-light)', display: 'flex', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                {/* Conversations List (Left Panel) */}
                <div style={{ width: '380px', borderRight: '1px solid var(--color-green-very-light)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-lightest)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)', padding: '12px 16px', borderRadius: '12px' }}>
                            <Search color="var(--color-green-medium)" size={18} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                style={{ border: 'none', background: 'none', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '0.95rem', color: 'var(--color-green-deep)' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {DUMMY_CONVERSATIONS.map(contact => {
                            const lastMsg = contact.thread[contact.thread.length - 1];
                            const isActive = activeId === contact.id;

                            return (
                                <div
                                    key={contact.id}
                                    onClick={() => setActiveId(contact.id)}
                                    style={{ padding: '20px', borderBottom: '1px solid var(--color-white)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-green-very-light)' : (contact.unread > 0 ? '#fff' : 'transparent'), display: 'flex', gap: '16px', transition: 'background 0.2s', borderRight: isActive ? '4px solid var(--color-green-primary)' : '4px solid transparent' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: isActive ? 'var(--color-green-deep)' : 'var(--color-green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <div style={{ color: 'var(--color-green-deep)', fontWeight: (contact.unread > 0 || isActive) ? 800 : 700, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {contact.name}
                                            </div>
                                            <div style={{ color: isActive ? 'var(--color-green-deep)' : 'var(--color-green-medium)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                {contact.time}
                                            </div>
                                        </div>
                                        <div style={{ color: 'var(--color-green-primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase' }}>
                                            {contact.crop}
                                        </div>
                                        <div style={{ color: (contact.unread > 0 || isActive) ? 'var(--color-green-dark)' : 'var(--color-green-medium)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: contact.unread > 0 ? 600 : 400 }}>
                                            {lastMsg.text}
                                        </div>
                                    </div>
                                    {contact.unread > 0 && !isActive && (
                                        <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}>
                                            <div style={{ backgroundColor: 'var(--color-green-deep)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                                                {contact.unread}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area (Right Panel) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)' }}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--color-green-very-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-lightest)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                                        {activeChat.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px' }}>{activeChat.name}</div>
                                        <div style={{ color: 'var(--color-green-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Regarding: {activeChat.crop}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green-medium)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-green-primary)' }}></div> Online Now
                                </div>
                            </div>

                            {/* Messages Scroll Area */}
                            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <span style={{ backgroundColor: 'var(--color-bg-lightest)', color: 'var(--color-green-medium)', padding: '6px 16px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        End-to-End Encrypted
                                    </span>
                                </div>

                                {activeChat.thread.map((msg, index) => {
                                    const isBuyer = msg.sender === 'buyer';
                                    return (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isBuyer ? 'flex-end' : 'flex-start', margin: '0' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '75%', flexDirection: isBuyer ? 'row-reverse' : 'row' }}>
                                                {/* Mini avatar for farmer if needed, but styling just bubble is cleaner */}
                                                {!isBuyer && (
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-green-very-light)', color: 'var(--color-green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0, marginBottom: '24px' }}>
                                                        {activeChat.name.charAt(0)}
                                                    </div>
                                                )}

                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isBuyer ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{
                                                        backgroundColor: isBuyer ? 'var(--color-green-primary)' : 'var(--color-bg-lightest)',
                                                        color: isBuyer ? 'var(--color-white)' : 'var(--color-green-deep)',
                                                        padding: '14px 20px',
                                                        borderRadius: '20px',
                                                        borderBottomRightRadius: isBuyer ? '4px' : '20px',
                                                        borderBottomLeftRadius: !isBuyer ? '4px' : '20px',
                                                        fontSize: '0.95rem',
                                                        lineHeight: 1.5,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                                    }}>
                                                        {msg.text}
                                                    </div>
                                                    <div style={{ color: 'var(--color-green-medium)', fontSize: '0.7rem', fontWeight: 600, marginTop: '8px', padding: '0 4px' }}>
                                                        {msg.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chat Input */}
                            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--color-green-very-light)', backgroundColor: 'var(--color-white)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <input
                                        type="text"
                                        placeholder={`Message ${activeChat.name}...`}
                                        value={msgInput}
                                        onChange={(e) => setMsgInput(e.target.value)}
                                        style={{ flex: 1, padding: '14px 24px', backgroundColor: 'var(--color-bg-lightest)', border: '1px solid var(--color-green-very-light)', borderRadius: '24px', fontSize: '0.95rem', color: 'var(--color-green-deep)', outline: 'none' }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { setMsgInput(''); } }}
                                    />
                                    <button
                                        onClick={() => setMsgInput('')}
                                        style={{ backgroundColor: 'var(--color-green-primary)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(22, 138, 74, 0.2)' }}
                                    >
                                        <Send size={18} color="white" style={{ marginLeft: '2px' }} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-lightest)' }}>
                            <div style={{ textAlign: 'center', color: 'var(--color-green-medium)' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                    <User size={32} color="var(--color-green-primary)" />
                                </div>
                                <h3 style={{ color: 'var(--color-green-deep)', marginBottom: '8px', fontSize: '1.4rem', fontWeight: 800 }}>Select a Conversation</h3>
                                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Choose a farmer or supplier from the list to view your thread.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
