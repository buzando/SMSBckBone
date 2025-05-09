import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Divider,
  Grid,
  Paper,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  RadioGroup,
  Checkbox,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  FormControlLabel,
  SelectChangeEvent,
  Switch,
  Radio
} from "@mui/material";
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import seachicon from '../assets/icon-lupa.svg'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import welcome from '../assets/icon-welcome.svg'
import PushPinIcon from "@mui/icons-material/PushPin";
import iconplus from "../assets/Icon-plus.svg";
import CloseIcon from '@mui/icons-material/Close';
import IconTache from "../assets/icon-close.svg";
import iconclose from "../assets/icon-close.svg";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from '@mui/icons-material/Check';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DynamicCampaignText from '../components/commons/DynamicCampaignText'
import IconTrash from "../assets/IconTrash.svg";
import IconCirclePlus from "../assets/IconCirclePlus.svg";
import SecondaryButton from '../components/commons/SecondaryButton'
import MainModal from '../components/commons/MainModal';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import CustomDateTimePicker from '../components/commons/DatePickerOneDate';
import TemplateViewer from '../components/commons/TemplateViewer'
import smsico from '../assets/Icon-sms.svg'
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MainButton from '../components/commons/MainButton'
import infoicon from '../assets/Icon-info.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'
import ModalError from "../components/commons/ModalError"

import boxopen from '../assets/NoResultados.svg';
import * as XLSX from 'xlsx';
import RemoveIcon from "@mui/icons-material/Remove";

import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { Tooltip } from "@mui/material";
import IconSMS from '../assets/IconSMS.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import DropZone from '../components/commons/DropZone';
import { Tabs, Tab } from '@mui/material';

interface Horario {
  titulo: string;
  start: Date | null;
  end: Date | null;
  operationMode?: number; // 1 o 2
  order?: number;
}

export interface Template {
  id: number;
  name: string;
  message: string;
  creationDate: string; // DateTime en C# es string en JS/TS
  idRoom: number;
}

export interface BlackList {
  id: number;
  name: string;
  creationDate: string;
  expirationDate: string;
  quantity: number;
}
export interface CampaignFullResponse {
  id: number;
  name: string;
  message?: string;
  useTemplate: boolean;
  templateId?: number;
  autoStart: boolean;
  flashMessage: boolean;
  customANI: boolean;
  recycleRecords: boolean;
  numberType: number;
  createdDate: string;
  numeroActual: number;
  numeroInicial: number;

  schedules: CampaignScheduleDto[];
  recycleSetting?: CampaignRecycleSettingDto;
  contacts: CampaignContactDto[];
}

export interface CampaignScheduleDto {
  startDateTime: string;
  endDateTime: string;
  operationMode?: number;
  order: number;
}

export interface CampaignRecycleSettingDto {
  typeOfRecords?: string;
  includeNotContacted: boolean;
  numberOfRecycles: number;
}

export interface CampaignContactDto {
  phoneNumber: string;
  dato?: string;
  datoId?: string;
  misc01?: string;
  misc02?: string;
}



const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/mexico/mexico-states.json";

const Campains: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const [campaignName, setCampaignName] = useState('');
  const [Serchterm, setSerchterm] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState<'escrito' | 'plantilla'>('escrito');
  const [mensajeAceptado, setMensajeAceptado] = useState(false);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [tipoNumero, setTipoNumero] = useState('corto');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [aniEnabled, setAniEnabled] = useState(false);
  const [recycleEnabled, setRecycleEnabled] = useState(false);
  const [recycleType, setRecycleType] = useState('todos'); // 'todos' o 'rechazados'
  const [includeUncontacted, setIncludeUncontacted] = useState(false);
  const [recycleCount, setRecycleCount] = useState(1);
  const [blacklistEnabled, setBlacklistEnabled] = useState(false);
  const [blackLists, setBlackLists] = useState<BlackList[]>([]);
  const [searchTermBlacklist, setSearchTermBlacklist] = useState('');
  const [selectedAni, setSelectedAni] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [messageChipBar, setMessageChipBar] = useState("");
  const [TitleErrorModal, setTitleErrorModal] = useState('');
  const [MessageErrorModal, setMessageErrorModal] = useState('');
  const [currentHorarioIndex, setCurrentHorarioIndex] = useState<number | null>(null);
const [selectedCampaign, setSelectedCampaign] = useState<CampaignFullResponse | null>(null);



  const [estadisticasCarga, setEstadisticasCarga] = useState<{
    registrosCargados: number;
    registrosFallidos: number;
    telefonosCargados: number;
    telefonosFallidos: number;
  } | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const dataCountry = [
    { id: "01", state: "Aguascalientes", value: 10 },
    { id: "02", state: "Baja California", value: 20 },
    { id: "03", state: "Baja California Sur", value: 30 },
    { id: "04", state: "Campeche", value: 40 },
    { id: "05", state: "Coahuila", value: 50 }
  ];

  const registros = [
    { tipo: "Respondidos", total: 4, porcentaje: "4%" },
    { tipo: "Fuera de horario", total: 4, porcentaje: "4%" },
    { tipo: "Bloqueados", total: 4, porcentaje: "4%" }
  ];

  const indicadores = [
    { label: "Tasa de recepción", value: "90%", color: "#A17EFF" },
    { label: "Tasa de no recepción", value: "90%", color: "#F6B960" },
    { label: "Tasa de espera", value: "90%", color: "#5EBBFF" },
    { label: "Tasa de entrega-falla", value: "90%", color: "#FF88BB" },
    { label: "Tasa de rechazos", value: "90%", color: "#F6B960" },
    { label: "Tasa de no envío", value: "90%", color: "#A6A6A6" },
    { label: "Tasa de excepción", value: "90%", color: "#7DD584" }
  ];

  const mensajesIndicadores = [
    ["Mensajes entregados de forma correcta."],
    ["Mensaje no entregado.", "Esta condición se presenta cuando se ha vencido el tiempo de entrega asignado."],
    ["Mensaje en espera.", "El mensaje ha sido aceptado por la red destino, pero el usuario tiene apagado su teléfono."],
    ["Mensaje fallido.", "La red destino ha enviado el mensaje al usuario, pero el usuario ha rechazado su entrega."],
    ["Mensaje rechazado.", "Esta condición se presenta cuando la red destino rechaza el mensaje."],
    ["Mensaje no enviado.", "No hubo un carrier disponible para enviarlo.", "No se consumieron créditos."],
    ["Excepción no controlada en el sistema.", "No se consumieron créditos."]
  ];

  const data = [
    { name: "Recibidos", value: 90, color: "#A17EFF" },
    { name: "No recibidos", value: 10, color: "#F6B960" },
    { name: "En espera", value: 90, color: "#5EBBFF" },
    { name: "Entrega-falla", value: 90, color: "#FF88BB" },
    { name: "Rechazados", value: 90, color: "#F6B960" },
    { name: "No enviados", value: 90, color: "#A6A6A6" },
    { name: "Excepciones", value: 90, color: "#7DD584" }
  ];
  const aniOptions = ['Regionalizado', '557685943', '5760548473'];
  const filteredBlackLists = blackLists.filter((item) =>
    item.name.toLowerCase().includes(searchTermBlacklist.toLowerCase())
  );

  const fetchTemplates = async () => {
    const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;
    try {
      setLoadingTemplates(true);
      const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_GET_GETTEMPLATESBYROOM}${salaId}`;
      const response = await axios.get(requestUrl);
      setTemplates(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchBlackLists = async () => {
    const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;
    if (!salaId) return;

    try {

      const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_GET_BLACKLIST}${salaId}`;
      const response = await axios.get(requestUrl);
      if (response.status === 200) {
        setBlackLists(response.data);
      }
    } finally {
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^\d{10,12}$/; // Acepta entre 10 y 12 dígitos
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhone(value);
    setError(!validatePhone(value)); // Actualiza error según la validación
  };

  const handleSearch2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSerchterm(value); // Actualiza el estado de búsqueda

    //ToDo: buscador campañas
  };

  const [checkedTelefonos, setCheckedTelefonos] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'telefonos' | 'variables'>('telefonos');
  const [postCargaActiva, setPostCargaActiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [openInfoModal, setOpenInfoModal] = useState(false);

  const [isRunning, setIsRunning] = useState(true);

  const [infoChecks, setInfoChecks] = useState<Record<string, boolean>>({
    "Horarios": true,
    "Prueba de envío de mensaje": true,
    "Registros": true,
    "Mapa de concentración de mensajes": true,
    "Resultados de envío por día": true,
  });

  const [selectedTelefonos, setSelectedTelefonos] = useState<string[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  const [openCreateCampaignModal, setOpenCreateCampaignModal] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end" | null>(null); // saber cuál está editando

  const handleManageFile = (file: File) => {
    console.log("📁 Archivo recibido:", file.name); // agrega esto
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      setWorkbook(wb);
      setSheetNames(wb.SheetNames);
      const firstSheet = wb.SheetNames[0];
      setSelectedSheet(firstSheet);
      const sheetData = XLSX.utils.sheet_to_json(wb.Sheets[firstSheet], { header: 1 }) as any[][];
      setExcelData(sheetData);
      setColumns(sheetData[0] as string[]);
    };
    reader.readAsArrayBuffer(file);

    // === BASE64 ===
    const readerB64 = new FileReader();
    readerB64.onloadend = () => {
      const base64 = (readerB64.result as string).split(',')[1];
      setBase64File(base64);
      setUploadedFileBase64(base64); // <- este es el que usas en el payload
    };
    readerB64.readAsDataURL(file);
  };

  const [telefonos, setTelefonos] = useState<string[]>([]);
  const [variables, setVariables] = useState<string[]>([]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [fileSuccess, setFileSuccess] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedDatoCol, setSelectedDatoCol] = useState('');
  const [selectedTelefonoCol, setSelectedTelefonoCol] = useState('');
  const [omitHeaders, setOmitHeaders] = useState(false);
  const [workbook, setWorkbook] = useState<any>(null);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [base64File, setBase64File] = useState('');
  const [uploadedFileBase64, setUploadedFileBase64] = useState('');
  const [dragColumns, setDragColumns] = useState<string[]>([]);
  const [selectedBlackListIds, setSelectedBlackListIds] = useState<number[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignFullResponse[]>([]);

  const handleAgregarHorario = () => {
    setHorarios((prev) => [
      ...prev,
      {
        titulo: `Horario ${prev.length + 1}`,
        start: new Date(), // o null si usas DatePicker
        end: new Date()
      }
    ]);

    const handleStartDateChange = (index: number, newStart: Date) => {
      setHorarios(prev =>
        prev.map((h, i) => i === index ? { ...h, start: newStart } : h)
      );
    };

    const handleEndDateChange = (index: number, newEnd: Date) => {
      setHorarios(prev =>
        prev.map((h, i) => i === index ? { ...h, end: newEnd } : h)
      );
    };

    // Mostrar solo si aún no se ha mostrado
    if (!mostrarModoOperacion) {
      setMostrarModoOperacion(true);
    }
  };
  const handleEliminarHorario = (index: number) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const currentSet = selectedTab === 'telefonos' ? selectedTelefonos : selectedVariables;
    setDragColumns(columns.filter(col =>
      !selectedTelefonos.includes(col) || selectedTab === 'telefonos'
    ).filter(col =>
      !selectedVariables.includes(col) || selectedTab === 'variables'
    ));
  }, [selectedTelefonos, selectedVariables, selectedTab, columns]);

  const handleContinue = async () => {
    if (activeStep === 0 && !postCargaActiva) {
      const cargaExitosa = await handleSaveTemplate();
      if (!cargaExitosa) return;
      setPostCargaActiva(true);
    } else if (activeStep === 2) {
      await handleSaveCampaign(); // Aquí se guarda la campaña
    } else if (activeStep === 1) {
      if (!mensajeAceptado) {
        setMensajeAceptado(true);
        return;
      }
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };


  const handleSheetChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    setSelectedSheet(selected);

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[selected], { header: 1 });
    const jsonData = sheet as any[][];
    setExcelData(jsonData);

    const allColumns = jsonData[0] as string[];
    setColumns(allColumns);

    // Clasificación de columnas
    const telCols = allColumns.filter(col =>
      col.toLowerCase().includes("teléfono") || col.toLowerCase().includes("telefono")
    );
    const varCols = allColumns.filter(col => !telCols.includes(col));

    setTelefonos(telCols);
    setVariables(varCols);
  };


  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;
    if (!salaId) return;

    try {
      const url = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CAMPAIGN + salaId}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setCampaigns(response.data);
        setSelectedCampaign(response.data);
      }
    } catch (error) {
      console.error("Error al traer campañas:", error);
    }
  };

  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(Serchterm.toLowerCase())
  );

  const [pinnedCampaigns, setPinnedCampaigns] = useState<number[]>([]);

  const colorScale = scaleLinear<string>()
    .domain([0, 50])
    .range(["#F5E8EA", "#7B354D"]);

  const [panelAbierto, setPanelAbierto] = useState(true);

  const [horarios, setHorarios] = useState<Horario[]>([{
    titulo: "Horario 1",
    start: null,
    end: null,
    operationMode: 1, // opcional
    order: 1          // opcional
  }]);
  const [mostrarModoOperacion, setMostrarModoOperacion] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const current = selectedTab === 'telefonos' ? [...selectedTelefonos] : [...selectedVariables];
    const [moved] = current.splice(result.source.index, 1);
    current.splice(result.destination.index, 0, moved);

    if (selectedTab === 'telefonos') {
      setSelectedTelefonos(current);
    } else {
      setSelectedVariables(current);
    }
  };

  const columnsToRender = selectedTab === 'telefonos'
    ? [...telefonos, ...variables.filter(v => !telefonos.includes(v))]
    : [...variables, ...telefonos.filter(t => !variables.includes(t))];

  const currentSelected = selectedTab === 'telefonos' ? selectedTelefonos : selectedVariables;

  const handleOpenModal = () => {
    if (templates.length === 0) {
      fetchTemplates();
    }
    if (blackLists.length === 0) {
      fetchBlackLists();
    }
    setOpenCreateCampaignModal(true);
  };

  const navigate = useNavigate();

  const handleSaveTemplate = async (): Promise<boolean> => {
    setLoadingTemplates(true);
    const sessionId = crypto.randomUUID();
    const createdBy = localStorage.getItem("userName") || "frontend"; // o ajústalo si usas otra clave
    const sheetName = selectedSheet; // nombre de la hoja seleccionada
    sessionIdRef.current = sessionId;

    try {
      if (!uploadedFileBase64 || selectedTelefonos.length === 0 || selectedVariables.length === 0) {
        throw new Error("Faltan campos requeridos");
      }

      const payload = {
        Base64File: uploadedFileBase64,
        SheetName: sheetName,
        PhoneColumns: selectedTelefonos,
        DatoColumns: selectedVariables,
        SessionId: sessionIdRef.current,
        CreatedBy: createdBy
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_ADD_TMPSAVEFILE}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setMessageChipBar("Registros añadidos con éxito");
        setEstadisticasCarga(response.data); // Guardamos la respuesta
      }
      return true;
    } catch (error) {
      console.error(error);
      setIsErrorModalOpen(true);
      setTitleErrorModal('Error al cargar archivo');
      setMessageErrorModal('Ocurrió un error al intentar cargar el archivo. Inténtalo más tarde.');
      return false;
    } finally {
      setLoadingTemplates(false);
    }
  };

  const totalRegistros = (estadisticasCarga?.registrosCargados || 0) + (estadisticasCarga?.registrosFallidos || 0);
  const porcentajeRegistrosCargados = totalRegistros > 0
    ? Math.round((estadisticasCarga?.registrosCargados || 0) * 100 / totalRegistros)
    : 0;

  const totalTelefonos = (estadisticasCarga?.telefonosCargados || 0) + (estadisticasCarga?.telefonosFallidos || 0);
  const porcentajeTelefonosCargados = totalTelefonos > 0
    ? Math.round((estadisticasCarga?.telefonosCargados || 0) * 100 / totalTelefonos)
    : 0;

  const handleCloseModalCampaña = () => {
    setOpenCreateCampaignModal(false);
    setCampaignName('');
    setMensajeTexto('');
    setTipoMensaje('escrito');
    setMensajeAceptado(false);
    setSelectedTemplate(undefined);
    setFlashEnabled(false);
    setAniEnabled(false);
    setRecycleEnabled(false);
    setRecycleType('todos');
    setIncludeUncontacted(false);
    setRecycleCount(1);
    setBlacklistEnabled(false);
    setSelectedBlackListIds([]);
    setHorarios([{
      titulo: "Horario 1",
      start: null,
      end: null,
      operationMode: 1,
      order: 1
    }]);
    setMostrarModoOperacion(false);
    setPostCargaActiva(false);
    setActiveStep(-1);
    setUploadedFile(null);
    setUploadedFileBase64('');
    setSelectedTelefonos([]);
    setSelectedVariables([]);
    setCheckedTelefonos([]);
    setEstadisticasCarga(null);
    setMessageChipBar('');
    sessionIdRef.current = null;
  };


  const handleSaveCampaign = async () => {
    try {
      const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

      const payload = {
        campaigns: {
          name: campaignName,
          RoomId: salaId,
          message: mensajeTexto,
          useTemplate: tipoMensaje === "plantilla",
          templateId: tipoMensaje === "plantilla" ? selectedTemplate?.id : null,
          autoStart: true,
          flashMessage: flashEnabled,
          customANI: aniEnabled,
          recycleRecords: recycleEnabled,
          numberType: tipoNumero === 'corto' ? 1 : 2,
          createdDate: new Date().toISOString()
        },
        campaignSchedules: horarios.map((h, index) => ({
          startDateTime: h.start?.toISOString(),
          endDateTime: h.end?.toISOString(),
          operationMode: recycleEnabled ? 2 : 1,
          order: index + 1
        })),
        campaignRecycleSetting: recycleEnabled ? {
          typeOfRecords: recycleType, // 'todos' o 'rechazados'
          includeNotContacted: includeUncontacted,
          numberOfRecycles: recycleCount
        } : null,
        blacklistIds: blacklistEnabled ? selectedBlackListIds : [],
        sessionId: sessionIdRef.current
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_ADD_CAMPAIGN}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        handleCloseModalCampaña();
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (

    <Box sx={{ padding: "20px", marginLeft: "30px", maxWidth: "81%" }}>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            p: 0,
            mr: 1,
            ml: '-28px',
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
              display: 'block',
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
          {/* Título que ya tengas, como "Campañas" */}
          Campañas
        </Typography>
      </Box>

      <Divider sx={{ marginBottom: "20px", marginTop: "17px" }} />

      <Grid container spacing={2}>
        {/* Listado de campañas */}

        <Grid item sx={{ display: 'flex' }}>
          <Box sx={{ display: "flex", }}>
            {/* Panel de campañas */}
            {panelAbierto && (
              <Paper
                sx={{
                  padding: "15px",
                  borderRadius: "8px 0 0 8px", // borde izquierdo redondeado
                  width: "370px",
                  height: "581px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "279px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "left",
                      fontFamily: "Poppins",
                      letterSpacing: "0px",
                      color: "#330F1B",
                      opacity: 1,
                      fontSize: "18px",
                    }}
                  >
                    Listado de campañas
                  </Typography>´

                  <Tooltip title="Crear" arrow placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "#000000",
                          color: "#CCC3C3",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "12px",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                        }
                      },
                      arrow: {
                        sx: {
                          color: "#000000"
                        }
                      }
                    }}
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                          }
                        }
                      ]
                    }}
                  >
                    <IconButton onClick={handleOpenModal}>
                      <img src={iconplus} alt="Agregar" style={{ width: "20px", height: "20px" }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar"
                  value={Serchterm}
                  onChange={handleSearch2}
                  autoFocus
                  onKeyDown={(e) => e.stopPropagation()} // Evita la navegación automática
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "4px",
                    height: "40px",
                    width: "279px",
                    marginBottom: "15px",
                    "& .MuiOutlinedInput-root": {
                      padding: "8px 12px",
                      height: "40px",
                      borderColor: Serchterm ? "#7B354D" : "#9B9295",
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "16px",
                      fontFamily: "Poppins, sans-serif",
                      color: Serchterm ? "#7B354D" : "#9B9295",
                      padding: "8px 12px",
                      height: "100%",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={seachicon}
                          alt="Buscar"
                          style={{
                            width: "18px",
                            height: "18px",
                            filter: Serchterm
                              ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)"
                              : "none",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: Serchterm ? (
                      <InputAdornment position="end">
                        <img
                          src={iconclose}
                          alt="Limpiar búsqueda"
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => setSerchterm("")} // Borra el texto al hacer clic
                        />
                      </InputAdornment>
                    ) : null,
                  }}
                />

                <Select
                  fullWidth
                  size="small"
                  displayEmpty
                  sx={{
                    marginTop: "10px",
                    width: "279px",
                    marginBottom: "10px",
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#645E60",
                    opacity: 1,
                    fontSize: "12px"
                  }}
                  renderValue={(selected) =>
                    selected && typeof selected === "string" ? selected : <em>Seleccionar estatus</em>
                  }
                >
                  <MenuItem sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#645E60",
                    opacity: 1,
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor: "#F2EBED"
                    }
                  }} value="Todos">Todos</MenuItem>

                  <MenuItem sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#645E60",
                    opacity: 1,
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor: "#F2EBED"
                    }
                  }} value="Encendidas">Campañas encendidas</MenuItem>

                  <MenuItem sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#645E60",
                    opacity: 1,
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor: "#F2EBED"
                    }
                  }} value="Detenidas">Campañas detenidas</MenuItem>
                </Select>

                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <Checkbox
                    checked={selectedCampaigns.length > 0}
                    onChange={() => setSelectedCampaigns([])} // 🔥 Limpiar todos los seleccionados
                    icon={
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: "2px solid #6C3A52",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          backgroundColor: "#8F4D63",
                          border: "2px solid #8F4D63",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        −
                      </Box>
                    }
                    sx={{
                      color: "#6C3A52",
                      "&.Mui-checked": { color: "#6C3A52" },
                      alignSelf: "flex-start",
                    }}
                  />

                  <Tooltip title="Eliminar" arrow placement="top"
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
                            offset: [0, -7] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                          }
                        }
                      ]
                    }}
                  >
                    <IconButton onClick={handleOpenModal} sx={{ padding: 0 }}>
                      <Box component="img" src={IconTrash} alt="Eliminar"
                        sx={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>


                <Divider sx={{ marginBottom: "5px" }} />

                <List sx={{ overflowY: "auto", flexGrow: 1 }}>
                  {filteredCampaigns.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
                      <Box component="img" src={boxopen} alt="Caja Vacía" sx={{ width: '250px', height: 'auto' }} />
                      <Typography sx={{ marginTop: '10px', color: '#8F4D63', fontWeight: '500', fontFamily: 'Poppins' }}>
                        No se encontraron resultados.
                      </Typography>
                    </Box>
                  ) : (
                    filteredCampaigns.map((campaign, index) => {
                      const isSelected = selectedCampaigns.includes(index);
                      const progreso = (campaign.numeroActual / campaign.numeroInicial) * 100;

                      return (
                        <ListItem key={index} sx={{
                          background: "#FFFFFF",
                          backgroundColor: isSelected ? "rgba(209, 119, 154, 0.15)" : "#FFFFFF",
                          border: "1px solid #AE78884D",
                          opacity: 1,
                          width: "100%",
                          height: "73px",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: "#F2EBEDCC" // 🔥 Fondo cuando pasas el mouse
                          }
                        }}>
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                            <Box sx={{ marginTop: "-5px", display: "flex", alignItems: "center" }}>
                              <Checkbox
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedCampaigns(prev =>
                                    isSelected ? prev.filter(i => i !== index) : [...prev, index]
                                  );
                                }}
                                icon={
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "4px",
                                      border: "2px solid #8F4D63",
                                    }}
                                  />
                                }
                                checkedIcon={
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "4px",
                                      backgroundColor: "#8F4D63",
                                      border: "2px solid #8F4D63",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        color: "#FFFFFF",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        lineHeight: "1",
                                        fontFamily: "Poppins, sans-serif",
                                      }}
                                    >
                                      ✓
                                    </Box>
                                  </Box>
                                }
                                sx={{
                                  color: "#8F4D63",
                                  "&.Mui-checked": { color: "#8F4D63" },
                                  alignSelf: "flex-start",
                                }}
                              />

                              <img src={smsico} alt="SMS"
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  marginRight: "8px",
                                  color: isSelected ? "#8E5065" : "#574B4F",
                                }} />
                              <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500",
                                fontFamily: "Poppins",
                                color: isSelected ? "#8E5065" : "#574B4F", // 👈 Cambia de color cuando está seleccionado
                                marginBottom: "6px"
                              }}
                              >
                                {campaign.name}
                              </Typography>
                            </Box>
                            <MoreVertIcon
                              sx={{
                                position: "absolute", // 3 puntillos fijos
                                top: "30px",          // distancia desde el top de su contenedor padre #6C3A52
                                right: "30px",
                                height: "24px",
                                width: "24px"
                              }}
                            />
                            <IconButton
                              onClick={() => {
                                setPinnedCampaigns(prev =>
                                  prev.includes(index)
                                    ? prev.filter(i => i !== index)
                                    : [...prev, index]
                                );
                                setSelectedCampaign(campaign);
                              }}
                              sx={{ padding: 0 }}
                            >
                              <PushPinIcon
                                sx={{
                                  color: pinnedCampaigns.includes(index) ? "#8E5065" : "#574B4F",
                                  fontSize: "20px",
                                  transform: pinnedCampaigns.includes(index) ? "rotate(45deg)" : "none",
                                  transition: "transform 0.3s ease, color 0.3s ease"
                                }}
                              />
                            </IconButton>
                          </Box>
                          <Box sx={{ width: "65%", backgroundColor: "#E0E0E0", borderRadius: "6px", height: "10px", position: "relative", marginBottom: "10px", marginX: "auto" }}>
                            <Box sx={{
                              width: `${progreso}%`, backgroundColor: "#AE7888", borderRadius: "3px",
                              height: "8px",
                              position: "absolute",
                              marginTop: "-9px",
                            }} />
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: "0px", paddingLeft: "45px" }}>
                            <Typography sx={{ fontSize: "12px", fontWeight: "600", color: "#574B4FCC", marginLeft: "7px", marginTop: "-7px", color: isSelected ? "#8E5065" : "#574B4F" }}>{Math.round(progreso)}%</Typography>
                            <Typography sx={{ fontSize: "12px", color: "#574B4FCC", marginTop: "-7px", marginLeft: "7px", color: isSelected ? "#8E5065" : "#574B4F", fontFamily: "Poppins" }}>{campaign.numeroActual}/{campaign.numeroInicial}</Typography>
                          </Box>
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Paper>
            )}
            <IconButton
              onClick={() => setPanelAbierto(!panelAbierto)}
              sx={{
                height: "581px",
                width: "30px",
                borderRadius: "0 8px 8px 0", // redondeado derecho
                borderLeft: "1px solid #D6D6D6", // 👉 esta es la línea gris
                backgroundColor: "#FFFFFF",
                '&:hover': { backgroundColor: "#FFFFFF" },
                paddingX: "10px"
              }}
            >
              <Typography sx={{
                fontSize: "20px",
                transform: panelAbierto ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s"
              }}
              >
                ❮
              </Typography>
            </IconButton>
          </Box>
        </Grid>


        {/* Visualización de campaña */}
        <Grid item xs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: "8px" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "left",
                fontFamily: "Poppins",
                letterSpacing: "0px",
                color: "#330F1B",
                opacity: 1,
                fontSize: "18px",
              }}
            >
              Visualización
            </Typography>

            <Tooltip title="Añadir información" arrow placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo negro con transparencia
                    color: "#CCC3C3",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "12px",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" // Sombra opcional
                  }
                },
                arrow: {
                  sx: {
                    color: "rgba(0, 0, 0, 0.8)" // Flecha negra con transparencia
                  }
                }
              }}
            >
              <IconButton
                style={{
                  backgroundColor: "#FFFFFF",
                  left: "84%",
                  border: '1px solid #CCCFD2',
                  borderRadius: '8px',
                  color: '#8F4D63',
                  background: '#FFFFFF',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#F2E9EC';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.border = '1px solid #CCCFD2';
                }}
                onClick={() => setOpenInfoModal(true)} // 👈 Aquí
              >
                <img src={welcome} alt="Welcome" style={{ width: '24px', height: '24px' }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", maxWidth: "100%", height: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img alt="IconSMS" src={IconSMS}
                  style={{ width: 35, height: 20, marginRight: "10px" }} // 👈 Ajusta el espacio aquí
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#574B4F",
                    opacity: 1,
                    fontSize: "18px",
                  }}
                >
                  {selectedCampaign?.name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MoreVertIcon sx={{ color: "#574B4F", fontSize: "20px", cursor: "pointer" }} />
                <PushPinIcon sx={{ color: "#6C3A52", fontSize: "20px", cursor: "pointer" }} />
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #D6CED2",
                borderRadius: "10px",
                opacity: 1,
                width: "100%", height: "auto",
                padding: "12px",
                marginTop: "10px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                <Typography sx={{ fontFamily: "Poppins", }}>Progreso: <span style={{ color: "#8F4D63" }}>Completada 100%</span></Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <AccessTimeIcon sx={{ fontSize: "16px" }} />
                  <Typography sx={{ fontFamily: "Poppins", opacity: 0.7, fontSize: "14px" }}>02:10 min</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <AutorenewIcon sx={{ fontSize: "16px" }} />
                  <Typography>1</Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={100} sx={{ marginTop: "8px", height: "12px", borderRadius: "6px", backgroundColor: "#E0E0E0", '& .MuiLinearProgress-bar': { backgroundColor: "#AE7888" } }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center" }}>
                  Registros <br />procesados:<br />
                  <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                    30
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center" }}>
                  Registros <br />respondidos:<br />
                  <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                    4
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center" }}>
                  Registros <br />fuera de horario:<br />
                  <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                    6
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center" }}>
                  Registros <br />bloqueados:<br />
                  <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F", }}>
                    6
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center" }}>
                  Total de <br />registros:<br />
                  <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                  {selectedCampaign?.numeroInicial ?? "0"}
                  </Box>
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "right", marginTop: "8px" }}>
              <MainButton
                text={isRunning ? 'Detener' : 'Iniciar'}
                onClick={() => setIsRunning(prev => !prev)}
              />
            </Box>


          </Paper>

          {/* Paper Horarios */}
          {infoChecks["Horarios"] && (
            <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", maxWidth: "100%", height: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                  Horarios
                </Typography>
                <Tooltip title="Cerrar" arrow placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#000000",
                        color: "#CCC3C3",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#000000"
                      }
                    }
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                        }
                      }
                    ]
                  }}
                >
                  <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, Horarios: false }))}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", gap: "16px", paddingLeft: "10px", paddingTop: "4px" }}>
                {[
                  { label: "Vencido", color: "#B0B0B0" },
                  { label: "Vigente", color: "#5CB85C" },
                  { label: "Próximo", color: "#E38C28" }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: item.color
                      }}
                    />
                    <Typography sx={{ fontSize: "14px", fontFamily: "Poppins", color: "#574B4F" }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto", backgroundColor: "#D6D6D64D" }}>
                <List sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {[
                    { texto: "25 MAR–26 MAR, 09:30–22:00", estado: "vencido" },
                    { texto: "26 JUL, 09:00–21:00", estado: "vigente" },
                    { texto: "27 MAR, 09:30–22:00", estado: "proximo" },
                    { texto: "28 MAR, 09:30–22:00", estado: "proximo", alineadoDerecha: true }
                  ].map((horario, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: horario.alineadoDerecha ? "flex-end" : "flex-start",
                        width: horario.alineadoDerecha ? "100%" : "auto",
                        paddingY: "2px",
                        paddingX: "8px"
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "22px",
                          color:
                            horario.estado === "vencido"
                              ? "#B4ACAC"
                              : horario.estado === "vigente"
                                ? "#5CB85C"
                                : "#E38C28"
                        }}
                      >
                        {horario.texto}
                      </Typography>
                    </Box>
                  ))}
                </List>
              </Box>
            </Paper>
          )}

          {/*Paper Mensaje*/}
          {infoChecks["Prueba de envío de mensaje"] && (
            <Paper
              sx={{
                padding: "10px",
                marginTop: "10px",
                borderRadius: "10px",
                width: "100%",
                height: "auto"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                  Mensaje
                </Typography>
                <Tooltip title="Cerrar" arrow placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#000000",
                        color: "#CCC3C3",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#000000"
                      }
                    }
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                        }
                      }
                    ]
                  }}
                >
                  <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Prueba de envío de mensaje": false }))}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                sx={{
                  padding: "10px",
                  borderRadius: "10px",
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#D6D6D64D",
                  opacity: 0.6
                }}
              >
                <Typography sx={{ textAlign: "left", fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
                  A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.
                </Typography>
              </Box>

              <Divider sx={{ marginY: "15px" }} />

              <Paper
                sx={{
                  padding: "10px",
                  marginTop: "15px",
                  borderRadius: "10px",
                  width: "100%",
                  height: "auto",
                  boxShadow: "none"
                }}
              >
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px" }}>
                  Prueba de envío
                </Typography>
                <Box
                  sx={{
                    padding: "16px",
                    marginTop: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          color: "#574B4F",
                          marginBottom: "6px"
                        }}
                      >
                        Teléfono
                      </Typography>
                      <TextField
                        fullWidth
                        value={phone}
                        onChange={(e) => {
                          const onlyNumbers = e.target.value.replace(/\D/g, "");
                          setPhone(onlyNumbers);
                          setError(!validatePhone(onlyNumbers));
                        }}
                        error={error}
                        helperText={error ? "Número inválido" : ""}
                        placeholder="5255"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 12
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip
                                placement="bottom-start"
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      backgroundColor: "#FFFFFF",
                                      color: "#574B4F",
                                      fontFamily: "Poppins, sans-serif",
                                      fontSize: "13px",
                                      padding: "8px 12px",
                                      borderRadius: "10px",
                                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                      maxWidth: 220,
                                      border: "1px solid #9B9295" // 🔥 borde nuevo
                                    }
                                  },
                                  arrow: {
                                    sx: {
                                      color: "#FFFFFF", opacity: 0.0
                                    }
                                  }
                                }}
                                PopperProps={{
                                  modifiers: [
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [-200, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                      }
                                    }
                                  ]
                                }}
                                title={
                                  <Box>
                                    <Typography component="div" sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
                                      Solo caracteres numéricos
                                    </Typography>
                                    <Typography component="div" sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
                                      El teléfono debe incluir el número del país
                                    </Typography>
                                  </Box>
                                }
                              >
                                <img
                                  src={error ? infoiconerror : infoicon}
                                  alt="Info"
                                  style={{ width: "24px", height: "24px", cursor: "pointer" }}
                                />
                              </Tooltip>
                            </InputAdornment>

                          )
                        }}
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "4px",
                          "& .MuiInputBase-input": {
                            fontFamily: "Poppins, sans-serif"
                          },
                          "& .MuiFormHelperText-root": {
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: "#FFFFFF",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            margin: 0
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ marginTop: "38px" }}>
                      <MainButton
                        text="Enviar"
                        onClick={() => console.log("Enviar")}
                        disabled={error}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Paper>
          )}

          {/*Paper Gestión de registros*/}
          {infoChecks["Registros"] && (
            <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                  Gestión de registros
                </Typography>
                <Tooltip title="Cerrar" arrow placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#000000",
                        color: "#CCC3C3",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#000000"
                      }
                    }
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                        }
                      }
                    ]
                  }}
                >
                  <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, Registros: false }))}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", padding: "10px 8px", opacity: 0.8 }}>Tipo</TableCell>
                      <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Total</TableCell>
                      <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Porcentaje</TableCell>
                      <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registros.map((registro, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: "13px", fontFamily: "Poppins, sans-serif", padding: "6px 8px", opacity: 0.5, }}>{registro.tipo}</TableCell>
                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.6 }}>{registro.total}</TableCell>
                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.7 }}>{registro.porcentaje}</TableCell>
                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.6 }}>

                          {/*Boton Icontrash */}
                          <Tooltip title="Eliminar" arrow placement="top"
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
                                    offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                  }
                                }
                              ]
                            }}
                          >
                            <IconButton>
                              <Box
                                component="img"
                                src={IconTrash}
                                alt="Eliminar"
                                sx={{ width: "25px", height: "25px", cursor: "pointer", opacity: 0.6 }}
                              />
                            </IconButton>
                          </Tooltip>

                          <IconButton>
                            <RestoreIcon sx={{ color: "#9B9295" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/*Paper Resultados de envío*/}
          {infoChecks["Resultados de envío por día"] && (
            <Paper sx={{ padding: "10px", marginTop: "25px", borderRadius: "10px", width: "100%", height: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                  Resultados de envío
                </Typography>
                <Tooltip title="Cerrar" arrow placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#000000",
                        color: "#CCC3C3",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#000000"
                      }
                    }
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                        }
                      }
                    ]
                  }}
                >
                  <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Resultados de envío por día": false }))}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px", border: "2px solid #F2F2F2", borderRadius: "10px", marginBottom: "20px", }}>
                {indicadores.map((indicador, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    <Tooltip
                      placement="bottom-start"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "#FFFFFF",
                            color: "#574B4F",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "13px",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            maxWidth: 220,
                            border: "1px solid #9B9295"
                          }
                        },
                        arrow: {
                          sx: {
                            color: "#FFFFFF", opacity: 0
                          }
                        }
                      }}
                      PopperProps={{
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [-90, -15]
                            }
                          }
                        ]
                      }}
                      title={
                        <Box>
                          {mensajesIndicadores[index].map((mensaje, i) => (
                            <Typography key={i} component="div" sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
                              {mensaje}
                            </Typography>
                          ))}
                        </Box>
                      }
                    >
                      <img src={infoicon} width="24px" height="24px" style={{ cursor: "pointer" }} />
                    </Tooltip>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#9B9295",
                        fontWeight: "500",
                        fontFamily: "Poppins, sans-serif",
                        whiteSpace: "pre-line",
                        lineHeight: "16px"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: indicador.label.replace("Tasa de ", "Tasa de<br/>")
                      }}
                    />
                    <Typography sx={{ fontSize: "22px", color: indicador.color, fontWeight: "500", fontFamily: "Poppins" }}>
                      {indicador.value}
                    </Typography>
                  </Box>

                ))}
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />

                  <Bar dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}

          {/*Paper Mapa */}
          {infoChecks["Mapa de concentración de mensajes"] && (
            <Paper sx={{ padding: "10px", marginTop: "30px", borderRadius: "10px", width: "100%", height: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                  Mapa de concentración de mensajes
                </Typography>
                <Tooltip title="Cerrar" arrow placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#000000",
                        color: "#CCC3C3",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#000000"
                      }
                    }
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                        }
                      }
                    ]
                  }}
                >
                  <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Mapa de concentración de mensajes": false }))}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1200 }} style={{ width: "100%", height: "auto" }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: GeographyProps[] }) =>
                    geographies.map((geo: GeographyProps) => {
                      const cur = dataCountry.find(s => s.id === geo.id);
                      return (
                        <Geography
                          key={`geo-${geo.id}`}
                          geography={geo}
                          fill={cur ? colorScale(cur.value) : "#ECECEC"}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#7B354D", outline: "none" },
                            pressed: { fill: "#7B354D", outline: "none" }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </Paper>
          )}
        </Grid>
      </Grid>
      <MainModal
        isOpen={openModal}
        Title="Eliminar campañas"
        message="Esta seguro de quedesea eliminar las campañas seleccionadas? Esta acción no podrá revertirse."
        primaryButtonText="Eliminar"
        secondaryButtonText="Cancelar"
        onPrimaryClick={() => {
          setOpenModal(false);
          // Aquí puedes meter la lógica de eliminación
          console.log("Campañas eliminadas");
        }}
        onSecondaryClick={() => setOpenModal(false)}
      />

      <Dialog
        open={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        PaperProps={{
          sx: {
            width: "585px",
            height: "435px",
            padding: "24px",
            borderRadius: "12px",
            boxSizing: "border-box",
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "20px",
            color: "#574B4F",
            paddingBottom: 0,
            textTransform: "none",
            pl: "5px",
            marginTop: "-20px",
          }}
        >
          Información visible en la sección campañas
        </DialogTitle>
        {/* Línea divisoria */}
        <Divider
          sx={{
            position: "absolute",
            marginY: "47px",
            left: "0px",
            backgroundColor: "#9F94A5",
            height: "1px",
            width: "100%",
            opacity: 0.3
          }}
        />

        <DialogContent sx={{ paddingTop: "10px" }}>
          <List sx={{ pl: "-20px" }}>
            <ListItem disablePadding sx={{ opacity: 0.5, marginBottom: "4px", marginTop: "15px" }}>
              <Checkbox
                checked
                icon={
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: "2px solid #8F4D63",
                    }}
                  />
                }
                checkedIcon={
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      backgroundColor: "#8F4D63",
                      border: "2px solid #8F4D63",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: "bold",
                        lineHeight: "1",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      ✓
                    </Box>
                  </Box>
                }
                sx={{
                  color: "#8F4D63",
                  "&.Mui-checked": { color: "#8F4D63" },
                  alignSelf: "flex-start",
                }} disabled />
              <ListItemText
                primary="Progreso de la campaña seleccionada"
                primaryTypographyProps={{
                  sx: { fontFamily: "Poppins", color: "#D3CED0", fontSize: "16px" }
                }}
              />
            </ListItem>
            {[
              "Horarios",
              "Prueba de envío de mensaje",
              "Registros",
              "Mapa de concentración de mensajes",
              "Resultados de envío por día"
            ].map((text, i) => (
              <ListItem key={i} disablePadding sx={{ marginBottom: "4px" }}>
                <Checkbox
                  checked={infoChecks[text]}
                  onChange={() =>
                    setInfoChecks((prev) => ({ ...prev, [text]: !prev[text] }))
                  }
                  icon={
                    <Box
                      sx={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: "2px solid #8F4D63",
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        backgroundColor: "#8F4D63",
                        border: "2px solid #8F4D63",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "13px",
                          fontWeight: "bold",
                          lineHeight: "1",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        ✓
                      </Box>
                    </Box>
                  }
                  sx={{
                    color: "#8F4D63",
                    "&.Mui-checked": { color: "#8F4D63" },
                    alignSelf: "flex-start",
                  }}
                />
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "Poppins",
                      color: "#8F4D63",
                      fontWeight: 500,
                      fontSize: "16px",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        {/* Línea divisoria */}
        <Divider
          sx={{
            position: "absolute",
            marginY: "332px",
            left: "0px",
            backgroundColor: "#9F94A5",
            height: "1px",
            width: "100%",
            opacity: 0.3
          }}
        />


        <DialogActions sx={{
          justifyContent: "space-between", paddingX: "24px", paddingBottom: "8px",
          marginLeft: "-20px",
          marginRight: "-20px",
          marginBottom: "-15px",
        }}>


          <Button
            variant="outlined"
            onClick={() => setOpenInfoModal(false)}
            sx={{
              border: "1px solid #CCCFD2",
              borderRadius: "4px",
              color: "#833A53",
              backgroundColor: "transparent",
              fontVariant: "normal",
              letterSpacing: "1.12px",
              fontWeight: "500",
              fontSize: "14px",
              fontFamily: "Poppins",
              opacity: 1,
              "&:hover": {
                backgroundColor: "#f3e6eb",
                fontSize: "14px",
                fontFamily: "Poppins",
                color: "#833A53",
                letterSpacing: "1.12px",
                opacity: 1,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenInfoModal(false)}
            sx={{
              background: "#833A53 0% 0% no-repeat padding-box",
              border: "1px solid #D4D1D1",
              borderRadius: "4px",
              opacity: 1,
              fontVariant: "normal",
              fontWeight: "500",
              fontSize: "14px",
              fontFamily: "Poppins",
              letterSpacing: "1.12px",
              color: "#FFFFFF", // Letra blanca
            }}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/*Modal Creación*/}

      <Dialog
        open={openCreateCampaignModal}
        onClose={() => setOpenCreateCampaignModal(false)}
        maxWidth={false} // Le quitamos el límite de ancho
        fullWidth // Forzamos que se respete el ancho del Paper
        PaperProps={{
          sx: {
            width: "810px",
            height: "668px",
            borderRadius: "12px",
            padding: "32px",
            boxSizing: "border-box",
          }
        }}
      >
        <Box
          sx={{
            height: "120px"
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "20px",
              color: "#574B4F",
              paddingBottom: "0px",
              pl: "9px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "none",
              marginTop: "-25px",
              marginLeft: "-20px"
            }}
          >
            Crear campaña SMS
            <IconButton onClick={() => setOpenCreateCampaignModal(false)}>
              <CloseIcon sx={{
                fontSize: "22px", color: "#574B4F",
                marginLeft: "65px",
                marginTop: "-20px",
                position: "absolute"
              }} />
            </IconButton>
          </DialogTitle>

          {/* Línea divisoria */}
          <Divider
            sx={{
              position: "absolute",
              marginY: "15px",
              left: "0px",
              backgroundColor: "#9F94A5",
              height: "1px",
              width: "100%",
              opacity: 0.3
            }}
          />

          <Divider sx={{ marginTop: "10px", marginBottom: "18px", opacity: 0.3 }} />

          {/*Stepper */}
          <DialogContent sx={{ padding: "0 8px", }}>


            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", width: "100%" }}>
              {["Nombre y horarios", "Registros", "Mensaje", "Configuraciones"].map((label, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                const isLast = index === 3;

                return (
                  <React.Fragment key={label}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: `2px solid ${isActive || isCompleted ? "#8F4D63" : "#D6D6D6"}`,
                          backgroundColor: isActive ? "#8F4D63" : isCompleted ? "#8F4D63" : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isActive && (
                          <Box
                            component="span"
                            sx={{
                              color: "#FFFFFF",
                              fontSize: "14px",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                            }}
                          >
                            ✓
                          </Box>
                        )}
                        {!isActive && isCompleted && (
                          <CheckIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          marginTop: "6px",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: isActive ? "#8F4D63" : "#9B9295",
                          textAlign: "center",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "80px",
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>

                    {!isLast && (
                      <Box
                        sx={{
                          width: "80px",
                          height: "2px",
                          backgroundColor: "#D6D6D6",
                          mx: "20px",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Box>

          </DialogContent>
        </Box>

        {/* Línea divisoria */}
        <Divider
          sx={{
            position: "absolute",
            marginY: "116px",
            left: "0px",
            backgroundColor: "#9F94A5",
            height: "1px",
            width: "100%",
            opacity: 0.3
          }}
        />
        <Box
          sx={{
            overflowY: 'auto', display: "flex", flexDirection: "column", marginTop: "0px", paddingBottom: 10,
          }}
        >
          {activeStep === -1 && (
            <Box sx={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: 4, maxHeight: "399px" }}>

              {/* Box 1: Ingrese un nombre */}

              <Box
                sx={{
                  width: "340px",
                  height: "88px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "18px",
                    color: "#574B4F",
                  }}
                >
                  Ingrese un nombre
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Nombre"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  sx={{
                    width: "340px",
                    height: "54px",
                    fontFamily: "Poppins",
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      height: "54px",
                      boxSizing: "border-box",
                      padding: "0 14px"
                    }
                  }}
                />
              </Box>

              {/* Box 2: Horarios */}
              {/* Renderiza todos los horarios */}
              {horarios.map((horario, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "672px",
                    backgroundColor: "#F2EBEDCC",
                    borderRadius: "8px",
                    padding: "16px",
                    marginTop: "-5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#574B4F",
                      }}
                    >
                      {horario.titulo}
                    </Typography>




                    {/* Botones a la derecha */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* Eliminar */}
                      <Tooltip title="Eliminar" arrow placement="top">
                        <IconButton onClick={() => handleEliminarHorario(index)}>
                          <Box
                            component="img"
                            src={IconTrash}
                            alt="Eliminar"
                            sx={{ width: "24px", height: "24px", cursor: "pointer", opacity: 0.6, position: "absolute", marginTop: "100px", marginRight: "80px" }}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* Agregar solo en el último horario */}
                      {index === horarios.length - 1 && (
                        <Tooltip title="Añadir horario" arrow placement="top"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: "#000000",
                                color: "#CCC3C3",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "12px",
                                padding: "6px 8px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                              }
                            },
                            arrow: {
                              sx: {
                                color: "#000000", marginLeft: "-6px"
                              }
                            }
                          }}
                          PopperProps={{
                            modifiers: [
                              {
                                name: 'offset',
                                options: {
                                  offset: [-6, -6]
                                }
                              }
                            ]
                          }}
                        >
                          <IconButton onClick={handleAgregarHorario}>
                            <Box
                              component="img"
                              src={IconCirclePlus}
                              alt="Agregar Horario"
                              sx={{ width: "24px", height: "24px", cursor: "pointer", position: "absolute", marginTop: "100px", marginRight: "40px" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {/*Horarios textfields */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      key={`start-${index}`}
                      variant="outlined"
                      placeholder="Inicia"
                      value={
                        horario.start
                          ? horario.start.toLocaleString('es-MX', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : ''
                      }
                      sx={{ width: "262px", height: "56px", backgroundColor: "#FFFFFF" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                setCalendarAnchor(e.currentTarget);
                                setCalendarOpen(true);
                                setCalendarTarget("start");
                                setCurrentHorarioIndex(index);
                              }}
                              size="small"
                              sx={{ padding: 0 }}
                            >
                              <CalendarTodayIcon sx={{ width: "15px", height: "15px", color: "#8F4D63" }} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField
                      key={`start-${index}`}
                      variant="outlined"
                      placeholder="Termina"
                      value={
                        horario.end
                          ? horario.end.toLocaleString('es-MX', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : ''
                      }
                      sx={{ width: "262px", height: "56px", backgroundColor: "#FFFFFF" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                setCalendarAnchor(e.currentTarget);
                                setCalendarOpen(true);
                                setCalendarTarget("end");
                                setCurrentHorarioIndex(index);
                              }}
                              size="small"
                              sx={{ padding: 0 }}
                            >
                              <CalendarTodayIcon sx={{ width: "15px", height: "15px", color: "#8F4D63" }} />
                            </IconButton>

                          </InputAdornment>
                        )
                      }}
                    />






                  </Box>

                  {/*Modo de operación*/}
                  {index === 0 && mostrarModoOperacion && (
                    <Box sx={{ width: "100%", height: "62px", marginTop: "10px", backgroundColor: "#FFFFFF" }}>
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "18px", color: "#574B4F", marginBottom: "4px" }}>
                        Modo de operación
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FormControlLabel
                          control={<Radio checked value="reanudar" sx={{
                            color: "#8F4D63",
                            '&.Mui-checked': { color: "#8F4D63" }
                          }} />}
                          label={<Typography sx={{ fontFamily: "Poppins", fontSize: "16px", color: "#8F4D63" }}>Reanudar</Typography>}
                        />
                        <FormControlLabel
                          control={<Radio value="reciclar" sx={{
                            color: "#9B9295",
                            '&.Mui-checked': { color: "#9B9295" }
                          }} />}
                          label={<Typography sx={{ fontFamily: "Poppins", fontSize: "16px", color: "#9B9295" }}>Reciclar</Typography>}
                        />
                      </Box>
                    </Box>
                  )}



                </Box>

              ))}

              {/* Checkbox Iniciar campaña automáticamente */}
              <Box
                sx={{
                  width: "250px",
                  height: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mt: -2, // espacio superior
                  marginBotttom: "10px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Checkbox
                    icon={
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: "2px solid #8F4D63",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          backgroundColor: "#8F4D63",
                          border: "2px solid #8F4D63",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#FFFFFF",
                            fontSize: "13px",
                            fontWeight: "bold",
                            lineHeight: "1",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          ✓
                        </Box>
                      </Box>
                    }
                    sx={{
                      color: "#8F4D63",
                      "&.Mui-checked": { color: "#8F4D63" },
                      alignSelf: "flex-start",
                      padding: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      color: "#574B4F",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Iniciar campaña automáticamente
                  </Typography>
                </Box>
              </Box>


            </Box>
          )}

          {activeStep === 0 && (
            // 🟰 CONTENIDO de "Registros" nuevo (el que quieres mostrar)
            <Box sx={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: 2, maxHeight: "420px", overflowY: "auto" }}>

              <Typography sx={{ fontFamily: 'Poppins', fontSize: '18px', color: '#330F1B', mt: -1 }}>
                Cargue un archivo desde su biblioteca.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 4,
                  width: '100%',
                  marginTop: '16px',
                }}
              >
                {/* Parte izquierda: DropZone y Seleccionar hoja */}
                <Box sx={{ width: "320px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <DropZone onDrop={(file) => {
                    setUploadedFile(file);
                    handleManageFile(file);
                  }} error={fileError} />

                  {uploadedFile && !postCargaActiva && (
                    <FormControl fullWidth sx={{ marginTop: "16px" }}>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', mb: 1 }}>
                        Seleccionar hoja
                      </Typography>
                      <Select
                        value={selectedSheet}
                        onChange={handleSheetChange}
                        displayEmpty
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: "#FFFFFF",
                          fontFamily: "Poppins",
                          fontSize: "14px"
                        }}
                      >
                        {sheetNames.map((name, idx) => (
                          <MenuItem key={idx} value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>

                {!postCargaActiva && uploadedFile && (
                  <Box sx={{ width: 380, border: '1px solid #E0E0E0', borderRadius: '12px', padding: '20px', marginTop: '24px', fontFamily: 'Poppins' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '18px', marginBottom: '12px', color: '#330F1B' }}>Seleccionar datos y orden</Typography>
                    <Tabs
                      value={selectedTab}
                      onChange={(_, newValue) => setSelectedTab(newValue)}
                      indicatorColor="secondary"
                      textColor="inherit"
                      sx={{ borderBottom: '1px solid #D9B4C3', marginBottom: '16px', '.MuiTab-root': { fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', textTransform: 'none', color: '#7B354D', paddingBottom: '6px', minWidth: '100px' } }}
                    >
                      <Tab label="Teléfonos" value="telefonos" />
                      <Tab label="Variables" value="variables" />
                    </Tabs>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="columns-droppable">
                        {(provided) => (
                          <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ maxHeight: '160px', overflowY: 'auto' }}>
                            {currentSelected.map((col, index) => {
                              const isDisabled = selectedTab === 'telefonos' ? selectedVariables.includes(col) : selectedTelefonos.includes(col);
                              const toggleValue = () => {
                                const updater = selectedTab === 'telefonos' ? setSelectedTelefonos : setSelectedVariables;
                                updater(currentSelected.filter(c => c !== col));
                              };
                              return (
                                <Draggable key={col} draggableId={col} index={index}>
                                  {(provided) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #D9B4C3', borderRadius: '8px', padding: '6px 12px', marginBottom: '10px', backgroundColor: '#F2EBED', width: '100%', cursor: 'grab' }}
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Checkbox checked onChange={toggleValue} sx={{ '&.Mui-checked': { color: '#7B354D' } }} />
                                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>{col}</Typography>
                                      </Box>
                                      <DragIndicatorIcon sx={{ fontSize: '18px', color: '#9B9295', cursor: 'grab' }} />
                                    </Box>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}

                            {columnsToRender
                              .filter(col => !currentSelected.includes(col))
                              .map((col) => {
                                const isDisabled = selectedTab === 'telefonos'
                                  ? selectedVariables.includes(col)
                                  : selectedTelefonos.includes(col);

                                const toggleValue = () => {
                                  const updater = selectedTab === 'telefonos' ? setSelectedTelefonos : setSelectedVariables;
                                  updater([...currentSelected, col]);
                                };

                                return (
                                  <Box
                                    key={col}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #D9B4C3', borderRadius: '8px', padding: '6px 12px', marginBottom: '10px', backgroundColor: '#FFF', width: '100%', opacity: isDisabled ? 0.5 : 1 }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Checkbox checked={false} onChange={toggleValue} disabled={isDisabled} sx={{ '&.Mui-checked': { color: '#7B354D' } }} />
                                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>{col}</Typography>
                                    </Box>
                                    <DragIndicatorIcon sx={{ fontSize: '18px', color: '#D9D9D9' }} />
                                  </Box>
                                );
                              })}
                          </Box>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Box>
                )}

                {postCargaActiva && estadisticasCarga && (
                  <Box
                    sx={{
                      border: "1px solid #D9B4C3",
                      borderRadius: "8px",
                      padding: "16px 24px",
                      marginLeft: "32px",
                      width: "280px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: 2, fontFamily: "Poppins" }}>
                      Resumen de carga
                    </Typography>

                    {/* Registros */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: "Poppins", mb: 1 }}>
                      <Typography>Registros</Typography>
                      <Typography>{porcentajeRegistrosCargados}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={porcentajeRegistrosCargados}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "#E2E2E2",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#8F4D63",
                        },
                        mb: 1,
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: "Poppins", mb: 2 }}>
                      <Typography>Cargados: {estadisticasCarga.registrosCargados}</Typography>
                      <Typography>No cargados: {estadisticasCarga.registrosFallidos}</Typography>
                    </Box>

                    {/* Teléfonos */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: "Poppins", mb: 1 }}>
                      <Typography>Teléfonos</Typography>
                      <Typography>{porcentajeTelefonosCargados}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={porcentajeTelefonosCargados}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "#E2E2E2",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#8F4D63",
                        },
                        mb: 1,
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: "Poppins" }}>
                      <Typography>Cargados: {estadisticasCarga.telefonosCargados}</Typography>
                      <Typography>No cargados: {estadisticasCarga.telefonosFallidos}</Typography>
                    </Box>
                  </Box>
                )}

              </Box>

            </Box>
          )}

          {activeStep === 1 && (
            <>
              {!mensajeAceptado ? (
                // 🔴 SELECCIÓN DE TIPO DE MENSAJE
                <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
                  <FormControlLabel
                    value="escrito"
                    control={<Radio checked={tipoMensaje === "escrito"} onChange={() => setTipoMensaje("escrito")} />}
                    label={
                      <Box sx={{ textAlign: "center", p: 2, border: "1px solid", borderColor: tipoMensaje === "escrito" ? "#8F4D63" : "#ccc", borderRadius: "12px", width: 120 }}>
                        <Typography variant="h6" sx={{ color: "#8F4D63", fontWeight: 600 }}>Abc|</Typography>
                        <Typography sx={{ mt: 1, fontFamily: "Poppins", fontWeight: 500 }}>Escrito + variables</Typography>
                      </Box>
                    }
                    labelPlacement="bottom"
                  />
                  <FormControlLabel
                    value="plantilla"
                    control={<Radio checked={tipoMensaje === "plantilla"} onChange={() => setTipoMensaje("plantilla")} />}
                    label={
                      <Box sx={{ textAlign: "center", p: 2, border: "1px solid", borderColor: tipoMensaje === "plantilla" ? "#8F4D63" : "#ccc", borderRadius: "12px", width: 120 }}>
                        <ArrowDropDownIcon sx={{ fontSize: 32, color: "#8F4D63" }} />
                        <Typography sx={{ mt: 1, fontFamily: "Poppins", fontWeight: 500 }}>Plantilla</Typography>
                      </Box>
                    }
                    labelPlacement="bottom"
                  />
                </Box>
              ) : tipoMensaje === "escrito" ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* Componente editor de mensaje */}
                  <DynamicCampaignText
                    variables={variables}
                    value={mensajeTexto}
                    onChange={setMensajeTexto}
                  />

                  {/* Opciones adicionales debajo */}
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked sx={{ color: "#8F4D63" }} />}
                        label="Concatenar mensajes con más de 160 caracteres"
                        sx={{
                          fontFamily: "Poppins",
                          color: "#574B4F",
                          '& .MuiFormControlLabel-label': { fontSize: "14px" },
                        }}
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked sx={{ color: "#8F4D63" }} />}
                        label="Acortar URLs en el mensaje"
                        sx={{
                          fontFamily: "Poppins",
                          color: "#574B4F",
                          '& .MuiFormControlLabel-label': { fontSize: "14px" },
                        }}
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked sx={{ color: "#8F4D63" }} />}
                        label="Guardar como plantilla"
                        sx={{
                          fontFamily: "Poppins",
                          color: "#574B4F",
                          '& .MuiFormControlLabel-label': { fontSize: "14px" },
                        }}
                      />
                    </Box>

                    <Typography sx={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "14px", mt: 2, mb: 1 }}>
                      Nombre
                    </Typography>

                    <TextField
                      fullWidth
                      placeholder="Nombre de la plantilla"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <img src={infoicon} alt="info" style={{ width: 20, height: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        fontFamily: "Poppins",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        '& .MuiOutlinedInput-root': {
                          fontSize: "14px",
                          paddingRight: "8px",
                        },
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                // 🔵 CONTENIDO PLANTILLA
                <TemplateViewer
                  templates={templates}
                  value={mensajeTexto}
                  onChange={setMensajeTexto}
                  onSelectTemplateId={(id) => {
                    const tpl = templates.find(t => t.id === id);
                    setSelectedTemplate(tpl);
                  }}
                />


              )}
            </>
          )}

          {activeStep === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', mb: 2 }}>
                Configuraciones avanzadas
              </Typography>
              <RadioGroup
                row
                value={tipoNumero}
                onChange={(e) => setTipoNumero(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="corto"
                  control={<Radio sx={{ color: '#330F1B', '&.Mui-checked': { color: '#330F1B' } }} />}
                  label="Número corto"
                  sx={{ mr: 4 }}
                />
                <FormControlLabel
                  value="largo"
                  control={<Radio sx={{ color: '#330F1B', '&.Mui-checked': { color: '#330F1B' } }} />}
                  label="Número largo"
                />
              </RadioGroup>


              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #D6CED2',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  opacity: tipoNumero === 'largo' ? 0.5 : 1,
                  backgroundColor: flashEnabled ? '#FFFFFF' : '#F8F8F8',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#330F1B',
                  }}
                >
                  Mensaje flash
                </Typography>

                <Switch
                  checked={flashEnabled}
                  disabled={tipoNumero === 'largo'}
                  onChange={(e) => setFlashEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#8F4D63',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#8F4D63',
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #D6CED2',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  backgroundColor: aniEnabled ? '#FFFFFF' : '#F8F8F8',
                  opacity: tipoNumero === 'corto' ? 0.5 : 1,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#330F1B',
                  }}
                >
                  Personalizar ANI
                </Typography>

                <Switch
                  checked={aniEnabled}
                  disabled={tipoNumero === 'corto'}
                  onChange={(e) => setAniEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#8F4D63',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#8F4D63',
                    },
                  }}
                />
                {aniEnabled && (
                  <Select
                    fullWidth
                    value={selectedAni}
                    onChange={(e) => setSelectedAni(e.target.value)}
                    displayEmpty
                    sx={{
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                      borderRadius: '6px',
                      height: '40px',
                      border: '1px solid #D6CED2',
                    }}
                  >
                    <MenuItem disabled value="">
                      Seleccionar
                    </MenuItem>
                    {aniOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}

              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #D6CED2',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  backgroundColor: recycleEnabled ? '#FFFFFF' : '#F8F8F8',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#330F1B',
                  }}
                >
                  Reciclar registros automaticamente
                </Typography>

                <Switch
                  checked={recycleEnabled}
                  onChange={(e) => setRecycleEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#8F4D63',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#8F4D63',
                    },
                  }}
                />

                {recycleEnabled && (
                  <Box sx={{ display: 'flex', gap: 4, mt: 2, alignItems: 'center' }}>
                    {/* Tipo de registros */}
                    <Box>
                      <Typography sx={{ fontSize: '14px', fontFamily: 'Poppins', mb: 1 }}>
                        Tipo de registros
                      </Typography>
                      <RadioGroup
                        value={recycleType}
                        onChange={(e) => setRecycleType(e.target.value)}
                      >
                        <FormControlLabel
                          value="todos"
                          control={<Radio />}
                          label="Todos"
                        />
                        <FormControlLabel
                          value="rechazados"
                          control={<Radio />}
                          label="Rechazados"
                        />
                      </RadioGroup>
                    </Box>

                    {/* Incluir no contactados */}
                    <Box>
                      <Typography sx={{ fontSize: '14px', fontFamily: 'Poppins', mb: 1 }}>
                        Incluir registros no contactados
                      </Typography>
                      <Checkbox
                        checked={includeUncontacted}
                        onChange={(e) => setIncludeUncontacted(e.target.checked)}
                      />
                    </Box>

                    {/* Número de reciclajes */}
                    <Box>
                      <Typography sx={{ fontSize: '14px', fontFamily: 'Poppins', mb: 1 }}>
                        Número de reciclajes
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => setRecycleCount((prev) => Math.max(1, prev - 1))}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={recycleCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) setRecycleCount(val);
                          }}
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          sx={{ width: 60, textAlign: 'center', mx: 1 }}
                        />
                        <IconButton
                          onClick={() => setRecycleCount((prev) => prev + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )}

              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #D6CED2',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  backgroundColor: blacklistEnabled ? '#FFFFFF' : '#F8F8F8',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#330F1B',
                  }}
                >
                  Listas Negras
                </Typography>

                <Switch
                  checked={blacklistEnabled}
                  onChange={(e) => setBlacklistEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#8F4D63',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#8F4D63',
                    },
                  }}
                />

                {blacklistEnabled && (
                  <Box mt={2}>
                    {/* Buscador visual */}
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        border: searchTermBlacklist ? "1px solid #7B354D" : "1px solid #9B9295",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        width: "100%",
                        maxWidth: "360px",
                        height: "40px",
                        mb: 2,
                      }}
                    >
                      <img
                        src={seachicon}
                        alt="Buscar"
                        style={{
                          marginRight: "8px",
                          width: "18px",
                          height: "18px",
                          filter: searchTermBlacklist ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)" : "none",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Buscar listas negras"
                        value={searchTermBlacklist}
                        onChange={(e) => setSearchTermBlacklist(e.target.value)}
                        style={{
                          border: "none",
                          outline: "none",
                          width: "100%",
                          fontSize: "16px",
                          fontFamily: "Poppins, sans-serif",
                          color: searchTermBlacklist ? "#7B354D" : "#9B9295",
                          backgroundColor: "transparent",
                        }}
                      />
                      {searchTermBlacklist && (
                        <img
                          src={iconclose}
                          alt="Limpiar búsqueda"
                          style={{
                            marginLeft: "8px",
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => setSearchTermBlacklist('')}
                        />
                      )}
                    </Box>

                    {/* Lista filtrada */}
                    <Box sx={{ maxHeight: "160px", overflowY: "auto", border: "1px solid #D6CED2", borderRadius: "8px" }}>
                      <table style={{ width: "100%", fontFamily: 'Poppins', fontSize: "14px" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Nombre</th>
                            <th style={{ textAlign: 'left' }}>Creación</th>
                            <th style={{ textAlign: 'left' }}>Expiración</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBlackLists.map((list) => (
                            <tr key={list.id}>
                              <td style={{ padding: '8px' }}>
                                <Checkbox
                                  checked={selectedBlackListIds.includes(list.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedBlackListIds(prev => [...prev, list.id]);
                                    } else {
                                      setSelectedBlackListIds(prev => prev.filter(id => id !== list.id));
                                    }
                                  }}
                                  sx={{
                                    color: '#8F4D63',
                                    '&.Mui-checked': { color: '#8F4D63' },
                                  }}
                                />
                                {list.name}
                              </td>
                              <td>{list.creationDate || 'NA'}</td>
                              <td>{list.expirationDate || 'NA'}</td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}


              </Box>

            </Box>
          )}


        </Box>


        {/*Botones Cancelar / Atras / Siguiente */}
        <DialogActions
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            padding: "24px",
            justifyContent: "space-between",
            borderTop: "1px solid #E0E0E0",
            backgroundColor: "#FFF",
          }}
        >
          {/* Botón Cancelar a la izquierda */}
          <Button
            variant="outlined"
            onClick={() => setOpenCreateCampaignModal(false)}
            sx={{
              width: "118px",
              height: "36px",
              border: "1px solid #CCCFD2",
              borderRadius: "4px",
              color: "#833A53",
              backgroundColor: "transparent",
              fontFamily: "Poppins",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1.12px",
              "&:hover": {
                backgroundColor: "#f3e6eb",
                color: "#833A53",
              },
            }}
          >
            Cancelar
          </Button>

          {/* Botones Atrás y Siguiente a la derecha */}
          <Box sx={{ display: "flex", gap: "20px" }}>
            {activeStep > -1 && (
              <Button
                onClick={() => setActiveStep((prev) => prev - 1)}
                sx={{
                  width: "118px",
                  height: "36px",
                  border: "1px solid #CCCFD2",
                  borderRadius: "4px",
                  color: "#833A53",
                  backgroundColor: "transparent",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "14px",
                  letterSpacing: "1.12px",
                  "&:hover": {
                    backgroundColor: "#f3e6eb",
                  },
                }}
              >
                Atrás
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                width: "118px",
                height: "36px",
                background: "#833A53",
                border: "1px solid #D4D1D1",
                borderRadius: "4px",
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1.12px",
              }}
            >
              {activeStep === 2 || (activeStep === 0 && !postCargaActiva) ? "Cargar" : "Siguiente"}

            </Button>
          </Box>
        </DialogActions>


      </Dialog>


      {calendarOpen && calendarAnchor && (
        <CustomDateTimePicker
          open={calendarOpen}
          anchorEl={calendarAnchor}
          onApply={(date, hour, minute) => {
            if (calendarTarget === null || currentHorarioIndex === null) return;

            const newDate = new Date(date);
            newDate.setHours(hour);
            newDate.setMinutes(minute);

            setHorarios(prev =>
              prev.map((h, i) =>
                i === currentHorarioIndex
                  ? { ...h, [calendarTarget]: newDate }
                  : h
              )
            );

            setCalendarOpen(false);
            setCalendarTarget(null);
            setCurrentHorarioIndex(null);
          }}
          onClose={() => {
            setCalendarOpen(false);
            setCalendarTarget(null);
            setCurrentHorarioIndex(null);
          }}
          placement="top-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [-50, -60],
              },
            },
          ]}
        />

      )}


      <ModalError
        isOpen={isErrorModalOpen}
        title={TitleErrorModal}
        message={MessageErrorModal}
        buttonText="Cerrar"
        onClose={() => setIsErrorModalOpen(false)}
      />


    </Box>
  );
};

export default Campains;
