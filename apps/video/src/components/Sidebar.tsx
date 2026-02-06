import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const Sidebar: React.FC<{ title: string; text: string }> = ({ title, text }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const translateY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: '100%',
            width: '100%',
            padding: '80px',
            opacity,
            transform: `translateY(${translateY}px)`
        }}>
            <h1 style={{
                fontFamily: 'sans-serif',
                fontSize: 60,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '20px',
                lineHeight: 1.2
            }}>
                {title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </h1>
            <p style={{
                fontFamily: 'sans-serif',
                fontSize: 40,
                color: '#555',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
            }}>
                {text}
            </p>
        </div>
    );
};
