const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    // Map variants to CSS classes
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'background-secondary text-white hover:opacity-90', // fallback if not in CSS or add to CSS
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
    };

    const assignedClass = variantClasses[variant] || 'btn-primary';

    return (
        <button
            className={`btn ${assignedClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
