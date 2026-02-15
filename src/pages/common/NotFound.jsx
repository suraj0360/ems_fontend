import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );
};

export default NotFound;
