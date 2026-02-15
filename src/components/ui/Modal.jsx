const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(2px)' // nice visual touch
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
