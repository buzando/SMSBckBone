import React, { useState, useEffect } from 'react';
import MainIcon from '../components/commons/MainButtonIcon';
import axios from 'axios';
import ModalError from "../components/commons/ModalError"
import ChipBar from "../components/commons/ChipBar";
import MainModal from "../components/commons/MainModal"
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SecondaryButton from '../components/commons/SecondaryButton'
import MainButton from '../components/commons/MainButton'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import infoicon from '../assets/Icon-info.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'
import { InputAdornment, Tooltip, TooltipProps } from "@mui/material";
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import trash from '../assets/Icon-trash-Card.svg'
import Radio from '@mui/material/Radio';


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

interface FormData {
    cardNumber: string;
    cardName: string;
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    cvv: string;
    month: string;
    year: string;
    isDefault: boolean;
    type: string;
}

type Errors = {
    [K in keyof FormData]?: string;
};
const PaymentMethods: React.FC = () => {
    const [Loading, setLoading] = useState(false);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [showChipBarCard, setshowChipBarCard] = useState(false);
    const [MessageChipBar, setMessageChipBar] = useState('');
    const [OpenModal, setOpenModal] = useState(false);
    const [TitleErrorModal, setTitleErrorModal] = useState('');
    const [MessageErrorModal, setMessageErrorModal] = useState('');
    const [TitleMainModal, setTitleMainModal] = useState('');
    const [MessageMainModal, setMessageMainModal] = useState('');
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        cardNumber: '',
        cardName: '',
        street: '',
        exteriorNumber: '',
        interiorNumber: '',
        neighborhood: '',
        city: '',
        state: '',
        postalCode: '',
        cvv: '',
        month: '',
        year: '',
        isDefault: false,
        type: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


    const WhiteTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .MuiTooltip-tooltip`]: {
            backgroundColor: '#ffffff',
            color: '#000000',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            borderRadius: '4px',
        },
    }));

    const validateField = (name: string, value: string) => {
        let error = '';
        const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/;
        const textRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        const numberRegex = /^[0-9]+$/;
        const postalCodeRegex = /^[0-9]{5}$/;
        const cvvRegex = /^[0-9]{3,4}$/; // CVV debe ser 3 o 4 dígitos según el tipo de tarjeta

        switch (name) {
            case 'cardNumber':
                if (!cardRegex.test(value)) {
                    error = 'Número de tarjeta no válido';
                } else {
                    const detectedType = detectCardType(value);
                    setFormData((prev) => ({
                        ...prev,
                        type: detectedType, // Se actualiza automáticamente el tipo de tarjeta
                    }));
                }
                break;
            case 'cardName':
            case 'street':
            case 'neighborhood':
            case 'city':
            case 'state':
                if (!textRegex.test(value)) error = 'No se permiten caracteres especiales';
                break;
            case 'exteriorNumber':
                if (!numberRegex.test(value)) error = 'Solo se permiten números';
                break;
            case 'interiorNumber':
                if (value && !numberRegex.test(value)) error = 'Solo se permiten números';
                break;
            case 'postalCode':
                if (!postalCodeRegex.test(value)) error = 'Debe ser un código postal válido (5 dígitos)';
                break;
            case 'cvv':
                if (!cvvRegex.test(value)) error = 'CVV no válido. Debe contener 3 o 4 dígitos';
                break;
            case 'month':
                if (!numberRegex.test(value) || parseInt(value, 10) < 1 || parseInt(value, 10) > 12) error = 'Mes no válido';
                break;
            case 'year':
                if (!numberRegex.test(value) || value.length !== 4) error = 'Año no válido';
                break;
            default:
                break;
        }
        return error;
    };

    const detectCardType = (number: string) => {
        if (/^4/.test(number)) {
            return "Visa";
        } else if (/^5[1-5]/.test(number)) {
            return "Mastercard";
        } else if (/^3[47]/.test(number)) {
            return "American Express";
        }
        return "Desconocida"; // En caso de no coincidir con ningún tipo
    };


    const handleDeleteCard = async () => {
        if (!cardToDelete) return;
        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_DELETE_CREDITCARD + cardToDelete.id}`;
            const response = await axios.get(requestUrl);


            if (response.status === 200) {
                await fetchCreditCards();
                setMessageChipBar('La tarjeta se borro correctamente');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
            }


        } catch {
            setTitleErrorModal('Error al eliminar tarjeta');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);
        } finally {
            setIsAddCardModalOpen(false);
        }
    };


    const openDeleteModal = (card: CreditCard) => {
        setCardToDelete(card);
        setTitleMainModal('Eliminar Tarjeta');
        setMessageMainModal('¿Estás seguro de que deseas eliminar la tarjeta seleccionada? Esta acción no podrá revertida.');
        setOpenModal(true);
    };

    const fetchCreditCards = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el correo electrónico del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CREDITCARD}${obj.id}`;
            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                setCreditCards(response.data); // Asigna las tarjetas de crédito al estado
            }
        } catch  {
            setTitleErrorModal('Error al traer información de sus tarjetas');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);
        }
    };

    useEffect(() => {
        fetchCreditCards();
    }, []);

    const handleAddCardSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Formulario enviado");
        setIsAddCardModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsAddCardModalOpen(false);
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const years = Array.from(new Array(30), (_, index) => `${new Date().getFullYear() + index}`);

    const addCreditCard = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_CREDITCARD}`;
            const payload = {
                user_id: obj.id, 
                card_number: formData.cardNumber,
                card_name: formData.cardName,
                expiration_month: parseInt(formData.month), 
                expiration_year: parseInt(formData.year), 
                cvv: formData.cvv,
                is_default: formData.isDefault,
                type: formData.type, 
                street: formData.street,
                exterior_number: formData.exteriorNumber,
                interior_number: formData.interiorNumber || null, 
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
            };

            const response = await axios.post(requestUrl, payload, {
    headers: {
        'Content-Type': 'application/json',
    },
});

            if (response.status === 200) {
                setMessageChipBar('La tarjeta se añadió correctamente');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchCreditCards();
                handleCloseModal();
            }
        } catch {
            setTitleErrorModal('Error al añadir tarjeta');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);
        } finally {
            handleCloseModal();
            setLoading(false);
        }
    };
    const areRequiredFieldsFilled = (): boolean => {
        // Verifica que los campos requeridos no estén vacíos
        const requiredFields = [
            formData.cardNumber,
            formData.cardName,
            formData.street,
            formData.exteriorNumber,
            formData.neighborhood,
            formData.city,
            formData.state,
            formData.postalCode,
            formData.cvv,
            formData.month,
            formData.year,
        ];

        // Devuelve true si todos los campos requeridos están llenos y sin errores
        return requiredFields.every((field) => field.trim() !== '') && Object.values(errors).every((error) => !error);
    };

    const handleCloseAddCardModal = () => {
        setTitleMainModal('Cancelación');
        setMessageMainModal('¿Estás seguro de que deseas cancelar? Los datos ingresados no serán almacenados.');
        setIsAddCardModalOpen(false);
        setIsConfirmModalOpen(true); // Abre el modal de confirmación
    };

    const handleCloseCancelationModal = () => {
        setTitleMainModal('');
        setMessageMainModal('');
        setIsAddCardModalOpen(true);
        setIsConfirmModalOpen(false); // Abre el modal de confirmación
    };

    const handleConfirmAccept = () => {
        setFormData({
            cardNumber: '',
            cardName: '',
            month: '',
            year: '',
            cvv: '',
            isDefault: false,
            street: '',
            exteriorNumber: '',
            interiorNumber: '',
            neighborhood: '',
            city: '',
            state: '',
            postalCode: '',
            type: '',
        }); // Limpia los datos
        setIsConfirmModalOpen(false); // Cierra el modal de confirmación
        setIsAddCardModalOpen(false); // Cierra el modal principal
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let name: string, value: string | number | boolean;

        if ("target" in e) { // ✅ TypeScript ya reconoce que e tiene target
            const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            name = target.name;
            value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
        } else {
            return; // Evita que TypeScript marque un error
        }

        // Aseguramos que los valores de 'month' y 'year' sean strings
        if (name === "month" || name === "year") {
            value = value.toString();
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value.toString()) }));
    };

    const handleSelectCard = async (card: CreditCard) => {
        setSelectedCard(card);
        try {
            // Payload que se enviará al API
            const payload = {
                id: card.id,
                is_default: true,
            };
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_DEFAULT_CREDITCARD}`;
            // Simulación de llamada al API
            const response = await axios.post(requestUrl, payload);

            if (response.status === 200) {
                setMessageChipBar('La tarjeta se definio como predeterminada');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchCreditCards();
            }
            
            // Actualiza el estado local para reflejar el cambio
            //setCards((prevCards) =>
            //    prevCards.map((card) => ({
            //        ...card,
            //        is_default: card.id === cardId, // Solo la tarjeta seleccionada será predeterminada
            //    }))
            //);

        } catch  {
            setTitleErrorModal('Error al definir tarjeta como predeterminada');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);
        }
    };


    return (
        <div style={{ padding: '20px', marginTop: '-80px' }}>
            <h1
                className="mb-2"
                style={{
                    textAlign: "left",
                    font: "normal normal medium 26px/55px Poppins",
                    letterSpacing: "0px",
                    color: "#330F1B",
                    opacity: 1,
                    fontSize: "26px"
                }}
            >
                Metodos de pago
            </h1>
            <hr style={{ width: "100%", border: "1px solid #ccc" }} />
            <p
                className="mb-4"
                style={{
                    textAlign: "left",
                    font: "normal normal medium 18px/22px Poppins",
                    letterSpacing: "0px",
                    color: "#330F1B",
                    opacity: 1,
                    fontSize: "18px"
                }}
            >
                Agregué un metodo de pago o seleccione uno existente
            </p>
            <MainIcon
                text="Agregar Tarjeta"
                isLoading={Loading}
                onClick={() => setIsAddCardModalOpen(true)}
                width="210px"
            >
                <span className="flex items-center">
                    <span className="mr-2">+</span> Add Card
                </span>
            </MainIcon>
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                {creditCards.map((card) => (
                    <div
                        key={card.id}
                        style={{
                            border: selectedCard?.id === card.id ? '2px solid #8d406d' : '1px solid #dcdcdc',
                            borderRadius: '8px',
                            padding: '15px',
                            width: '360px', // Ancho del contenedor
                            height: '172px', // Alto del contenedor
                            position: 'relative',
                            backgroundColor: selectedCard?.id === card.id ? '#f3e6f5' : '#fff',
                        }}
                    >
                        {/* Barra lateral de color */}
                        {selectedCard?.id === card.id && (
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: '8px',
                                backgroundColor: '#8F4D63',
                                borderTopLeftRadius: '8px',
                                borderBottomLeftRadius: '8px',
                            }}></div>
                        )}
                        {/* Marca de la tarjeta */}
                        <div style={{
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textAlign: "left",
                            fontFamily: "Poppins",
                            letterSpacing: "0px",
                            color: "#330F1B",
                            opacity: 1,
                            fontSize: "14px"
                        }}>
                            <div>
                                {card.type}
                            </div>
                        </div>

                        {/* Detalles */}

                        <div
                            style={{
                                fontSize: '14px',
                                fontFamily: "Poppins",
                                display: 'flex',
                                flexDirection: 'column', // Distribución en filas
                                gap: '5px', // Espacio entre filas
                                lineHeight: '1.2', // Compacta las líneas ligeramente
                            }}
                        >
                            <span style={{ margin: '0', padding: '0' }}>{card.card_name}</span>
                            <span style={{ margin: '0', padding: '0' }}>Terminación: •••• {card.card_number.slice(-4)}</span>
                            <span style={{ margin: '0', padding: '0' }}>Vencimiento: {card.expiration_month.toString().padStart(2, '0')}/{card.expiration_year.toString().slice(-2)}</span>
                        </div>


                        {/* Radio para seleccionar */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', cursor: 'pointer', }} onClick={() => handleSelectCard(card)} >
                            <Radio
                                checked={selectedCard?.id === card.id}
                                readOnly
                                sx={{
                                    color: '#8F4D63',
                                    '&.Mui-checked': { color: '#8F4D63' },
                                }}
                            />
                            <span style={{
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#8F4D63",
                                opacity: 1,
                                fontSize: "14px",
                            }}>{selectedCard?.id === card.id ? 'Tarjeta seleccionada' : 'Seleccionar tarjeta'}</span>

                        </label>

                        {/* Botón para eliminar */}
                        <button
                            onClick={() => openDeleteModal(card)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <img src={trash} width='24px' height='24px' />
                        </button>
                    </div>
                ))}
            </div>
            <ModalError
                isOpen={isErrorModalOpen}
                title={TitleErrorModal}
                message={MessageErrorModal}
                buttonText="Cerrar"
                onClose={() => setIsErrorModalOpen(false)}
            />
            {showChipBarCard && (
                <ChipBar
                    message={MessageChipBar}
                    buttonText="Cerrar"
                    onClose={() => setshowChipBarCard(false)}
                />
            )}
            <MainModal
                isOpen={OpenModal}
                Title={TitleMainModal}
                message={MessageMainModal}
                primaryButtonText="Aceptar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleDeleteCard}
                onSecondaryClick={() => setOpenModal(false)}
            />
            <MainModal
                isOpen={isConfirmModalOpen}
                Title={TitleMainModal}
                message={MessageMainModal}
                primaryButtonText="Aceptar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleConfirmAccept}
                onSecondaryClick={handleCloseCancelationModal}

            />
            {/* Modal para agregar tarjeta */}
            <Modal
                open={isAddCardModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-card-modal-title"
                aria-describedby="add-card-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '885px',
                        height: '756px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2
                            id="add-card-modal-title"
                            style={{
                                textAlign: "left",
                                font: "normal normal 600 20px/54px Poppins",
                                letterSpacing: "0px",
                                color: "#574B4F",
                                opacity: 1,
                                fontSize: "20px",
                                margin: 0
                            }}
                        >
                            Agregar tarjeta
                        </h2>
                        <IconButton onClick={handleCloseModal} style={{ color: "#574B4F" }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <hr style={{ width: '100%', border: '1px solid #ccc', margin: '10px 0' }} />
                    <form
                        onSubmit={handleAddCardSubmit}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            columnGap: '20px',
                            rowGap: '15px',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "block",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Número de tarjeta<span style={{ color: "#D01247" }}>*</span>
                                </label>
                                <TextField name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    error={Boolean(errors['cardNumber'])}
                                    helperText={errors['cardNumber']}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WhiteTooltip title={<>
                                                    <div>• Solo caracteres numéricos</div>
                                                    <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                                </>}>
                                                    <img src={errors['cardNumber'] ? infoiconerror : infoicon} alt="info-icon" />
                                                </WhiteTooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "block",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Nombre en la tarjeta<span style={{ color: "#D01247" }}>*</span>
                                </label>
                                <TextField name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    error={Boolean(errors.cardName)}
                                    helperText={errors.cardName}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WhiteTooltip title={<>
                                                    <div>• Solo caracteres numéricos</div>
                                                    <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                                </>}>
                                                    <img src={errors.cardName ? infoiconerror : infoicon} alt="info-icon" />
                                                </WhiteTooltip>
                                            </InputAdornment>
                                        )
                                    }} />
                            </div>
                        </div>
                        <div>
                            <label
                                style={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "16px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            >
                                Calle<span style={{ color: "#D01247" }}>*</span>
                            </label>
                            <TextField name="street"
                                value={formData.street}
                                onChange={handleChange}
                                error={Boolean(errors.street)}
                                helperText={errors.street}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <WhiteTooltip title={<>
                                                <div>• Solo caracteres numéricos</div>
                                                <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                            </>}>
                                                <img src={errors.street ? infoiconerror : infoicon} alt="info-icon" />
                                            </WhiteTooltip>
                                        </InputAdornment>
                                    )
                                }} /> 
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "block",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Número exterior<span style={{ color: "#D01247" }}>*</span>
                                </label>
                                <TextField type="number"
                                    name="exteriorNumber"
                                    value={formData.exteriorNumber}
                                    onChange={handleChange}
                                    error={Boolean(errors.exteriorNumber)}
                                    helperText={errors.exteriorNumber}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WhiteTooltip title={<>
                                                    <div>• Solo caracteres numéricos</div>
                                                    <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                                </>}>
                                                    <img src={errors.exteriorNumber ? infoiconerror : infoicon} alt="info-icon" />
                                                </WhiteTooltip>
                                            </InputAdornment>
                                        )
                                    }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "block",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Número interior
                                </label>
                                <TextField type="number"
                                    name="interiorNumber"
                                    value={formData.interiorNumber}
                                    onChange={handleChange}
                                    error={Boolean(errors.interiorNumber)}
                                    helperText={errors.interiorNumber}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WhiteTooltip title={<>
                                                    <div>• Solo caracteres numéricos</div>
                                                    <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                                </>}>
                                                    <img src={errors.interiorNumber ? infoiconerror : infoicon} alt="info-icon" />
                                                </WhiteTooltip>
                                            </InputAdornment>
                                        )
                                    }} />
                            </div>
                        </div>
                        <div>
                            <label
                                style={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "16px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            >
                                Colonia<span style={{ color: "#D01247" }}>*</span>
                            </label>
                            <TextField name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                error={Boolean(errors.neighborhood)}
                                helperText={errors.neighborhood}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <WhiteTooltip title={<>
                                                <div>• Solo caracteres numéricos</div>
                                                <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                            </>}>
                                                <img src={errors.neighborhood ? infoiconerror : infoicon} alt="info-icon" />
                                            </WhiteTooltip>
                                        </InputAdornment>
                                    )
                                }} />
                        </div>
                        <div>
                            <label
                                style={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "16px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            >
                                Ciudad<span style={{ color: "#D01247" }}>*</span>
                            </label>
                            <TextField name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={Boolean(errors.city)}
                                helperText={errors.city}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <WhiteTooltip title={<>
                                                <div>• Solo caracteres numéricos</div>
                                                <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                            </>}>
                                                <img src={errors.city ? infoiconerror : infoicon} alt="info-icon" />
                                            </WhiteTooltip>
                                        </InputAdornment>
                                    )
                                }} />
                        </div>
                        <div>
                            <label
                                style={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "16px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            >
                                Estado<span style={{ color: "#D01247" }}>*</span>
                            </label>
                            <TextField name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={Boolean(errors.state)}
                                helperText={errors.state}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <WhiteTooltip title={<>
                                                <div>• Solo caracteres numéricos</div>
                                                <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                            </>}>
                                                <img src={errors.state ? infoiconerror : infoicon} alt="info-icon" />
                                            </WhiteTooltip>
                                        </InputAdornment>
                                    )
                                }} />
                        </div>
                        <div>
                            <label
                                style={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "16px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            >
                                CP<span style={{ color: "#D01247" }}>*</span>
                            </label>
                            <TextField type="number"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                error={Boolean(errors.postalCode)}
                                helperText={errors.postalCode}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <WhiteTooltip title={<>
                                                <div>• Solo caracteres numéricos</div>
                                                <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                            </>}>
                                                <img src={errors.postalCode ? infoiconerror : infoicon} alt="info-icon" />
                                            </WhiteTooltip>
                                        </InputAdornment>
                                    )
                                }} />
                        </div>
                        <div style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "inline-block",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Fecha de vencimiento<span style={{ color: "#D01247" }}>*</span>
                                </label>
                                <label
                                    style={{
                                        textAlign: "left",
                                        font: "normal normal medium 16px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        display: "inline-block",
                                        marginBottom: "5px",
                                        marginLeft: "37px"
                                    }}
                                >
                                    CVV <span style={{ color: "#D01247" }}>*</span>
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Select
                                        name="month" // 🔥 Aseguramos que `name` esté presente
                                        value={formData.month} // 🔥 `value` debe coincidir con `formData.month`
                                        onChange={handleChange}
                                        required
                                        style={{
                                            background: "#FFFFFF",
                                            border: "1px solid #9B9295",
                                            borderRadius: "8px",
                                            width: "87px",
                                            height: "40px",
                                        }}
                                    >
                                        <MenuItem value="" disabled>Mes</MenuItem>
                                        {months.map((month, index) => (
                                            <MenuItem key={index} value={(index + 1).toString()}>{month}</MenuItem> // 🔥 Convertimos a `string`
                                        ))}
                                    </Select>

                                    <Select
                                        name="year" // 🔥 Aseguramos que `name` esté presente
                                        value={formData.year} // 🔥 `value` debe coincidir con `formData.year`
                                        onChange={handleChange}
                                        required
                                        style={{
                                            background: "#FFFFFF",
                                            border: "1px solid #9B9295",
                                            borderRadius: "8px",
                                            width: "87px",
                                            height: "40px",
                                        }}
                                    >
                                        <MenuItem value="" disabled>Año</MenuItem>
                                        {years.map((year, index) => (
                                            <MenuItem key={index} value={year.toString()}>{year}</MenuItem> // 🔥 Convertimos a `string`
                                        ))}
                                    </Select>

                                    <TextField
                                        type="number"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        error={Boolean(errors.cvv)}
                                        helperText={errors.cvv}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <WhiteTooltip title={<>
                                                        <div>• Solo caracteres numéricos</div>
                                                        <div>• Longitud min. 14 dígitos, máx. 19 dígitos</div>
                                                    </>}>
                                                        <img src={errors.cvv ? infoiconerror : infoicon} alt="info-icon" />
                                                    </WhiteTooltip>
                                                </InputAdornment>
                                            )
                                        }}
                                        style={{
                                            background: "#FFFFFF 0% 0% no-repeat padding-box",
                                            border: "1px solid #9B9295",
                                            borderRadius: "4px",
                                            width: "132px",
                                            height: "54px",
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#ffffff', // 🔥 Color del check (blanco)
                                        },
                                        '&.Mui-checked .MuiSvgIcon-root': {
                                            backgroundColor: '#8F4D63', // 🔥 Cambia el color de adentro cuando está seleccionado
                                            borderRadius: '4px',
                                            color: '#ffffff', // 🔥 Cambia el color de la flecha (check) a blanco
                                        }
                                    }}
                                />
                                <span style={{
                                    textAlign: "left",
                                    font: "normal normal normal 16px/20px Poppins",
                                    letterSpacing: "0px",
                                    color: "#8F4D63",
                                    opacity: 1,
                                    fontSize: "16px",
                                }}>Establecer como forma de pago predeterminada.</span>
                            </div>
                        </div>
                        <hr
                            style={{
                                gridColumn: 'span 2',
                                width: '100%',
                                border: '1px solid #ccc',
                                margin: '20px 0',
                            }}
                        />
                        <div style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                            <div style={{ flex: 1 }}>
                                <SecondaryButton
                                    onClick={() => handleCloseAddCardModal()}
                                    text="Cancelar"// 🔥 Se asegura que no se expanda
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MainButton
                                    text="Agregar"
                                    isLoading={Loading}
                                    onClick={() => addCreditCard()}
                                    disabled={!areRequiredFieldsFilled()}
                                />
                            </div>
                        </div>
                       


                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default PaymentMethods;
