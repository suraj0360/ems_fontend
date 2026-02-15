import React from 'react';

const AboutUs = () => {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>About EMS</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Welcome to the Event Management System (EMS), your premier destination for discovering and managing events.
                </p>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Our mission is to bring people together through memorable experiences. Whether you are looking to attend a local workshop, a concert, or a corporate networking event, EMS simplifies the process.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>For Organizers</h2>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    We provide powerful tools for organizers to create, manage, and track their events. From real-time analytics to seamless attendee management, we've got you covered.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>For Attendees</h2>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Discover events that match your interests, book tickets securely, and keep track of your schedule all in one place.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
