const Footer = () => {
    return (
        <footer style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border)',
            marginTop: 'auto',
            background: 'var(--bg-card)'
        }}>
            <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Event Management System. User Interface Only.</p>
        </footer>
    );
};

export default Footer;
