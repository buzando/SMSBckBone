import React, { useState, useEffect, useRef } from 'react';
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
import { Divider, InputAdornment, Tooltip, TooltipProps, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import trash from '../assets/Icon-trash-Card.svg'
import Radio from '@mui/material/Radio';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import seachicon from '../assets/icon-lupa.svg'
import iconclose from "../assets/icon-close.svg"
import BoxEmpty from '../assets/Nousers.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDateTimePicker from '../components/commons/DatePickerOneDate';
import AddIcon from '../assets/Icon-plus.svg'
import Thrashicon from '../assets/Icon-trash-Card.svg'
import Snackbar from '../components/commons/ChipBar'
interface BlackList {
    id: number;
    creationDate: string;
    name: string;
    expirationDate: string;
    quantity: number;
}

interface FormData {
    Name: string;
    Phones: string[];
    ExpirationDate: Date | null;
    File: string;
}

type Errors = {
    [K in keyof FormData]?: string;
};
const BlackList: React.FC = () => {
    const [Loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [BlackList, setBlackList] = useState<BlackList[]>([]);
    const [selectedBlackList, setSelectedBlackList] = useState<BlackList | null>(null);
    const [cardToDelete, setCardToDelete] = useState<BlackList | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [showChipBarCard, setshowChipBarCard] = useState(false);
    const [MessageChipBar, setMessageChipBar] = useState('');
    const [OpenModal, setOpenModal] = useState(false);
    const [TitleErrorModal, setTitleErrorModal] = useState('');
    const [MessageErrorModal, setMessageErrorModal] = useState('');
    const [TitleMainModal, setTitleMainModal] = useState('');
    const [MessageMainModal, setMessageMainModal] = useState('');
    const [isblacklistdModalOpen, setIsblacklistModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        Name: '',
        Phones: [''],
        ExpirationDate: null,
        File: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState(false);
    const [fileSuccess, setFileSuccess] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

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


    const openDeleteModal = (card: BlackList) => {
        setCardToDelete(card);
        setTitleMainModal('Eliminar Lista negra');
        setMessageMainModal('¿Estás seguro de que deseas eliminar la lista negra? Esta acción no podrá revertida.');
        setOpenModal(true);
    };

    const fetchBlackListsByUser = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;
      
        if (!obj?.id) {
          console.error("No se encontró el ID del usuario.");
          return;
        }
      
        try {
          const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_GET_BLACKLIST}${obj.id}`;
          const response = await axios.get(requestUrl);
      
          if (response.status === 200) {
            setBlackList(response.data);
          }
        } catch (error) {
          setTitleErrorModal("Error al cargar listas negras");
          setMessageErrorModal("No se pudo obtener la información. Inténtalo más tarde.");
          setIsErrorModalOpen(true);
        }
      };

    useEffect(() => {
        fetchBlackListsByUser();
    }, []);


    const handleCloseModal = () => {
        setIsblacklistModalOpen(false);
    };


    const addBlackList = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_BLACKLIST}`;
            const payload = {
                Name: formData.Name,
                ExpirationDate: formData.ExpirationDate,
                IdUser: obj.id,
                Phones: formData.Phones,
                FileBase64: formData.File
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
                await fetchBlackListsByUser();
                handleCloseModal();
            }
        } catch {
            setTitleErrorModal('Error al añadir la lista negra');
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
            formData.Name,
        ];

        // Devuelve true si todos los campos requeridos están llenos y sin errores
        return requiredFields.every((field) => field.trim() !== '') && Object.values(errors).every((error) => !error);
    };

    const handleCloseAddCardModal = () => {
        setTitleMainModal('Cancelación');
        setMessageMainModal('¿Estás seguro de que deseas cancelar? Los datos ingresados no serán almacenados.');
        setIsblacklistModalOpen(false);
        setIsConfirmModalOpen(true); // Abre el modal de confirmación
    };

    const handleCloseCancelationModal = () => {
        setTitleMainModal('');
        setMessageMainModal('');
        setIsblacklistModalOpen(true);
        setIsConfirmModalOpen(false); // Abre el modal de confirmación
    };

    const handleConfirmAccept = () => {
        setFormData({
            Name: '',
            Phones: [''],
            ExpirationDate: null,
            File: '',
        }); // Limpia los datos
        setIsConfirmModalOpen(false); // Cierra el modal de confirmación
        setIsblacklistModalOpen(false); // Cierra el modal principal
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


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const handleFile = (file: File) => {
        const isValid = file.name.endsWith('.xlsx');
        setSelectedFile(isValid ? file : null);
        setFileError(!isValid);
        setFileSuccess(isValid);
      
        if (isValid) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result?.toString().split(',')[1] || '';
            setFormData((prev) => ({ ...prev, File: base64String }));
          };
          reader.readAsDataURL(file);
        }
      };
      

    const handlePhoneChange = (index: number, value: string) => {
        const updated = [...formData.Phones];
        updated[index] = value;
        setFormData((prev) => ({ ...prev, Phones: updated }));
    };

    const handleAddPhone = () => {
        if (formData.Phones.length < 5) {
            setFormData((prev) => ({ ...prev, Phones: [...prev.Phones, ''] }));
        }
    };

    const handleRemovePhone = (index: number) => {
        const updated = [...formData.Phones];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, Phones: updated }));
    };

    const handleNameChange = (value: string) => {
        const onlyValid = value.replace(/[^a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ\s]/g, '');
        setFormData(prev => ({ ...prev, Name: onlyValid }));
    };

    const handlePhonesChange = (updatedPhones: string[]) => {
        setFormData(prev => ({ ...prev, Phones: updatedPhones }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData(prev => ({ ...prev, ExpirationDate: date }));
    };


    return (
        <div style={{ padding: '20px', marginTop: '-70px', marginLeft: "40px", maxWidth: "1040px" }}>
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
                        fontSize: '26px'
                    }}
                >
                    Listas negras
                </Typography>
            </Box>
            <Divider sx={{ marginBottom: "17px", marginTop: "16px" }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '25px', marginBottom: '20px' }}>
                <MainIcon
                    text="Nueva Lista Negra"
                    isLoading={Loading}
                    onClick={() => setIsblacklistModalOpen(true)}
                    width="218px"
                >
                    <span className="flex items-center">
                        <span className="mr-2">+</span> Add Card
                    </span>
                </MainIcon>
                <div style={{ position: 'relative', width: '220px' }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            backgroundColor: "#FFFFFF",
                            border: searchTerm ? "1px solid #7B354D" : "1px solid #9B9295", // Cambia el color del borde si hay texto
                            borderRadius: "4px",
                            padding: "8px 12px",
                            width: "218px",
                            height: "40px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <img
                            src={seachicon}
                            alt="Buscar"
                            style={{
                                marginRight: "8px",
                                width: "18px",
                                height: "18px",
                                filter: searchTerm ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)" : "none", // Ajusta el color si hay texto
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchTerm} // Variable de estado para el valor del input
                            onChange={handleSearch} // Función que maneja el cambio en el input
                            style={{
                                border: "none", // Sin borde
                                outline: "none", // Sin borde al enfocar
                                width: "100%", // Ocupa todo el espacio restante
                                fontSize: "16px", // Tamaño de la fuente
                                fontFamily: "Poppins, sans-serif", // Fuente según especificación
                                color: searchTerm ? "#7B354D" : "#9B9295", // Cambia el color del texto si hay texto
                                backgroundColor: "transparent", // Fondo transparente para evitar interferencias
                            }}
                        />
                        {/* Ícono de cerrar cuando hay texto */}
                        {searchTerm && (
                            <img
                                src={iconclose}
                                alt="Limpiar búsqueda"
                                style={{
                                    marginLeft: "8px",
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setSearchTerm('');
                                }}
                            />
                        )}
                    </Box>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                {BlackList.length === 0 && (
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
                            mt: 3
                        }}
                    >
                        <img
                            src={BoxEmpty}
                            alt="Caja vacía"
                            style={{ width: '120px', marginBottom: '16px' }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Poppins',
                                fontSize: '14px',
                                color: '#7B354D',
                                fontWeight: 500
                            }}
                        >
                            Cree una lista negra para comenzar.
                        </Typography>
                    </Box>
                )}
                {BlackList.length > 0 && (
                    <Box
                        sx={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                            overflowX: 'auto',
                            mt: 3
                        }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F5F5F5', textAlign: 'left' }}>
                                    <th style={{ padding: '16px' }}><Checkbox /></th>
                                    <th style={{ padding: '16px' }}>Fecha de creación</th>
                                    <th style={{ padding: '16px' }}>Nombre de lista</th>
                                    <th style={{ padding: '16px' }}>Fecha de expiración</th>
                                    <th style={{ padding: '16px' }}>Cantidad de registros</th>
                                    <th style={{ padding: '16px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {BlackList.map((black) => (
                                    <tr key={black.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                                        <td style={{ padding: '16px' }}>
                                            <Checkbox />
                                        </td>
                                        <td style={{ padding: '16px' }}>{formatDate(black.creationDate)}</td>
                                        <td style={{ padding: '16px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {black.name}
                                        </td>
                                        <td style={{ padding: '16px' }}>{formatDate(black.expirationDate)}</td>
                                        <td style={{ padding: '16px' }}>{black.quantity}</td>
                                        <td style={{ padding: '16px' }}>
                                            <IconButton>
                                                <span style={{ fontSize: '24px', color: '#7B354D' }}>⋮</span>
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}

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
            {/* <MainModal
                isOpen={OpenModal}
                Title={TitleMainModal}
                message={MessageMainModal}
                primaryButtonText="Aceptar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleDeleteCard}
                onSecondaryClick={() => setOpenModal(false)}
            /> */}
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
                open={isblacklistdModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-card-modal-title"
                aria-describedby="add-card-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '80px',
                        left: '350px',
                        transform: 'none',
                        width: '580px',
                        maxWidth: '100%',
                        height: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        pt: 1.5,     // 🔥 Padding top reducido
                        px: 4,     // Conservamos padding lateral
                        pb: 2,     // Padding bottom igual
                        borderRadius: '8px',
                        overflowY: 'hidden',
                        overflowX: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            height: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: '#330F1B',
                                }}
                            >
                                Añadir lista negra
                            </Typography>
                            <IconButton onClick={handleCloseModal}>
                                <CloseIcon sx={{ color: '#A6A6A6' }} />
                            </IconButton>
                        </Box>
                        <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mb: 2 }} />
                        {/* Nombre */}
                        <Box>
                            <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#330F1B', mb: 1 }}>
                                Nombre<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    fullWidth
                                    value={formData.Name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img src={infoicon} alt="info" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: '340px',
                                        height: '54px',
                                        '& .MuiInputBase-root': {
                                            height: '100%',
                                        },
                                        '& input': {
                                            fontFamily: 'Poppins',
                                            fontSize: '14px',
                                            height: '100%',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                />

                            </Box>
                        </Box>

                        {/* Descripción */}
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#330F1B', mt: 1 }}>
                            Cargar un archivo desde la biblioteca o agregar registros manualmente.
                        </Typography>

                        {/* Upload y Teléfonos */}
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {/* Subir archivo */}
                            <Box
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleFile(file);
                                }}

                                sx={{
                                    border: `2px dashed ${fileError ? '#EF5466' : '#D9B4C3'}`,
                                    backgroundColor: fileError ? '#FFF4F5' : 'transparent',
                                    borderRadius: '8px',
                                    width: '200px',
                                    height: '140px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontFamily: 'Poppins',
                                    fontSize: '13px',
                                    color: '#330F1B',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    px: 1
                                }}
                            >
                                <WhiteTooltip
                                    title={
                                        fileError
                                            ? "Solo se permiten archivos .xlsx"
                                            : fileSuccess
                                                ? `Archivo cargado: ${selectedFile?.name}`
                                                : "Puede subir archivos Excel (.xlsx)"
                                    }
                                >
                                    <img
                                        src={fileError ? infoiconerror : infoicon}
                                        alt="info"
                                        style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer' }}
                                    />
                                </WhiteTooltip>
                                <img
                                    src={
                                        fileError
                                            ? '/ruta/a/icono-error.svg'
                                            : fileSuccess
                                                ? 'fileUploadedIcon'
                                                : '/ruta/a/icono-nube.svg'
                                    }
                                    alt="estado archivo"
                                    style={{ marginBottom: '8px' }}
                                />

                                <Typography sx={{ fontWeight: 600 }}>
                                    {fileError
                                        ? 'Archivo inválido'
                                        : fileSuccess
                                            ? 'Archivo cargado'
                                            : 'Subir archivo'}
                                </Typography>
                                <Typography>
                                    Arrastre un archivo aquí, o selecciónelo.
                                </Typography>

                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFile(file);
                                    }}

                                />
                            </Box>
                            <Box
                                sx={{
                                    width: '1px',
                                    backgroundColor: '#E6E4E4',
                                    margin: '0 10px',
                                }}
                            />
                            {/* Teléfonos */}
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#330F1B', mb: 1 }}>
                                    Teléfono(s)
                                </Typography>

                                <Box
                                    sx={{
                                        maxHeight: '150px', // ajusta según tu modal
                                        overflowY: 'auto',
                                        pr: 1, // para evitar que el scroll tape el contenido
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    {formData.Phones.map((phone, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <TextField
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                                fullWidth
                                                placeholder="5255..."
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Tooltip title="Información del campo">
                                                                <img src={infoicon} alt="info" style={{ width: 18, height: 18 }} />
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& input': {
                                                        fontFamily: 'Poppins',
                                                        fontSize: '14px',
                                                    }
                                                }}
                                            />

                                            {/* Botón de agregar solo para el último campo */}
                                            {index === formData.Phones.length - 1 && (
                                                <Tooltip title="Agregar otro teléfono">
                                                    <IconButton onClick={handleAddPhone}>
                                                        <img
                                                            src={AddIcon}
                                                            alt="Agregar teléfono"
                                                            style={{ width: 18, height: 18 }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {index > 0 && (
                                                <Tooltip title="Eliminar teléfono">
                                                    <IconButton onClick={() => handleRemovePhone(index)}>
                                                        <img
                                                            src={Thrashicon}
                                                            alt="Eliminar"
                                                            style={{ width: 18, height: 18 }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                        </Box>

                        {/* Fecha de expiración */}
                        <Box sx={{ position: 'relative' }}>
                            <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#330F1B', mb: 1 }}>
                                Fecha de expiración (opcional)
                            </Typography>
                            <Box
                                onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setDatePickerOpen(true);
                                }}
                                sx={{
                                    width: '340px',
                                    height: '54px',
                                    border: '1px solid #D9B4C3',
                                    borderRadius: '4px',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                    fontFamily: 'Poppins',
                                    color: '#574B4F',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {formData.ExpirationDate
                                    ? formData.ExpirationDate.toLocaleString('es-MX', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : 'Selecciona fecha y hora'}
                            </Box>

                            {/* Popper personalizado */}
                            {datePickerOpen && anchorEl && (
                                <CustomDateTimePicker
                                    open={datePickerOpen}
                                    anchorEl={anchorEl}
                                    onApply={(date, hour, minute) => {
                                        const newDate = new Date(date);
                                        newDate.setHours(hour);
                                        newDate.setMinutes(minute);
                                        handleDateChange(newDate);
                                    }}
                                    onClose={() => setDatePickerOpen(false)}
                                />
                            )}

                        </Box>



                        {/* Botones */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                            <SecondaryButton text="Cancelar" onClick={handleCloseModal} />
                            <MainButton text="Guardar" onClick={addBlackList} />
                        </Box>
                    </Box>

                </Box>
            </Modal>

        </div >
    );
};

export default BlackList;
