import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Divider, Modal, FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainIcon from '../components/commons/MainButtonIcon';
import seachicon from '../assets/icon-lupa.svg';
import iconclose from "../assets/icon-close.svg";
import BoxEmpty from '../assets/Nousers.svg';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import SecondaryButton from '../components/commons/SecondaryButton'
import MainButton from '../components/commons/MainButton'
import infoicon from '../assets/Icon-info.svg'
import DynamicMessageEditor from '../components/commons/DymanicMessageEditor';

const Templates = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();

    const [openModal, setOpenModal] = React.useState(false);
    const [mensaje, setMensaje] = React.useState('');
    const [selectedID, setSelectedID] = React.useState('');
    const [selectedPhone, setSelectedPhone] = React.useState('');
    const [selectedDato, setSelectedDato] = React.useState('');
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [templateName, setTemplateName] = useState('');


    const getProcessedMessage = () => {
        return mensaje
            .replace(/\bID\b/gi, selectedID || 'ID')
            .replace(/\bTel[eé]fono\b/gi, selectedPhone || 'Teléfono')
            .replace(/\bDato\b/gi, selectedDato || 'Dato');
    };
    
    

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handlePreviewClick = () => {
        console.log("Mensaje crudo:", mensaje);
        setOpenPreviewModal(true);
    };
    
    const handleMessageChange = (text: string) => {
        setMensaje(text);
    };

    return (
        <div style={{ padding: '20px', marginTop: '-70px', marginLeft: '40px', maxWidth: '1040px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                        p: 0,
                        mr: 1,
                        ml: '-28px', // para que flote más a la izquierda si quieres
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={ArrowBackIosNewIcon}
                        alt="Regresar"
                        style={{
                            width: 24,
                            height: 24,
                            transform: 'rotate(270deg)',
                            display: 'block'
                        }}
                    />
                </IconButton>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#330F1B',
                        fontFamily: 'Poppins',
                        fontSize: '26px',
                    }}
                >
                    Plantillas
                </Typography>
            </Box>

            <Divider sx={{ marginBottom: '17px', marginTop: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '25px', marginBottom: '20px' }}>
                <MainIcon
                    text="New Template"
                    isLoading={false}
                    onClick={handleOpenModal}
                    width="218px"
                >
                    <span className="flex items-center">
                        <span className="mr-2">+</span> Nueva Plantilla
                    </span>
                </MainIcon>

                <div style={{ position: 'relative', width: '220px' }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            backgroundColor: '#FFFFFF',
                            border: searchTerm ? '1px solid #7B354D' : '1px solid #9B9295',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            width: '218px',
                            height: '40px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <img
                            src={seachicon}
                            alt="Buscar"
                            style={{
                                marginRight: '8px',
                                width: '18px',
                                height: '18px',
                                filter: searchTerm ? 'invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)' : 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '16px',
                                fontFamily: 'Poppins, sans-serif',
                                color: searchTerm ? '#7B354D' : '#9B9295',
                                backgroundColor: 'transparent',
                            }}
                        />
                        {searchTerm && (
                            <img
                                src={iconclose}
                                alt="Limpiar"
                                style={{ marginLeft: '8px', width: '16px', height: '16px', cursor: 'pointer' }}
                                onClick={() => setSearchTerm('')}
                            />
                        )}
                    </Box>
                </div>
            </div>

            <Box
                sx={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '60px 0',
                    height: '332px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                    mt: 3,
                }}
            >
                <img src={BoxEmpty} alt="Caja vacía" style={{ width: '120px', marginBottom: '16px' }} />
                <Typography
                    sx={{
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        color: '#7B354D',
                        fontWeight: 500,
                    }}
                >
                    Crea una plantilla para comenzar.
                </Typography>
            </Box>


            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        width: 580,
                        height: "auto",
                        fontFamily: 'Poppins',
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        mx: 'auto',
                        my: '5%',
                        outline: 'none',
                    }}
                >
                    <Typography variant="h6" fontWeight={600} fontFamily="Poppins">
                        Añadir plantilla
                    </Typography>

                    <Typography mt={2} fontWeight={600} fontSize={14} fontFamily="Poppins">
                        Nombre*
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            size="medium"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Plantilla 1"
                            sx={{ background: '#fff' }}
                        />
                        <IconButton size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <img src={infoicon} alt="info" />
                        </IconButton>
                    </Box>

                    <Typography mt={3} fontWeight={600} fontSize={14} fontFamily="Poppins">
                        Mensaje*
                    </Typography>



                    <DynamicMessageEditor
                        selectedValues={{
                            id: selectedID,
                            telefono: selectedPhone,
                            dato: selectedDato
                        }}
                        onChange={handleMessageChange}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <SecondaryButton onClick={handlePreviewClick} text='Vista Previa'
                        />

                    </Box>
                    <Divider sx={{ mt: 3, mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <SecondaryButton text='Cancelar' onClick={handleCloseModal} />

                        <MainButton text='Aceptar' onClick={() => console.log("")} />
                    </Box>
                </Box>
            </Modal>

            <Modal open={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
                <Box
                    sx={{
                        width: 500,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        mx: 'auto',
                        my: '10%',
                        fontFamily: 'Poppins',
                        outline: 'none',
                    }}
                >
                    <Typography fontWeight="600" fontSize="18px" color="#330F1B" mb={2}>
                        Vista previa: <span style={{ color: '#7B354D' }}>{templateName || 'Sin título'}</span>
                    </Typography>

                    <Box sx={{ backgroundColor: '#F8E7EC', borderRadius: 2, padding: 2 }}>
                        <Typography fontSize="15px" color="#3A3A3A">
                            {getProcessedMessage()}
                        </Typography>
                    </Box>
                </Box>
            </Modal>


        </div>
    );
};

export default Templates;
