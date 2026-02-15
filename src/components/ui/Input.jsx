const Input = ({ label, id, error, ...props }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input
                id={id}
                className="form-input"
                {...props}
            />
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default Input;
