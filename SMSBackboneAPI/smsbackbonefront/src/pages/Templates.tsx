import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Divider, Modal, FormControl, TextField, InputLabel, Select, MenuItem, Menu, Tooltip, ListItemText, ListItemIcon, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainIcon from '../components/commons/MainButtonIcon';
import seachicon from '../assets/icon-lupa.svg';
import iconclose from "../assets/icon-close.svg";
import BoxEmpty from '../assets/Nousers.svg';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import SecondaryButton from '../components/commons/SecondaryButton'
import MainButton from '../components/commons/MainButton'
import infoicon from '../assets/Icon-info.svg'
import DynamicMessageEditor from '../components/commons/DymanicMessageEditor';
import axios from 'axios';
import ModalError from "../components/commons/ModalError"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '../assets/Icon-trash-Card.svg'
import SmsIcon from '@mui/icons-material/Sms';
import Emptybox from '../assets/NoResultados.svg';
import MainModal from "../components/commons/MainModal"
import ChipBar from "../components/commons/ChipBar";



export interface Template {
    id: number;
    name: string;
    message: string;
    creationDate: string; // DateTime en C# es string en JS/TS
    idRoom: number;
}
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
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [TitleErrorModal, setTitleErrorModal] = useState('');
    const [MessageErrorModal, setMessageErrorModal] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
    const [assignedCampaigns, setAssignedCampaigns] = useState<string[]>([]);
    const open = Boolean(anchorEl);
    const [hasAssignedCampaigns, setHasAssignedCampaigns] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
    const [showChipBar, setShowChipBar] = useState(false);
    const [messageChipBar, setMessageChipBar] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
    const [openMassiveDeleteModal, setOpenMassiveDeleteModal] = useState(false);
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

    const handleOpenEditTemplate = (template: Template) => {
        setIsEditingTemplate(true);
        setTemplateToEdit(template);
        setTemplateName(template.name);
        setMensaje(template.message);
        setOpenModal(true);
    };


    const resetTemplateForm = () => {
        setIsEditingTemplate(false);
        setTemplateToEdit(null);
        setTemplateName('');
        setMensaje('');
    };


    const handleOpenDeleteModal = (template: Template) => {
        setTemplateToDelete(template);
        setOpenDeleteModal(true);
    };

    const handleOpenDeleteSelectedTemplates = async () => {
        try {
            const room = JSON.parse(localStorage.getItem('selectedRoom') || '{}');

            // 🔥 Revisión de campañas asignadas
            let hasAssigned = false;

            for (const template of selectedTemplates) {
                const payload = {
                    name: template.name,
                    idRoom: room.id
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_ADD_GETCAMPAINSBYTEMPLATE}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data && response.data.length > 0) {
                    hasAssigned = true;
                    break;
                }
            }

            if (hasAssigned) {
                setTitleErrorModal('Error al eliminar plantillas');
                setMessageErrorModal('Alguna o todas las plantillas seleccionadas se encuentran asignadas a una campaña que está en curso. No es posible eliminarla(s).');
                setIsErrorModalOpen(true);
            } else {
                setOpenMassiveDeleteModal(true); // ✅ Modal de confirmación
            }
        } catch (err) {
            console.error('Error verificando campañas asignadas:', err);
            setTitleErrorModal('Error inesperado');
            setMessageErrorModal('No se pudo verificar el estado de las plantillas. Intente más tarde.');
            setIsErrorModalOpen(true);
        }
    };



    const handleConfirmDeleteTemplate = async () => {
        if (!templateToDelete) return;

        try {
            const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

            const payload = {
                name: templateToDelete.name,
                idRoom: salaId
            };

            const response = await axios.post(`${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_DELETE_TEMPLATE}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
                setMessageChipBar('Plantilla eliminada correctamente');
                setShowChipBar(true);
                setTimeout(() => setShowChipBar(false), 3000);
            }
        } catch (err) {
            setTitleErrorModal("Error al eliminar");
            setMessageErrorModal("No se pudo eliminar la plantilla. Intenta más tarde.");
            setIsErrorModalOpen(true);
        } finally {
            setOpenDeleteModal(false);
            setTemplateToDelete(null);
        }
    };

    const handleDeleteSelectedTemplates = async () => {
        try {
            const room = JSON.parse(localStorage.getItem('selectedRoom') || '{}');

            for (const template of selectedTemplates) {
                const payload = {
                    name: template.name,
                    idRoom: room.id
                };

                await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_DELETE_TEMPLATE}`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
            }

            // 🔥 Mostrar mensaje y limpiar selección
            setTemplates(prev => prev.filter(t => !selectedTemplates.find(sel => sel.id === t.id)));
            setSelectedTemplates([]);
            setMessageChipBar("Plantillas eliminadas correctamente");
            setShowChipBar(true);
            setTimeout(() => setShowChipBar(false), 3000);
        } catch (err) {
            console.error("Error al eliminar plantillas", err);
            setTitleErrorModal("Error al eliminar plantillas");
            setMessageErrorModal("No se pudieron eliminar una o más plantillas.");
            setIsErrorModalOpen(true);
        } finally {
            setOpenMassiveDeleteModal(false);
        }
    };


    const handleSelectTemplate = (template: Template) => {
        const isSelected = selectedTemplates.some((t) => t.id === template.id);

        if (isSelected) {
            setSelectedTemplates(prev => prev.filter((t) => t.id !== template.id));
        } else {
            setSelectedTemplates(prev => [...prev, template]);
        }
    };

    const handleSelectAllTemplates = () => {
        if (selectedTemplates.length === templates.length) {
            setSelectedTemplates([]);
        } else {
            setSelectedTemplates(templates);
        }
    };


    const handleMenuClick = async (event: React.MouseEvent<HTMLElement>, template: Template) => {
        setAnchorEl(event.currentTarget);
        setSelectedTemplate(template);

        // Cargar campañas al abrir el menú
        try {
            const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

            const payload = {
                name: template.name,
                idRoom: salaId
            };

            const response = await axios.post(`${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_GETCAMPAINSBYTEMPLATE}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setAssignedCampaigns(response.data);
            setHasAssignedCampaigns(response.data.length > 0);
        } catch (error) {
            console.error('Error cargando campañas para validar eliminar:', error);
            setAssignedCampaigns([]);
            setHasAssignedCampaigns(false);
        }
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTemplate(null);
    };

    const handleInspectTemplate = async (template: Template) => {
        try {
            setIsInspectModalOpen(true);
            const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

            const payload = {
                name: selectedTemplate?.name,
                idRoom: salaId
            }

            const response = await axios.post(`${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_GETCAMPAINSBYTEMPLATE}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setAssignedCampaigns(response.data);
        } catch (error) {
            console.error('Error cargando campañas asignadas:', error);
            setTitleErrorModal('Error al inspeccionar plantilla');
            setMessageErrorModal('No se pudieron cargar las campañas asociadas.');
            setIsErrorModalOpen(true);
            setIsInspectModalOpen(false);
        }
    };


    const fetchTemplates = async () => {

        try {
            const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

            setLoadingTemplates(true);
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_GETTEMPLATESBYROOM + salaId}`;
            const response = await axios.get(requestUrl);
            setTemplates(response.data);
        }
        catch (error) {
            console.error(error);
            setIsErrorModalOpen(true);
            setTitleErrorModal('Error al traer las plantillas');
            setMessageErrorModal('Ocurrió un error al intentar guardar la plantilla. Inténtalo más tarde.');
        } finally {
            setLoadingTemplates(false);
        }
    };


    useEffect(() => {


        fetchTemplates();
    }, []);

    const handleSaveTemplate = async () => {
        setLoadingTemplates(true);
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

        try {
            if (isEditingTemplate && templateToEdit) {
                // 🔥 Estamos editando un template existente
                const payload = {
                    oldName: templateToEdit.name,
                    idRoom: salaId,
                    newName: templateName,
                    newMessage: mensaje
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_UPDATE_TEMPLATES}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.status === 200) {
                    // 🔥 Actualizar localmente la lista
                    setTemplates(prevTemplates =>
                        prevTemplates.map(t =>
                            t.id === templateToEdit.id
                                ? { ...t, name: templateName, message: mensaje }
                                : t
                        )
                    );
                    fetchTemplates();
                    setMessageChipBar('Plantilla actualizada correctamente');
                }
            } else {
                // 🔥 Estamos creando un nuevo template
                const payload = {
                    name: templateName,
                    message: mensaje,
                    idRoom: salaId
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_ADD_TEMPLATE}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.status === 200) {
                    setMessageChipBar('Plantilla agregada correctamente');
                    fetchTemplates();
                }
            }

            setShowChipBar(true);
            setTimeout(() => setShowChipBar(false), 3000);
            setOpenModal(false);
            resetTemplateForm(); // 🔥 Limpieza segura
        } catch (error) {
            console.error(error);
            setIsErrorModalOpen(true);
            setTitleErrorModal(isEditingTemplate ? 'Error al actualizar la plantilla' : 'Error al guardar la plantilla');
            setMessageErrorModal('Ocurrió un error al intentar guardar la plantilla. Inténtalo más tarde.');
        } finally {
            setLoadingTemplates(false);
        }
    };



    const getProcessedMessage = () => {
        if (!mensaje) return '';

        let processed = mensaje;

        if (processed.includes('{ID}')) {
            processed = processed.replace(/\{ID\}/gi, selectedID || '[ID]');
        }
        if (processed.includes('{Teléfono}')) {
            processed = processed.replace(/\{Tel[eé]fono\}/gi, selectedPhone || '[Teléfono]');
        }
        if (processed.includes('{Dato}')) {
            processed = processed.replace(/\{Dato\}/gi, selectedDato || '[Dato]');
        }

        return processed;
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

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAcceptDisabled = !templateName.trim() || !mensaje.trim() || (!selectedID && !selectedPhone && !selectedDato);


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
                        fontWeight: '500',
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


            {templates.length === 0 ? (
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
            ) : (
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        mt: 3
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins' }}>
                        <thead>
                            {selectedTemplates.length === 0 ? (
                                <tr style={{ backgroundColor: '#FFFFFF', textAlign: 'left', borderBottom: '1px solid #E6E4E4', }}>
                                    <th style={{ padding: '12px 16px' }}>
                                        <Checkbox
                                            checked={selectedTemplates.length === templates.length && templates.length > 0}
                                            indeterminate={selectedTemplates.length > 0 && selectedTemplates.length < templates.length}
                                            onChange={handleSelectAllTemplates}
                                            sx={{
                                                color: '#7B354D',
                                                '&.Mui-checked': {
                                                    color: '#7B354D'
                                                },
                                                '&.MuiCheckbox-indeterminate': {
                                                    color: '#7B354D'
                                                }
                                            }}
                                        />
                                    </th><th style={{ padding: '12px 16px', fontWeight: 500 }}>Fecha de creación</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Nombre</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Contenido</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 500 }}></th>
                                </tr>
                            ) : (
                                <tr style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E6E4E4', }}>
                                    <th colSpan={5}>
                                        <Box display="flex" alignItems="center" gap={1} pl={2} marginTop={"12px"} marginLeft={"-2px"} marginBottom={"10px"}>
                                            {/*Checkbox para tablas*/}
                                            <Checkbox
                                                checked={selectedTemplates.length === templates.length}
                                                indeterminate={selectedTemplates.length > 0 && selectedTemplates.length < templates.length}
                                                onChange={handleSelectAllTemplates}
                                                sx={{
                                                    color: '#7B354D',
                                                    '&.Mui-checked': {
                                                        color: '#7B354D'
                                                    },
                                                    '&.MuiCheckbox-indeterminate': {
                                                        color: '#7B354D'
                                                    }
                                                }}
                                            />
                                            <Tooltip title="Eliminar Seleccionados" arrow placement="top"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                                                            color: "#CCC3C3",
                                                            fontFamily: "Poppins, sans-serif",
                                                            fontSize: "12px",
                                                            padding: "6px 8px",
                                                            borderRadius: "8px",
                                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)"
                                                        }
                                                    },
                                                    arrow: {
                                                        sx: {
                                                            color: "rgba(0, 0, 0, 0.8)"
                                                        }
                                                    }
                                                }}
                                                PopperProps={{
                                                    modifiers: [
                                                        {
                                                            name: 'offset',
                                                            options: {
                                                                offset: [0, -10] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                            }
                                                        }
                                                    ]
                                                }}
                                            >
                                                <IconButton onClick={handleOpenDeleteSelectedTemplates}>
                                                    <img src={DeleteIcon} alt="Eliminar" style={{ width: 20, height: 20 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </th>
                                </tr>
                            )}
                        </thead>



                        <tbody>
                            {filteredTemplates.length === 0 ? (
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
                                    <img src={Emptybox} alt="Caja vacía" style={{
                                        width: '240px',
                                        marginTop: '-56px',
                                        marginLeft: '620px',
                                        position: 'absolute',
                                    }} />
                                    <Typography
                                        sx={{
                                            fontFamily: 'Poppins',
                                            position: 'absolute',
                                            fontSize: '14px',
                                            color: '#7B354D',
                                            fontWeight: 500,
                                            marginTop: '158px',
                                            marginLeft: '629px',
                                        }}
                                    >
                                        No se encontraron resultados.
                                    </Typography>
                                </Box>
                            ) : (
                                filteredTemplates.map((template) => (
                                    <tr key={template.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                            <Checkbox
                                                checked={selectedTemplates.some((t) => t.id === template.id)}
                                                onChange={() => handleSelectTemplate(template)}
                                                sx={{
                                                    color: '#7B354D',
                                                    '&.Mui-checked': {
                                                        color: '#7B354D'
                                                    },
                                                    '&.MuiCheckbox-indeterminate': {
                                                        color: '#7B354D'
                                                    }
                                                }}
                                            />
                                        </td>

                                        {/* Fecha */}
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                            {new Date(template.creationDate).toLocaleDateString('es-MX')}
                                        </td>

                                        {/* Nombre con Tooltip */}
                                        <td style={{ padding: '12px 16px', fontSize: '14px', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {template.name.length > 15 ? (
                                                <Tooltip title={template.name} arrow>
                                                    <span>{template.name.slice(0, 15) + '...'}</span>
                                                </Tooltip>
                                            ) : (
                                                template.name
                                            )}
                                        </td>

                                        {/* Contenido */}
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{template.message}</td>

                                        {/* Menú de acciones */}
                                        <td
                                            style={{
                                                padding: '12px 16px',
                                                textAlign: 'center',
                                                borderLeft: '1px solid #D9D9D9',
                                            }}
                                        >
                                            <IconButton onClick={(e) => handleMenuClick(e, template)}>
                                                <MoreVertIcon sx={{ color: '#7B354D' }} />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>
                </Box>
            )}



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
                    <Typography variant="h6" fontWeight={500} fontFamily="Poppins">
                        Añadir plantilla
                    </Typography>

                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 100, right: 676 }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography mt={2} fontWeight={500} fontSize={14} fontFamily="Poppins">
                        Nombre
                        <Box component="span" sx={{ color: "#EF5466", ml: "2px" }}>*</Box>
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            size="medium"
                            value={templateName}
                            onChange={(e) => {
                                const onlyValid = e.target.value.replace(/[^a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ\s]/g, '');
                                setTemplateName(onlyValid);
                            }}
                            placeholder="Plantilla 1"
                            sx={{
                                background: '#fff',
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Poppins',
                                },
                                '& input::placeholder': {
                                    fontFamily: 'Poppins',
                                },
                            }}
                        />
                        <Tooltip
                            title={
                                <Box
                                    sx={{
                                        backgroundColor: "#FFFFFF",
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                        padding: "8px 12px",
                                        fontFamily: "Poppins",
                                        fontSize: "12px",
                                        color: "#000000",
                                        whiteSpace: "pre-line",
                                        transform: "translate(-10px, -22px)",
                                        borderColor: "#00131F3D",
                                        borderStyle: "solid",
                                        borderWidth: "1px"
                                    }}
                                >
                                    <>
                                        • Solo caracteres alfabéticos<br />
                                        • Longitud máxima de 40<br />
                                        caracteres
                                    </>
                                </Box>
                            }
                            placement="bottom-end"
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        backgroundColor: "transparent",
                                        padding: 0,

                                    },
                                },
                            }}
                        >
                            <IconButton size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
                                <img src={infoicon} alt="info" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography mt={3} fontWeight={500} fontSize={14} fontFamily="Poppins">
                        Mensaje
                        <Box component="span" sx={{ color: "#EF5466", ml: "2px" }}>*</Box>
                    </Typography>



                    <DynamicMessageEditor
                        initialMessage={mensaje}
                        selectedValues={{
                            id: selectedID,
                            telefono: selectedPhone,
                            dato: selectedDato
                        }}
                        onChange={handleMessageChange}
                        onSelectID={(val) => setSelectedID(val)}
                        onSelectTelefono={(val) => setSelectedPhone(val)}
                        onSelectDato={(val) => setSelectedDato(val)}
                    />


                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            whiteSpace: 'nowrap',
                            fontFamily: 'Poppins',
                            fontWeight: 500
                        }}
                    >
                        <Box sx={{ width: '142px' /* ajusta según lo necesites */ }}>
                            <SecondaryButton
                                onClick={handlePreviewClick}
                                text="Vista Previa"
                                sx={{
                                    width: '142px',
                                    fontFamily: 'Poppins',
                                    fontWeight: 500
                                }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ mt: 3, mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <SecondaryButton text='Cancelar' onClick={handleCloseModal} />

                        <MainButton
                            text='Aceptar'
                            onClick={handleSaveTemplate}
                            disabled={isAcceptDisabled}
                        />
                    </Box>
                </Box>
            </Modal>

            <Modal open={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
                <Box
                    sx={{
                        width: '556px', height: '417px',
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        mx: 'auto',
                        my: '10%',
                        fontFamily: 'Poppins',
                        outline: 'none',
                    }}
                >
                    <Typography fontWeight="500" fontSize="18px" fontFamily="Poppins" color="#330F1B" mb={2}>
                        Vista previa: <span style={{ color: '#7B354D', fontFamily: "Poppins", fontWeight: "500" }}>{templateName || 'Mensaje Prueba 1'}</span>
                    </Typography>

                    <IconButton onClick={() => setOpenPreviewModal(false)} sx={{ position: 'absolute', top: 196, right: 686 }}>
                        <CloseIcon />
                    </IconButton>

                    <Box sx={{ backgroundColor: '#F8E7EC', borderRadius: 2, padding: 2, width: '508px', height: '300px', }}>
                        <Typography fontSize="15px" color="#3A3A3A" fontFamily="Poppins" fontWeight="500">
                            {getProcessedMessage()}
                        </Typography>
                    </Box>
                </Box>
            </Modal>
            <ModalError
                isOpen={isErrorModalOpen}
                title={TitleErrorModal}
                message={MessageErrorModal}
                buttonText="Cerrar"
                onClose={() => setIsErrorModalOpen(false)}
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        borderRadius: 2,
                        mt: 1,
                        minWidth: 160,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        '& .MuiMenuItem-root': {
                            fontFamily: 'Poppins',
                            fontSize: '14px',
                            color: '#333',
                            '&:hover': { backgroundColor: '#F6F6F6' }
                        }
                    }
                }}
            >
                <MenuItem disabled={hasAssignedCampaigns} onClick={() => !hasAssignedCampaigns && handleOpenEditTemplate(selectedTemplate!)}>
                    <ListItemIcon>
                        <EditIcon sx={{ color: hasAssignedCampaigns ? '#B0A8A8' : '#7B354D' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Editar"
                        primaryTypographyProps={{
                            fontFamily: 'Poppins',
                            color: hasAssignedCampaigns ? '#B0A8A8' : 'inherit'
                        }}
                    />
                </MenuItem>



                <MenuItem onClick={() => { handleMenuClose(); handleInspectTemplate(selectedTemplate!); }}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" sx={{ color: '#7B354D' }} />
                    </ListItemIcon>
                    <ListItemText>Inspeccionar</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => { handleMenuClose(); handleOpenDeleteModal(selectedTemplate!); }}
                    disabled={hasAssignedCampaigns}

                >
                    <ListItemIcon>
                        <img src={DeleteIcon} alt="Borrar"
                            style={{
                                width: 24,
                                height: 24,
                                display: 'block',
                                opacity: hasAssignedCampaigns ? 0.5 : 1 // 🔥 Se pone más clarito si está deshabilitado
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText>Eliminar</ListItemText>
                </MenuItem>
            </Menu>

            <Modal open={isInspectModalOpen} onClose={() => setIsInspectModalOpen(false)}>
                <Box sx={{
                    width: '440px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    p: 3,
                    m: 'auto',
                    mt: '10%',
                    outline: 'none',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 500, mb: 2 }}>
                        Inspeccionar plantilla
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 500, mb: 1, color: '#7B354D' }}>
                        Campañas asignadas
                    </Typography>

                    {assignedCampaigns.length > 0 ? (
                        assignedCampaigns.map((campaignName, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1,
                                    borderBottom: '1px solid #eee',
                                    fontFamily: 'Poppins',
                                    fontSize: '14px',
                                    color: '#333'
                                }}
                            >
                                <SmsIcon sx={{ color: '#7B354D' }} />
                                {campaignName}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={Emptybox} alt="No campaigns" style={{ width: '220px', marginBottom: '16px' }} />
                            <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', mt: 1, color: '#999' }}>
                                No hay campañas asignadas.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>

            <MainModal
                isOpen={openDeleteModal}
                Title="Eliminar plantilla"
                message="¿Está seguro de que desea eliminar la plantilla seleccionada? Esta acción no podrá revertirse."
                primaryButtonText="Eliminar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleConfirmDeleteTemplate}
                onSecondaryClick={() => setOpenDeleteModal(false)}
            />
            <MainModal
                isOpen={openMassiveDeleteModal}
                Title="Eliminar plantillas"
                message="¿Está seguro de que desea eliminar las plantillas seleccionadas? Esta acción no podrá revertirse."
                primaryButtonText="Eliminar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleDeleteSelectedTemplates}
                onSecondaryClick={() => setOpenMassiveDeleteModal(false)}
            />

            {
                showChipBar && (
                    <ChipBar
                        message={messageChipBar}
                        buttonText="Cerrar"
                        onClose={() => setShowChipBar(false)}
                    />
                )
            }
        </div >
    );
};

export default Templates;
