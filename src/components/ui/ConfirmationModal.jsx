import React from 'react';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

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
                    background: 'var(--role-warning, #f59e0b)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.5rem auto'
                }}>
                    ?
                </div>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>{title}</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button onClick={onClose} className="btn-ghost">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="btn-primary">
                        Confirm
                    </Button>
                </div>
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

export default ConfirmationModal;
