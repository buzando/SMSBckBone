import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Divider,
    Tabs,
    Tab,
    Popper,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Checkbox,
    ListItemText,
    CircularProgress
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DatePicker from '../components/commons/DatePicker';
import BoxEmpty from '../assets/Nousers.svg';
import boxopen from '../assets/NoResultados.svg';
import backarrow from '../assets/MoveTable.svg';

import IconCSV from '../assets/IconCSV.svg';
import IconExcel from '../assets/IconExcel.svg';
import IconPDF from '../assets/IconPDF.svg';
import Tooltip from "@mui/material/Tooltip";

import axios from 'axios';

import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';

interface Reports {
    id: number,
    Fecha: Date,
    Telefono: string,
    Sala: string,
    Campana: string,
    Idcampana: number,
    Usuario: string,
    Idmensaje: number,
    Mensaje: string,
    Estado: string,
    Fecharecepcion: Date,
    Costo: number,
    Tipo: string,
    Resultado: string,
}

// Datos simulados de campañas y usuarios
const campaigns = ['Campaña 1', 'Campaña 2', 'Campaña 3', 'Campaña 4'];
const users = ['Usuario 0', 'Usuario 1', 'Usuario 2', 'Usuario 3'];

const Reports: React.FC = () => {
    const [Reports, setReports] = useState<Reports[] | null | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState("SMS");

    // Estados para DatePicker
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedDates, setSelectedDates] = useState<any>(null);

    // Estados para el Popper de Campañas
    const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
    const [anchorElC, setAnchorElC] = useState<HTMLElement | null>(null);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [campaignSearch, setCampaignSearch] = useState('');

    // Estados para el Popper de Usuarios
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const tableRef = React.useRef<HTMLDivElement>(null);
    const [filteredReports, setFilteredReports] = useState<Reports[] | null>(null);
    const navigate = useNavigate();

    // Maneja el cambio de tabs (SMS / Llamada)
    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    // Abre el DatePicker al hacer clic en el botón
    const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setDatePickerOpen(true);
    };

    // Cierra el DatePicker sin aplicar cambios
    const handleCancelDatePicker = () => {
        setDatePickerOpen(false);
    };



    // Abre o cierra el menú de campañas
    const handleCampaignClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (campaignMenuOpen) {
            setCampaignMenuOpen(false);
            setAnchorElC(null);
        } else {
            setAnchorElC(event.currentTarget);
            setCampaignMenuOpen(true);
        }
    };

    // Alterna selección de una campaña
    const handleCampaignSelection = (campaign: string) => {
        setSelectedCampaigns((prev) =>
            prev.includes(campaign) ? prev.filter((item) => item !== campaign) : [...prev, campaign]
        );
    };

    // Selecciona o deselecciona todas las campañas
    const handleSelectAllCampaigns = () => {
        setSelectedCampaigns(selectedCampaigns.length === campaigns.length ? [] : [...campaigns]);
    };

    // Limpia todas las campañas seleccionadas
    const handleClearCampaignSelection = () => {
        setSelectedCampaigns([]);
        setFilteredReports(null);
    };


    // Abre o cierra el menú de usuarios
    const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (userMenuOpen) {
            setUserMenuOpen(false);
            setUserAnchorEl(null);
        } else {
            setUserAnchorEl(event.currentTarget);
            setUserMenuOpen(true);
        }
    };

    // Alterna selección de un usuario
    const handleUserSelection = (user: string) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(user)
                ? prevSelected.filter((u) => u !== user)
                : [...prevSelected, user]
        );
    };

    // Selecciona o deselecciona todos los usuarios
    const handleSelectAllUsers = () => {
        setSelectedUsers(selectedUsers.length === users.length ? [] : [...users]);
    };

    // Limpia todos los usuarios seleccionados
    const handleClearUserSelection = () => {
        setSelectedUsers([]);
        setFilteredReports(null);
    };

    //Estado para submenu SMS
    const [smsMenuOpen, setSmsMenuOpen] = useState(false);
    const [smsAnchorEl, setSmsAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSmsOption, setSelectedSmsOption] = useState<string>("SMS");
    const smsOptions = [
        "SMS",
        "Global",
        "Mensajes entrantes",
        "Mensajes enviados",
        "Mensajes no enviados",
        "Mensajes rechazados"
    ];
    //Función abrir /cerrar SMS
    const handleSmsClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setSmsAnchorEl(event.currentTarget);
        setSmsMenuOpen((prev) => !prev);
    };

    const handleSmsOptionSelect = (option: string) => {
        setSelectedSmsOption(option);
        setSmsMenuOpen(false);
        setSelectedDates(null);
        setReports(undefined);
    };





    const data: Reports[] = [
        {
            id: 1,
            Fecha: new Date('2025-03-25T10:00:00'),
            Telefono: '3001234567',
            Sala: 'Atención al Cliente',
            Campana: 'Campaña Marzo',
            Idcampana: 101,
            Usuario: 'jdoe',
            Idmensaje: 5001,
            Mensaje: 'Mensaje enviado correctamente',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:01:00'),
            Costo: 30,
            Tipo: 'SMS'
        },
        {
            id: 2,
            Fecha: new Date('2025-03-25T10:05:00'),
            Telefono: '3017654321',
            Sala: 'Soporte Técnico',
            Campana: 'Campaña Marzo',
            Idcampana: 101,
            Usuario: 'asmith',
            Idmensaje: 5002,
            Mensaje: 'Tu caso ha sido actualizado',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:06:00'),
            Costo: 25,
            Tipo: 'SMS'
        },
        {
            id: 3,
            Fecha: new Date('2025-03-25T10:10:00'),
            Telefono: '3025551234',
            Sala: 'Ventas',
            Campana: 'Promoción Primavera',
            Idcampana: 102,
            Usuario: 'mjordan',
            Idmensaje: 5003,
            Mensaje: 'Nueva oferta disponible',
            Estado: 'Fallido',
            Fecharecepcion: new Date('2025-03-25T10:11:00'),
            Costo: 0,
            Tipo: 'SMS'
        },
        {
            id: 4,
            Fecha: new Date('2025-03-25T10:15:00'),
            Telefono: '3039876543',
            Sala: 'Cobranza',
            Campana: 'Recordatorio de Pago',
            Idcampana: 103,
            Usuario: 'lrojas',
            Idmensaje: 5004,
            Mensaje: 'Tu factura vence mañana',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:16:00'),
            Costo: 20,
            Tipo: 'SMS'
        },
        {
            id: 5,
            Fecha: new Date('2025-03-25T10:20:00'),
            Telefono: '3043217890',
            Sala: 'Marketing',
            Campana: 'Campaña Abril',
            Idcampana: 104,
            Usuario: 'eperez',
            Idmensaje: 5005,
            Mensaje: 'No te pierdas nuestras novedades',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:21:00'),
            Costo: 28,
            Tipo: 'SMS'
        },
        {
            id: 6,
            Fecha: new Date('2025-03-25T10:25:00'),
            Telefono: '3051237894',
            Sala: 'Atención al Cliente',
            Campana: 'Campaña Abril',
            Idcampana: 104,
            Usuario: 'lvalencia',
            Idmensaje: 5006,
            Mensaje: 'Gracias por contactarnos',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:26:00'),
            Costo: 30,
            Tipo: 'SMS'
        },
        {
            id: 7,
            Fecha: new Date('2025-03-25T10:30:00'),
            Telefono: '3069871234',
            Sala: 'Soporte Técnico',
            Campana: 'Campaña Especial',
            Idcampana: 105,
            Usuario: 'mcastillo',
            Idmensaje: 5007,
            Mensaje: 'Se ha creado tu ticket',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:31:00'),
            Costo: 32,
            Tipo: 'SMS'
        },
        {
            id: 8,
            Fecha: new Date('2025-03-25T10:35:00'),
            Telefono: '3076543210',
            Sala: 'Ventas',
            Campana: 'Promoción de Pascua',
            Idcampana: 106,
            Usuario: 'gfernandez',
            Idmensaje: 5008,
            Mensaje: 'Oferta válida por 24h',
            Estado: 'Fallido',
            Fecharecepcion: new Date('2025-03-25T10:36:00'),
            Costo: 0,
            Tipo: 'SMS'
        },
        {
            id: 9,
            Fecha: new Date('2025-03-25T10:40:00'),
            Telefono: '3083216547',
            Sala: 'Cobranza',
            Campana: 'Alerta de Pago',
            Idcampana: 107,
            Usuario: 'nruiz',
            Idmensaje: 5009,
            Mensaje: 'Tu saldo está vencido',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:41:00'),
            Costo: 27,
            Tipo: 'SMS'
        },
        {
            id: 10,
            Fecha: new Date('2025-03-25T10:45:00'),
            Telefono: '3091122334',
            Sala: 'Marketing',
            Campana: 'Campaña Verano',
            Idcampana: 108,
            Usuario: 'adominguez',
            Idmensaje: 5010,
            Mensaje: '¡Prepárate para el verano!',
            Estado: 'Entregado',
            Fecharecepcion: new Date('2025-03-25T10:46:00'),
            Costo: 30,
            Tipo: 'SMS'
        }
    ];

    const dataEntrantes: Reports[] = [
        {
            id: 1,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 2',
            Idcampana: 1,
            Usuario: 'Usuario 1',
            Idmensaje: 11,
            Mensaje: 'Hola'
        },
        {
            id: 2,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 2,
            Usuario: 'Usuario 2',
            Idmensaje: 13,
            Mensaje: 'No gracias'
        },
        {
            id: 3,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 3,
            Usuario: 'Usuario 3',
            Idmensaje: 22,
            Mensaje: 'Probando'
        },
        {
            id: 4,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 4,
            Usuario: 'Usuario 4',
            Idmensaje: 26,
            Mensaje: 'Ejemplo mensaje muy largo que debe cortarse...'
        },
        {
            id: 5,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 5,
            Usuario: 'Usuario 5',
            Idmensaje: 34,
            Mensaje: 'Hola'
        },
        {
            id: 6,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 6,
            Usuario: 'Usuario 6',
            Idmensaje: 39,
            Mensaje: 'Adiós'
        },
        {
            id: 7,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 7,
            Usuario: 'Usuario 7',
            Idmensaje: 45,
            Mensaje: 'No me interesa'
        },
        {
            id: 8,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: 'Sala Tal',
            Campana: 'Campaña 1',
            Idcampana: 8,
            Usuario: 'Usuario 8',
            Idmensaje: 55,
            Mensaje: 'Gracias'
        }
    ];

    const dataEnviados: Reports[] = [
        {
            id: 1,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 1,
            Usuario: 'Usuario 1',
            Idmensaje: 23,
            Mensaje: 'Hola',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 2,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 2,
            Usuario: 'Usuario 2',
            Idmensaje: 35,
            Mensaje: 'Le informamos que su cuenta tal debe equis cantidad',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 3,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 3,
            Usuario: 'Usuario 3',
            Idmensaje: 54,
            Mensaje: 'Probando',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 4,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 4,
            Usuario: 'Usuario 4',
            Idmensaje: 65,
            Mensaje: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 5,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 5,
            Usuario: 'Usuario 5',
            Idmensaje: 77,
            Mensaje: 'Hola',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 6,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 6,
            Usuario: 'Usuario 6',
            Idmensaje: 87,
            Mensaje: 'Adiós',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 7,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 7,
            Usuario: 'Usuario 7',
            Idmensaje: 91,
            Mensaje: 'No me interesa',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        },
        {
            id: 8,
            Fecha: new Date('2024-07-23T00:00:00'),
            Telefono: '525512121212',
            Sala: '',
            Campana: 'Campaña 1',
            Idcampana: 8,
            Usuario: 'Usuario 8',
            Idmensaje: 93,
            Mensaje: 'Gracias',
            Resultado: 'Enviado',
            Fecharecepcion: new Date('2024-07-23T00:00:00')
        }
    ];

    const dataNoEnviados = [
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 1',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 23,
            Mensaje: 'Hola'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 2',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 35,
            Mensaje: 'Le informamos que su cuenta tal debe equis cantidad'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 3',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 54,
            Mensaje: 'Probando'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 4',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 65,
            Mensaje: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed...'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 5',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Excepción no controlada',
            Idmensaje: 77,
            Mensaje: 'Hola'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 6',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 87,
            Mensaje: 'Adiós'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 7',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Excepción no controlada',
            Idmensaje: 91,
            Mensaje: 'No me interesa'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 8',
            Sala: 'Sala Tal',
            Campana: '8Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'No enviado',
            Razon: 'Carrier no disponible',
            Idmensaje: 93,
            Mensaje: 'Gracias'
        }
    ];

    const dataRechazados = [
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 1',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por el usuario',
            Idmensaje: 23,
            Mensaje: 'Hola'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 2',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por red del destino',
            Idmensaje: 35,
            Mensaje: 'Le informamos que su cuenta tal debe equis cantidad'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 3',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por red del destino',
            Idmensaje: 54,
            Mensaje: 'Probando'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 4',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por el usuario',
            Idmensaje: 65,
            Mensaje: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed...'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 5',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por red del destino',
            Idmensaje: 77,
            Mensaje: 'Hola'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 6',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por el usuario',
            Idmensaje: 87,
            Mensaje: 'Adiós'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 7',
            Sala: 'Sala Tal',
            Campana: 'Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por el usuario',
            Idmensaje: 91,
            Mensaje: 'No me interesa'
        },
        {
            Fecha: new Date('2024-07-23T00:00:00'),
            Usuario: 'Usuario 8',
            Sala: 'Sala Tal',
            Campana: '8Campaña Tal',
            Telefono: '525512121212',
            Resultado: 'Rechazado',
            Razon: 'Rechazo por el usuario',
            Idmensaje: 93,
            Mensaje: 'Gracias'
        }
    ];


    const handleDateSelectionApply = async (start: Date, end: Date, startHour: number, startMinute: number, endHour: number, endMinute: number) => {
        setSelectedDates({ start, end, startHour, startMinute, endHour, endMinute });
        setDatePickerOpen(false);
        setAnchorEl(null);
        setLoading(true);
        try {
            setReports(data);
        } catch {
            setReports(null);
        } finally {
            setLoading(false);
        }
    };

    {/*Spinner*/ }
    const handleExportClick = (
        format: 'csv' | 'xlsx' | 'pdf',
        setThisLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setThisLoading(true);

        setTimeout(() => {
            exportReport(format, () => {
                setThisLoading(false);
            });
        }, 1000); // Tiempo del spinner
    };

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
            {/* Spinner de fondo */}
            <CircularProgress
                variant="determinate"
                value={100}
                size={24}
                thickness={8}
                sx={{
                    color: '#D6C4CB',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
            />

            {/* Spinner (color principal) */}
            <CircularProgress
                size={24}
                thickness={8}
                sx={{
                    color: '#7B354D',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    animationDuration: '1s',
                }}
            />

            {/* Centro blanco */}
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


    const [isExportingCSV, setIsExportingCSV] = useState(false);
    const [isExportingXLSX, setIsExportingXLSX] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const anyExporting = isExportingCSV || isExportingXLSX || isExportingPDF;



    const exportReport = async (format: 'csv' | 'xlsx' | 'pdf',
        onComplete?: () => void
    ) => {
        const MAX_RECORDS_LOCAL = 100000;
        try {

            if (data.length <= MAX_RECORDS_LOCAL) {
                // === LOCAL EXPORT ===
                const cleanData = data.map(item => ({
                    Fecha: new Date(item.Fecha).toLocaleString(),
                    Telefono: item.Telefono,
                    Sala: item.Sala,
                    Campana: item.Campana,
                    Idcampana: item.Idcampana,
                    Usuario: item.Usuario,
                    Idmensaje: item.Idmensaje,
                    Mensaje: item.Mensaje,
                    Estado: item.Estado,
                    Fecharecepcion: new Date(item.Fecharecepcion).toLocaleString(),
                    Costo: item.Costo,
                    Tipo: item.Tipo
                }));

                if (format === 'csv') {
                    const csv = unparse(cleanData);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    saveAs(blob, 'Reporte.csv');
                } else if (format === 'xlsx') {
                    const worksheet = XLSX.utils.json_to_sheet(cleanData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([excelBuffer], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                    saveAs(blob, 'Reporte.xlsx');
                }
                else if (format === 'pdf') {
                    const input = tableRef.current;
                    if (!input) return;

                    // 🔄 Crear un clon oculto para capturar sin afectar la vista
                    const clone = input.cloneNode(true) as HTMLDivElement;
                    clone.style.position = 'absolute';
                    clone.style.top = '-9999px';
                    clone.style.left = '-9999px';
                    clone.style.overflow = 'visible';
                    clone.style.width = 'fit-content';
                    clone.style.maxWidth = 'none';

                    document.body.appendChild(clone);

                    const canvas = await html2canvas(clone, {
                        scale: 2,
                        useCORS: true
                    });

                    document.body.removeChild(clone); // 🧹 Limpieza

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('l', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();

                    const imgProps = pdf.getImageProperties(imgData);
                    const imgWidth = pdfWidth;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                    let position = 0;

                    if (imgHeight < pdfHeight) {
                        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    } else {
                        const canvasHeight = canvas.height;
                        const pageHeightPx = (pdfHeight * canvas.height) / imgHeight;

                        const pageCanvas = document.createElement('canvas');
                        const pageCtx = pageCanvas.getContext('2d')!;
                        pageCanvas.width = canvas.width;
                        pageCanvas.height = pageHeightPx;

                        let pageCount = 0;

                        for (let offset = 0; offset < canvasHeight; offset += pageHeightPx) {
                            pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
                            pageCtx.drawImage(canvas, 0, -offset);
                            const pageImg = pageCanvas.toDataURL('image/png');
                            if (pageCount > 0) pdf.addPage();
                            pdf.addImage(pageImg, 'PNG', 0, 0, imgWidth, pdfHeight);
                            pageCount++;
                        }
                    }

                    pdf.save('Reporte.pdf');
                    return;
                }


            }
            else {
                const payload = {
                    // Cambia esto según los filtros seleccionados
                    FechaInicio: selectedDates?.start,
                    FechaFin: selectedDates?.end,
                    Campanas: selectedCampaigns,
                    Usuarios: selectedUsers,
                    Tipo: selectedTab, // SMS o Llamada
                    Formato: format // csv, excel, pdf
                };

                const headers = {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "X-Requested-With",
                    "Access-Control-Allow-Origin": "*"
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_SMS_API_URL}` + `${import.meta.env.VITE_API_GET_REPORTS}`,
                    payload,
                    { headers }
                );

                // Crea un enlace para descargar el archivo
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Reporte.${format === 'excel' ? 'xlsx' : format}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error("Error exportando reporte:", error);
        }
        finally {
            onComplete?.();
        }
    };

    const handleFilter = () => {
        let baseData: any[] = [];

        // Selecciona el dataset base según la opción actual
        switch (selectedSmsOption) {
            case "Global":
                baseData = data;
                break;
            case "Mensajes entrantes":
                baseData = dataEntrantes;
                break;
            case "Mensajes enviados":
                baseData = dataEnviados;
                break;
            case "Mensajes no enviados":
                baseData = dataNoEnviados;
                break;
            case "Mensajes rechazados":
                baseData = dataRechazados;
                break;
            default:
                baseData = [];
        }

        // Aplica filtro por usuario si hay selección
        let resultado = [...baseData];
        if (selectedUsers.length > 0) {
            resultado = resultado.filter(r => selectedUsers.includes(r.Usuario));
        }
        if (selectedCampaigns.length > 0) {
            resultado = resultado.filter(r => selectedCampaigns.includes(r.Campana));
        }
        // En el futuro podés aplicar filtros por campaña u otros aquí

        setFilteredReports(resultado);
    };

    const getCurrentDataLength = () => {
        if (filteredReports) return filteredReports.length;

        switch (selectedSmsOption) {
            case "Global":
                return data.length;
            case "Mensajes entrantes":
                return dataEntrantes.length;
            case "Mensajes enviados":
                return dataEnviados.length;
            case "Mensajes no enviados":
                return dataNoEnviados.length;
            case "Mensajes rechazados":
                return dataRechazados.length;
            default:
                return 0;
        }
    };


    return (
        <Box p={4} sx={{ padding: '10px', marginLeft: "35px", marginTop:'-50px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '0px', mb: 1 }}>
                <IconButton
                    onClick={() => navigate('/')} // ← O ajusta la ruta a donde quieras volver
                    sx={{
                        ml: '-20px',
                        p: 0,
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={ArrowBackIosNewIcon}
                        alt="Regresar"
                        style={{ width: 24, height: 24, transform: 'rotate(270deg)' }}
                    />
                </IconButton>

                <Typography
                    variant="h4"
                    sx={{
                        color: '#5A2836',
                        fontFamily: 'Poppins',
                        fontSize: '26px',
                    }}
                >
                    Reportes
                </Typography>
            </Box>

            {/* Tabs para SMS y Llamada */}
            <Divider sx={{ mt: 2, mb: 0, maxWidth: "83%", }} />
            <Tabs value={selectedTab} onChange={handleTabChange} TabIndicatorProps={{
                style: {
                    display: 'none',

                }
            }}>


                <Box
                    onClick={handleSmsClick}
                    sx={{
                        height: "43px",
                        minWidth: "109px",
                        px: 2,
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: "500",
                        opacity: 1,
                        fontSize: "16px",
                        lineHeight: "25px",
                        color: selectedSmsOption !== "SMS" || smsMenuOpen ? "#864058 !important" : "#574B4F !important",
                        backgroundColor: selectedSmsOption !== "SMS" || smsMenuOpen ? "#EDD5DC99" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        "&:hover": {
                            backgroundColor: "#EDD5DC99 !important",
                            color: "#864058 !important"
                        }
                    }} >
                    {selectedSmsOption === "SMS" ? "SMS" : `SMS - ${selectedSmsOption}`}
                </Box>


                <Tab label="Llamada" value="Llamada"
                    sx={{
                        minHeight: "auto",
                        padding: "4px 12px",
                        fontFamily: "Poppins",
                        textTransform: "none",
                        fontSize: "16px"
                    }} disabled={true} />

                <Popper open={smsMenuOpen} anchorEl={smsAnchorEl} placement="bottom-start">
                    <Paper sx={{ width: 379 }}>
                        {smsOptions
                            .filter((option) => option !== "SMS") // 👈 Aquí ocultamos "SMS"
                            .map((option) => (

                                <MenuItem
                                    key={option}
                                    selected={option === selectedSmsOption}
                                    onClick={() => handleSmsOptionSelect(option)}
                                    sx={{
                                        fontFamily: "Poppins",
                                        color: "#84797C",
                                        fontSize: "16px",
                                        "&:hover": {
                                            backgroundColor: "#F2EBED"
                                        }
                                    }}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                    </Paper>
                </Popper>

            </Tabs>
            <Divider sx={{ mt: 1, mb: 2, marginTop: "-5px", maxWidth: "83%", }} />

            {/* Filtros de Fecha, Campaña y Usuario */}
            <Box display="flex" gap={2} mb={4} marginBottom={2}>
                <Button variant="outlined" sx={buttonStyle} onClick={handleDateClick}>
                    {selectedDates ? `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()}` : 'FECHA'}
                </Button>

                {/* Mostrar solo si no es "Global" */}
                {selectedSmsOption !== "Global" && (
                    <>
                        <Button variant="outlined" sx={buttonStyle} onClick={handleCampaignClick}>CAMPAÑA</Button>
                        <Button variant="outlined" sx={buttonStyle} onClick={handleUserClick}>USUARIO</Button>
                    </>
                )}
            </Box>


            {/* Popper Campañas */}
            <Popper open={campaignMenuOpen} anchorEl={anchorElC} placement="bottom-start">
                <Paper sx={{ width: 280, p: 2 }}>
                    <TextField
                        placeholder="Buscar"
                        fullWidth
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'Poppins',
                                fontSize: '16px',
                                color: campaignSearch ? '#7B354D' : '#9B9295',
                                '& fieldset': {
                                    borderColor: campaignSearch ? '#7B354D' : '#9B9295',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#7B354D',
                                },
                            },
                            input: {
                                fontFamily: 'Poppins',
                                height: '10px',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: campaignSearch ? '#7B354D' : '#B0A7AA' }} />
                                </InputAdornment>
                            ),
                            endAdornment: campaignSearch && (
                                <IconButton onClick={() => setCampaignSearch('')}>
                                    <ClearIcon sx={{ color: '#7B354D' }} />
                                </IconButton>
                            ),
                        }}
                    />


                    {/* Línea horizontal*/}
                    <Divider sx={{ my: 1.5, bgcolor: '#dcdcdc', marginBottom: "10px", marginTop: "15px", }} />
                    <div style={{
                        position: 'absolute',
                        top: '74px', // ajusta según el contenido anterior
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#dcdcdc',
                    }}>
                    </div>

                    <Box sx={{ maxHeight: 140, overflowY: 'auto' }}>
                        {/* <MenuItem onClick={handleSelectAllCampaigns}>
                            <Checkbox checked={selectedCampaigns.length === campaigns.length}
                                sx={{
                                    marginBottom: "-10px",
                                    marginTop: "-10px",
                                    marginLeft: "-20px",
                                    color: '#6C3A52',
                                    '&.Mui-checked': { color: '#6C3A52' },

                                }}
                            />
                            <ListItemText primary="Seleccionar todo"
                                primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: "500" }}
                            />
                        </MenuItem> */}
                        {campaigns.filter(c => c.toLowerCase().includes(campaignSearch.toLowerCase())).map(c => (
                            <MenuItem key={c} onClick={() => handleCampaignSelection(c)}>
                                <Checkbox checked={selectedCampaigns.includes(c)}
                                    sx={{
                                        marginBottom: "-10px",
                                        marginTop: "-10px",
                                        marginLeft: "-20px",
                                        color: '#786E71',
                                        '&.Mui-checked': { color: '#6C3A52' },

                                    }}
                                />
                                <ListItemText
                                    primary={c}
                                    primaryTypographyProps={{
                                        fontFamily: 'Poppins',
                                        color: selectedCampaigns.includes(c) ? '#8F4E63' : '#786E71',
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </Box>

                    {/* Línea horizontal arriba de los botones */}
                    <div style={{
                        position: 'absolute',
                        top: '245px', // ajusta según el contenido anterior
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#dcdcdc',
                    }}>
                    </div>

                    <Box display="flex" justifyContent="space-between" sx={{ mt: 4.5 }}>
                        <Button variant="outlined" onClick={handleClearCampaignSelection}
                            sx={{
                                backgroundColor: '#FFFFFF',
                                color: '#833A53',
                                borderColor: '#CCCFD2',
                                width: '116px',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: "1.12px",
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#EDD5DC99',
                                }
                            }}

                        >LIMPIAR</Button>



                        <Button variant="contained"
                            onClick={() => {
                                setCampaignMenuOpen(false);
                                handleFilter();
                            }}
                            sx={{
                                backgroundColor: '#833A53',
                                color: '#FFFFFF',
                                borderColor: '#60293C',
                                width: '109px',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: "1.12px",
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#A54261',
                                }
                            }}
                        >APLICAR</Button>
                    </Box>
                </Paper>
            </Popper>

            {/* Popper Usuarios */}
            <Popper open={userMenuOpen} anchorEl={userAnchorEl} placement="bottom-start">
                <Paper sx={{ width: 280, p: 2 }}>
                    <TextField
                        placeholder="Buscar"
                        fullWidth
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'Poppins',
                                fontSize: '16px',
                                color: userSearch ? '#7B354D' : '#9B9295',
                                '& fieldset': {
                                    borderColor: userSearch ? '#7B354D' : '#9B9295',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#7B354D',
                                },
                            },
                            input: {
                                fontFamily: 'Poppins',
                                height: '10px',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: userSearch ? '#7B354D' : '#B0A7AA' }} />
                                </InputAdornment>
                            ),
                            endAdornment: userSearch && (
                                <IconButton onClick={() => setUserSearch('')}>
                                    <ClearIcon sx={{ color: '#7B354D' }} />
                                </IconButton>
                            ),
                        }}
                    />

                    {/* Línea horizontal*/}
                    <Divider sx={{ my: 1.5, bgcolor: '#dcdcdc', marginBottom: "10px", marginTop: "15px" }} />
                    <div style={{
                        position: 'absolute',
                        top: '74px', // ajusta según el contenido anterior
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#dcdcdc',
                    }}>
                    </div>

                    <Box sx={{ maxHeight: 140, overflowY: 'auto', }}>
                        {/* <MenuItem onClick={handleSelectAllUsers}>
                            <Checkbox checked={selectedUsers.length === users.length}
                                sx={{
                                    marginBottom: "-10px",
                                    marginTop: "-10px",
                                    marginLeft: "-20px",
                                    
                                    color: '#6C3A52',
                                    '&.Mui-checked': { color: '#6C3A52' },

                                }}
                            />
                            <ListItemText primary="Seleccionar todo"
                                primaryTypographyProps={{ fontFamily: 'Poppins' }}
                            />
                        </MenuItem> */}
                        {users.filter(u => u.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                            <MenuItem key={u} onClick={() => handleUserSelection(u)}>
                                <Checkbox checked={selectedUsers.includes(u)}
                                    sx={{
                                        marginBottom: "-10px",
                                        marginTop: "-10px",
                                        marginLeft: "-20px",
                                        color: '#786E71',
                                        '&.Mui-checked': { color: '#6C3A52' },

                                    }}
                                />
                                <ListItemText primary={u}
                                    primary={u}
                                    primaryTypographyProps={{
                                        fontFamily: 'Poppins',
                                        color: selectedUsers.includes(u) ? '#8F4E63' : '#786E71',
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </Box>

                    {/* Línea horizontal arriba de los botones */}
                    <div style={{
                        position: 'absolute',
                        top: '245px', // ajusta según el contenido anterior
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#dcdcdc',
                    }}>
                    </div>


                    <Box display="flex" justifyContent="space-between" sx={{ mt: 4.5 }}>
                        <Button variant="outlined" onClick={handleClearUserSelection}
                            sx={{
                                backgroundColor: '#FFFFFF',
                                color: '#833A53',
                                borderColor: '#CCCFD2',
                                width: '116px',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: "1.12px",
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#EDD5DC99',
                                }
                            }}

                        >LIMPIAR</Button>
                        <Button variant="contained"
                            onClick={() => {
                                setUserMenuOpen(false);
                                handleFilter();
                            }}
                            sx={{
                                backgroundColor: '#833A53',
                                color: '#FFFFFF',
                                borderColor: '#60293C',
                                width: '109px',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: "1.12px",
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#A54261',
                                }
                            }}

                        >APLICAR</Button>
                    </Box>
                </Paper>
            </Popper>

            <Divider sx={{ mb: 4, maxWidth: "83%" }} />


            {/* Controles de paginación (solo visual) */}
            {selectedDates?.start && selectedDates?.end && (
                <Box display="flex" gap={2} alignItems="center" mb={3} sx={{ marginTop: "-15px", marginBottom: "20px" }}>
                    <Typography sx={{
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: "#6F565E",
                        fontSize: "14px",
                        marginLeft: "5px"
                    }}>
                        1-1 de {getCurrentDataLength()}
                    </Typography>

                    <Box display="flex" gap={1}>
                        {/* Primera página (doble flecha izquierda) */}
                        <IconButton sx={{ p: 0 }} disabled>
                            <Box display="flex" alignItems="center" >
                                <img src={backarrow} alt="<<" style={{ marginRight: '-16px', opacity: 0.4 }} />
                                <img src={backarrow} alt="<<" style={{ opacity: 0.4 }} />
                            </Box>
                        </IconButton>

                        {/* Página anterior (flecha izquierda) */}
                        <IconButton sx={{ p: 0 }} disabled>
                            <img src={backarrow} alt="<" style={{ opacity: 0.4 }} />
                        </IconButton>

                        {/* Página siguiente (flecha derecha volteada) */}
                        <IconButton sx={{ p: 0 }} disabled>
                            <img
                                src={backarrow}
                                alt=">"
                                style={{ transform: 'scaleX(-1)', opacity: 0.4 }}
                            />
                        </IconButton>

                        {/* Última página (doble flecha derecha) */}
                        <IconButton sx={{ p: 0 }} disabled>
                            <Box display="flex" alignItems="center">
                                <img
                                    src={backarrow}
                                    alt=">>"
                                    style={{ transform: 'scaleX(-1)', marginRight: '-4px', opacity: 0.4 }}
                                />
                                <img
                                    src={backarrow}
                                    alt=">>"
                                    style={{ transform: 'scaleX(-1)', marginLeft: '-12px', opacity: 0.4 }}
                                />
                            </Box>
                        </IconButton>

                        {/* Botones de CSV / Excel y PDF */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1, marginLeft: "1140px", gap: 2 }}>
                            <IconButton sx={{ p: 0, opacity: !isExportingCSV && anyExporting ? 0.3 : 1 }}
                                onClick={() => handleExportClick('csv', setIsExportingCSV)}
                                disabled={anyExporting && !isExportingCSV}
                            >
                                <Tooltip title="Exportar a CSV" placement="top"
                                    arrow

                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'arrow',
                                                options: {
                                                    padding: 8, // Ajusta si es necesario
                                                },
                                            },
                                        ],
                                    }}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'Poppins',
                                                backgroundColor: '#322D2E', // Fondo negro
                                                color: '#FFFFFF', // Texto blanco para contraste
                                                fontSize: '12px',
                                                borderRadius: '4px',
                                                padding: '6px 10px',
                                            },
                                        },
                                        arrow: {
                                            sx: {
                                                color: '#322D2E', // Flecha con color negro también
                                            },
                                        },
                                    }}

                                >
                                    {isExportingCSV ? (
                                        <DualSpinner />
                                    ) : (
                                        <img src={IconCSV} alt="csv" style={{ transform: 'rotate(0deg)' }} />
                                    )}
                                </Tooltip>
                            </IconButton>

                            <IconButton sx={{ p: 0, opacity: !isExportingXLSX && anyExporting ? 0.3 : 1 }}
                                onClick={() => handleExportClick('xlsx', setIsExportingXLSX)}
                                disabled={anyExporting && !isExportingXLSX}
                            >


                                <Tooltip title="Exportar a Excel"
                                    placement="top"
                                    arrow

                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'arrow',
                                                options: {
                                                    padding: 8, // Ajusta si es necesario
                                                },
                                            },
                                        ],
                                    }}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'Poppins',
                                                backgroundColor: '#322D2E', // Fondo negro
                                                color: '#FFFFFF', // Texto blanco para contraste
                                                fontSize: '12px',
                                                borderRadius: '4px',
                                                padding: '6px 10px',
                                            },
                                        },
                                        arrow: {
                                            sx: {
                                                color: '#322D2E', // Flecha con color negro también
                                            },
                                        },
                                    }}

                                >
                                    {isExportingXLSX ? (
                                        <DualSpinner />
                                    ) : (
                                        <img src={IconExcel} alt="xlsx" style={{ transform: 'rotate(0deg)' }} />
                                    )}
                                </Tooltip>
                            </IconButton>


                            <IconButton sx={{ p: 0, opacity: !isExportingPDF && anyExporting ? 0.3 : 1 }}
                                onClick={() => handleExportClick('pdf', setIsExportingPDF)}
                                disabled={anyExporting && !isExportingPDF}
                            >
                                <Tooltip title="Exportar a PDF"
                                    placement="top"
                                    arrow

                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'arrow',
                                                options: {
                                                    padding: 8, // Ajusta si es necesario
                                                },
                                            },
                                        ],
                                    }}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'Poppins',
                                                backgroundColor: '#322D2E', // Fondo negro
                                                color: '#FFFFFF', // Texto blanco para contraste
                                                fontSize: '12px',
                                                borderRadius: '4px',
                                                padding: '6px 10px',
                                            },
                                        },
                                        arrow: {
                                            sx: {
                                                color: '#322D2E', // Flecha con color negro también
                                            },
                                        },
                                    }}

                                >
                                    {isExportingPDF ? (
                                        <DualSpinner />
                                    ) : (
                                        <img src={IconPDF} alt="pdf" style={{ transform: 'rotate(0deg)' }} />
                                    )}
                                </Tooltip>
                            </IconButton>



                        </Box>

                    </Box>
                </Box>
            )}



            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '512px'
                    }}
                >
                    <CircularProgress sx={{ color: '#7B354D' }} size={60} />
                </Box>
            ) : Reports === undefined ? (
                // Imagen de caja cerrada cuando NO se ha seleccionado ninguna fecha
                <Box>
                    {/* Contenido por defecto cuando no hay selección */}
                    <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 5, textAlign: "center", maxWidth: "83%" }}>
                        <CardContent>
                            <Box component="img" src={BoxEmpty} alt="Caja Vacía" sx={{ width: '200px', height: "400px" }} />
                            <Typography mt={2} sx={{ color: '#8F4D63', fontWeight: '500', fontFamily: 'Poppins', fontSize: '14px' }}>
                                Seleccione un canal del menú superior para comenzar.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            ) : Reports === null ? (
                // Imagen de caja abierta cuando NO se encuentran resultados
                <Box
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '892px',
                        height: '512px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '20px'
                    }}
                >
                    <img src={boxopen} alt="No results" style={{ width: '150px', height: '150px', }} />
                    <Typography
                        sx={{
                            textAlign: 'center',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: '500',
                            lineHeight: '18px',
                            color: '#7B354D',
                            marginTop: '10px'
                        }}
                    >
                        No se encontraron resultados.
                    </Typography>
                </Box>
            ) : selectedSmsOption === "Global" ? (


                <Box
                    ref={tableRef}
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '1500px', // Limita el ancho
                        maxWidth: '100%',
                        padding: '20px',
                        marginTop: '5px',
                        overflowX: 'auto', // Habilita scroll horizontal
                        overflowY: 'auto', // Opcional: oculta scroll vertical si no se necesita
                        height: '500px',
                        maxHeight: '100%',

                    }}


                >
                    <table style={{ maxWidth: "83%", borderCollapse: 'collapse', marginTop: "-15px", tableLayout: 'auto' }}>
                        {/* Encabezados */}
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E6E4E4', }}>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    opacity: 1,
                                }}>
                                    Fecha
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Teléfono
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Sala
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Campaña
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Id de Campaña
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Usuario
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Id de Mensaje
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Mensaje
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Estado
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Fecha de Recepción
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Costo
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Tipo
                                </th>
                            </tr>
                        </thead>

                        {/* Datos */}
                        <tbody>
                            {Reports.map((recarga, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E6E4E4', height: '50px' }}>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',

                                    }}>
                                        {new Date(recarga.Fecha).toLocaleString()}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Telefono}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Sala}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Campana}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Idcampana}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Usuario}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Idmensaje}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Mensaje}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Estado}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {new Date(recarga.Fecharecepcion).toLocaleString()}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Costo}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#574B4F',
                                        letterSpacing: "0.03",
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.Tipo}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            ) : selectedSmsOption === "Mensajes entrantes" ? (
                <Box
                    ref={tableRef}
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '1500px',
                        maxWidth: '100%',
                        padding: '20px',
                        marginTop: '5px',
                        overflowX: 'auto',
                        overflowY: 'auto', // Opcional: oculta scroll vertical si no se necesita
                        height: '500px',
                        maxHeight: '100%',
                    }}
                >
                    <table style={{ maxWidth: "83%", borderCollapse: 'collapse', marginTop: "-15px", tableLayout: 'auto' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E6E4E4' }}>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    opacity: 1,
                                }}>
                                    Fecha
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Teléfono
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Sala
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Campaña
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Id de campaña
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Usuario
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Id de mensaje
                                </th>
                                <th style={{
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Mensaje
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredReports || dataEntrantes).map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E6E4E4', height: '50px' }}>
                                    <td style={cellStyle}>{new Date(item.Fecha).toLocaleString()}</td>
                                    <td style={cellStyle}>{item.Telefono}</td>
                                    <td style={cellStyle}>{item.Sala}</td>
                                    <td style={cellStyle}>{item.Campana}</td>
                                    <td style={cellStyle}>{item.Idcampana}</td>
                                    <td style={cellStyle}>{item.Usuario}</td>
                                    <td style={cellStyle}>{item.Idmensaje}</td>
                                    <td style={cellStyle}>{item.Mensaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

            ) : selectedSmsOption === "Mensajes enviados" ? (
                <Box
                    ref={tableRef}
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '1500px',
                        maxWidth: '100%',
                        padding: '20px',
                        marginTop: '5px',
                        overflowX: 'auto',
                        overflowY: 'auto', // Opcional: oculta scroll vertical si no se necesita
                        height: '500px',
                        maxHeight: '100%',
                    }}
                >
                    <table style={{ width: '83%', borderCollapse: 'collapse', marginTop: "-15px", tableLayout: 'auto' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E6E4E4' }}>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Fecha
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Teléfono de destinatario
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Campaña
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    ID de campaña
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Usuario
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Resultado
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Fecha de recepción
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    ID de mensaje
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Mensaje
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredReports || dataEnviados).map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E6E4E4', height: '50px' }}>
                                    <td style={cellStyle}>{new Date(item.Fecha).toLocaleString()}</td>
                                    <td style={cellStyle}>{item.Telefono}</td>
                                    <td style={cellStyle}>{item.Campana}</td>
                                    <td style={cellStyle}>{item.Idcampana}</td>
                                    <td style={cellStyle}>{item.Usuario}</td>
                                    <td style={cellStyle}>{item.Resultado}</td>
                                    <td style={cellStyle}>{new Date(item.Fecharecepcion).toLocaleString()}</td>
                                    <td style={cellStyle}>{item.Idmensaje}</td>
                                    <td style={cellStyle}>{item.Mensaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            ) : selectedSmsOption === "Mensajes no enviados" ? (
                <Box
                    ref={tableRef}
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '1500px',
                        maxWidth: '100%',
                        padding: '20px',
                        marginTop: '5px',
                        overflowX: 'auto',
                        overflowY: 'auto', // Opcional: oculta scroll vertical si no se necesita
                        height: '500px',
                        maxHeight: '100%',
                    }}
                >
                    <table style={{ width: '83%', borderCollapse: 'collapse', marginTop: "-15px", tableLayout: 'auto' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E6E4E4' }}>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Fecha
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Usuario
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Sala
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Campaña
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Teléfono de destinatario
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Resultado
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Razón
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    ID de mensaje
                                </th>
                                <th style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: "500",
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    Mensaje
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredReports || dataNoEnviados).map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E6E4E4', height: '50px' }}>
                                    <td style={cellStyle}>{new Date(item.Fecha).toLocaleString()}</td>
                                    <td style={cellStyle}>{item.Usuario}</td>
                                    <td style={cellStyle}>{item.Sala}</td>
                                    <td style={cellStyle}>{item.Campana}</td>
                                    <td style={cellStyle}>{item.Telefono}</td>
                                    <td style={cellStyle}>{item.Resultado}</td>
                                    <td style={cellStyle}>{item.Razon}</td>
                                    <td style={cellStyle}>{item.Idmensaje}</td>
                                    <td style={cellStyle}>{item.Mensaje}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

            ) : selectedSmsOption === "Mensajes rechazados" ? (<Box
                ref={tableRef}
                sx={{
                    background: '#FFFFFF',
                    border: '1px solid #E6E4E4',
                    borderRadius: '8px',
                    width: '1500px',
                    maxWidth: '100%',
                    padding: '20px',
                    marginTop: '5px',
                    overflowX: 'auto',
                    overflowY: 'auto', // Opcional: oculta scroll vertical si no se necesita
                    height: '500px',
                    maxHeight: '100%',
                }}
            >
                <table style={{ width: '83%', borderCollapse: 'collapse', marginTop: "-15px", tableLayout: 'auto' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E6E4E4' }}>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Fecha</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Usuario</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Sala</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Campaña</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Teléfono de destinatario</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Resultado</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Razón</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                ID de mensaje</th>
                            <th style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: "500",
                                textAlign: 'left',
                                padding: '10px',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF'
                            }}>
                                Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredReports || dataRechazados).map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #E6E4E4', height: '50px' }}>
                                <td style={cellStyle}>{new Date(item.Fecha).toLocaleString()}</td>
                                <td style={cellStyle}>{item.Usuario}</td>
                                <td style={cellStyle}>{item.Sala}</td>
                                <td style={cellStyle}>{item.Campana}</td>
                                <td style={cellStyle}>{item.Telefono}</td>
                                <td style={cellStyle}>{item.Resultado}</td>
                                <td style={cellStyle}>{item.Razon}</td>
                                <td style={cellStyle}>{item.Idmensaje}</td>
                                <td style={cellStyle}>{item.Mensaje}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
            ) : (null)}



            {/* Componente de selección de fechas */}
            <DatePicker
                open={datePickerOpen}
                anchorEl={anchorEl}
                onApply={handleDateSelectionApply}
                onClose={handleCancelDatePicker}
            />
        </Box>
    );
};

// Estilo para los botones de filtros
const buttonStyle = {
    background: '#F6F6F6',
    border: '1px solid #C6BFC2',
    borderRadius: '18px',
    padding: '8px 16px',
    fontWeight: '500',
    letterSpacing: "1.12px",
    height: "36px",
    fontFamily: 'Poppins',
    color: '#8F4D63',
    opacity: 1,
    textTransform: 'none',
    '&:hover': {
        background: '#F2E9EC',
        border: '1px solid #BE93A066',
    },
    '&:active': {
        background: '#E6C2CD',
        border: '1px solid #BE93A0',
    }
};

const headerStyle = {
    textAlign: 'left',
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    color: '#330F1B',
    backgroundColor: '#FFFFFF',
};

const cellStyle = {
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    color: '#574B4F',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export default Reports;
