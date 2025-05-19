import React from 'react';
import './Common.css'; // Import the CSS file for styling
import CircularProgress from '@mui/material/CircularProgress';

interface MainButtonProps {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    width?: string;
}

const MainButton: React.FC<MainButtonProps> = ({ text, onClick, isLoading = false, disabled = false, width, }) => {
    return (
        <button
            className={`main-button ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: width ?? 'auto',      // ✅ usa el ancho si se proporciona
                minWidth: width ? undefined : '124px',  // ✅ si se pasa width, no impongas minWidth
                minHeight: '36px',           // ✅ mantiene altura uniforme
            }}
        >
            {isLoading ? (
                <CircularProgress size={20} thickness={8} style={{ color: '#FFFFFF' }} />
            ) : (
                text.toUpperCase()
            )}
        </button>
    );
};

export default MainButton;
