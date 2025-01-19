import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { TextField, InputAdornment, MenuItem, Box, Select, FormControl, InputLabel, Menu, Modal, Button, Typography, ListItemText, Checkbox, Grid, IconButton } from '@mui/material';
import HelpIco from '../assets/Icono_ayuda.svg';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { SelectChangeEvent } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Snackbar, Alert } from '@mui/material';
interface CreditCard {
    id: number;
    user_id: number;
    card_number: string;
    card_name: string;
    expiration_month: number;
    expiration_year: number;
    CVV: string;
    is_default: boolean;
    created_at: string;
    updated_at?: string;
    type: string;
}
interface AcceptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    title: string;
    description: string;
}

const MyNumbers: React.FC = () => {
    // Datos en duro para la tabla
    const numbersData = [
        {
            id: 1,
            number: '525512121212',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.',
            state: 'Aguascalientes',
            municipality: 'Calvillo',
            lada: '495'
        },
        {
            id: 2,
            number: '525512121213',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.',
            state: 'Baja California',
            municipality: 'Mexicali',
            lada: '686'
        },
        {
            id: 3,
            number: '525512121214',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.',
            state: 'Baja California Sur',
            municipality: 'La Paz',
            lada: '612'
        },
        {
            id: 4,
            number: '525512121215',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.',
            state: 'Aguascalientes',
            municipality: 'Rincón de Romos',
            lada: '449'
        }
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(numbersData.length / itemsPerPage);

    // Calcular los elementos de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = numbersData.slice(startIndex, startIndex + itemsPerPage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'corto' | 'largo'>('corto');
    const [numberQuantity, setNumberQuantity] = useState(1);
    const [monthlyCost, setMonthlyCost] = useState(50);
    const [totalCost, settotalCost] = useState(50);
    const [costSetup, setcostSetup] = useState(100);
    const [currentStep, setCurrentStep] = useState(1);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]); // Uso del tipo CreditCard[]
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [generateInvoice, setGenerateInvoice] = useState(false);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [isLongNumber, setIsLongNumber] = useState(false); // Nuevo estado para determinar si es largo o corto
    const [selectedState, setSelectedState] = useState('');
    const [municipalities, setMunicipalities] = useState<{ name: string; lada: string }[]>([]);
    const [selectedLada, setSelectedLada] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [municipalitySearch, setMunicipalitySearch] = useState('');
    const [openStateMenu, setOpenStateMenu] = useState(false);
    const [anchorElState, setAnchorElState] = useState<null | HTMLElement>(null);
    const [anchorElMunicipality, setAnchorElMunicipality] = useState<null | HTMLElement>(null);
    const costPerNumberlong = 50;
    const costPerNumbershort = 50;
    const [isModalAyudaOpen, setIsModalAyudaOpen] = useState(false);
    const [stateSearch2, setStateSearch2] = useState('');
    const [selectedStates2, setSelectedStates2] = useState<string[]>([]);
    const [municipalities2, setMunicipalities2] = useState<string[]>([]);
    const [selectedMunicipalities2, setSelectedMunicipalities2] = useState<string[]>([]);
    const [municipalitySearch2, setMunicipalitySearch2] = useState('');
    const [stateMenuOpen, setStateMenuOpen] = useState(false);
    const [municipalityMenuOpen, setMunicipalityMenuOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'darDeBaja' | 'eliminar' | ''>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

    const navigate = useNavigate(); // Inicializa el hook de navegación

    // Función para manejar la navegación a la página de ayuda
    const handleNavigateToHelp = () => {
        navigate('/help'); // Reemplaza '/help' con la ruta correcta a tu componente Help
    };
    const statesOfMexico = [
        {
            state: 'Aguascalientes',
            municipalities: [
                { name: 'Aguascalientes', lada: '449' },
                { name: 'Asientos', lada: '458' },
                { name: 'Calvillo', lada: '495' },
                { name: 'Cosío', lada: '449' },
                { name: 'Jesús María', lada: '449' },
                { name: 'Pabellón de Arteaga', lada: '449' },
                { name: 'Rincón de Romos', lada: '449' },
                { name: 'San José de Gracia', lada: '449' },
                { name: 'Tepezalá', lada: '449' },
                { name: 'El Llano', lada: '449' },
                { name: 'San Francisco de los Romo', lada: '449' },
            ],
        },
        {
            state: 'Baja California',
            municipalities: [
                { name: 'Ensenada', lada: '646' },
                { name: 'Mexicali', lada: '686' },
                { name: 'Tecate', lada: '665' },
                { name: 'Tijuana', lada: '664' },
                { name: 'Playas de Rosarito', lada: '661' },
                { name: 'San Quintín', lada: '616' },
                { name: 'San Felipe', lada: '686' },
            ],
        },
        {
            state: 'Baja California Sur',
            municipalities: [
                { name: 'Comondú', lada: '613' },
                { name: 'La Paz', lada: '612' },
                { name: 'Loreto', lada: '613' },
                { name: 'Los Cabos', lada: '624' },
                { name: 'Mulegé', lada: '615' },
            ],
        },
    ]

    const handleStateChange = (state: string) => {
        setSelectedState(state);
        const stateData = statesOfMexico.find((s) => s.state === state);
        setMunicipalities(stateData ? stateData.municipalities : []);
        setSelectedMunicipality('');
        setSelectedLada('');
        handleStateMenuClose();
    };

    const handleMunicipalityChange = (municipality: { name: string; lada: string }) => {
        setSelectedMunicipality(municipality.name);
        setSelectedLada(municipality.lada);
        handleMunicipalityMenuClose();
    };


    // Función para obtener las tarjetas de crédito
    const fetchCreditCards = async () => {
        const userData = localStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : null;

        if (!user?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CREDITCARD}${user.id}`;
            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                setCreditCards(response.data); // Asigna las tarjetas de crédito al estado
            }
        } catch (error) {
            console.error("Error al obtener las tarjetas de crédito:", error);
        }
    };


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        setNumberQuantity((prev) => {
            let newQuantity = prev;
            if (type === 'increment') newQuantity = prev + 1;
            if (type === 'decrement' && prev > 1) newQuantity = prev - 1;

            // Actualiza el costo mensual en base a la cantidad
            if (!isLongNumber) {

                setMonthlyCost(newQuantity * costPerNumbershort);
            }
            if (isLongNumber) {
                setMonthlyCost(newQuantity * costPerNumberlong)
            }
            return newQuantity;
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            // Realiza la solicitud para obtener las tarjetas de crédito
            await fetchCreditCards();
            // Avanza al siguiente paso
            setCurrentStep(2);
        }
    };


    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };


    const handleSelectCard = (card: CreditCard) => {
        setSelectedCard(card);
    };

    const filteredStates = statesOfMexico.filter((state) =>
        state.state.toLowerCase().includes(stateSearch.toLowerCase())
    );

    const filteredMunicipalities = municipalities.filter((municipality) =>
        municipality.name.toLowerCase().includes(municipalitySearch.toLowerCase())
    );

    const filteredStates2 = statesOfMexico.filter((state) =>
        state.state.toLowerCase().includes(stateSearch2.toLowerCase())
    );

    const handleRent = async () => {
        try {
            const payload = {
                quantity: numberQuantity,
                costSetup,
                monthlyCost,
                cardId: selectedCard?.id,
            };

            await axios.post('/api/rent', payload); // Ajusta la URL según tu API
            alert('Renta realizada exitosamente.');
            handleCloseModal();
        } catch {
            setErrorModal({
                title: "Error al realizar renta",
                message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
            });
        }
    };

    const closeErrorModal = () => {
        setErrorModal(null);
    };

    const handleStateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElState(event.currentTarget);
        setOpenStateMenu(true);
    };

    const handleStateMenuClose = () => {
        setAnchorElState(null);
        setOpenStateMenu(false);
        setStateSearch('');
    };

    const handleStateSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateSearch(event.target.value);
    };

    const handleMunicipalitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMunicipalitySearch(event.target.value);
    };

    const handleMunicipalityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMunicipality(event.currentTarget);
    };


    const handleMunicipalityMenuClose = () => {
        setAnchorElMunicipality(null);
        setMunicipalitySearch('');
    };

    const handleModalAyudaOpen = () => {
        setIsModalAyudaOpen(true);
    };

    const handleModalAyudaClose = () => {
        setIsModalAyudaOpen(false);
    };

    const handleStateSearchChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateSearch2(event.target.value);
    };
    const handleStateChange2 = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[]; // Asegúrate de que sea un arreglo de strings
        setSelectedStates2(value);
    };

    const handleClearSelection = () => {
        setSelectedStates2([]);
        setMunicipalities2([]);
    };

    const handleApplySelection = () => {
        const selectedMunicipalities: string[] = [];
        selectedStates2.forEach((state) => {
            const stateData = statesOfMexico.find((s) => s.state === state);
            if (stateData) {
                stateData.municipalities.forEach((municipality) => {
                    selectedMunicipalities.push(municipality.name);
                });
            }
        });
        setSelectedMunicipalities2(selectedMunicipalities);
        setStateMenuOpen(false); // Cerrar el menú después de aplicar
    };

    const handleMunicipalitySearchChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMunicipalitySearch2(event.target.value);
    };

    const handleMunicipalityChange2 = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedMunicipalities2(event.target.value as string[]);
    };



    const handleClearMunicipalitySelection = () => {
        setSelectedMunicipalities2([]);
    };

    const handleApplyMunicipalitySelection = () => {
        setMunicipalityMenuOpen(false); // Cerrar el menú de municipios después de aplicar
    };

    const filteredMunicipalities2 = selectedStates2
        .flatMap((state) => {
            const stateData = statesOfMexico.find((s) => s.state === state);
            return stateData ? stateData.municipalities : [];
        })
        .filter((municipality) =>
            municipality.name.toLowerCase().includes(municipalitySearch2.toLowerCase())
    );

    const handleRowSelection = (id: number) => {
        setSelectedRows((prevSelectedRows) => {
            const updatedSelection = prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id];

            setIsAnyRowSelected(updatedSelection.length > 0); // Verifica si hay filas seleccionadas
            return updatedSelection;
        });
    };

    const handleSelectAllRows = () => {
        const updatedSelection =
            selectedRows.length === currentItems.length
                ? []
                : currentItems.map((item) => item.id);

        setSelectedRows(updatedSelection);
        setIsAnyRowSelected(updatedSelection.length > 0); // Verifica si hay filas seleccionadas
    };

    const handleOpenAcceptModal = (action: 'darDeBaja' | 'eliminar') => {
        setActionType(action);
        setIsAcceptModalOpen(true);
    };

    const handleCloseAcceptModal = () => {
        setActionType('');
        setIsAcceptModalOpen(false);
    };

    const handleCloseToast = () => {
        setToastOpen(false);
    };

    const handleAccept = async () => {
        try {
            if (actionType === 'darDeBaja') {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una espera
                setToastMessage('El número fue dado de baja correctamente.');
                setToastSeverity('success');
            }
            if (actionType === 'eliminar') {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una espera
                setToastMessage('El número fue eliminado correctamente.');
                setToastSeverity('success');
            }
            setToastOpen(true); // Muestra el toast
            setIsModalOpen(false); // Cierra el modal
        } catch {
            if (actionType === 'darDeBaja') {
                setErrorModal({
                    title: "Error al procesar la solicitud",
                    message: "Error al dar de baja los números",
                });
            }
            if (actionType === 'eliminar') {
                setErrorModal({
                    title: "Error al procesar la solicitud",
                    message: "Error al eliminar los números",
                });
            }
        } finally {
            setIsModalOpen(false);
        }
    };

    const getModalContent = () => {
        if (actionType === 'darDeBaja') {
            return {
                title: 'Dar de baja números',
                message: '¿Está seguro de que desea dar de baja los números seleccionados? Pasarán 30 días en cuarentena sin poder ser utilizados.',
            };
        }
        if (actionType === 'eliminar') {
            return {
                title: 'Eliminar números',
                message: '¿Está seguro de que desea eliminar los números seleccionados? Esta acción no podrá ser revertida.',
            };
        }
        return { title: '', message: '' };
    };

    const modalContent = getModalContent();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Mis números</h2>
            <hr style={{
                border: 'none',
                height: '1px',
                backgroundColor: '#dcdcdc',
                marginBottom: '20px'
            }} />
            {/* Filtros */}
            <div style={{ marginBottom: '20px' }}>
                {/* Fila superior con Estado, Municipio, Buscador y Rentar Números */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    {/* Botones de Estado y Municipio */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {/* Select de estados con búsqueda */}
                                    <Select
                                        multiple
                                        displayEmpty
                                        value={selectedStates2}
                                        onChange={handleStateChange2}
                                        open={stateMenuOpen}
                                        onOpen={() => setStateMenuOpen(true)}
                                        onClose={() => setStateMenuOpen(false)}
                                        renderValue={() => 'Seleccionar estados'} // Texto fijo
                                        fullWidth
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 150, // Altura máxima
                                                    overflowY: 'auto', // Scroll
                                                },
                                            },
                                        }}
                                    >
                                        <Box p={1}>
                                            <TextField
                                                placeholder="Buscar estado"
                                                variant="outlined"
                                                fullWidth
                                                value={stateSearch2}
                                                onChange={handleStateSearchChange2}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                        {filteredStates2.map((state) => (
                                            <MenuItem key={state.state} value={state.state}>
                                                <Checkbox checked={selectedStates2.includes(state.state)} />
                                                <ListItemText primary={state.state} />
                                            </MenuItem>
                                        ))}
                                        <Box p={1} display="flex" justifyContent="space-between">
                                            <Button
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el botón cierre el menú
                                                    handleClearSelection();
                                                }}
                                                style={{ color: '#8d406d', borderColor: '#8d406d' }}
                                            >
                                                LIMPIAR
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el botón cierre el menú
                                                    handleApplySelection();
                                                }}
                                                style={{ backgroundColor: '#8d406d', color: '#fff' }}
                                            >
                                                APLICAR
                                            </Button>
                                        </Box>
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    {/* Select de municipios generados con búsqueda */}
                                    <Select
                                        multiple
                                        displayEmpty
                                        value={selectedMunicipalities2}
                                        onChange={handleMunicipalityChange2}
                                        open={municipalityMenuOpen}
                                        onOpen={() => setMunicipalityMenuOpen(true)}
                                        onClose={() => setMunicipalityMenuOpen(false)}
                                        renderValue={() => 'Seleccionar municipios'} // Texto fijo
                                        fullWidth
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 150, // Altura máxima
                                                    overflowY: 'auto', // Scroll
                                                },
                                            },
                                        }}
                                    >
                                        <Box p={1}>
                                            <TextField
                                                placeholder="Buscar municipio"
                                                variant="outlined"
                                                fullWidth
                                                value={municipalitySearch2}
                                                onChange={handleMunicipalitySearchChange2}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                        {filteredMunicipalities2.map((municipality) => (
                                            <MenuItem key={municipality.name} value={municipality.name}>
                                                <Checkbox checked={selectedMunicipalities2.includes(municipality.name)} />
                                                <ListItemText primary={municipality.name} />
                                            </MenuItem>
                                        ))}
                                        <Box p={1} display="flex" justifyContent="space-between">
                                            <Button
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el botón cierre el menú
                                                    handleClearMunicipalitySelection();
                                                }}
                                                style={{ color: '#8d406d', borderColor: '#8d406d' }}
                                            >
                                                LIMPIAR
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el botón cierre el menú
                                                    handleApplyMunicipalitySelection();
                                                }}
                                                style={{ backgroundColor: '#8d406d', color: '#fff' }}
                                            >
                                                APLICAR
                                            </Button>
                                        </Box>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>

                    {/* Buscador y Botón de Rentar Números */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={handleOpenModal}
                            style={{
                                padding: '10px 20px', // Un poco más grande
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: '#8d406d',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                            }}>
                            <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span> Rentar Números
                        </button>
                        <div style={{ position: 'relative', width: '250px' }}>
                            <SearchIcon style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6a6a6a',
                            }} />
                            <input
                                type="text"
                                placeholder="Buscar"
                                style={{
                                    width: '100%',
                                    padding: '8px 12px 8px 32px', // Espacio para la lupa a la izquierda
                                    border: '1px solid #dcdcdc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Línea horizontal debajo del buscador y botón */}
                <div style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#dcdcdc',
                    margin: '10px 0',
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    {/* Controles de paginación */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: '#6a6a6a' }}>
                            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, numbersData.length)} de {numbersData.length}
                        </span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {/* Botón para ir a la primera página */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'|<<'}
                            </button>

                            {/* Botón para ir a la página anterior */}
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'<<'}
                            </button>

                            {/* Botón para ir a la siguiente página */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'>>'}
                            </button>

                            {/* Botón para ir a la última página */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'>>|'}
                            </button>
                        </div>
                    </div>

                    {/* Botón Servicios Adicionales */}
                    <div>
                        <button
                            style={{
                                backgroundColor: '#f8d7da',
                                color: '#8d406d',
                                border: '1px solid #8d406d',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#dba0a8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8d7da';
                            }}
                            onClick={handleModalAyudaOpen}
                        >

                            SERVICIOS ADICIONALES
                        </button>
                    </div>
                </div>

            </div>


            {/* Tabla */}
            <div style={{ border: '1px solid #dcdcdc', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: '#f9f9f9', color: '#6a6a6a' }}>
                        {isAnyRowSelected ? (
                            <tr>
                                <th colSpan={7} style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <Tooltip title="Dar de baja">
                                            <button
                                                style={{
                                                    padding: '8px 12px',
                                                    border: 'none',
                                                    backgroundColor: '#e0e0e0',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleOpenAcceptModal('darDeBaja')}                                            >
                                                ➖
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <button
                                                style={{
                                                    padding: '8px 12px',
                                                    border: 'none',
                                                    backgroundColor: '#e0e0e0',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleOpenAcceptModal('eliminar')}                                            >
                                                🗑️
                                            </button>
                                        </Tooltip>
                                    </div>
                                </th>
                            </tr>
                        ) : (
                            <tr>
                                <th style={{ textAlign: 'center', padding: '10px' }}>
                                    <Checkbox
                                        checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < currentItems.length}
                                        onChange={handleSelectAllRows}
                                    />
                                </th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Número</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Tipo</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Servicio</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Costo</th>
                                <th style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid #dcdcdc' }}>
                                    Fecha del próx. pago
                                </th>
                                <th style={{ textAlign: 'center', padding: '10px' }}>Acciones</th>
                            </tr>
                        )}
                    </thead>;
                    <tbody>
                        {currentItems.map((number) => (
                            <tr key={number.id} style={{ borderBottom: '1px solid #dcdcdc' }}>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <Checkbox
                                        checked={selectedRows.includes(number.id)}
                                        onChange={() => handleRowSelection(number.id)}
                                    />
                                </td>
                                <td style={{ padding: '10px' }}>{number.number}</td>
                                <td style={{ padding: '10px' }}>{number.type}</td>
                                <td style={{ padding: '10px' }}>{number.service}</td>
                                <td style={{ padding: '10px' }}>{number.cost}</td>
                                <td style={{ padding: '10px' }}>{number.nextPaymentDate}</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleOpenMenu}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseMenu}
                                    >
                                        <MenuItem    onClick={() => handleOpenAcceptModal('darDeBaja')}   >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>❌</span> Dar de baja
                                            </span>
                                        </MenuItem>
                                        <MenuItem onClick={() => handleOpenAcceptModal('eliminar')}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>🗑️</span> Eliminar
                                            </span>
                                        </MenuItem>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '500px',
                            maxHeight: '70vh', // Límite para altura del modal
                            overflowY: 'auto', // Habilita scroll en todo el modal
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {currentStep === 1 && (
                            <>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Renta de números</h2>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                    <button
                                        onClick={() => setIsLongNumber(false)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            border: isLongNumber ? '1px solid #dcdcdc' : '1px solid #8d406d',
                                            backgroundColor: isLongNumber ? '#fff' : '#8d406d',
                                            color: isLongNumber ? '#8d406d' : '#fff',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Número corto
                                    </button>
                                    <button
                                        onClick={() => setIsLongNumber(true)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            border: isLongNumber ? '1px solid #8d406d' : '1px solid #dcdcdc',
                                            backgroundColor: isLongNumber ? '#8d406d' : '#fff',
                                            color: isLongNumber ? '#fff' : '#8d406d',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Número largo
                                    </button>
                                </div>


                                <p style={{ fontSize: '0.9rem', color: '#6a6a6a', marginBottom: '20px' }}>
                                    {isLongNumber
                                        ? "Nota: Los números largos son dedicados. Tienen un costo inicial y mensual. El tiempo de espera para la implementación es de 4 semanas."
                                        : "Nota: La renta de los números dedicados toma de 2 a 4 semanas."}
                                </p>


                                <hr style={{ margin: '20px 0', borderColor: '#dcdcdc' }} />

                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>Elegir cantidad de números</h3>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => handleQuantityChange('decrement')}
                                            style={{
                                                padding: '5px 10px',
                                                border: '1px solid #dcdcdc',
                                                borderRadius: '4px',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="text"
                                            value={numberQuantity}
                                            readOnly
                                            style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                padding: '5px',
                                                border: '1px solid #dcdcdc',
                                                borderRadius: '4px',
                                                fontSize: '1rem',
                                            }}
                                        />
                                        <button
                                            onClick={() => handleQuantityChange('increment')}
                                            style={{
                                                padding: '5px 10px',
                                                border: '1px solid #dcdcdc',
                                                borderRadius: '4px',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {!isLongNumber && (
                                    <div style={{ marginBottom: '20px', color: '#4a4a4a', fontSize: '1rem' }}>
                                        <p><strong>Costo por setup (único):</strong> ${costSetup.toFixed(2)}</p>
                                        <p><strong>Costo mensual:</strong> ${monthlyCost.toFixed(2)}</p>
                                    </div>
                                )}
                                {isLongNumber && (
                                    <div
                                        style={{
                                            maxHeight: '50vh', // Límite de altura para forzar scroll si el contenido excede
                                            overflowY: 'auto', // Activa el scroll vertical si el contenido es mayor al `maxHeight`
                                            paddingRight: '10px',
                                            boxSizing: 'border-box', // Asegura que los paddings no excedan el área total
                                        }}
                                    >
                                        <TextField
                                            label="Estado"
                                            value={selectedState}
                                            onClick={handleStateMenuOpen}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Menu
                                            anchorEl={anchorElState}
                                            open={Boolean(anchorElState)}
                                            onClose={handleStateMenuClose}
                                            PaperProps={{
                                                style: { maxHeight: '300px', width: anchorElState ? anchorElState.clientWidth : undefined },
                                            }}
                                        >
                                            <div style={{ padding: '8px' }}>
                                                <TextField
                                                    placeholder="Buscar estado"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={stateSearch}
                                                    onChange={handleStateSearchChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                            {filteredStates.map((state) => (
                                                <MenuItem key={state.state} onClick={() => handleStateChange(state.state)}>
                                                    {state.state}
                                                </MenuItem>
                                            ))}
                                        </Menu>

                                        <TextField
                                            label="Municipio"
                                            value={selectedMunicipality}
                                            onClick={handleMunicipalityMenuOpen}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled={!municipalities.length}
                                        />
                                        <Menu
                                            anchorEl={anchorElMunicipality}
                                            open={Boolean(anchorElMunicipality)}
                                            onClose={handleMunicipalityMenuClose}
                                            PaperProps={{
                                                style: { maxHeight: '300px', width: anchorElMunicipality ? anchorElMunicipality.clientWidth : undefined },
                                            }}
                                        >
                                            <div style={{ padding: '8px' }}>
                                                <TextField
                                                    placeholder="Buscar municipio"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={municipalitySearch}
                                                    onChange={handleMunicipalitySearchChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                            {filteredMunicipalities.map((municipality) => (
                                                <MenuItem
                                                    key={municipality.name}
                                                    onClick={() => handleMunicipalityChange(municipality)}
                                                >
                                                    {municipality.name}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                        <TextField
                                            label="LADA"
                                            value={selectedLada}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />

                                        <TextField
                                            label="Costo inicial"
                                            value={`$${monthlyCost.toFixed(2)}`}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />

                                        <TextField
                                            label="Costo mensual"
                                            value={`$${monthlyCost.toFixed(2)}`}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                )}


                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={handleCloseModal}
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#8d406d',
                                            border: '2px solid #8d406d',
                                            borderRadius: '5px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        style={{
                                            backgroundColor: '#8d406d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Renta de números</h2>
                                {isLongNumber ? (
                                    <>
                                        <p style={{ margin: '5px 0' }}><strong>Números:</strong> {numberQuantity}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Estado:</strong> {selectedState || 'No seleccionado'}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Municipio:</strong> {selectedMunicipality || 'No seleccionado'}</p>
                                        <p style={{ margin: '5px 0' }}><strong>LADA:</strong> {selectedLada || 'No seleccionado'}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Costo inicial:</strong> ${monthlyCost.toFixed(2)}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Costo mensual:</strong> ${monthlyCost.toFixed(2)}</p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #dcdcdc', borderRadius: '8px' }}>
                                            <p style={{ margin: '5px 0' }}>Números: {numberQuantity}</p>
                                            <p style={{ margin: '5px 0' }}>Costo por setup: ${costSetup.toFixed(2)}</p>
                                            <p style={{ margin: '5px 0' }}>Costo mensual: ${monthlyCost.toFixed(2)}</p>
                                        </div>
                                    </>
                                )}

                                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#4a4a4a' }}>Seleccionar método de pago</h3>
                                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
                                    {creditCards.map((card) => (
                                        <div
                                            key={card.id}
                                            style={{
                                                border: selectedCard?.id === card.id ? '2px solid #8d406d' : '1px solid #dcdcdc',
                                                borderRadius: '8px',
                                                padding: '15px',
                                                width: '250px',
                                                backgroundColor: selectedCard?.id === card.id ? '#f3e6f5' : '#fff',
                                                position: 'relative', // Para posicionar los elementos
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {/* Botón de eliminar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que seleccione la tarjeta al hacer click
                                                    /*  openDeleteModal(card);*/
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                🗑️
                                            </button>

                                            {/* Tipo de tarjeta */}
                                            <span style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                color: '#8d406d',
                                                textTransform: 'uppercase',
                                            }}>
                                                {card.type}
                                            </span>

                                            {/* Nombre de la tarjeta */}
                                            <p style={{ margin: '25px 0 0', fontWeight: 'bold', color: '#4a4a4a' }}>
                                                {card.card_name}
                                            </p>

                                            {/* Terminación y vencimiento */}
                                            <p style={{ margin: '5px 0' }}>Terminación: •••• {card.card_number.slice(-4)}</p>
                                            <p style={{ margin: 0 }}>
                                                Vencimiento: {card.expiration_month}/{card.expiration_year.toString().slice(-2)}
                                            </p>

                                            {/* Radio button para seleccionar tarjeta */}
                                            <label style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginTop: '15px',
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="selectedCard"
                                                    checked={selectedCard?.id === card.id}
                                                    onChange={() => handleSelectCard(card)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                Seleccionar tarjeta
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                                    Generar factura automáticamente
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={handlePreviousStep}
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#8d406d',
                                            padding: '10px 20px',
                                            border: '2px solid #8d406d',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        style={{
                                            backgroundColor: '#8d406d',
                                            color: '#fff',
                                            padding: '10px 20px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                        )}
                        {currentStep === 3 && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>
                                    Datos de facturación
                                </h2>

                                <div style={{
                                    backgroundColor: '#f9f9f9',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontSize: '0.9rem',
                                    color: '#4a4a4a',
                                }}>
                                    <p><strong>Nombre o razón social:</strong> Nuxiba</p>
                                    <p><strong>RFC:</strong> VECJ880326</p>
                                    <p><strong>Código postal:</strong> 45678</p>
                                    <p><strong>Régimen fiscal:</strong> Régimen ejemplo</p>
                                    <p><strong>Descripción de los bienes o servicios:</strong> Régimen ejemplo</p>
                                    <p><strong>Créditos:</strong> {numberQuantity.toLocaleString()}</p>
                                    <p><strong>Precio unitario:</strong> ${costSetup.toFixed(2)}</p>
                                    <p><strong>Costo total:</strong> ${monthlyCost.toFixed(2)}</p>
                                    <p><strong>Método de pago:</strong> {selectedCard?.type} **{selectedCard?.card_number.slice(-4)}, {selectedCard?.card_name}</p>
                                </div>

                                {/* Botones de navegación */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#8d406d',
                                            border: '2px solid #8d406d',
                                            borderRadius: '5px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ATRÁS
                                    </button>
                                    <button
                                        onClick={handleRent}
                                        style={{
                                            backgroundColor: '#8d406d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        RENTAR
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {errorModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '400px',
                        textAlign: 'center',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>{errorModal.title}</h3>
                        <p style={{ marginBottom: '20px', color: '#6a6a6a' }}>{errorModal.message}</p>
                        <button
                            onClick={closeErrorModal}
                            style={{
                                backgroundColor: '#fff',
                                color: '#8d406d',
                                border: '2px solid #8d406d',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            CERRAR
                        </button>
                    </div>
                </div>
            )}
            <Modal
                open={isModalAyudaOpen}
                onClose={handleModalAyudaClose}
                aria-labelledby="modal-ayuda-title"
                aria-describedby="modal-ayuda-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #dcdcdc',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography id="modal-ayuda-title" variant="h6" component="h2">
                            Servicios adicionales
                        </Typography>
                        <CloseIcon
                            onClick={handleModalAyudaClose}
                            style={{ cursor: 'pointer', color: '#8d406d' }}
                        />
                    </Box>
                    <Typography id="modal-ayuda-description" sx={{ mt: 2, mb: 4 }}>
                        Si requiere un servicio adicional como compra de troncal, rotación automática o regionalizada de números por troncal entre otros, favor de llamar al ejecutivo de la cuenta.
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={handleModalAyudaClose}
                            sx={{
                                borderColor: '#8d406d',
                                color: '#8d406d',
                                '&:hover': {
                                    backgroundColor: '#f8d7da',
                                    borderColor: '#8d406d',
                                },
                            }}
                        >
                            CANCELAR
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#8d406d',
                                '&:hover': {
                                    backgroundColor: '#732d57',
                                },
                            }}
                            onClick={handleNavigateToHelp}
                        >
                            <img src={HelpIco} alt="Ayuda" style={{ width: '20px', height: '20px' }} />
                            ¿AYUDA?
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {isAcceptModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '400px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>
                            {modalContent.title}
                        </h2>
                        <p style={{ fontSize: '1rem', marginBottom: '20px', color: '#6a6a6a' }}>
                            {modalContent.message}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={handleCloseAcceptModal}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    color: '#8d406d',
                                    border: '2px solid #8d406d',
                                    cursor: 'pointer',
                                }}
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={handleAccept}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    backgroundColor: '#8d406d',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                ACEPTAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default MyNumbers;
