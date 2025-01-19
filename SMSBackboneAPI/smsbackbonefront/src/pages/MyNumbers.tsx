import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { TextField, InputAdornment, MenuItem, Box, Select, FormControl, InputLabel, Menu } from '@mui/material';
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

const MyNumbers: React.FC = () => {
    // Datos en duro para la tabla
    const numbersData = [
        {
            number: '525512121212',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
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
    const costPerNumber = 50;
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

                setMonthlyCost(newQuantity * 50);
            }
            if (isLongNumber) {
                settotalCost(newQuantity * costPerNumber)
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
                        <button style={{
                            padding: '10px 20px',
                            border: '1px solid #dcdcdc',
                            borderRadius: '50px', // Bordes ovalados
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: '#6a6a6a',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            Estado
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            border: '1px solid #dcdcdc',
                            borderRadius: '50px', // Bordes ovalados
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: '#6a6a6a',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            Municipio
                        </button>
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
                        <button style={{
                            padding: '8px 12px',
                            border: '1px solid #8d406d',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            color: '#8d406d',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}>
                            SERVICIOS ADICIONALES
                        </button>
                    </div>
                </div>

            </div>


            {/* Tabla */}
            <div style={{ border: '1px solid #dcdcdc', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: '#f9f9f9', color: '#6a6a6a' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Número</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Tipo</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Servicio</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Costo</th>
                            <th style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid #dcdcdc' }}>Fecha del próx. pago</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((number, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #dcdcdc' }}>
                                <td style={{ padding: '10px' }}>{number.number}</td>
                                <td style={{ padding: '10px' }}>{number.type}</td>
                                <td style={{ padding: '10px' }}>{number.service}</td>
                                <td style={{ padding: '10px' }}>{number.cost}</td>
                                <td style={{ padding: '10px' }}>{number.nextPaymentDate}</td>
                                <td style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    borderLeft: '1px solid #dcdcdc'
                                }}>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '2px',
                                        }}>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                        </div>
                                    </button>
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
                                            value={`$${totalCost.toFixed(2)}`}
                                            fullWidth
                                            margin="normal"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />

                                        <TextField
                                            label="Costo mensual"
                                            value={`$${totalCost.toFixed(2)}`}
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
                                        <p style={{ margin: '5px 0' }}><strong>Costo inicial:</strong> ${costSetup.toFixed(2)}</p>
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

        </div>
    );
};

export default MyNumbers;
