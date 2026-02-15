import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Event Management System. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/about" className="text-hover" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>About Us</Link>
                    <Link to="/contact" className="text-hover" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Contact Us</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
