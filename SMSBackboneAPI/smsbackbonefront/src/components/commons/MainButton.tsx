import React from 'react';
import './Common.css'; // Import the CSS file for styling
import CircularProgress from '@mui/material/CircularProgress';

interface MainButtonProps {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({ text, onClick, isLoading = false, disabled = false }) => {
    return (
        <button
            className={`main-button ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {isLoading ? <CircularProgress size={20} style={{ color: '#FFFFFF' }} /> : text.toUpperCase()}
        </button>
    );
};

export default MainButton;
