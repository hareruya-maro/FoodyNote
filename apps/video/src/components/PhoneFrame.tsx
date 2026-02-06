import React from 'react';
import { AbsoluteFill } from 'remotion';

export const PhoneFrame: React.FC<{ children: React.ReactNode; label?: string }> = ({ children, label }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {/* Phone Bezel */}
            <div style={{
                width: '450px', // Roughly 9:19.5 ratio relative to 1080p height
                height: '900px',
                backgroundColor: '#000',
                borderRadius: '50px',
                padding: '15px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Screen Content */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    borderRadius: '35px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {children}
                    {label && (
                        <AbsoluteFill style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ color: '#333', textAlign: 'center' }}>{label}</h2>
                            <p style={{ color: '#666' }}>Video Placeholder</p>
                        </AbsoluteFill>
                    )}
                </div>
            </div>
        </div>
    );
};
