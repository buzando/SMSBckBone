import React, { useState } from 'react';
import { Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';




const HomePage: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const navigate = useNavigate();
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', marginLeft: '0' }}>
            {/* Header con título */}
            <Typography variant="h4" component="h1" style={{ textAlign: 'left', fontWeight: 'bold', color: '#330F1B' }}>
                ¡Bienvenida de vuelta, Fulanita!
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'left', color: '#574B4F', marginBottom: '20px' }}>
                Te mostramos el resumen de tu actividad más reciente.
            </Typography>

            {/* Contenedor de botones alineados */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* Botón de filtro */}
                <Button
                    variant="outlined"
                    style={{
                        border: '1px solid #C6BFC2',
                        borderRadius: '18px',
                        padding: '8px 16px',
                        background: activeButton === 'filter' ? '#E6C2CD' : 'transparent',
                        borderColor: activeButton === 'filter' ? '#BE93A0' : '#C6BFC2',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#F2E9EC')}
                    onMouseOut={(e) => (e.currentTarget.style.background = activeButton === 'filter' ? '#E6C2CD' : 'transparent')}
                    onMouseDown={() => setActiveButton('filter')}
                    onMouseUp={() => setActiveButton(null)}
                >
                    SMS # CORTOS
                </Button>

                {/* Botones de la derecha alineados */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        onClick={() => navigate('/Use')}
                        variant="outlined"
                        style={{
                            border: '1px solid #C6BFC2',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: 'bold',
                            color: '#8F4D63',
                            background: activeButton === 'uso' ? '#E6C2CD' : 'transparent',
                            borderColor: activeButton === 'uso' ? '#BE93A0' : '#C6BFC2',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#F2E9EC';
                            e.currentTarget.style.border = '1px solid #BE93A066';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = activeButton === 'uso' ? '#E6C2CD' : 'transparent';
                            e.currentTarget.style.border = activeButton === 'uso' ? '#BE93A0' : '#C6BFC2';
                        }}
                        onMouseDown={() => setActiveButton('uso')}
                        onMouseUp={() => setActiveButton(null)}
                    >
                        USO
                    </Button>

                    <IconButton
                        style={{
                            border: '1px solid #C6BFC2',
                            borderRadius: '8px',
                            color: '#8F4D63',
                            background: activeButton === 'chat' ? '#E6C2CD' : 'transparent',
                            borderColor: activeButton === 'chat' ? '#BE93A0' : '#C6BFC2',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#F2E9EC';
                            e.currentTarget.style.border = '1px solid #BE93A066';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = activeButton === 'chat' ? '#E6C2CD' : 'transparent';
                            e.currentTarget.style.border = activeButton === 'chat' ? '#BE93A0' : '#C6BFC2';
                        }}
                        onMouseDown={() => setActiveButton('chat')}
                        onMouseUp={() => setActiveButton(null)}
                    >
                        <ChatBubbleOutlineIcon />
                    </IconButton>

                    <IconButton
                        style={{
                            background: activeButton === 'dashboard' ? '#E6C2CD' : '#8F4D63',
                            borderRadius: '8px',
                            color: '#FFF',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = '#BE93A066')}
                        onMouseOut={(e) => (e.currentTarget.style.background = activeButton === 'dashboard' ? '#E6C2CD' : '#8F4D63')}
                        onMouseDown={() => setActiveButton('dashboard')}
                        onMouseUp={() => setActiveButton(null)}
                    >
                        <DashboardIcon />
                    </IconButton>
                </div>
            </div>

            {/* Contenedores de métricas */}
            <Grid container spacing={2}>
                {[
                    { title: "Campañas activas", value: "100" },
                    { title: "SMS enviados hoy", value: "333" },
                    { title: "Promedio SMS por día", value: "4%" },
                    { title: "Consumo de créditos", value: "$1,000.00" }
                ].map((item, index) => (
                    <Grid item xs={3} key={index}>
                        <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#574B4F' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="h5" style={{ color: '#8F4D63', fontWeight: 'bold' }}>
                                {item.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default HomePage;
