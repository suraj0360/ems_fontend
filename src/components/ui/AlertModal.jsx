import React from 'react';
import Button from './Button';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    let icon = 'ℹ️';
    let color = 'var(--primary)';

    if (type === 'success') {
        icon = '✓';
        color = 'var(--role-success, #10b981)';
    } else if (type === 'danger') {
        icon = '⚠️';
        color = 'var(--role-admin, #ef4444)';
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <div style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    background: color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.5rem auto'
                }}>
                    {icon}
                </div>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>{title}</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{message}</p>
                <Button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
                    Okay
                </Button>
            </div>
            <style>
                {`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default AlertModal;
