import React from 'react';

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    impact?: 'light' | 'medium' | 'heavy';
}

const HapticButton: React.FC<HapticButtonProps> = ({
    children,
    impact = 'light',
    onClick,
    className = '',
    ...props
}) => {
    const triggerHaptic = () => {
        if ('vibrate' in navigator) {
            const duration = impact === 'light' ? 10 : impact === 'medium' ? 20 : 30;
            navigator.vibrate(duration);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerHaptic();
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`active:scale-95 transition-transform duration-100 ease-out select-none touch-manipulation ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default HapticButton;
