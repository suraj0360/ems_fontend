import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton = ({ to, label = 'Back' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            onClick={handleBack}
            className="btn-outline"
            style={{
                marginBottom: '1.5rem',
                gap: '0.5rem',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content'
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>←</span> {label}
        </Button>
    );
};

export default BackButton;
