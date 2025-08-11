import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const colorClasses = {
        primary: 'border-blue-500',
        white: 'border-white',
    };

    return (
        <div
            className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
