import React from 'react';
import { Box, Typography } from '@mui/material';
import fileUploadedIcon from '@mui/icons-material/InsertDriveFile';
import uploadIcon from '@mui/icons-material/CloudUpload';
import errorIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '../../assets/Icon-info.svg';

interface DropZoneProps {
  onDrop: (file: File) => void;
  file?: File | null;
  fileSuccess?: boolean;
  fileError?: boolean;
  helperText?: string;
  acceptedFiles?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  file,
  fileSuccess = false,
  fileError = false,
  helperText = 'Arrastre un archivo aquí, o selecciónelo.',
  acceptedFiles = '.xlsx',
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      onDrop(newFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      onDrop(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const borderColor = fileError ? '#D32F2F' : fileSuccess ? '#A45C6B' : '#D9B4C3';
  const bgColor = fileError ? '#FFF2F2' : fileSuccess ? '#FFF5F8' : '#FFFFFF';

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      sx={{
        width: 180,
        height: 140,
        border: `2px dashed ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: 'Poppins',
        textAlign: 'center',
        px: 1,
        position: 'relative',
      }}
    >
      <input
        type="file"
        accept={acceptedFiles}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <img
        src={fileError ? errorIcon : fileSuccess ? fileUploadedIcon : uploadIcon}
        alt="estado archivo"
        style={{ marginBottom: '8px', width: 32, height: 32 }}
      />

      <Typography sx={{ fontWeight: 600 }}>
        {fileError ? 'Archivo inválido' : fileSuccess ? file?.name : 'Subir archivo'}
      </Typography>

      {!fileSuccess && (
        <Typography fontSize="12px" color="#330F1B">
          {helperText}
        </Typography>
      )}

      <Box
        component="img"
        src={InfoIcon}
        alt="info"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 16,
          height: 16,
        }}
      />
    </Box>
  );
};

export default DropZone;