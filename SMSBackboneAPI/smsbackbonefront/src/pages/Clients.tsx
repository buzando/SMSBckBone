import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Checkbox, TextField, InputAdornment, Tooltip, CircularProgress } from '@mui/material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Select,
    Stepper,
    Step,
    StepLabel,
    Button,
    FormControlLabel,
    Radio,
    Grid,
    Modal,
    FormControl,
    InputLabel,
    FormGroup,
    FormLabel,
    RadioGroup
} from '@mui/material';
import MainIcon from '../components/commons/MainButtonIcon';
import seachicon from '../assets/icon-lupa.svg';
import iconclose from '../assets/icon-close.svg';
import BoxEmpty from '../assets/Nousers.svg';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconDownloadCSV from '../assets/IconCSV.svg';
import IconDownloadExcel from '../assets/IconExcel.svg';
import IconDownloadPDF from '../assets/IconPDF.svg';
import backarrow from '../assets/MoveTable.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DeleteIcon from '@mui/icons-material/Delete';
import MainButton from '../components/commons/MainButton'
import SecondaryButton from '../components/commons/SecondaryButton'
import NoResult from '../assets/NoResultados.svg';
import ModalError from "../components/commons/ModalError";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { unparse } from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ModalMain from '../components/commons/MainModal'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BlockIcon from '@mui/icons-material/Block';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CustomDateTimePicker from '../components/commons/DatePickerOneDate';

export interface Clients {
    id: number;
    nombreCliente: string;
    creationDate: string;
    rateForShort: number;
    rateForLong: number;
    shortRateType: number;
    longRateType: number;
    shortRateQty: string;
    longRateQty: string;
    estatus: number;

    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    extension: number;

    roomName: string;
    totalCredits: number;
    totalLongSmsCredits: number;
    totalShortSmsCredits: number;
    deactivationDate: Date;
}

interface FormData {
    Name: string;
    Phones: string[];
    ExpirationDate: Date | null;
    File: string;
}



const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'cliente' | ''>(''); 

    const [loading, setLoading] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRowId, setMenuRowId] = useState<number | null>(null);
    const open = Boolean(anchorEl);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [serviceAnchorEl, setServiceAnchorEl] = useState<null | HTMLElement>(null);
    const openServiceFilter = Boolean(serviceAnchorEl);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [clientsList, setClientsList] = useState<Clients[]>([]);
    const [originalData, setOriginalData] = useState<Clients[]>([]);
    const [clientMenuOpen, setClientMenuOpen] = useState(false);
    const [clientAnchorEl, setClientAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [clientSearch, setClientSearch] = useState('');

    const [isExportingCSV, setIsExportingCSV] = useState(false);
    const [isExportingXLSX, setIsExportingXLSX] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const anyExporting = isExportingCSV || isExportingXLSX || isExportingPDF;

    const [errorModal, setErrorModal] = useState(false);
    const [MainModal, setMainModal] = useState(false);
    const [MainModalDelete, setMainModalDelete] = useState(false);
    const [MainModalMessage, setMainModalMessage] = useState('');
    const [MainModalTitle, setMainModalTitle] = useState('');
    const [openClientModal, setOpenClientModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Clients | null>(null);
    const [rechargeRooms, setRechargeRooms] = useState<string[]>([]);
    const [step, setStep] = useState(0);
    const [newRooms, setNewRooms] = useState<string[]>([]);
    const [roomCount, setRoomCount] = useState<number>(0);
    const [shortRateType, setShortRateType] = useState<'estandar' | 'personalizada'>('estandar');
    const [longRateType, setLongRateType] = useState<'estandar' | 'personalizada'>('estandar');
    const [shortStandardQty, setShortStandardQty] = useState('');
    const [shortStandardPrice, setShortStandardPrice] = useState('');
    const [shortCustomQty, setShortCustomQty] = useState('');

    const [longStandardQty, setLongStandardQty] = useState('');
    const [longStandardPrice, setLongStandardPrice] = useState('');
    const [longCustomQty, setLongCustomQty] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [confirmEmailError, setConfirmEmailError] = useState(false);
    const [modalAction, setModalAction] = useState<() => void>(() => () => { });

    const [selectedSmsType, setSelectedSmsType] = useState<'short' | 'long'>('short');
    const [selectedRoomsForRecharge, setSelectedRoomsForRecharge] = useState<string[]>([]);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const initialRechargeState = {
        smsType: '', // 'short' | 'long'
        roomsSelected: [] as string[],
        ratePerMessage: 0,
        amount: 0,
        totalWithTax: 0,
        paymentType: '',
        billingDate: new Date().toISOString().split('T')[0],
    };
    const [rechargeData, setRechargeData] = useState(initialRechargeState);

    const DualSpinner = () => (
        <Box
            sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress
                variant="determinate"
                value={100}
                size={24}
                thickness={8}
                sx={{ color: '#D6C4CB', position: 'absolute' }}
            />
            <CircularProgress
                size={24}
                thickness={8}
                sx={{
                    color: '#7B354D',
                    position: 'absolute',
                    animationDuration: '1s',
                }}
            />
            <Box
                sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    zIndex: 3,
                }}
            />
        </Box>
    );

    const handleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === clientsList.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(clientsList.map((n) => n.id));
        }
    };

    const GetClientsAdmin = async () => {
        setLoading(true);

        try {
            const request = `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_GET_CLIENTSADMIN}`;
            const response = await axios.get<Clients[]>(request);

            if (response.status === 200) {
                const fetchedClient = response.data;
                const uniqueClients: Clients[] = [
                    ...new Map(fetchedClient.map((item: Clients) => [item.nombreCliente, item])).values()
                ];
                setClientsList(uniqueClients);
                setOriginalData(uniqueClients);
                setClientsList(uniqueClients.slice(0, 50));

            }
        } catch {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetClientsAdmin();
    }, []);


    const handleExportClick = (
        format: 'csv' | 'xlsx' | 'pdf',
        setThisLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setThisLoading(true);
        setTimeout(() => {
            exportClients(format, () => setThisLoading(false));
        }, 1000);
    };

    const exportClients = async (
        format: 'csv' | 'xlsx' | 'pdf',
        onComplete?: () => void
    ) => {
        const MAX_RECORDS_LOCAL = 100000;
        const data = clientsList;

        try {
            if (data.length <= MAX_RECORDS_LOCAL) {
                const cleanData = data.map(item => ({
                    "Fecha de alta": item.creationDate,
                    "Cliente": item.nombreCliente,
                    "Nombre": item.firstName,
                    "Apellidos": item.lastName,
                    "Teléfono": item.phoneNumber,
                    "Extensión": item.extension || '',
                    "Correo electrónico": item.email,
                    "Tarifa SMS # Cortos": item.rateForShort,
                    "Tarifa SMS # Largos": item.rateForLong,
                    "Salas": item.roomName,
                    "Estatus": item.estatus,
                    "Créditos Globales": item.totalCredits,
                    "Créditos SMS # Cortos": item.totalShortSmsCredits,
                    "Créditos SMS # Largos": item.totalLongSmsCredits
                }));


                if (format === 'csv') {
                    const csv = unparse(cleanData);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    saveAs(blob, 'DescargaClientes.csv');
                } else if (format === 'xlsx') {
                    const worksheet = XLSX.utils.json_to_sheet(cleanData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'NumerosDID');
                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([excelBuffer], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                    saveAs(blob, 'DescargaClientes.xlsx');
                } else if (format === 'pdf') {
                    const input = document.querySelector('table');
                    if (!input) return;

                    const clone = input.cloneNode(true) as HTMLElement;
                    clone.style.position = 'absolute';
                    clone.style.top = '-9999px';
                    document.body.appendChild(clone);

                    const canvas = await html2canvas(clone, { scale: 2, useCORS: true });
                    document.body.removeChild(clone);

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('l', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
                    pdf.save('DescargaClientes.pdf');
                }
            } else {
                const payload = { Formato: format };
                const response = await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_EXPORT_NUMBERS}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' }, responseType: 'blob' }
                );

                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `NumerosDID.${format}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            setErrorModal(true);
        } finally {
            onComplete?.();
        }
    };

    const goToFirstPage = () => setCurrentPage(1);

    const goToLastPage = () => setCurrentPage(totalPages);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const filtered = clientsList.filter((client) =>
            client.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setCurrentItems(filtered.slice(start, end));
        setTotalItems(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }, [clientsList, searchTerm, currentPage]);


    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
        setAnchorEl(event.currentTarget);
        setMenuRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRowId(null);
    };


    const filteredData = clientsList.filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
            item.nombreCliente.toLowerCase().includes(term)
        );
    });

    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleAddClient = () => {
        setSelectedClient(null);
        setStep(0);
        setOpenClientModal(true);
        setEmail('');
        setConfirmEmail('');
        setEmailError(false);
        setConfirmEmailError(false);
    };

    const handleEditClient = (client: Clients) => {
        setSelectedClient(client);

        // Salas
        setNewRooms(
            client.roomName
                ? client.roomName.split(',').map(r => r.trim()).slice(0, 5)
                : []
        );

        // Email
        setEmail(client.email);
        setConfirmEmail(client.email);

        // Tarifas cortas
        setShortRateType(client.shortRateType === 1 ? 'personalizada' : 'estandar');
        setShortStandardQty(client.shortRateQty || '');
        setShortCustomQty(client.shortRateQty || '');
        setLongCustomQty(client.longRateQty || '');

        // Tarifas largas
        setLongRateType(client.longRateType === 1 ? 'personalizada' : 'estandar');
        setLongStandardQty(client.longRateQty || '');
        setShortCustomQty(client.shortRateQty || '');
        setLongCustomQty(client.longRateQty || '');

        // Step y modal
        setStep(0);
        setOpenClientModal(true);
    };

    const rateForShort =
        shortRateType === 'estandar'
            ? parseFloat(shortStandardPrice)
            : selectedClient?.rateForShort;

    const rateForLong =
        longRateType === 'estandar'
            ? parseFloat(longStandardPrice)
            : selectedClient?.rateForLong;

    const handleSubmit = async () => {
        if (!selectedClient) return;

        const payload = {
            id: selectedClient.id,
            nombreCliente: selectedClient.nombreCliente,
            firstName: selectedClient.firstName,
            lastName: selectedClient.lastName,
            phoneNumber: selectedClient.phoneNumber,
            extension: selectedClient.extension,
            email: email,
            rateForShort: rateForShort,
            rateForLong: rateForLong,
            shortRateType: shortRateType === 'personalizada' ? 1 : 0,
            longRateType: longRateType === 'personalizada' ? 1 : 0,
            shortRateQty: shortRateType === 'estandar' ? shortStandardQty : null,
            longRateQty: longRateType === 'estandar' ? longStandardQty : null,
            roomNames: newRooms.filter((r) => r.trim() !== ''),
        };

        try {
            const urlBase = import.meta.env.VITE_SMS_API_URL;
            const endpoint = `${urlBase}${import.meta.env.VITE_API_UPDATE_CREATE_CLIENT}`


            const method = axios.post;

            await method(endpoint, payload);
            setOpenClientModal(false);
            GetClientsAdmin();
        } catch (error) {
            setErrorModal(true);
        }
    };

    const standardShortRates: Record<string, number> = {
        "1–999": 0.2819,
        "1,000": 0.2702,
        "2,000": 0.2584,
        "3,000": 0.2526,
        "4,000": 0.2467,
        "6,000": 0.2408,
    };

    const standardLongRates: Record<string, number> = {
        "1": 0.150,
        "1,000": 0.125,
        "2,000": 0.100,
        "4,000": 0.080,
        "5,000": 0.075,
        "8,000": 0.070,
    };

    const validateEmailFormat = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };


    const handleDeactivateClient = async (id: number) => {
        const newStatus = currentClient?.estatus === 1 ? 0 : 1;
        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_DEACTIVATE_CLIENT}${id}`;
            await axios.get(requestUrl);

            setClientsList(prev =>
                prev.map(client =>
                    client.id === id
                        ? { ...client, estatus: newStatus }
                        : client
                )
            );

            setMainModal(false);

        } catch (error) {
            console.error('Error al desactivar cliente:', error);
            setErrorModal(true);
        }
    };

    const handleOpenDeactivateModal = () => {
        if (menuRowId === null) return;

        setMainModalTitle("¿Estás seguro que deseas dar de baja este cliente?");
        setMainModalMessage("El cliente ya no podrá iniciar sesión, pero su información permanecerá en el sistema.");
        setModalAction(() => () => handleDeactivateClient(menuRowId));
        setMainModal(true);
    };


    const handleActivateClient = () => {
        if (menuRowId === null) return;

        setMainModalTitle("¿Estás seguro que deseas dar de alta este cliente?");
        setMainModalMessage("Estas Seguro que desea dar de alta al cliente seleccionado?.");
        setModalAction(() => () => handleDeactivateClient(menuRowId));
        setMainModal(true);
    };
    const currentClient = clientsList.find((c) => c.id === menuRowId);
    const canDeleteClient = (client: Clients) => {
        if (client.estatus !== 0 || !client.deactivationDate) return false;

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const clientDeactivationDate = new Date(client.deactivationDate);
        return clientDeactivationDate <= sixMonthsAgo;
    };
    const handleDeleteClient = async (id: number) => {
        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_DELETE_CLIENT}${id}`;
            await axios.get(requestUrl);

            GetClientsAdmin();
            setMainModalDelete(false);

        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            setErrorModal(true);
        }
    };

    const handleToggleRoom = (room: string) => {
        setRechargeData(prev => {
            const exists = prev.roomsSelected.includes(room);
            return {
                ...prev,
                roomsSelected: exists
                    ? prev.roomsSelected.filter(r => r !== room)
                    : [...prev.roomsSelected, room]
            };
        });
    };


    const getRoomsList = () => {
        return currentClient?.roomName?.split(',').map(r => r.trim()) || [];
    };

    const handleOpenRechargeModal = (client: Clients) => {
        setSelectedClient(client);

        const parsedRooms = client.roomName
            ? client.roomName.split(',').map(r => r.trim()).filter(Boolean)
            : [];
        setRechargeData(prev => ({
            ...prev,
            smsType: '',
            roomsSelected: parsedRooms,
            ratePerMessage: 0,
            amount: 0,
            tax: 0,
            totalWithTax: 0,
            paymentType: '',
            billingDate: ''
        }));


        setRechargeModalOpen(true);
    };

    const handleOpenDatePicker = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(event.currentTarget);
        setDatePickerOpen(true);
    };

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleSaveRecharge = async () => {
        if (!selectedClient) return;

        // Validaciones básicas
        if (!rechargeData.smsType || rechargeData.roomsSelected.length === 0 || !rechargeData.amount || !rechargeData.paymentType || !rechargeData.billingDate) {
            setErrorModal(true);
            return;
        }
        const userData = localStorage.getItem("userData");
        const parsedUser = userData ? JSON.parse(userData) : null;

        if (!parsedUser?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const payload = {
                IdUser: parsedUser.id,
                clientId: selectedClient.id,
                smsType: rechargeData.smsType,
                rooms: rechargeData.roomsSelected,
                rate: rechargeData.ratePerMessage,
                amount: rechargeData.amount,
                total: rechargeData.totalWithTax,
                paymentType: rechargeData.paymentType,
                billingDate: rechargeData.billingDate
            };

            const url = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_DELETE_CLIENT}`;
            const response = await axios.post(url, payload);

            if (response.status === 200) {
                setRechargeModalOpen(false);
                GetClientsAdmin();
            } else {
                setErrorModal(true);
            }
        } catch (error) {
            console.error('Error al guardar la recarga:', error);
            setErrorModal(true);
        }
    };

    useEffect(() => {
        if (rechargeData.amount) {
            const subtotal = parseFloat(rechargeData.amount.toString());
            const iva = subtotal * 0.16;
            const total = subtotal + iva;

            setRechargeData(prev => ({
                ...prev,
                totalWithTax: total,
            }));
        }
    }, [rechargeData.amount]);

    return (
        <Box p={3} sx={{ marginTop: "-80px", width: '90%', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Header con título y flecha */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton onClick={() => navigate('/')} sx={{ p: 0, mr: 1 }}>
                    <img src={ArrowBackIosNewIcon} alt="Regresar" style={{ width: 24, transform: 'rotate(270deg)' }} />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Poppins', fontSize: '26px', color: '#330F1B' }}>
                    Clientes
                </Typography>
            </Box>

            <Divider sx={{ marginBottom: "17px", marginTop: "16px" }} />

            {/* Controles de acción */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginBottom: '24px',
                }}
            >
                {/* Chips redonditos */}
                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['CLIENTE'].map((label) => {
                        const isClient = label === 'CLIENTE';


                        const count = selectedClients.length;


                        const labelDisplay = count > 0 ? `${count} ${label}` : label;

                        return (
                            <Box
                                key={label}
                                onClick={(e) => {
                                    if (label === 'CLIENTE') {
                                        setClientAnchorEl(e.currentTarget);
                                        setClientMenuOpen(true);
                                    }
                                    setActiveFilter(label.toLowerCase() as any);
                                }}
                                sx={{
                                    px: '16px', py: '6px', border: '1px solid', borderColor: activeFilter === label.toLowerCase() ? '#7B354D' : '#CFCFCF',
                                    borderRadius: '50px', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600,
                                    fontSize: '13px', backgroundColor: activeFilter === label.toLowerCase() ? '#F6EEF1' : '#FFFFFF',
                                    color: activeFilter === label.toLowerCase() ? '#7B354D' : '#9B9295', transition: 'all 0.2s ease-in-out', userSelect: 'none',
                                }}
                            >
                                {labelDisplay}
                            </Box>
                        );
                    })}

                </Box>

                {/* Botón y buscador */}
                <Box sx={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    <SecondaryButton text="SALAS" onClick={() => navigate('/RoomsAdmin')} />
                    <MainIcon text="Añadir cliente" width="218px" onClick={handleAddClient} />
                    <Box sx={{ position: 'relative', width: '220px' }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                border: searchTerm ? "1px solid #7B354D" : "1px solid #9B9295",
                                borderRadius: "4px",
                                px: 2,
                                py: 1,
                                width: "100%",
                                height: "40px"
                            }}
                        >
                            <img src={seachicon} alt="Buscar" style={{ marginRight: 8, width: 18 }} />
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    fontSize: "16px",
                                    fontFamily: "Poppins",
                                    color: searchTerm ? "#7B354D" : "#9B9295",
                                    backgroundColor: "transparent",
                                }}
                            />
                            {searchTerm && (
                                <img
                                    src={iconclose}
                                    alt="Limpiar búsqueda"
                                    onClick={() => {
                                        setSearchTerm('');
                                    }}
                                    style={{ marginLeft: 8, width: 20, height: 20, cursor: 'pointer' }}
                                />

                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: "17px", marginTop: "16px" }} />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                p={2}
                sx={{ backgroundColor: "#F6F6F6", borderRadius: "8px" }}
            >
                {/* Rango de resultados */}
                <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#330F1B" }}>
                    {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
                </Typography>

                {/* Flechas + Exportaciones */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Primera página">
                        <IconButton onClick={goToFirstPage} disabled={currentPage === 1}>
                            <Box
                                display="flex"
                                gap="2px"
                                alignItems="center"
                                sx={{
                                    opacity: currentPage === 1 ? 0.3 : 1
                                }}
                            >
                                <img src={backarrow} style={{ width: 12 }} />
                                <img src={backarrow} style={{ width: 12 }} />
                            </Box>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Página Anterior">
                        <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
                            <img src={backarrow} style={{ width: 12, opacity: currentPage === 1 ? 0.3 : 1 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Siguiente página">
                        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <img src={backarrow} style={{ width: 12, transform: 'rotate(180deg)', opacity: currentPage === totalPages ? 0.3 : 1 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Ultima Página">
                        <IconButton onClick={goToLastPage} disabled={currentPage === totalPages}>
                            <Box
                                display="flex"
                                gap="2px"
                                alignItems="center"
                                sx={{
                                    opacity: currentPage === 1 ? 0.3 : 1
                                }}
                            >
                                <img src={backarrow} style={{ width: 12, transform: 'rotate(180deg)' }} />
                                <img src={backarrow} style={{ width: 12, transform: 'rotate(180deg)' }} />
                            </Box>
                        </IconButton>
                    </Tooltip>


                    {/* Exportaciones */}
                    <Box display="flex" alignItems="center" gap={2} ml={3}>
                        <Tooltip title="Exportar CSV" arrow>
                            <IconButton
                                onClick={() => handleExportClick('csv', setIsExportingCSV)}
                                disabled={anyExporting && !isExportingCSV}
                                sx={{ opacity: !isExportingCSV && anyExporting ? 0.3 : 1 }}
                            >
                                {isExportingCSV ? <DualSpinner /> : <img src={IconDownloadCSV} alt="CSV" />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Exportar Excel" arrow>
                            <IconButton
                                onClick={() => handleExportClick('xlsx', setIsExportingXLSX)}
                                disabled={anyExporting && !isExportingXLSX}
                                sx={{ opacity: !isExportingXLSX && anyExporting ? 0.3 : 1 }}
                            >
                                {isExportingXLSX ? <DualSpinner /> : <img src={IconDownloadExcel} alt="Excel" />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Exportar PDF" arrow>
                            <IconButton
                                onClick={() => handleExportClick('pdf', setIsExportingPDF)}
                                disabled={anyExporting && !isExportingPDF}
                                sx={{ opacity: !isExportingPDF && anyExporting ? 0.3 : 1 }}
                            >
                                {isExportingPDF ? <DualSpinner /> : <img src={IconDownloadPDF} alt="PDF" />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                </Box>
            </Box>

            {originalData.length === 0 ? (
                // Caja cerrada - sin registros cargados
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: '100%',
                        minHeight: '300px',
                        backgroundColor: '#F9F9F9',
                        padding: 4,
                        borderRadius: '12px',
                        border: '1px solid #E0E0E0',
                        mt: 2,
                    }}
                >
                    <img src={BoxEmpty} alt="Caja vacía" style={{ width: '120px', marginBottom: '16px' }} />
                    <Typography
                        sx={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            color: '#7B354D',
                            fontWeight: 500,
                        }}
                    >
                        Da de alta un cliente para comenzar.
                    </Typography>
                </Box>
            ) : paginatedData.length === 0 ? (
                // Caja abierta - no hay coincidencias con los filtros
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: '100%',
                        minHeight: '300px',
                        backgroundColor: '#F9F9F9',
                        padding: 4,
                        borderRadius: '12px',
                        border: '1px solid #E0E0E0',
                        mt: 2,
                    }}
                >
                    <img src={NoResult} alt="No resultados" style={{ width: '120px', marginBottom: '16px' }} />
                    <Typography
                        sx={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            color: '#7B354D',
                            fontWeight: 500,
                        }}
                    >
                        No se encontraron resultados
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        padding: '30px 20px',
                        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                        overflowX: 'auto',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontFamily: 'Poppins', fontSize: '13px', color: '#9B9295' }}>
                                <th style={{ padding: '12px' }}>
                                    <Checkbox
                                        checked={selectedIds.length === clientsList.length}
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < clientsList.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th style={{ padding: '12px 16px' }}>Fecha de alta</th>
                                <th style={{ padding: '12px 16px' }}>Cliente</th>
                                <th style={{ padding: '12px 16px' }}>Nombre</th>
                                <th style={{ padding: '12px 16px' }}>Apellidos</th>
                                <th style={{ padding: '12px 16px' }}>Teléfono</th>
                                <th style={{ padding: '12px 16px' }}>Extensión</th>
                                <th style={{ padding: '12px 16px' }}>Correo electrónico</th>
                                <th style={{ padding: '12px 16px' }}>Tarifa SMS # Cortos</th>
                                <th style={{ padding: '12px 16px' }}>Tarifa SMS # Largos</th>
                                <th style={{ padding: '12px 16px' }}>Salas</th>
                                <th style={{ padding: '12px 16px' }}>Estatus</th>
                                <th style={{ padding: '12px 16px' }}>Créditos Globales</th>
                                <th style={{ padding: '12px 16px' }}>Créditos SMS # Cortos</th>
                                <th style={{ padding: '12px 16px' }}>Créditos SMS # Largos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((Client) => (
                                <tr key={Client.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                                    <td style={{ padding: '12px' }}>
                                        <Checkbox
                                            checked={selectedIds.includes(Client.id)}
                                            onChange={() => handleSelect(Client.id)}
                                        />
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>{Client.creationDate}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.nombreCliente}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.firstName}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.lastName}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.phoneNumber}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.extension}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.email}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.rateForShort}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.rateForLong}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.roomName}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.estatus}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.totalCredits}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.totalShortSmsCredits}</td>
                                    <td style={{ padding: '12px 16px' }}>{Client.totalLongSmsCredits}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <IconButton onClick={(event) => handleMenuOpen(event, Client.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            )}

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => {
                    const clientToEdit = clientsList.find(c => c.id === menuRowId);
                    if (clientToEdit) {
                        handleEditClient(clientToEdit);
                    }
                    handleMenuClose();
                }}>
                    <ListItemIcon><img src="/icons/editar.svg" alt="Editar" style={{ width: 20 }} /></ListItemIcon>
                    <ListItemText primary="Editar" />
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        const clientToEdit = clientsList.find(c => c.id === menuRowId);
                        if (clientToEdit) {
                            handleOpenRechargeModal(clientToEdit);
                        }

                    }}
                >
                    <ListItemIcon><img src="/icons/recargar.svg" alt="Recargar" style={{ width: 20 }} /></ListItemIcon>
                    <ListItemText primary="Recargar" />
                </MenuItem>

                {currentClient?.estatus === 0 ? (
                    <MenuItem onClick={() => {
                        handleActivateClient();
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <CheckBoxIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Dar de alta" />
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => {
                        handleOpenDeactivateModal();
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <BlockIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Dar de baja" />
                    </MenuItem>
                )}



                <MenuItem
                    disabled={!currentClient || !canDeleteClient(currentClient)}
                    onClick={() => {
                        setModalAction(() => () => handleDeleteClient(menuRowId!));
                        setMainModalDelete(true);
                        handleMenuClose();
                    }}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" />

                    <Tooltip
                        title="El cliente no puede ser eliminado debido a que no ha cumplido 6 meses sin inactividad."
                        placement="left"
                        arrow
                    >
                        <InputAdornment position="end" sx={{ ml: 1, cursor: 'pointer' }}>
                            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#645E60' }} />
                        </InputAdornment>
                    </Tooltip>
                </MenuItem>

            </Menu>


            <Menu
                anchorEl={clientAnchorEl}
                open={clientMenuOpen}
                onClose={() => setClientMenuOpen(false)}
                PaperProps={{
                    sx: {
                        padding: 1,
                        width: 250,
                        borderRadius: '12px',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <TextField
                    placeholder="Buscar cliente"
                    variant="outlined"
                    fullWidth
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value.toLowerCase())}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <img src={seachicon} alt="Buscar" style={{ width: 16 }} />
                            </InputAdornment>
                        ),
                        endAdornment: clientSearch && (
                            <IconButton onClick={() => setClientSearch('')}>
                                <img src={iconclose} alt="Limpiar" style={{ width: 16 }} />
                            </IconButton>
                        ),
                    }}
                    sx={{ mb: 1 }}
                />

                <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {clientsList
                        .filter((c) => c.nombreCliente.toLowerCase().includes(clientSearch))
                        .map((client) => (
                            <MenuItem
                                key={client.id}
                                onClick={() =>
                                    setSelectedClients((prev) =>
                                        prev.includes(client.nombreCliente)
                                            ? prev.filter((c) => c !== client.nombreCliente)
                                            : [...prev, client.nombreCliente]
                                    )
                                }
                            >
                                <Checkbox checked={selectedClients.includes(client.nombreCliente)} />
                                <ListItemText primary={client.nombreCliente} />
                            </MenuItem>
                        ))}
                    {clientsList.filter((c) => c.nombreCliente.toLowerCase().includes(clientSearch)).length === 0 && (
                        <Typography sx={{ textAlign: 'center', color: '#7B354D', fontSize: '14px', fontWeight: 500 }}>
                            No se encontraron resultados.
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" px={2} pb={1} gap={1}>
                    <SecondaryButton
                        onClick={() => {
                            setSelectedClients([]);
                            setClientSearch('');
                            setClientMenuOpen(false);
                            setClientsList(originalData.slice(0, 50));
                            setCurrentPage(1);
                        }}
                        text="LIMPIAR"
                    />
                    <MainButton
                        onClick={() => {
                            // Obtener los IDs de los clientes seleccionados
                            const selectedClientIds = clientsList
                                .filter(c => selectedClients.includes(c.nombreCliente))
                                .map(c => c.id);

                            // Filtrar los números por idClient
                            const filtered = originalData.filter(item =>
                                selectedClientIds.length === 0 || selectedClientIds.includes(item.id)
                            );

                            setClientsList(filtered);
                            setClientMenuOpen(false);
                            setCurrentPage(1);
                        }}

                        text="APLICAR"
                    />
                </Box>
            </Menu>

            {/* Modal para añadir o editar cliente */}
            <Dialog open={openClientModal} onClose={() => setOpenClientModal(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600, color: '#330F1B' }}>
                    {selectedClient ? 'Editar cliente' : 'Añadir cliente'}
                </DialogTitle>
                <DialogContent>
                    <Box px={3} pt={1}>
                        <Box display="flex" justifyContent="space-around" mb={2}>
                            {['Información', 'Tarifas', 'Salas'].map((label, index) => (
                                <Box key={label} textAlign="center">
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            border: '2px solid',
                                            borderColor: index <= step ? '#7B3F61' : '#DDD',
                                            borderRadius: '50%',
                                            mx: 'auto',
                                            backgroundColor: index < step ? '#7B3F61' : 'transparent',
                                        }}
                                    />
                                    <Typography
                                        fontSize="12px"
                                        mt={1}
                                        color={index === step ? '#7B3F61' : '#B7AEB0'}
                                    >
                                        {label} {index > 0 && <span style={{ fontSize: '10px' }}>(Opcional)</span>}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {step === 0 && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography fontWeight={600}>Información de contacto</Typography>

                                <TextField
                                    label="Nombre del cliente"
                                    value={selectedClient?.nombreCliente || ''}
                                    onChange={(e) => setSelectedClient({ ...selectedClient, nombreCliente: e.target.value })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Nombre único del cliente">
                                                    <InfoOutlined fontSize="small" />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                />

                                <Box display="flex" gap={2}>
                                    <TextField
                                        label="Nombre"
                                        value={selectedClient?.firstName || ''}
                                        onChange={(e) => setSelectedClient({ ...selectedClient, firstName: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Nombre de la persona responsable">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Apellidos"
                                        value={selectedClient?.lastName || ''}
                                        onChange={(e) => setSelectedClient({ ...selectedClient, lastName: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Apellidos del responsable">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                </Box>

                                <Box display="flex" gap={2}>
                                    <TextField
                                        label="Teléfono"
                                        value={selectedClient?.phoneNumber || ''}
                                        onChange={(e) => setSelectedClient({ ...selectedClient, phoneNumber: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Número de contacto del cliente">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Extensión"
                                        value={selectedClient?.extension || ''}
                                        onChange={(e) => setSelectedClient({ ...selectedClient, extension: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Extensión telefónica (opcional)">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                </Box>
                                <Box display="flex" gap={2}>
                                    <TextField
                                        label="Correo electrónico"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError(!validateEmailFormat(e.target.value));
                                        }}
                                        error={emailError}
                                        helperText={emailError ? 'Formato inválido' : ''}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Correo electrónico del usuario principal">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Confirmar correo electrónico"
                                        value={confirmEmail}
                                        onChange={(e) => {
                                            setConfirmEmail(e.target.value);
                                            setConfirmEmailError(e.target.value !== email);
                                        }}
                                        error={confirmEmailError}
                                        helperText={confirmEmailError ? 'Los correos no coinciden' : ''}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Escriba nuevamente el correo">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />

                                </Box>
                            </Box>
                        )}

                        {step === 1 && (
                            <Box display="flex" flexDirection="column" gap={4}>
                                <Typography fontWeight={600} sx={{ fontSize: '16px', color: '#330F1B' }}>
                                    Tarifas
                                </Typography>

                                <Box
                                    sx={{
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '12px',
                                        padding: '16px',
                                    }}
                                >
                                    <Typography fontWeight={600} sx={{ color: '#330F1B', mb: 1 }}>
                                        SMS # cortos
                                    </Typography>

                                    <Box display="flex" gap={4} flexWrap="wrap">
                                        {/* Columna tarifa estándar */}
                                        <Box sx={{ flex: 1, minWidth: 280 }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={shortRateType === 'estandar'}
                                                        onChange={() => setShortRateType('estandar')}
                                                    />
                                                }
                                                label="Tarifa estándar"
                                            />

                                            <Select
                                                fullWidth
                                                displayEmpty
                                                value={shortStandardQty}
                                                onChange={(e) => {
                                                    const selected = e.target.value as string;
                                                    setShortStandardQty(selected);
                                                    setShortStandardPrice(String(standardShortRates[selected] ?? ''));
                                                }}

                                                disabled={shortRateType !== 'estandar'}
                                                sx={{ mt: 1 }}
                                            >
                                                <MenuItem disabled value="">
                                                    Seleccionar cantidad de mensajes
                                                </MenuItem>
                                                <MenuItem value="1–999">1–999</MenuItem>
                                                <MenuItem value="1,000">1,000</MenuItem>
                                                <MenuItem value="2,000">2,000</MenuItem>
                                                <MenuItem value="3,000">3,000</MenuItem>
                                                <MenuItem value="4,000">4,000</MenuItem>
                                                <MenuItem value="6,000">6,000</MenuItem>
                                            </Select>

                                            <TextField
                                                label="Tarifa por mensaje"
                                                value={shortStandardPrice}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    readOnly: true,
                                                }}
                                                disabled={shortRateType !== 'estandar'}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                            />

                                        </Box>

                                        {/* Columna tarifa personalizada */}
                                        <Box sx={{ flex: 1, minWidth: 280 }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={shortRateType === 'personalizada'}
                                                        onChange={() => setShortRateType('personalizada')}
                                                    />
                                                }
                                                label="Tarifa personalizada"
                                            />

                                            <TextField
                                                label="Cantidad de mensajes"
                                                value={shortCustomQty}
                                                onChange={(e) => setShortCustomQty(e.target.value)}
                                                disabled={shortRateType !== 'personalizada'}
                                                fullWidth
                                                sx={{ mt: 1 }}
                                            />

                                            <TextField
                                                label="Tarifa por mensaje"
                                                value={selectedClient?.rateForShort || ''}
                                                onChange={(e) =>
                                                    setSelectedClient({ ...selectedClient, rateForShort: parseFloat(e.target.value) })
                                                }
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                disabled={shortRateType !== 'personalizada'}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>



                                <Box
                                    sx={{
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '12px',
                                        padding: '16px',
                                    }}
                                >
                                    <Typography fontWeight={600} sx={{ color: '#330F1B', mb: 1 }}>
                                        SMS # largos
                                    </Typography>

                                    <Box display="flex" gap={4} flexWrap="wrap">
                                        {/* Columna tarifa estándar */}
                                        <Box sx={{ flex: 1, minWidth: 280 }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={longRateType === 'estandar'}
                                                        onChange={() => setLongRateType('estandar')}
                                                    />
                                                }
                                                label="Tarifa estándar"
                                            />

                                            <Select
                                                fullWidth
                                                displayEmpty
                                                value={longStandardQty}
                                                onChange={(e) => {
                                                    const selected = e.target.value as string;
                                                    setLongStandardQty(selected);
                                                    setLongStandardPrice(String(standardLongRates[selected] ?? ''));
                                                }}
                                                disabled={longRateType !== 'estandar'}
                                                sx={{ mt: 1 }}
                                            >
                                                <MenuItem disabled value="">
                                                    Seleccionar cantidad de mensajes
                                                </MenuItem>
                                                <MenuItem value="1">1</MenuItem>
                                                <MenuItem value="1,000">1,000</MenuItem>
                                                <MenuItem value="2,000">2,000</MenuItem>
                                                <MenuItem value="4,000">4,000</MenuItem>
                                                <MenuItem value="5,000">5,000</MenuItem>
                                                <MenuItem value="8,000">8,000</MenuItem>
                                            </Select>

                                            <TextField
                                                label="Tarifa por mensaje"
                                                value={longStandardPrice}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    readOnly: true,
                                                }}
                                                disabled={longRateType !== 'estandar'}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                            />

                                        </Box>

                                        {/* Columna tarifa personalizada */}
                                        <Box sx={{ flex: 1, minWidth: 280 }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={longRateType === 'personalizada'}
                                                        onChange={() => setLongRateType('personalizada')}
                                                    />
                                                }
                                                label="Tarifa personalizada"
                                            />

                                            <TextField
                                                label="Cantidad de mensajes"
                                                value={longCustomQty}
                                                onChange={(e) => setLongCustomQty(e.target.value)}
                                                disabled={longRateType !== 'personalizada'}
                                                fullWidth
                                                sx={{ mt: 1 }}
                                            />

                                            <TextField
                                                label="Tarifa por mensaje"
                                                value={selectedClient?.rateForLong || ''}
                                                onChange={(e) =>
                                                    setSelectedClient({ ...selectedClient, rateForLong: parseFloat(e.target.value) })
                                                }
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                disabled={longRateType !== 'personalizada'}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>
                        )}
                        {step === 2 && (
                            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                                <Typography fontWeight={600} sx={{ fontSize: '16px', color: '#330F1B' }}>
                                    Elegir cantidad de salas
                                </Typography>

                                <Box display="flex" alignItems="center" gap={2}>
                                    <IconButton
                                        onClick={() => {
                                            if (ronomCount > 0) {
                                                const updatedRooms = [...newRooms];
                                                updatedRooms.pop();
                                                setNewRooms(updatedRooms);
                                                setRoomCount(roomCount - 1);
                                            }
                                        }}
                                        disabled={roomCount === 0}
                                        sx={{
                                            border: '1px solid #C4B2B9',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            color: '#7B354D',
                                        }}
                                    >
                                        −
                                    </IconButton>

                                    <TextField
                                        value={roomCount}
                                        inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                                        sx={{ width: 48 }}
                                    />

                                    <IconButton
                                        onClick={() => {
                                            if (roomCount < 5) {
                                                setNewRooms([...newRooms, '']);
                                                setRoomCount(roomCount + 1);
                                            }
                                        }}
                                        disabled={roomCount === 5}
                                        sx={{
                                            border: '1px solid #C4B2B9',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            color: '#7B354D',
                                        }}
                                    >
                                        +
                                    </IconButton>
                                </Box>

                                {newRooms.map((value, index) => (
                                    <TextField
                                        key={index}
                                        fullWidth
                                        label={`Nombre de sala ${index + 1}`}
                                        value={value}
                                        onChange={(e) => {
                                            const updated = [...newRooms];
                                            updated[index] = e.target.value;
                                            setNewRooms(updated);
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Nombre para identificar la sala">
                                                        <InfoOutlined fontSize="small" />
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={4} px={3} pb={2}>
                        <SecondaryButton text="Cancelar" onClick={() => setOpenClientModal(false)} />
                        <MainButton
                            text={
                                selectedClient && step === 1
                                    ? 'Guardar cambios'
                                    : step === 2
                                        ? 'Guardar'
                                        : 'Siguiente'
                            }
                            onClick={() => {
                                if (step === 0) {
                                    const isEmailValid = validateEmailFormat(email);
                                    const isMatch = email === confirmEmail;

                                    setEmailError(!isEmailValid);
                                    setConfirmEmailError(!isMatch);

                                    if (!isEmailValid || !isMatch) return;
                                }

                                if (step === 1 && selectedClient) {
                                    // Si es edición, guardar directamente
                                    handleSubmit();
                                    return;
                                }

                                if (step === 2) {
                                    handleSubmit();
                                } else {
                                    setStep(step + 1);
                                }
                            }}

                        />
                    </Box>
                </DialogContent>
            </Dialog>



            <ModalMain
                isOpen={MainModal}
                Title={MainModalTitle}
                message={MainModalMessage}
                primaryButtonText='Aceptar'
                secondaryButtonText='Cancelar'
                onPrimaryClick={modalAction}
                onSecondaryClick={() => setMainModal(false)}
            />
            <ModalMain
                isOpen={MainModalDelete}
                Title='Eliminar Cliente'
                message='¿Está seguro de que desea eliminar al cliente seleccionado? Esta acción no podrá revertirse.'
                primaryButtonText='Aceptar'
                secondaryButtonText='Cancelar'
                onPrimaryClick={modalAction}
                onSecondaryClick={() => setMainModalDelete(false)}
            />
            <ModalError
                isOpen={errorModal}
                title="Error al cargar registros"
                message="Algo salió mal. Inténtelo de nuevo o regrese más tarde."
                buttonText="Cerrar"
                onClose={() => setErrorModal(false)}
            />

            <Modal open={rechargeModalOpen} onClose={() => setRechargeModalOpen(false)}>
                <Box sx={{ background: '#fff', padding: 4, width: 500, margin: '100px auto', borderRadius: 2 }}>
                    <Typography variant="h6" mb={2} fontFamily="Poppins">Recargar Saldo para {selectedClient?.nombreCliente}</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tipo de SMS</InputLabel>
                        <Select
                            value={rechargeData.smsType}
                            onChange={(e) => {
                                const tipo = e.target.value as 'short' | 'long';
                                setRechargeData(prev => ({
                                    ...prev,
                                    smsType: tipo,
                                    ratePerMessage:
                                        tipo === 'short'
                                            ? selectedClient?.rateForShort ?? 0
                                            : selectedClient?.rateForLong ?? 0
                                }));
                            }}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>Seleccionar servicio</em>
                            </MenuItem>
                            <MenuItem value="short">SMS Cortos</MenuItem>
                            <MenuItem value="long">SMS Largos</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography fontWeight="bold" fontFamily="Poppins">Salas:</Typography>
                    <FormGroup sx={{ mb: 2 }}>
                        {getRoomsList().map((room, idx) => (
                            <FormControlLabel
                                key={idx}
                                control={
                                    <Checkbox
                                        checked={rechargeData.roomsSelected.includes(room)}
                                        onChange={() => handleToggleRoom(room)}
                                    />
                                }
                                label={room}
                            />
                        ))}
                    </FormGroup>
                    <TextField
                        label="Tarifa por mensaje"
                        value={rechargeData.ratePerMessage.toFixed(2)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Monto"
                                type="number"
                                fullWidth
                                value={rechargeData.amount}
                                onChange={(e) =>
                                    setRechargeData((prev) => ({
                                        ...prev,
                                        amount: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Total (con IVA 16%)"
                                value={`$${((rechargeData.amount || 0) * 1.16).toFixed(2)}`}
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                    </Grid>
                    <FormControl component="fieldset" sx={{ mt: 3 }}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
                            Tipo de pago
                        </FormLabel>
                        <RadioGroup
                            value={rechargeData.paymentType}
                            onChange={(e) =>
                                setRechargeData((prev) => ({
                                    ...prev,
                                    paymentType: e.target.value,
                                }))
                            }
                        >
                            <FormControlLabel value="demo" control={<Radio />} label="Demo" />
                            <FormControlLabel value="transferencia" control={<Radio />} label="Transferencia bancaria" />
                            <FormControlLabel value="deposito" control={<Radio />} label="Depósito en efectivo" />
                        </RadioGroup>
                    </FormControl>
                    <Box mt={2}>
                        <Typography sx={{ fontWeight: 600, fontFamily: 'Poppins', mb: 1 }}>
                            Fecha de facturación
                        </Typography>
                        <TextField
                            value={selectedDate ? selectedDate.toLocaleDateString('es-MX') : ''}
                            onClick={handleOpenDatePicker}
                            placeholder="Seleccionar fecha"
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img src="/icons/calendar.svg" alt="Calendario" style={{ width: 18 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <SecondaryButton text='Cancelar' onClick={() => setRechargeModalOpen(false)} />
                        <MainButton text='Recargar' onClick={handleSaveRecharge} />
                    </Box>
                </Box>
            </Modal>
            <CustomDateTimePicker
                open={datePickerOpen}
                anchorEl={anchorEl2}
                onApply={(date, hour, minute) => {
                    const newDate = new Date(date);
                    newDate.setHours(hour);
                    newDate.setMinutes(minute);
                    handleDateChange(newDate);
                    setRechargeData(prev => ({
                        ...prev,
                        billingDate: newDate.toISOString()
                    }));
                }}
                onClose={() => setDatePickerOpen(false)}
            />
        </Box>
    );
};

export default Clients;
