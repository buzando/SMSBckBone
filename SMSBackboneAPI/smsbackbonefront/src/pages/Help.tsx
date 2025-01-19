import React from 'react';
import { Box, Typography } from '@mui/material';

const Help: React.FC = () => {
    return (
        <Box sx={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#4a4a4a' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                Ayuda
            </Typography>

            <hr style={{
                border: 'none',
                height: '1px',
                backgroundColor: '#dcdcdc',
                marginBottom: '20px'
            }} />

            <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Por favor, contáctenos:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                <Box sx={{ flex: '1 1 45%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Horarios de atención
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <strong>Lunes a viernes</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        Teléfono: 55 1107 8510 Opción 3
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <strong>Sábado</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        9:00-18:00 CST
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        Teléfono: 55 1107 8510 Opción 3
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <strong>Domingo</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        9:00-15:00 CST
                    </Typography>
                    <Typography variant="body2">
                        Teléfono: 55 1107 8510 Opción 3
                    </Typography>
                </Box>

                <Box sx={{ flex: '1 1 45%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Línea de emergencia
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <strong>Lunes a viernes</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        21:00 - 07:00
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        Teléfono: 55 5437 6175
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <strong>Sábado y domingo</strong>
                    </Typography>
                    <Typography variant="body2">
                        Teléfono: 55 5437 6175
                    </Typography>
                </Box>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Soporte: cwsoporte@nuxiba.com
            </Typography>
        </Box>
    );
};

export default Help;
