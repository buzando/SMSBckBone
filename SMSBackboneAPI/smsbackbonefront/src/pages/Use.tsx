import React, { useState } from 'react';
import { Button, Typography, Divider, Box, Popper, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import BoxEmpty from '../assets/Nousers.svg';
import MainButton from '../components/commons/MainButton'
import SecondaryButton from '../components/commons/SecondaryButton'
import DatePicker from '../components/commons/DatePicker';

const Use: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOption, setSelectedOption] = useState("corto");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const [buttonText, setButtonText] = useState("SMS # CORTOS");
    const [selectedDates, setSelectedDates] = useState({ start: new Date(), end: new Date() });
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget); // Asegurar que el anchor es el botón de fecha
        setDatePickerOpen(true);
    };

    const handleCancelDatePicker = () => {
        setDatePickerOpen(false); // Cierra el DatePicker
    };

    const handleApply = () => {
        // Cambiar el texto del botón basado en la selección
        if (selectedOption === "largo") {
            setButtonText("SMS # LARGOS");
        } else {
            setButtonText("SMS # CORTOS");
        }
        setAnchorEl(null); // Cerrar el Popper
    };

    const open = Boolean(anchorEl);
    const id = open ? 'sms-popper' : undefined;

    return (
        <Box sx={{ padding: '20px', maxWidth: '1000px', marginLeft: 0 }}>
            {/* Encabezado */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#330F1B', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px', cursor: 'pointer' }}>⬅</span> Uso
            </Typography>
            <Divider sx={{ marginTop: '10px', marginBottom: '20px' }} />

            {/* Botones de filtro */}
            <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {/* Botón con Popper */}
                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={handleClick}
                    aria-describedby={id}
                >
                    {buttonText}
                </Button>

                {/* Popper para mostrar opciones */}
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <Paper sx={{
                        width: '280px',  // Ancho del Popper
                        height: '157px', // Alto del Popper
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <RadioGroup
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <FormControlLabel
                                value="corto"
                                control={
                                    <Radio
                                        sx={{
                                            color: "#000000",
                                            "&.Mui-checked": {
                                                color: "#8F4D63",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 24,
                                            },
                                        }}
                                    />
                                }
                                label="SMS # cortos"
                                sx={{
                                    color: selectedOption === "corto" ? "#8F4D63" : "#000000",
                                    fontWeight: selectedOption === "corto" ? "bold" : "normal",
                                }}
                            />

                            <FormControlLabel
                                value="largo"
                                control={
                                    <Radio
                                        sx={{
                                            color: "#000000",
                                            "&.Mui-checked": {
                                                color: "#8F4D63",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 24,
                                            },
                                        }}
                                    />
                                }
                                label="SMS # largos"
                                sx={{
                                    color: selectedOption === "largo" ? "#8F4D63" : "#000000",
                                    fontWeight: selectedOption === "largo" ? "bold" : "normal",
                                }}
                            />
                        </RadioGroup>
                        <Divider sx={{ margin: '10px 0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <SecondaryButton text='Limpiar' onClick={() => setSelectedOption("corto")} />
                            <MainButton text='Aplicar' onClick={handleApply} />
                        </Box>
                    </Paper>
                </Popper>

                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={handleDateClick}
                >
                    FECHA
                </Button>
                <Button variant="outlined" sx={buttonStyle}>CAMPAÑA</Button>
                <Button variant="outlined" sx={buttonStyle}>USUARIO</Button>
            </Box>
            <DatePicker
                open={datePickerOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                onApply={(start, end) => {
                    setSelectedDates({ start, end });
                    setDatePickerOpen(false);
                }}
                onClose={() => setDatePickerOpen(false)}
            />

            <Divider sx={{ marginBottom: '20px' }} />

            {/* Imagen de vacío y mensaje */}
            <Box sx={{ textAlign: 'center', marginTop: '50px', marginLeft: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box component="img" src={BoxEmpty} alt="Caja Vacía" sx={{ width: '150px', height: 'auto' }} />
                </Box>
                <Typography variant="body1" sx={{ marginTop: '10px', color: '#8F4D63', fontWeight: '500' }}>
                    Seleccione un rango para comenzar.
                </Typography>
            </Box>
        </Box>
    );
};

/* 🎨 Estilos */
const buttonStyle = {
    background: '#F6F6F6',
    border: '1px solid #C6BFC2',
    borderRadius: '18px',
    padding: '8px 16px',
    fontWeight: 'bold',
    color: '#8F4D63',
    textTransform: 'none',
    opacity: 1,
    '&:hover': {
        background: '#F2E9EC',
        border: '1px solid #BE93A066',
    },
    '&:active': {
        background: '#E6C2CD',
        border: '1px solid #BE93A0',
    }
};

const optionStyle = {
    fontWeight: 'bold',
    color: '#8F4D63',
};

const cleanButtonStyle = {
    border: '1px solid #8F4D63',
    borderRadius: '8px',
    padding: '6px 12px',
    fontWeight: 'bold',
    color: '#8F4D63',
    textTransform: 'none',
};

const applyButtonStyle = {
    background: '#8F4D63',
    borderRadius: '8px',
    padding: '6px 12px',
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'none',
    '&:hover': {
        background: '#7A3E53',
    },
};

export default Use;
