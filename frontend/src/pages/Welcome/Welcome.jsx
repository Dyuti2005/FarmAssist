import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/role-selection');
        }, 4500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-lightest)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
                <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="none">
                    <motion.path
                        d="M 50,800 C 100,600 300,400 200,200 C 100,0 250,-100 250,-100"
                        fill="transparent"
                        stroke="var(--color-green-light)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    {[
                        { cx: 160, cy: 500 },
                        { cx: 240, cy: 300 },
                        { cx: 190, cy: 150 }
                    ].map((node, i) => (
                        <motion.circle
                            key={i}
                            cx={node.cx}
                            cy={node.cy}
                            r="6"
                            fill="var(--color-green-medium)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5 + i * 0.3, duration: 0.5 }}
                        />
                    ))}
                </svg>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.8, type: 'spring' }}
                style={{ marginBottom: '24px', zIndex: 1, filter: 'drop-shadow(0px 0px 8px var(--color-green-soft))' }}
            >
                <Leaf size={56} color="var(--color-green-dark)" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                style={{
                    color: 'var(--color-green-primary)',
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    zIndex: 1
                }}
            >
                Welcome To
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }}
                style={{
                    color: 'var(--color-green-deep)',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    marginBottom: '16px',
                    lineHeight: 1.2,
                    textShadow: '0 4px 12px rgba(0, 90, 50, 0.1)',
                    zIndex: 1
                }}
            >
                FARMCHAIN<br />ASSIST
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.0, duration: 0.8 }}
                style={{
                    color: 'var(--color-green-dark)',
                    fontSize: '1rem',
                    textAlign: 'center',
                    fontWeight: 500,
                    zIndex: 1
                }}
            >
                Your Intelligent Farming Companion
            </motion.p>
        </div>
    );
}
