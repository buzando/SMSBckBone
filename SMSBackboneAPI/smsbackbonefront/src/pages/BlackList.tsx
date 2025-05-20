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
import UpCloudIcon from '../assets/UpCloudIcon.svg'
import IconPlusCircle from '../assets/IconPlusCircle.svg'
import IconPlusUnselected from '../assets/IconPlusUnselected.svg'
import IconMinusSelected from '../assets/IconMinusSelected.svg'
import IconUpdateSelected from '../assets/IconUpdateSelected.svg'
import IconEyeOpen from '../assets/IconEyeOpen.svg'


import IconNegativeCircle from '../assets/IconNegativeCircle.svg'
import IconReUpdate1 from '../assets/IconReUpdate1.svg'

import IconCloudError from '../assets/IconCloudError.svg'
import CloudCheckedIcon from '../assets/CloudCheckedIcon.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'
import { Divider, InputAdornment, Tooltip, TooltipProps, Typography, Paper, ToggleButton, ToggleButtonGroup, Switch, FormControl, FormControlLabel, List, ListItemText, ListItemButton, ListItem, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import trash from '../assets/Icon-trash-Card.svg'
import Radio from '@mui/material/Radio';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import seachicon from '../assets/icon-lupa.svg'
import iconclose from "../assets/icon-close.svg"
import BoxEmpty from '../assets/Nousers.svg';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDateTimePicker from '../components/commons/DatePickerOneDate';
import AddIcon from '../assets/Icon-plus.svg'
import Thrashicon from '../assets/Icon-trash-Card.svg'
import backarrowD from '../assets/MoveTabledesactivated.svg'
import backarrow from '../assets/MoveTable.svg'
import Snackbar from '../components/commons/ChipBar'
import Menu from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import Emptybox from '../assets/NoResultados.svg';
import IconPlus2 from '../assets/IconPlus2.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import * as XLSX from 'xlsx';
import DropZone from '../components/commons/DropZone';
import { SelectChangeEvent } from '@mui/material';

interface BlackList {
    id: number;
    creationDate: string;
    name: string;
    expirationDate: string;
    quantity: number;
    hasActiveCampaign: boolean;
}

interface FormData {
    Name: string;
    Phones: string[];
    ExpirationDate: Date | null;
    File: string;
}

interface ManageRecordsPayload {
    operation: 'agregar' | 'eliminar' | 'actualizar';
    name: string;
    idRoom: number;

    // solo para modo por Excel
    sheetName?: string;
    columnPhone?: string;
    columnData?: string;
    omitHeaders?: boolean;
    filterType?: string;
    fileBase64?: string;
    eliminationname?: string;
    // solo para modo por teléfonos manuales
    phones?: string[];
}


interface BlackListPhones {
    phone: string;
    dato: string;
}

interface CampainsBlackListResponse {
    chanel: string;
    campainName: string;
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
    const [originalName, setOriginalName] = useState('');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [rowToDelete, setRowToDelete] = useState<BlackList | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredBlackList = BlackList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalItems = filteredBlackList.length;

    const itemsPerPage = 50;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = filteredBlackList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);



    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRowId, setMenuRowId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<BlackList | null>(null);

    const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
    const [inspectTab, setInspectTab] = useState<'registros' | 'campañas'>('registros');
    const [inspectData, setInspectData] = useState<BlackListPhones[]>([]);
    const [inspectSearch, setInspectSearch] = useState('');
    const [inspectPage, setInspectPage] = useState(1);

    const [campaignData, setCampaignData] = useState<CampainsBlackListResponse[]>([]);
    const [campaignSearch, setCampaignSearch] = useState('');
    const [campaignPage, setCampaignPage] = useState(1);

    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [manageOperation, setManageOperation] = useState<'agregar' | 'eliminar' | 'actualizar'>('agregar');
    const [manageByList, setManageByList] = useState(false);
    const [manageByIndividual, setManageByIndividual] = useState(false);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputManageRef = useRef<HTMLInputElement>(null);

    const [sheetNames, setSheetNames] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedTelefonoCol, setSelectedTelefonoCol] = useState('');
    const [selectedDatoCol, setSelectedDatoCol] = useState('');
    const [excelData, setExcelData] = useState<any[][]>([]);
    const [processedRows, setProcessedRows] = useState<any[]>([]);
    const [base64File, setBase64File] = useState('');
    const [workbook, setWorkbook] = useState<any>(null);
    const [omitHeaders, setOmitHeaders] = useState(false);
    const [telefonoFilter, setTelefonoFilter] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedPhoneColumn, setSelectedPhoneColumn] = useState('');
    const [selectedDataColumn, setSelectedDataColumn] = useState('');
    const [selectedPhoneFilter, setSelectedPhoneFilter] = useState('');
    const [uploadedFileBase64, setUploadedFileBase64] = useState('');
    const [individualPhones, setIndividualPhones] = useState<string[]>([]);
    const [selectedBlackListName, setSelectedBlackListName] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<BlackList[]>([]);

    const [allRows, setAllRows] = useState<BlackList[]>([]);
    useEffect(() => {
        setAllRows(currentItems);
    }, [currentItems]);

    const WhiteTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .MuiTooltip-tooltip`]: {
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "8px 12px",
            fontSize: "14px",
            fontFamily: "Poppins",
            color: "#000000",
            whiteSpace: "pre-line",
            transform: "translate(-5px, -5px)",
            borderColor: "#00131F3D",
            borderStyle: "solid",
            borderWidth: "1px"
        },
    }));

    const openEditModal = (item: BlackList) => {
        setEditData(item);
        setFormData({
            Name: item.name,
            ExpirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
            Phones: [''],
            File: ''
        });
        setOriginalName(item.name);
        setIsEditModalOpen(true);
    };

    const handleUpdateBlackList = async () => {
        if (!editData) return;

        setLoading(true);
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;


        if (!salaId) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_UPDATE_BLACKLIST}`;
            const payload = {
                oldname: originalName,
                newname: formData.Name,
                expiration: formData.ExpirationDate,
                idRoom: salaId,
            };

            const response = await axios.post(requestUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setMessageChipBar('Lista negra actualizada correctamente');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchBlackListsByUser();
                setIsEditModalOpen(false);
            }
        } catch (error) {
            setIsErrorModalOpen(true);
            setTitleErrorModal('Error al actualizar la lista negra');
            setMessageErrorModal('No se pudo actualizar. Intente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (base64File) {
            setFormData(prev => ({ ...prev, File: base64File }));
        }
    }, [base64File]);

    useEffect(() => {
        if (uploadedFileBase64) {
            console.log("✅ uploadedFileBase64 cargado:", uploadedFileBase64.substring(0, 50));
        }
    }, [uploadedFileBase64]);

    useEffect(() => {
        if (manageByIndividual && individualPhones.length === 0) {
            setIndividualPhones(['']);
        }
    }, [manageByIndividual]);


    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRowId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRowId(null);
    };



    const fetchBlackListsByUser = async () => {
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

        if (!salaId) {
            console.error("No se encontró el ID de la sala.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_GET_BLACKLIST}${salaId}`;
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

    //Const para limpiar formulario
    const handleResetAndCloseModal = () => {
        // Limpiar formulario
        setFormData({
            Name: '',
            Phones: [''],
            ExpirationDate: null,
            File: '',
        });

        // Limpiar archivo
        setFileSuccess(false);
        setFileError(false);
        setUploadedFile(null);
        setBase64File('');
        setUploadedFileBase64('');

        // Limpiar file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Cerrar modal
        setIsblacklistModalOpen(false);
    };


    const handleSendToServer = async () => {
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;

        const payload: ManageRecordsPayload = {
            operation: manageOperation,                         // 'agregar' | 'eliminar' | 'actualizar'
            name: selectedBlackList?.name || '',
            idRoom: salaId,
            sheetName: selectedSheet,
            columnPhone: selectedTelefonoCol,
            columnData: selectedDatoCol,
            omitHeaders: omitHeaders,
            filterType: selectedPhoneFilter,
            fileBase64: uploadedFileBase64,
            phones: individualPhones,
            eliminationname: selectedBlackListName || '',
        };


        try {
            setLoading(true);
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_UPDATERECORDS_BLACKLIST}`;
            const response = await axios.post(requestUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setMessageChipBar('La lista negra se gestiono correctamente');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchBlackListsByUser();
                setIsManageModalOpen(false);
            }
        } catch (err) {
            setTitleErrorModal('Error al Gestionar la lista negra');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);

            setIsManageModalOpen(false);
        } finally {
            setBase64File('');
            setFileSuccess(false);
            setFileError(false);
            setUploadedFile(null);
            setLoading(false);
        }
    };

    const addBlackList = async () => {
        setLoading(true);
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;


        if (!salaId) {
            console.error("No se encontró el ID de la sala.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_BLACKLIST}`;
            const payload = {
                Name: formData.Name,
                ExpirationDate: formData.ExpirationDate,
                IdRoom: salaId,
                Phones: formData.Phones,
                FileBase64: formData.File
            };

            const response = await axios.post(requestUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setMessageChipBar('La lista negra ha sido creada correctamente');
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchBlackListsByUser();
                handleResetAndCloseModal();
            }
        } catch {
            setTitleErrorModal('Error al añadir la lista negra');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
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


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (!date) return 'Sin expiración';


        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() <= 1969) return 'Sin expiración';

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
    useEffect(() => {
        if (selectedTelefonoCol && selectedDatoCol && excelData.length > 1) {
            const telefonoIndex = columns.indexOf(selectedTelefonoCol);
            const datoIndex = columns.indexOf(selectedDatoCol);

            const rows = excelData.slice(1).map((row) => ({
                telefono: row[telefonoIndex],
                dato: row[datoIndex],
            }));

            setProcessedRows(rows); // ✅ esto puedes mandarlo junto con el archivo base64
        }
    }, [selectedTelefonoCol, selectedDatoCol]);

    const handleFile = (file: File) => {
        const isValid = file.name.endsWith('.xlsx');

        if (!isValid) {
            setUploadedFile(null);
            setFileError(true);
            setFileSuccess(false);
            setSheetNames([]);
            setColumns([]);
            setExcelData([]);
            setBase64File('');

            return;
        }

        setUploadedFile(file);
        setFileError(false);
        setFileSuccess(true);
        setShowColumnOptions(true);

        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetNames = workbook.SheetNames;
            setSheetNames(sheetNames);
            setSelectedSheet('');

            const sheet = workbook.Sheets[sheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

            setExcelData(jsonData);
            setColumns(jsonData[0] as string[]);
        };

        reader.readAsArrayBuffer(file);

        // Extraer base64 también
        const readerB64 = new FileReader();
        readerB64.onloadend = () => {
            const base64 = (readerB64.result as string).split(',')[1];
            setBase64File(base64);
            setUploadedFileBase64(base64);
        };
        readerB64.readAsDataURL(file);
    };


    const extractBase64 = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setBase64File(base64);
        };
        reader.readAsDataURL(file);
    };


    const handleSheetChange = (event: SelectChangeEvent<string>) => {
        const selected = event.target.value;
        setSelectedSheet(selected);

        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[selected], { header: 1 });
        const jsonData = sheet as any[][];
        setExcelData(jsonData);
        setColumns(jsonData[0] as string[]);
    };


    const handlePhoneChange = (index: number, value: string) => {
        const numericOnly = value.replace(/\D/g, ''); // elimina todo lo que no sea número
        const updated = [...formData.Phones];
        updated[index] = numericOnly;
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
        setFormData(prev => ({ ...prev, Name: value }));
    };

    const handlePhonesChange = (updatedPhones: string[]) => {
        setFormData(prev => ({ ...prev, Phones: updatedPhones }));
    };

    const handleDateChange = (date: Date) => {
        setFormData(prev => ({
            ...prev,
            ExpirationDate: date
        }));
    };
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRows(allRows);
        } else {
            setSelectedRows([]);
        }
    };

    const isAllSelected = selectedRows.length === allRows.length && allRows.length > 0;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < allRows.length;

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const openInspectModal = async (blackList: BlackList) => {
        try {
            const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;
            if (!salaId) {

                console.error("No se encontró el ID de la sala.");

                return;

            }
            const apicall = `${import.meta.env.VITE_SMS_API_URL}${import.meta.env.VITE_API_GET_BLACKLISTRECORDS}`;
            const payload = {
                Name: blackList.name,
                id: salaId,
            };

            const response = await axios.post(apicall, payload, {

                headers: {

                    'Content-Type': 'application/json',

                },
            });
            if (response.status === 200) {
                setInspectData(response.data.blackListPhones);
                setCampaignData(response.data.campains);
                setIsInspectModalOpen(true);
                setInspectTab('registros');
                setInspectPage(1);
            }
        } catch (error) {
            console.error("Error al obtener registros:", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

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

    const handleIndividualPhoneChange = (index: number, value: string) => {
        const updated = [...individualPhones];
        updated[index] = value;
        setIndividualPhones(updated);
    };

    const handleAddIndividualPhone = () => {
        if (individualPhones.length < 5) {
            setIndividualPhones(prev => [...prev, '']);
        }
    };

    const handleRemoveIndividualPhone = (index: number) => {
        const updated = [...individualPhones];
        updated.splice(index, 1);
        setIndividualPhones(updated);
    };

    const handleSelectRow = (row: BlackList) => {
        const isSelected = selectedRows.some(r => r.id === row.id);
        if (isSelected) {
            setSelectedRows(prev => prev.filter(r => r.id !== row.id));
        } else {
            setSelectedRows(prev => [...prev, row]);
        }
    };

    const handleDeleteSelected = async (blackList: BlackList) => {
        const salaId = JSON.parse(localStorage.getItem('selectedRoom') || '{}')?.id;
        const tieneProtegidas = selectedRows.some((row) => row.hasActiveCampaign);

        if (tieneProtegidas) {
            setTitleErrorModal("Error al eliminar listas negras");
            setMessageErrorModal("Alguna o todas las listas negras seleccionadas se encuentran asignadas a una campaña que está en curso. No es posible eliminarla(s).");
            setIsErrorModalOpen(true);
            return;
        }
        const payload = {
            names: blackList ? [blackList.name] : selectedRows.map(row => row.name),
            idroom: salaId
        };


        try {
            setLoading(true);
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_DELETE_BLACKLISTRECORDS}`;
            const response = await axios.post(requestUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                if (selectedRows.map(row => row.name).length > 1) {
                    setMessageChipBar('Las listas negras se elimino correctamente');

                } else {

                    setMessageChipBar('La lista negra se elimino correctamente');
                }
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchBlackListsByUser();
                setIsManageModalOpen(false);
            }
        } catch (err) {
            setTitleErrorModal('Error al eliminar la lista negra');
            setMessageErrorModal('Algo salió mal. Inténtelo de nuevo o regreso más tarde.');
            setIsErrorModalOpen(true);

            setIsManageModalOpen(false);
        } finally {
            setBase64File('');
            setFileSuccess(false);
            setFileError(false);
            setUploadedFile(null);
            setLoading(false);
            setSelectedRows([]);
        }
    };

    const handleOpenDeleteModal = (blackList: BlackList) => {
        setRowToDelete(blackList);
        setOpenDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setRowToDelete(null);
        setOpenDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (rowToDelete) {
            await handleDeleteSelected(rowToDelete); // tu función ya existente
            handleCloseDeleteModal();
        }
    };
    const hasLockedBlackLists = selectedRows.some((row) => row.hasActiveCampaign);

    const hasPhoneInput = formData.Phones.some(p => p.trim() !== '');

    const isNameInvalid = !!(
        formData.Name &&
        (formData.Name.length > 40 || !/^[a-zA-Z0-9 ]+$/.test(formData.Name))
    );

    const handleCloseManageModal = () => {
        setIsManageModalOpen(false);

        // Opcionalmente puedes limpiar campos si quieres
        setSelectedBlackList(null);
        setSelectedBlackListName('');
        setIndividualPhones(['']);
        setUploadedFile(null);
        setBase64File('');
        setUploadedFileBase64('');
        setFileError(false);
        setFileSuccess(false);
        setSelectedSheet('');
        setSelectedTelefonoCol('');
        setSelectedDatoCol('');
        setSheetNames([]);
        setColumns([]);
        setExcelData([]);
        setManageOperation('agregar');
        setManageByList(false);
        setManageByIndividual(false);
    };



    const [showColumnOptions, setShowColumnOptions] = useState(true);

    return (
        <div style={{ padding: '20px', marginTop: '-70px', marginLeft: "40px", maxWidth: "1540px" }}>
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
                    onClick={() => {
                        setFormData({
                            Name: '',
                            Phones: [''],
                            ExpirationDate: null,
                            File: '',
                        });
                        setFileSuccess(false);
                        setFileError(false);
                        setUploadedFile(null);
                        setBase64File('');
                        setUploadedFileBase64('');
                        setIsblacklistModalOpen(true);
                    }}
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
                                    width: "24px",
                                    height: "24px",
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
            {BlackList.length > 0 && (
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', marginTop: '-46px',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#574B4F', minWidth: '120px' }}>
                            {startItem}–{endItem} de {totalItems}
                        </Typography>

                        {/* Ir al inicio */}
                        <IconButton
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            sx={{ p: 0 }}
                        >
                            <img
                                src={currentPage === 1 ? backarrowD : backarrow}
                                style={{ transform: 'rotate(0deg)', width: 22 }}
                                alt="Primera página"
                            />
                            <img
                                src={currentPage === 1 ? backarrowD : backarrow}
                                style={{ transform: 'rotate(0deg)', width: 22, marginLeft: '-16px' }}
                                alt=""
                            />
                        </IconButton>

                        {/* Anterior */}
                        <IconButton
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            sx={{ p: 0 }}
                        >
                            <img
                                src={currentPage === 1 ? backarrowD : backarrow}
                                style={{ transform: 'rotate(0deg)', width: 22 }}
                                alt="Anterior"
                            />
                        </IconButton>

                        {/* Siguiente */}
                        <IconButton
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            sx={{ p: 0 }}
                        >
                            <img
                                src={currentPage === totalPages ? backarrowD : backarrow}
                                style={{ transform: 'rotate(180deg)', width: 22 }}
                                alt="Siguiente"
                            />
                        </IconButton>

                        {/* Ir al final */}
                        <IconButton
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            sx={{ p: 0 }}
                        >
                            <img
                                src={currentPage === totalPages ? backarrowD : backarrow}
                                style={{ transform: 'rotate(180deg)', width: 22 }}
                                alt="Última página"
                            />
                            <img
                                src={currentPage === totalPages ? backarrowD : backarrow}
                                style={{ transform: 'rotate(180deg)', width: 22, marginLeft: '-16px' }}
                                alt=""
                            />
                        </IconButton>
                    </Box>
                </Box>
            )}

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                {BlackList.length === 0 && (
                    <Box
                        sx={{
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '60px 0',
                            height: '625px',
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
                            style={{ width: '263px', marginBottom: '16px' }}
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
                        <table style={{ width: '1500px', borderCollapse: 'collapse', fontFamily: 'Poppins' }}>
                            <thead>
                                {selectedRows.length === 0 ? (
                                    <tr style={{ backgroundColor: '#FFFFFF', textAlign: 'left', width: '100%' }}>
                                        <th style={{ padding: '16px' }}>
                                            <Checkbox
                                                sx={{
                                                    color: '#8F4E63',
                                                    '&.Mui-checked': { color: '#8F4E63' },
                                                    '&.MuiCheckbox-indeterminate': { color: '#8F4E63' }
                                                }}
                                                checked={isAllSelected}
                                                indeterminate={isIndeterminate}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: '500' }}>Fecha de creación</th>
                                        <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: '500' }}>Nombre de lista</th>
                                        <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: '500' }}>Fecha de expiración</th>
                                        <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: '500' }}>Cantidad de registros</th>
                                        <th style={{ padding: '16px' }}></th>
                                    </tr>
                                ) : (
                                    <tr style={{ backgroundColor: '#FFFFFF', textAlign: 'left', width: '100%' }}>
                                        <th colSpan={6} style={{ minWidth: "967px" }}>

                                            <Box display="flex" alignItems="center" gap={1} pl={2} marginTop={"18px"} marginLeft={"2px"} marginBottom={"18px"}>
                                                {/*Checkbox para tablas*/}
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    indeterminate={isIndeterminate}
                                                    onChange={handleSelectAll}
                                                    icon={
                                                        <Box
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                                border: '2px solid #8F4E63',
                                                                borderRadius: '2px',
                                                            }}
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <Box
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                                backgroundColor: '#8F4E63',
                                                                border: '2px solid #8F4E63',
                                                                borderRadius: '2px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: 14,
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            ✓
                                                        </Box>
                                                    }
                                                    indeterminateIcon={
                                                        <Box
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                                backgroundColor: '#8F4E63',
                                                                border: '2px solid #8F4E63',
                                                                borderRadius: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: 2,
                                                                    backgroundColor: 'white',
                                                                    borderRadius: 1,
                                                                }}
                                                            />
                                                        </Box>
                                                    }
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
                                                                    offset: [0, -12] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                                }
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <IconButton onClick={handleDeleteSelected} >
                                                        <img src={Thrashicon} alt="Eliminar" style={{ width: 20, height: 20 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </th>

                                    </tr>
                                )}
                            </thead>


                            <tbody>
                                {currentItems.map((black) => (
                                    <tr key={black.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                                        <td style={{ padding: '16px' }}>
                                            <Checkbox
                                                sx={{
                                                    color: '#8F4E63',
                                                    '&.Mui-checked': { color: '#8F4E63' },
                                                }}
                                                checked={selectedRows.some(r => r.id === black.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedRows(prev => [...prev, black]);
                                                    } else {
                                                        setSelectedRows(prev => prev.filter(r => r.id !== black.id));
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '16px', fontFamily: 'Poppins', }}>{formatDate(black.creationDate)}</td>
                                        <td style={{ padding: '16px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Poppins', }}>
                                            {black.name}
                                        </td>
                                        <td style={{ padding: '16px', fontFamily: 'Poppins', }}>{formatDate(black.expirationDate)}</td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontFamily: 'Poppins', }}>{black.quantity}</td>
                                        <td style={{
                                            padding: '16px',
                                            borderLeft: '1px solid #E0E0E0',
                                            textAlign: 'center'
                                        }}>
                                            <IconButton onClick={(e) => {
                                                setMenuAnchorEl(e.currentTarget);
                                                setSelectedBlackList(black); // GUÁRDALO DIRECTO
                                            }}>

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
            <MainModal
                isOpen={openDeleteModal}
                Title='Elimianr lista negra'
                message='Estas seguro de eliminar la lista negra'
                primaryButtonText="Aceptar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleConfirmDelete}
                onSecondaryClick={handleCloseDeleteModal}

            />
            {/* Modal para agregar */}
            <Modal
                open={isblacklistdModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-card-modal-title"
                aria-describedby="add-card-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '15%',
                        left: '35%',
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
                                    marginTop: "10px"
                                }}
                            >
                                Añadir lista negra
                            </Typography>
                            <IconButton
                                onClick={handleResetAndCloseModal}
                                sx={{
                                    position: 'absolute',
                                    marginTop: '-16px',
                                    marginLeft: '504px',
                                    zIndex: 10
                                }}
                            >
                                <CloseIcon sx={{ color: '#A6A6A6' }} />
                            </IconButton>
                        </Box>
                        <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mb: 1.5 }} />
                        {/* Nombre */}
                        <Box>
                            <Typography
                                sx={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    fontFamily: "Poppins",
                                    letterSpacing: "0px",
                                    color:
                                        formData.Name &&
                                            (formData.Name.length > 40 || !/^[a-zA-Z0-9 ]+$/.test(formData.Name))
                                            ? "#D01247"
                                            : "#330F1B",
                                    opacity: 1,
                                    marginBottom: "4px",
                                }}
                            >
                                Nombre
                                <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    fullWidth
                                    value={formData.Name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    variant="outlined"
                                    required
                                    error={
                                        !!(
                                            formData.Name &&
                                            (formData.Name.length > 40 || !/^[a-zA-Z0-9 ]+$/.test(formData.Name))
                                        )
                                    }
                                    helperText

                                    ={
                                        formData.Name && formData.Name.length > 40
                                            ? "Máximo 40 caracteres"
                                            : formData.Name && !/^[a-zA-Z0-9 ]+$/.test(formData.Name)
                                                ? "Formato inválido"
                                                : ""
                                    }
                                    FormHelperTextProps={{
                                        sx: {
                                            fontFamily: 'Poppins',
                                            fontSize: '12px',
                                            color: '#D01247',
                                            marginLeft: '0px',
                                            marginTop: '4px'
                                        }
                                    }}
                                    sx={{
                                        fontFamily: "Poppins",
                                        "& .MuiInputBase-input": {
                                            fontFamily: "Poppins",
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (

                                            <Tooltip
                                                title={
                                                    <Box
                                                        sx={{
                                                            backgroundColor: "#FFFFFF",
                                                            borderRadius: "8px",
                                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                            padding: "8px 12px",
                                                            fontSize: "14px",
                                                            fontFamily: "Poppins",
                                                            color: "#000000",
                                                            whiteSpace: "pre-line",
                                                            transform: "translate(-1px, -15px)",
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
                                                <InputAdornment position="end">
                                                    <img
                                                        src={
                                                            formData.Name &&
                                                                (formData.Name.length > 40 || !/^[a-zA-Z0-9 ]+$/.test(formData.Name))
                                                                ? infoiconerror
                                                                : infoicon
                                                        }
                                                        alt="info-icon"
                                                        style={{ width: 24, height: 24 }}
                                                    />
                                                </InputAdornment>
                                            </Tooltip>
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
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '16px', color: '#330F1B', mt: 1 }}>
                            Cargar un archivo desde la biblioteca o agregar registros manualmente.
                        </Typography>

                        {/* Upload y Teléfonos */}
                        <Box sx={{ display: 'flex', gap: 3, }}>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column', // 🔥 esta línea es clave
                                    alignItems: 'center',     // Opcional: centra horizontalmente
                                    gap: 0,

                                }}
                            >



                                {/* Subir archivo */}
                                <Box
                                    marginBottom={'25px'}
                                    onClick={() => !hasPhoneInput && fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (hasPhoneInput) return; // 🔒 prevenir carga
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) handleFile(file);
                                    }}
                                    sx={{
                                        border: fileError
                                            ? '2px solid #EF5466'
                                            : fileSuccess
                                                ? '2px solid #8F4E63CC' // ✅ borde éxito
                                                : '2px dashed #D9B4C3',
                                        backgroundColor: fileError
                                            ? '#FFF4F5'
                                            : fileSuccess
                                                ? '#E5CBD333'           // ✅ fondo éxito
                                                : 'transparent',
                                        borderRadius: '8px',
                                        width: '160px',
                                        height: '160px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        fontFamily: 'Poppins',
                                        fontSize: '13px',
                                        color: '#330F1B',
                                        position: 'relative',
                                        cursor: hasPhoneInput ? 'not-allowed' : 'pointer',
                                        px: 1,
                                        opacity: hasPhoneInput ? 0.5 : 1,
                                        pointerEvents: hasPhoneInput ? 'none' : 'auto',
                                    }}

                                >

                                    {/*Tooltip */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            marginTop: "-115px",
                                            marginRight: '-115px',
                                            width: 24,
                                            height: 24,

                                        }}
                                    >
                                        <Tooltip
                                            placement="right"
                                            title={
                                                fileError ? (
                                                    <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#EF5466', opacity: 0.7 }}>
                                                        Solo se permiten archivos .xlsx
                                                    </Box>
                                                ) : fileSuccess ? (
                                                    <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#28A745', opacity: 0.7 }}>
                                                        Archivo cargado {selectedFile?.name}
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#000000', opacity: 0.7 }}>
                                                        El archivo debe ser Excel<br />(.xls/.xlsx)
                                                    </Box>
                                                )
                                            }
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        backgroundColor: "#FFFFFF",
                                                        borderRadius: "8px",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                        padding: "8px 12px",
                                                        fontSize: "14px",
                                                        fontFamily: "Poppins",
                                                        color: "#000000",
                                                        whiteSpace: "pre-line",
                                                        transform: "translate(-5px, -5px)",
                                                        borderColor: "#00131F3D",
                                                        borderStyle: "solid",
                                                        borderWidth: "1px"
                                                    }
                                                }
                                            }}
                                            PopperProps={{
                                                modifiers: [
                                                    {
                                                        name: 'offset',
                                                        options: {
                                                            offset: [35, -180] // 👉 [horizontal, vertical]
                                                        }
                                                    }
                                                ]
                                            }}
                                        >
                                            {!fileSuccess && (
                                                <img
                                                    src={fileError ? infoiconerror : infoicon}
                                                    alt="estado"
                                                    style={{ width: '24px', height: '24px', pointerEvents: 'auto', cursor: 'default' }}
                                                />
                                            )}
                                        </Tooltip>
                                        {fileSuccess && (
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
                                                                offset: [0, -8] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                            }
                                                        }
                                                    ]
                                                }}
                                            >
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // ❌ evita que el click se propague al Box que abre el file picker
                                                        setSelectedFile(null);
                                                        setUploadedFile(null);
                                                        setFileSuccess(false);
                                                        setFileError(false);
                                                        setBase64File('');
                                                        setUploadedFileBase64('');
                                                        setFormData(prev => ({ ...prev, File: '' }));
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        width: 24,
                                                        height: 24,
                                                        padding: 0,
                                                    }}
                                                >
                                                    <img src={Thrashicon} alt="Eliminar archivo" style={{ width: 24, height: 24 }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                    </Box>


                                    {/*Imagen central del archivo a subir*/}
                                    <Box
                                        sx={{
                                            width: "142px", height: "100px"
                                        }}
                                    >
                                        <img
                                            src={
                                                fileError
                                                    ? IconCloudError
                                                    : fileSuccess
                                                        ? CloudCheckedIcon
                                                        : UpCloudIcon
                                            }
                                            alt="estado archivo"
                                            style={{ marginBottom: '8px', width: "" }}
                                        />


                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: "Poppins",
                                                color: "#330F1B",
                                                fontSize: '14px',
                                                opacity: !fileError && !fileSuccess ? 0.6 : 1 // 🔥 esta línea es la clave
                                            }}
                                        >
                                            {fileError
                                                ? 'Archivo inválido'
                                                : fileSuccess
                                                    ? 'Archivo cargado'
                                                    : 'Subir archivo'}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '10px',
                                                color: '#574B4F',
                                                opacity: 0.7,
                                                textAlign: 'center',
                                                wordBreak: 'break-word', // para dividir texto largo
                                                maxWidth: '142px' // asegúrate de limitar ancho si el nombre del archivo es largo
                                            }}
                                        >
                                            {fileSuccess && uploadedFile
                                                ? uploadedFile.name
                                                : 'Arrastre un archivo aquí, o selecciónelo.'}
                                        </Typography>
                                        {fileSuccess && (
                                            <Typography
                                                sx={{
                                                    fontFamily: 'Poppins',
                                                    fontSize: '10px',
                                                    color: '#574B4F',
                                                    opacity: 0.7,
                                                    textAlign: 'center',
                                                    mt: '4px'
                                                }}
                                            >
                                                Total de registros:
                                            </Typography>
                                        )}

                                    </Box>

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


                                {/*Descargar archivo de muestra*/}
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center", // 🔥 centra horizontalmente
                                        mt: -1 // o el margen superior que necesites para ajustarlo
                                    }}
                                >


                                    <Button
                                        disableRipple
                                        sx={{
                                            backgroundColor: 'transparent',
                                            textTransform: 'none',
                                            padding: 0,
                                            minWidth: 'auto',
                                            '&:hover': {
                                                backgroundColor: 'transparent' // ❌ sin cambio de fondo
                                            }
                                        }}
                                        onClick={() => {
                                            // tu lógica si la necesitas
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textDecoration: "underline",
                                                fontFamily: 'Poppins',
                                                fontSize: '11px',
                                                color: "#8F4D63",
                                            }}
                                        >
                                            Descargar archivo de muestra
                                        </Typography>
                                    </Button>

                                </Box>
                            </Box>



                            <Box
                                sx={{
                                    width: '1px',
                                    backgroundColor: '#E6E4E4',
                                    margin: '0 10px',
                                }}
                            />
                            {/* Teléfonos */}
                            <Box
                                sx={{
                                    flex: 1,
                                    opacity: fileSuccess ? 0.5 : 1,           // 🔥 se ve más tenue si hay archivo
                                    pointerEvents: fileSuccess ? 'none' : 'auto' // 🔥 bloquea interacción
                                }}
                            >
                                <Typography sx={{ fontFamily: 'Poppins', fontSize: '18px', color: '#330F1B', mb: 1 }}>
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
                                                            <Tooltip
                                                                title={
                                                                    <Box
                                                                        sx={{
                                                                            backgroundColor: "#FFFFFF",
                                                                            borderRadius: "8px",
                                                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                                            padding: "8px 12px",
                                                                            fontSize: "14px",
                                                                            fontFamily: "Poppins",
                                                                            color: "#000000",
                                                                            whiteSpace: "pre-line",
                                                                            transform: "translate(2px, -15px)",
                                                                            borderColor: "#00131F3D",
                                                                            borderStyle: "solid",
                                                                            borderWidth: "1px"
                                                                        }}
                                                                    >
                                                                        <>
                                                                            • Solo caracteres numéricos<br />
                                                                            • El teléfono debe incluir<br />
                                                                            el código del país
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
                                                                <img src={infoicon} alt="info" style={{ width: 24, height: 24 }} />
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    width: '200px',
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

                                            {/* Botón de agregar solo para el último campo */}
                                            {index === formData.Phones.length - 1 && (
                                                <Tooltip title="Agregar número" arrow placement="top"
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
                                                                    offset: [-20, -7] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                                }
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 21,
                                                            height: 21,
                                                            backgroundColor: "#6F565E",
                                                            borderRadius: "50%", // 🔥 clave para hacerlo circular
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}
                                                    >
                                                        <IconButton onClick={handleAddPhone}>
                                                            <img
                                                                src={IconPlus2}
                                                                alt="Agregar teléfono"
                                                                style={{ width: 21, height: 21, }}
                                                            />
                                                        </IconButton>
                                                    </Box>
                                                </Tooltip>
                                            )}

                                            {index > 0 && (
                                                <Tooltip title="Eliminar teléfono" arrow placement="top"
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
                                                                    offset: [-24, -9] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                                }
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <IconButton onClick={() => handleRemovePhone(index)}>
                                                        <img
                                                            src={Thrashicon}
                                                            alt="Eliminar"
                                                            style={{ width: 24, height: 24, marginLeft: "-8px", marginRight: "-17px", }}
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
                                    : '00/00/00 00:00'}
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

                        <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mb: -4, mt: 1 }} />

                        {/* Botones */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>

                            <SecondaryButton text="Cancelar" onClick={handleResetAndCloseModal} />



                            <MainButton
                                text="Guardar"
                                onClick={addBlackList}
                                disabled={
                                    !formData.Name.trim() || // nombre vacío
                                    isNameInvalid ||         // nombre inválido
                                    (!formData.File && !formData.Phones.some(p => p.trim() !== '')) // ni archivo ni teléfonos
                                }
                            />

                        </Box>
                    </Box>

                </Box>
            </Modal>

            <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '180px',
                        left: '750px',
                        width: '580px',
                        height: '409px',
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    {/* Encabezado */}
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'


                    }}>
                        <Typography sx={{
                            fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600, color: '#330F1B',
                            marginTop: "-10px", marginBottom: "10px"
                        }}>
                            Editar lista negra
                        </Typography>
                        <IconButton onClick={() => setIsEditModalOpen(false)}>
                            <CloseIcon sx={{ color: '#A6A6A6', marginTop: "-26px", marginLeft: "30px" }} />
                        </IconButton>
                    </Box>

                    <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px' }} />

                    {/* Nombre */}
                    <Box
                        sx={{
                            marginLeft: "81px",
                            width: '340px',
                            height: '84px',
                            marginBottom: "8px"
                        }}
                    >
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '16px', color: '#330F1B', mb: 1 }}>
                            Nombre<span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            value={formData.Name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip
                                        title={
                                            <Box
                                                sx={{
                                                    backgroundColor: "#FFFFFF",
                                                    borderRadius: "8px",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                    padding: "8px 12px",
                                                    fontSize: "14px",
                                                    fontFamily: "Poppins",
                                                    color: "#000000",
                                                    whiteSpace: "pre-line",
                                                    transform: "translate(-1px, -15px)",
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
                                        <InputAdornment position="end">
                                            <img src={infoicon} alt="info" />
                                        </InputAdornment>
                                    </Tooltip>
                                )
                            }}
                            sx={{
                                width: '100%',
                                height: '54px',
                                '& .MuiInputBase-root': {
                                    height: '100%'
                                },
                                '& input': {
                                    fontFamily: 'Poppins',
                                    fontSize: '14px'
                                }
                            }}
                        />
                    </Box>

                    {/* Fecha */}
                    <Box
                        sx={{
                            marginLeft: "81px",
                            width: '341px',
                            height: '83px',

                        }}
                    >
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '16px', color: '#330F1B', mb: 1 }}>
                            Fecha de expiración (opcional)
                        </Typography>
                        <Box>
                            <Box
                                onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setDatePickerOpen(true);
                                }}
                                sx={{
                                    width: '100%',
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
                                        minute: '2-digit'
                                    })
                                    : 'Selecciona fecha y hora'}
                            </Box>

                            {datePickerOpen && anchorEl && (
                                <CustomDateTimePicker
                                    open={datePickerOpen}
                                    anchorEl={anchorEl}
                                    placement="top-start"
                                    onApply={(date, hour, minute) => {
                                        const newDate = new Date(date);
                                        newDate.setHours(hour);
                                        newDate.setMinutes(minute);
                                        handleDateChange(newDate);
                                        setDatePickerOpen(false);
                                        setAnchorEl(null);
                                    }}
                                    onClose={() => {
                                        setDatePickerOpen(false);
                                        setAnchorEl(null);
                                    }}
                                    modifiers={[
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -380], // 🔥 prueba valores como -4, -6 o incluso 0 si quieres que quede más abajo
                                            },
                                        },
                                    ]}

                                />

                            )}

                        </Box>

                    </Box>

                    <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mt: 3, mb: -2 }} />

                    {/* Botones */}
                    <Box sx={{
                        px: -2,
                        py: 4,
                        display: 'flex',
                        justifyContent: 'space-between',

                    }}>
                        <SecondaryButton text="Cancelar" onClick={() => setIsEditModalOpen(false)} />
                        <MainButton
                            text="Guardar cambios"
                            onClick={handleUpdateBlackList}
                            disabled={formData.Name.trim() === ''}
                        />
                    </Box>
                </Box>
            </Modal>

            <Modal open={isInspectModalOpen} onClose={() => setIsInspectModalOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    marginTop: '150px',
                    marginLeft: '50%',
                    transform: 'translateX(-50%)',
                    width: '546px',
                    height: '667px',
                    maxHeight: 'calc(100vh - 100px)',
                    bgcolor: 'white',
                    borderRadius: '8px',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600, color: '#330F1B' }}>
                            Inspeccionar lista negra
                        </Typography>
                        <IconButton onClick={() => setIsInspectModalOpen(false)}>
                            <CloseIcon sx={{ color: '#A6A6A6', marginTop: "-34px", marginRight: "-24px" }} />
                        </IconButton>
                    </Box>

                    <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mb: 1, mt: 1 }} />

                    {/* Tabs */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between', // Asegura que se distribuyan
                            width: '100%',
                            borderBottom: '1px solid #E0E0E0',
                            mb: 2,
                        }}
                    >
                        <Typography
                            onClick={() => setInspectTab('registros')}
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                width: '100%',
                                textAlign: 'center',
                                borderBottom: inspectTab === 'registros' ? '2px solid #7B354D' : 'none',
                                color: inspectTab === 'registros' ? '#7B354D' : '#9B9295',
                                cursor: 'pointer',
                                pb: 1
                            }}
                        >
                            REGISTROS
                        </Typography>
                        <Typography
                            onClick={() => setInspectTab('campañas')}
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                width: '100%',
                                textAlign: 'center',
                                borderBottom: inspectTab === 'campañas' ? '2px solid #7B354D' : 'none',
                                color: inspectTab === 'campañas' ? '#7B354D' : '#9B9295',
                                cursor: 'pointer',
                                pb: 1
                            }}
                        >
                            CAMPAÑAS ASIGNADAS
                        </Typography>
                    </Box>

                    <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mb: 3, mt: -2.3 }} />
                    {inspectTab === 'campañas' && (
                        <>
                            {/* Header: paginación + buscador */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2,
                                mt: '-10px'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#574B4F', minWidth: '120px' }}>
                                        {Math.min(campaignPage * 50 - 49, campaignData.length)}–{Math.min(campaignPage * 50, campaignData.length)} de {campaignData.length}
                                    </Typography>

                                    {/* Flechas */}
                                    <IconButton onClick={() => setCampaignPage(1)} disabled={campaignPage === 1} sx={{ p: 0 }}>
                                        <img src={campaignPage === 1 ? backarrowD : backarrow} style={{ transform: 'rotate(0deg)', width: 22 }} />
                                        <img src={campaignPage === 1 ? backarrowD : backarrow} style={{ transform: 'rotate(0deg)', width: 22, marginLeft: '-16px' }} />
                                    </IconButton>

                                    <IconButton onClick={() => setCampaignPage(prev => Math.max(prev - 1, 1))} disabled={campaignPage === 1} sx={{ p: 0 }}>
                                        <img src={campaignPage === 1 ? backarrowD : backarrow} style={{ transform: 'rotate(0deg)', width: 22 }} />
                                    </IconButton>

                                    <IconButton onClick={() => setCampaignPage(prev => prev + 1)} disabled={campaignPage * 50 >= campaignData.length} sx={{ p: 0 }}>
                                        <img src={campaignPage * 50 >= campaignData.length ? backarrowD : backarrow} style={{ transform: 'rotate(180deg)', width: 22 }} />
                                    </IconButton>

                                    <IconButton onClick={() => setCampaignPage(Math.ceil(campaignData.length / 50))} disabled={campaignPage * 50 >= campaignData.length} sx={{ p: 0 }}>
                                        <img src={campaignData.length === 0 || campaignPage * 50 >= campaignData.length ? backarrowD : backarrow} style={{ transform: 'rotate(180deg)', width: 22 }} />
                                        <img src={campaignData.length === 0 || campaignPage * 50 >= campaignData.length ? backarrowD : backarrow} style={{ transform: 'rotate(180deg)', width: 22, marginLeft: '-16px' }} />
                                    </IconButton>
                                </Box>

                                {/* Buscador */}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        backgroundColor: "#FFFFFF",
                                        border: campaignSearch ? "1px solid #7B354D" : "1px solid #9B9295",
                                        borderRadius: "4px",
                                        padding: "6px 10px",
                                        width: "220px",
                                        height: "38px",
                                    }}
                                >
                                    <img src={seachicon} alt="Buscar" style={{
                                        marginRight: "8px",
                                        width: "16px",
                                        height: "16px",
                                        filter: campaignSearch ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)" : "none"
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Buscar campaña"
                                        value={campaignSearch}
                                        onChange={(e) => setCampaignSearch(e.target.value)}
                                        style={{
                                            border: "none",
                                            outline: "none",
                                            width: "100%",
                                            fontSize: "14px",
                                            fontFamily: "Poppins, sans-serif",
                                            color: campaignSearch ? "#7B354D" : "#9B9295",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Tabla o mensaje vacío */}
                            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                                {campaignData.filter(c => c.campainName.toLowerCase().includes(campaignSearch.toLowerCase()))
                                    .slice((campaignPage - 1) * 50, campaignPage * 50).length === 0 ? (
                                    <Box sx={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={Emptybox} alt="No campaigns" style={{ width: '242px', marginBottom: '16px', marginTop: '100px' }} />
                                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#7B354D', fontWeight: 500 }}>
                                            No se encontraron resultados.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F5F5F5' }}>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Canal</th>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Ícono</th>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Campaña</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaignData
                                                .filter(c => c.campainName.toLowerCase().includes(campaignSearch.toLowerCase()))
                                                .slice((campaignPage - 1) * 50, campaignPage * 50)
                                                .map((row, index) => (
                                                    <tr key={index} style={{ borderTop: '1px solid #E0E0E0' }}>
                                                        <td style={{ padding: '12px' }}>{row.chanel}</td>
                                                        <td style={{ padding: '12px' }}>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>{row.campainName}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}
                            </Box>
                        </>
                    )}

                    {inspectTab === 'registros' && (
                        <>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '20px',
                                marginTop: '-10px',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#574B4F', minWidth: '120px' }}>
                                        {Math.min(inspectPage * 50 - 49, inspectData.length)}–{Math.min(inspectPage * 50, inspectData.length)} de {inspectData.length}
                                    </Typography>

                                    {/* Flechas */}
                                    <IconButton
                                        onClick={() => setInspectPage(1)}
                                        disabled={inspectPage === 1}
                                        sx={{ p: 0 }}
                                    >
                                        <img
                                            src={inspectPage === 1 ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(0deg)', width: 22 }}
                                            alt="Primera página"
                                        />
                                        <img
                                            src={inspectPage === 1 ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(0deg)', width: 22, marginLeft: '-16px' }}
                                            alt=""
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setInspectPage(prev => Math.max(prev - 1, 1))}
                                        disabled={inspectPage === 1}
                                        sx={{ p: 0 }}
                                    >
                                        <img
                                            src={inspectPage === 1 ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(0deg)', width: 22 }}
                                            alt="Anterior"
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setInspectPage(prev => prev + 1)}
                                        disabled={inspectPage * 50 >= inspectData.length}
                                        sx={{ p: 0 }}
                                    >
                                        <img
                                            src={inspectPage * 50 >= inspectData.length ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(180deg)', width: 22 }}
                                            alt="Siguiente"
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setInspectPage(Math.ceil(inspectData.length / 50))}
                                        disabled={inspectPage * 50 >= inspectData.length}
                                        sx={{ p: 0 }}
                                    >
                                        <img
                                            src={inspectPage * 50 >= inspectData.length ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(180deg)', width: 22 }}
                                            alt="Última página"
                                        />
                                        <img
                                            src={inspectPage * 50 >= inspectData.length ? backarrowD : backarrow}
                                            style={{ transform: 'rotate(180deg)', width: 22, marginLeft: '-16px' }}
                                            alt=""
                                        />
                                    </IconButton>
                                </Box>

                                {/* Buscador */}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        backgroundColor: "#FFFFFF",
                                        border: inspectSearch ? "1px solid #7B354D" : "1px solid #9B9295",
                                        borderRadius: "4px",
                                        padding: "6px 10px",
                                        width: "220px",
                                        height: "38px",
                                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <img
                                        src={seachicon}
                                        alt="Buscar"
                                        style={{
                                            marginRight: "8px",
                                            width: "16px",
                                            height: "16px",
                                            filter: inspectSearch
                                                ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)"
                                                : "none",
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar teléfono"
                                        value={inspectSearch}
                                        onChange={(e) => setInspectSearch(e.target.value)}
                                        style={{
                                            border: "none",
                                            outline: "none",
                                            width: "100%",
                                            fontSize: "14px",
                                            fontFamily: "Poppins, sans-serif",
                                            color: inspectSearch ? "#7B354D" : "#9B9295",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                </Box>

                            </Box>

                            {/* Tabla */}
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    border: '1px solid transparent' // opcional para testeo visual
                                }}
                            >                                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins', }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#ffff' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Dato</th>
                                        </tr>
                                    </thead>
                                    {inspectData
                                        .filter((d) => d.phone.includes(inspectSearch))
                                        .slice((inspectPage - 1) * 50, inspectPage * 50).length === 0 ? (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '300px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <img src={Emptybox} alt="No results" style={{
                                                width: '242px',
                                                marginBottom: '16px',
                                                position: 'absolute',
                                                marginLeft: '200px'
                                            }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontFamily: 'Poppins',
                                                    fontSize: '14px',
                                                    color: '#7B354D',
                                                    fontWeight: 500,
                                                    mt: "220px",
                                                    position: "absolute",
                                                    marginLeft: '200px'
                                                }}
                                            >
                                                No se encontraron resultados.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <tbody>
                                            {inspectData
                                                .filter((d) => d.phone.includes(inspectSearch))
                                                .slice((inspectPage - 1) * 50, inspectPage * 50)
                                                .map((row, index) => (
                                                    <tr key={index} style={{ borderTop: '1px solid #E0E0E0' }}>
                                                        <td style={{ padding: '12px' }}>{row.phone}</td>
                                                        <td style={{ padding: '12px' }}>Dato 1</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    )}
                                </table>
                            </Box>
                        </>
                    )}


                </Box>
            </Modal>

            <Modal open={isManageModalOpen} onClose={() => setIsManageModalOpen(false)}>
                <Box sx={{
                    width: '580px',
                    height: '592px',
                    bgcolor: 'white',
                    borderRadius: '10px',
                    mx: 'auto',
                    mt: '5%',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Poppins',
                    overflow: 'hidden', // 🔥 evita doble scroll
                    boxShadow: 24,
                }}>


                    <Box sx={{ px: 4, pt: 4 }}>
                        <Typography fontWeight="600" fontSize="20px" fontFamily='Poppins' marginTop={'-10px'} marginLeft={'-5px'}>
                            Gestionar registros: <span style={{ color: '#7B354D', fontFamily: 'Poppins' }}>{selectedBlackList ? `${selectedBlackList.name}` : ''}</span>
                        </Typography>

                        <IconButton
                            onClick={handleCloseManageModal}
                            sx={{
                                position: 'absolute',
                                marginTop: '-46px',
                                marginLeft: '500px',
                                zIndex: 10
                            }}
                        >
                            <CloseIcon sx={{ color: '#A6A6A6' }} />
                        </IconButton>

                        <Divider sx={{
                            width: 'calc(100% + 64px)', marginLeft: '-32px',
                            marginTop: "20px",
                            marginBottom: "-15px"
                        }} />

                        <Typography
                            mt={3}
                            fontWeight="500"
                            fontSize="18px"
                            fontFamily="Poppins"
                            textAlign="center"
                            sx={{ width: '100%' }}
                        >
                            Seleccionar operación
                        </Typography>


                        <ToggleButtonGroup
                            exclusive
                            value={manageOperation}
                            onChange={(e, value) => value && setManageOperation(value)}
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: "25px",

                            }}
                        >
                            <Box
                                sx={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "6px",
                                    border: '2px solid #8F4E63',
                                    backgroundColor: manageOperation === 'agregar' ? '#8F4D63' : '#FFFFFF',

                                }}
                            >

                                <ToggleButton
                                    value="agregar"
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: "64px",
                                        height: "64px",
                                        padding: 1
                                    }}
                                >
                                    <img
                                        src={
                                            manageOperation === 'agregar'
                                                ? IconPlusCircle
                                                : IconPlusUnselected
                                        }
                                        alt="Icono de acción"
                                        style={{ width: 32, height: 32, marginBottom: 4 }}
                                    />

                                </ToggleButton>
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                        fontFamily: 'Poppins',
                                        fontSize: '12px',
                                        lineHeight: 1,
                                        color: '#8F4D63',
                                        textTransform: 'none',
                                        marginLeft: "0px",
                                        marginTop: "7px"
                                    }}
                                >
                                    Cargar
                                </Typography>
                                <InputAdornment position="end"
                                    sx={{ marginTop: "-15px", marginLeft: "46px" }}
                                >
                                    <Tooltip
                                        title={
                                            <Box
                                                sx={{

                                                    backgroundColor: "#FFFFFF",
                                                    borderRadius: "8px",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                    padding: "8px 12px",
                                                    fontSize: "14px",
                                                    fontFamily: "Poppins",
                                                    color: "#000000",
                                                    whiteSpace: "pre-line",
                                                    transform: "translate(2px, -15px)",
                                                    borderColor: "#00131F3D",
                                                    borderStyle: "solid",
                                                    borderWidth: "1px"
                                                }}
                                            >
                                                <>
                                                    Añadir teléfonos a la<br />
                                                    lista actual
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
                                        <img src={infoicon} alt="info" style={{ width: 20, height: 20 }} />
                                    </Tooltip>
                                </InputAdornment>


                            </Box>

                            <Box
                                sx={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "6px",
                                    border: '2px solid #8F4E63',
                                    backgroundColor: manageOperation === 'eliminar' ? '#8F4D63' : '#FFFFFF',

                                }}
                            >
                                <ToggleButton value="eliminar"
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: "64px",
                                        height: "64px",
                                        padding: 1,
                                    }}
                                >
                                    <img
                                        src={manageOperation === 'eliminar' ? IconMinusSelected : IconNegativeCircle}
                                        alt="Eliminar"
                                        style={{ width: 32, height: 32, marginBottom: 4 }}
                                    />

                                </ToggleButton>
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                        fontFamily: 'Poppins',
                                        fontSize: '12px',
                                        lineHeight: 1,
                                        color: '#8F4D63',
                                        textTransform: 'none',
                                        marginLeft: "7px",
                                        marginTop: "6px"
                                    }}
                                >
                                    Eliminar
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "6px",
                                    border: '2px solid #8F4E63',
                                    backgroundColor: manageOperation === 'actualizar' ? '#8F4D63' : '#FFFFFF',

                                }}
                            >
                                <ToggleButton value="actualizar"
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: "64px",
                                        height: "64px",
                                        padding: 1
                                    }}
                                >
                                    <img
                                        src={manageOperation === 'actualizar' ? IconUpdateSelected : IconReUpdate1}
                                        alt="Actualizar"
                                        style={{ width: 27, height: 27, marginBottom: 4 }}
                                    />

                                </ToggleButton>
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                        fontFamily: 'Poppins',
                                        fontSize: '12px',
                                        lineHeight: 1,
                                        color: '#8F4D63',
                                        textTransform: 'none',
                                        marginLeft: "0px",
                                        marginTop: "6px"
                                    }}
                                >
                                    Actualizar
                                </Typography>
                            </Box>

                        </ToggleButtonGroup>

                        <Divider sx={{ my: 3, mt: 5 }} />
                    </Box>


                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            px: 3,
                            py: 0,
                            mt: -3,
                            maxHeight: 'calc(85vh - 200px)', // 🔥 ajusta el espacio restante después del header y los botones
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                px: 4,
                                py: 3,
                                maxHeight: 'calc(90vh - 180px)', // o lo que uses
                                overflowX: 'hidden', // 🔥 Esto evita scroll lateral
                            }}
                        >
                            <Typography fontWeight="500" fontSize="18px" mb={1} fontFamily={"Poppins"}
                                marginLeft={'-30px'} marginTop={'-10px'}>Seleccionar fuente de registros</Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={'-30px'} marginBottom={'-8px'}
                                border={'1px solid #E6E4E4'} borderRdius={'6px'} width={'530px'} height={'57px'} borderRadius={'6px'}
                                opacity={manageByIndividual ? 0.4 : 1} pointerEvents={manageByIndividual ? 'none' : 'auto'}
                            >
                                <Typography fontSize="18px" fontFamily={"Poppins"} marginLeft={'16px'}>Por archivo</Typography>
                                <Switch
                                    checked={manageByList}
                                    onChange={() => {
                                        const newValue = !manageByList;
                                        setManageByList(newValue);
                                        if (newValue) {
                                            setManageByIndividual(false);
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box mt={-2}>
                            {manageByList && (
                                <>
                                    {manageOperation === 'agregar' && (
                                        <Box display="flex" alignItems="flex-start" gap={3} mt={2} flexWrap="wrap">
                                            {/* Subir archivo en gestión de registros - Cargar*/}
                                            <Box
                                                marginBottom={'0px'}
                                                onClick={() => !hasPhoneInput && fileInputRef.current?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (hasPhoneInput) return; // 🔒 prevenir carga
                                                    const file = e.dataTransfer.files?.[0];
                                                    if (file) handleFile(file);
                                                }}
                                                sx={{
                                                    border: fileError
                                                        ? '2px solid #EF5466'
                                                        : fileSuccess
                                                            ? '2px solid #8F4E63CC' // ✅ borde éxito
                                                            : '2px dashed #D9B4C3',
                                                    backgroundColor: fileError
                                                        ? '#FFF4F5'
                                                        : fileSuccess
                                                            ? '#E5CBD333'           // ✅ fondo éxito
                                                            : 'transparent',
                                                    borderRadius: '8px',
                                                    width: '160px',
                                                    height: '160px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: fileSuccess ? 'flex-start' : 'center',
                                                    transition: 'all 0.3s ease', // animación suave
                                                    marginLeft: fileSuccess ? '20px' : 'auto',
                                                    marginRight: fileSuccess ? '10px' : 'auto',
                                                    textAlign: 'center',
                                                    fontFamily: 'Poppins',
                                                    fontSize: '13px',
                                                    color: '#330F1B',
                                                    position: 'relative',
                                                    cursor: hasPhoneInput ? 'not-allowed' : 'pointer',
                                                    px: 1,
                                                    opacity: hasPhoneInput ? 0.5 : 1,
                                                    pointerEvents: hasPhoneInput ? 'none' : 'auto',
                                                }}

                                            >

                                                {/*Tooltip */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        marginTop: "-115px",
                                                        marginRight: '-115px',
                                                        width: 24,
                                                        height: 24,

                                                    }}
                                                >
                                                    <Tooltip
                                                        placement="right"
                                                        title={
                                                            fileError ? (
                                                                <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#EF5466', opacity: 0.7 }}>
                                                                    Solo se permiten archivos .xlsx
                                                                </Box>
                                                            ) : fileSuccess ? (
                                                                <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#28A745', opacity: 0.7 }}>
                                                                    Archivo cargado {selectedFile?.name}
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#000000', opacity: 0.7 }}>
                                                                    El archivo debe ser Excel<br />(.xls/.xlsx)
                                                                </Box>
                                                            )
                                                        }
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: "#FFFFFF",
                                                                    borderRadius: "8px",
                                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                                    padding: "8px 12px",
                                                                    fontSize: "14px",
                                                                    fontFamily: "Poppins",
                                                                    color: "#000000",
                                                                    whiteSpace: "pre-line",
                                                                    transform: "translate(-5px, -5px)",
                                                                    borderColor: "#00131F3D",
                                                                    borderStyle: "solid",
                                                                    borderWidth: "1px"
                                                                }
                                                            }
                                                        }}
                                                        PopperProps={{
                                                            modifiers: [
                                                                {
                                                                    name: 'offset',
                                                                    options: {
                                                                        offset: [35, -180] // 👉 [horizontal, vertical]
                                                                    }
                                                                }
                                                            ]
                                                        }}
                                                    >
                                                        {!fileSuccess && (
                                                            <img
                                                                src={fileError ? infoiconerror : infoicon}
                                                                alt="estado"
                                                                style={{ width: '24px', height: '24px', pointerEvents: 'auto', cursor: 'default' }}
                                                            />
                                                        )}
                                                    </Tooltip>
                                                    {fileSuccess && (
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
                                                                            offset: [0, -8] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                                        }
                                                                    }
                                                                ]
                                                            }}
                                                        >
                                                            {/*Trashicon 2*/}
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedFile(null);
                                                                    setUploadedFile(null);
                                                                    setFileSuccess(false);
                                                                    setFileError(false);
                                                                    setBase64File('');
                                                                    setUploadedFileBase64('');
                                                                    setFormData(prev => ({ ...prev, File: '' }));
                                                                    setShowColumnOptions(false); // 🔥 ocultar secciones de columnas
                                                                    if (fileInputRef.current) {
                                                                        fileInputRef.current.value = '';
                                                                    }
                                                                }}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    marginTop: "0px",
                                                                    marginLeft: "100px",
                                                                    width: 24,
                                                                    height: 24,
                                                                    padding: 0,
                                                                }}
                                                            >
                                                                <img src={Thrashicon} alt="Eliminar archivo" style={{ width: 24, height: 24 }} />
                                                            </IconButton>

                                                        </Tooltip>
                                                    )}

                                                </Box>


                                                {/*Imagen central del archivo a subir*/}
                                                <Box
                                                    sx={{
                                                        width: "142px", height: "100px"
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            fileError
                                                                ? IconCloudError
                                                                : fileSuccess
                                                                    ? CloudCheckedIcon
                                                                    : UpCloudIcon
                                                        }
                                                        alt="estado archivo"
                                                        style={{ marginBottom: '8px', width: "" }}
                                                    />


                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontFamily: "Poppins",
                                                            color: "#330F1B",
                                                            fontSize: '14px',
                                                            opacity: !fileError && !fileSuccess ? 0.6 : 1 // 🔥 esta línea es la clave
                                                        }}
                                                    >
                                                        {fileError
                                                            ? 'Archivo inválido'
                                                            : fileSuccess
                                                                ? 'Archivo cargado'
                                                                : 'Subir archivo'}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'Poppins',
                                                            fontSize: '10px',
                                                            color: '#574B4F',
                                                            opacity: 0.7,
                                                            textAlign: 'center',
                                                            wordBreak: 'break-word', // para dividir texto largo
                                                            maxWidth: '142px' // asegúrate de limitar ancho si el nombre del archivo es largo
                                                        }}
                                                    >
                                                        {fileSuccess && uploadedFile
                                                            ? uploadedFile.name
                                                            : 'Arrastre un archivo aquí, o selecciónelo.'}
                                                    </Typography>
                                                    {fileSuccess && (
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '10px',
                                                                color: '#574B4F',
                                                                opacity: 0.7,
                                                                textAlign: 'center',
                                                                mt: '4px'
                                                            }}
                                                        >
                                                            Total de registros:
                                                        </Typography>
                                                    )}

                                                </Box>

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

                                            {columns.length > 0 && showColumnOptions && (

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {/* Seleccionar hoja */}
                                                    <Box>
                                                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', mb: 1 }}>
                                                            Seleccionar hoja
                                                        </Typography>
                                                        <FormControl fullWidth size="small">
                                                            <Select
                                                                displayEmpty
                                                                value={selectedSheet}
                                                                onChange={handleSheetChange}
                                                                sx={{ borderRadius: '8px' }}
                                                                renderValue={(selected) =>
                                                                    selected ? (
                                                                        <span style={{
                                                                            fontSize: "12px",
                                                                            fontFamily: "Poppins",
                                                                            color: "#645E60"
                                                                        }}>
                                                                            {selected}
                                                                        </span>
                                                                    ) : (
                                                                        <span style={{
                                                                            fontSize: "12px",
                                                                            fontFamily: "Poppins",
                                                                            color: "#645E60",
                                                                            opacity: 0.8
                                                                        }}>
                                                                            Seleccionar hoja
                                                                        </span>
                                                                    )
                                                                }
                                                            >
                                                                {sheetNames.map((name, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={name}
                                                                        sx={{
                                                                            fontSize: '12px',
                                                                            fontFamily: 'Poppins',
                                                                            color: '#645E60',
                                                                            opacity: 0.8,
                                                                            '&:hover': {
                                                                                backgroundColor: '#F2EBED', // 💥 color al pasar el mouse
                                                                            },
                                                                            '&.Mui-selected': {
                                                                                backgroundColor: '#F2EBED',
                                                                            },
                                                                            '&.Mui-selected:hover': {
                                                                                backgroundColor: '#F2EBED',
                                                                            }
                                                                        }}
                                                                    >
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>


                                                    </Box>

                                                    {/* Seleccionar columnas */}

                                                    <Box>
                                                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', mb: 1, color: '#330F1B' }}>
                                                            Seleccionar columnas
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    displayEmpty
                                                                    value={selectedDatoCol}
                                                                    onChange={(e) => setSelectedTelefonoCol(e.target.value)}
                                                                    sx={{ borderRadius: '8px' }}
                                                                    renderValue={(selected) =>
                                                                        selected ? (
                                                                            <span style={{
                                                                                fontSize: "12px",
                                                                                fontFamily: "Poppins",
                                                                                color: "#645E60"
                                                                            }}>
                                                                                {selected}
                                                                            </span>
                                                                        ) : (
                                                                            <span style={{
                                                                                fontSize: "12px",
                                                                                fontFamily: "Poppins",
                                                                                color: "#645E60",
                                                                                opacity: 0.8
                                                                            }}>
                                                                                Seleccionar columna 1
                                                                            </span>
                                                                        )
                                                                    }
                                                                >
                                                                    {columns
                                                                        .filter((col) => col !== selectedTelefonoCol)
                                                                        .map((col, idx) => (
                                                                            <MenuItem
                                                                                key={idx}
                                                                                value={col}
                                                                                sx={{
                                                                                    fontSize: '12px',
                                                                                    fontFamily: 'Poppins',
                                                                                    color: '#645E60',
                                                                                    opacity: 0.8,
                                                                                    '&:hover': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    },
                                                                                    '&.Mui-selected': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    },
                                                                                    '&.Mui-selected:hover': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {col}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </FormControl>


                                                            {/* Columna de teléfono */}
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    displayEmpty
                                                                    value={selectedTelefonoCol}
                                                                    onChange={(e) => setSelectedDatoCol(e.target.value)}
                                                                    sx={{ borderRadius: '8px' }}
                                                                    renderValue={(selected) =>
                                                                        selected ? (
                                                                            <span style={{
                                                                                fontSize: "12px",
                                                                                fontFamily: "Poppins",
                                                                                color: "#645E60"
                                                                            }}>
                                                                                {selected}
                                                                            </span>
                                                                        ) : (
                                                                            <span style={{
                                                                                fontSize: "12px",
                                                                                fontFamily: "Poppins",
                                                                                color: "#645E60",
                                                                                opacity: 0.8
                                                                            }}>
                                                                                Seleccionar columna 2
                                                                            </span>
                                                                        )
                                                                    }
                                                                >
                                                                    <MenuItem disabled value=""></MenuItem>
                                                                    {columns
                                                                        .filter((col) => col !== selectedDatoCol)
                                                                        .map((col, idx) => (
                                                                            <MenuItem
                                                                                key={idx}
                                                                                value={col}
                                                                                sx={{
                                                                                    fontSize: '12px',
                                                                                    fontFamily: 'Poppins',
                                                                                    color: '#645E60',
                                                                                    opacity: 0.8,
                                                                                    '&:hover': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    },
                                                                                    '&.Mui-selected': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    },
                                                                                    '&.Mui-selected:hover': {
                                                                                        backgroundColor: '#F2EBED',
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {col}
                                                                            </MenuItem>
                                                                        ))}

                                                                </Select>
                                                            </FormControl>
                                                            <Box mt={-1} mb={0}>
                                                                {/* Checkbox Omitir encabezados */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={omitHeaders}
                                                                            onChange={(e) => setOmitHeaders(e.target.checked)}
                                                                            sx={{
                                                                                color: '#7B354D',
                                                                                '&.Mui-checked': {
                                                                                    color: '#7B354D',
                                                                                },
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography sx={{ color: '#574B4FCC', fontSize: '16px', fontFamily: 'Poppins' }}>
                                                                            Omitir encabezados de columna
                                                                        </Typography>
                                                                    }
                                                                />

                                                                {/* Select filtrado de teléfonos */}
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: '16px',
                                                                        color: '#330F1B',
                                                                        fontFamily: 'Poppins',
                                                                        mt: 1,
                                                                        mb: 1,
                                                                    }}
                                                                >
                                                                    Seleccionar filtrado de teléfonos
                                                                </Typography>

                                                                <FormControl fullWidth size="small">
                                                                    <Select
                                                                        value={telefonoFilter}
                                                                        onChange={(e) => setTelefonoFilter(e.target.value)}
                                                                        displayEmpty
                                                                        sx={{ borderRadius: '8px' }}
                                                                        renderValue={(selected) =>
                                                                            selected ? (
                                                                                <span style={{ fontSize: "12px", fontFamily: "Poppins", color: "#645E60" }}>
                                                                                    {selected === "verificar" ? "Verificar" : "Limpiar"}
                                                                                </span>
                                                                            ) : (
                                                                                <span style={{ fontSize: "12px", fontFamily: "Poppins", color: "#645E60", opacity: 0.8 }}>
                                                                                    Seleccionar filtro
                                                                                </span>
                                                                            )
                                                                        }
                                                                    >
                                                                        <MenuItem
                                                                            value="limpiar"
                                                                            sx={{
                                                                                fontSize: '12px',
                                                                                fontFamily: 'Poppins',
                                                                                color: '#645E60',
                                                                                opacity: 0.8,
                                                                                '&:hover': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                },
                                                                                '&.Mui-selected': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                },
                                                                                '&.Mui-selected:hover': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                }
                                                                            }}
                                                                        >
                                                                            Limpiar
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            value="verificar"
                                                                            sx={{
                                                                                fontSize: '12px',
                                                                                fontFamily: 'Poppins',
                                                                                color: '#645E60',
                                                                                opacity: 0.8,
                                                                                '&:hover': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                },
                                                                                '&.Mui-selected': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                },
                                                                                '&.Mui-selected:hover': {
                                                                                    backgroundColor: '#F2EBED',
                                                                                }
                                                                            }}
                                                                        >
                                                                            Verificar
                                                                        </MenuItem>
                                                                    </Select>
                                                                </FormControl>

                                                            </Box>

                                                        </Box>
                                                    </Box>

                                                </Box>
                                            )}

                                        </Box>

                                    )}
                                    {manageOperation === 'eliminar' && (
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'flex-start' }}>
                                            <Box>

                                                <DropZone
                                                    onDrop={handleManageFile}
                                                    file={uploadedFile}
                                                    fileError={fileError}
                                                    fileSuccess={fileSuccess}
                                                    helperText="Arrastre un archivo aquí, o selecciónelo."
                                                    acceptedFiles=".xlsx"
                                                />
                                            </Box>

                                            {!uploadedFileBase64 && (
                                                <>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography fontWeight={600} fontSize="16px" mb={1} fontFamily={'Poppins'}>
                                                            O seleccionar archivos actuales
                                                        </Typography>
                                                        <Paper
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 2,
                                                                borderColor: '#D9B4C3',
                                                                maxHeight: 180,
                                                                overflowY: 'auto',
                                                                p: 1,
                                                            }}
                                                        >
                                                            <List dense>
                                                                {BlackList.map((bl) => (
                                                                    <ListItem
                                                                        key={bl.id}
                                                                        sx={{
                                                                            px: 1,
                                                                            color: selectedBlackList?.id === bl.id ? '#8F4E63' : '#330F1B',
                                                                            fontFamily: 'Poppins',
                                                                        }}
                                                                        disablePadding
                                                                    >
                                                                        <ListItemButton onClick={() => setSelectedBlackListName(bl.name)} dense>
                                                                            <Checkbox
                                                                                edge="start"
                                                                                tabIndex={-1}
                                                                                disableRipple
                                                                                checked={selectedBlackListName === bl.name}
                                                                                sx={{
                                                                                    color: '#8F4E63',
                                                                                    '&.Mui-checked': {
                                                                                        color: '#8F4E63',
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                                <ListItemText
                                                                                    primary={bl.name}
                                                                                    primaryTypographyProps={{
                                                                                        fontFamily: 'Poppins',
                                                                                        fontSize: '16px',
                                                                                        color: '#786E71',
                                                                                    }}
                                                                                />
                                                                                <img
                                                                                    src={IconEyeOpen}
                                                                                    alt="Ver"
                                                                                    style={{ width: 24, height: 24 }}
                                                                                />
                                                                            </Box>
                                                                        </ListItemButton>
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Paper>
                                                    </Box>
                                                </>
                                            )}

                                            {uploadedFileBase64 && (
                                                <Box mt={0} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', mb: 1 }}>
                                                        Seleccionar hoja
                                                    </Typography>
                                                    <Select
                                                        fullWidth
                                                        value={selectedSheet}
                                                        onChange={handleSheetChange}
                                                        displayEmpty
                                                        sx={{ fontFamily: 'Poppins', fontSize: '12px', color: "#645E60", opacity: 0.8 }}
                                                    >
                                                        <MenuItem disabled value="">Seleccione una hoja</MenuItem>
                                                        {sheetNames.map((name, index) => (
                                                            <MenuItem key={index} value={name}>
                                                                {name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>

                                                    <Typography fontSize="14px" fontWeight={600}>Seleccionar columnas</Typography>
                                                    <Select
                                                        fullWidth
                                                        value={selectedDataColumn}
                                                        onChange={(e) => setSelectedTelefonoCol(e.target.value)}
                                                        displayEmpty
                                                        sx={{ fontFamily: 'Poppins', fontSize: '14px' }}
                                                    >
                                                        <MenuItem disabled value=""></MenuItem>
                                                        {columns
                                                            .filter((col) => col !== selectedPhoneColumn)
                                                            .map((col, index) => (
                                                                <MenuItem key={index} value={col}>
                                                                    {col}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>

                                                    <Select
                                                        fullWidth
                                                        value={selectedPhoneColumn}
                                                        onChange={(e) => setSelectedDatoCol(e.target.value)}
                                                        displayEmpty
                                                        sx={{ fontFamily: 'Poppins', fontSize: '14px' }}
                                                    >
                                                        <MenuItem disabled value=""></MenuItem>
                                                        {columns
                                                            .filter((col) => col !== selectedDataColumn)
                                                            .map((col, index) => (
                                                                <MenuItem key={index} value={col}>
                                                                    {col}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>

                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={omitHeaders}
                                                                onChange={(e) => setOmitHeaders(e.target.checked)}
                                                                sx={{
                                                                    color: '#8F4E63',
                                                                    '&.Mui-checked': {
                                                                        color: '#8F4E63',
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        label={
                                                            <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#330F1B' }}>
                                                                Omitir encabezados de columna
                                                            </Typography>
                                                        }
                                                    />

                                                    <Typography fontSize="14px" fontWeight={600}>Seleccionar filtrado de teléfonos</Typography>
                                                    <Select
                                                        fullWidth
                                                        value={selectedPhoneFilter}
                                                        onChange={(e) => setSelectedPhoneFilter(e.target.value)}
                                                        displayEmpty
                                                        sx={{ fontFamily: 'Poppins', fontSize: '14px' }}
                                                    >
                                                        <MenuItem value="limpiar">Limpiar</MenuItem>
                                                        <MenuItem value="remover guiones">Remover guiones</MenuItem>
                                                        <MenuItem value="formato 10 dígitos">Formato 10 dígitos</MenuItem>
                                                    </Select>
                                                </Box>
                                            )}


                                        </Box>

                                    )}
                                    {manageOperation === 'actualizar' && (
                                        <Box display="flex" alignItems="flex-start" gap={3} mt={2} flexWrap="wrap">
                                            <Box>
                                                <DropZone
                                                    onDrop={handleManageFile}
                                                    file={uploadedFile}
                                                    fileError={fileError}
                                                    fileSuccess={fileSuccess}
                                                    helperText="Arrastre un archivo aquí, o selecciónelo."
                                                    acceptedFiles=".xlsx"
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {/* Seleccionar hoja */}
                                                <Box>
                                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', mb: 1 }}>
                                                        Seleccionar hoja
                                                    </Typography>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            displayEmpty
                                                            value={selectedSheet}
                                                            onChange={handleSheetChange}
                                                            sx={{ borderRadius: '8px' }}
                                                        >
                                                            {sheetNames.map((name, index) => (
                                                                <MenuItem key={index} value={name}>{name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                {/* Seleccionar columnas */}
                                                {columns.length > 0 && (
                                                    <Box>
                                                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', mb: 1 }}>
                                                            Seleccionar columnas
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    displayEmpty
                                                                    value={selectedDatoCol}
                                                                    onChange={(e) => setSelectedTelefonoCol(e.target.value)}
                                                                    sx={{ borderRadius: '8px' }}
                                                                >
                                                                    <MenuItem disabled value=""></MenuItem>
                                                                    {columns
                                                                        .filter((col) => col !== selectedTelefonoCol)
                                                                        .map((col, idx) => (
                                                                            <MenuItem key={idx} value={col}>{col}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </FormControl>

                                                            {/* Columna de teléfono */}
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    displayEmpty
                                                                    value={selectedTelefonoCol}
                                                                    onChange={(e) => setSelectedDatoCol(e.target.value)}
                                                                    sx={{ borderRadius: '8px' }}
                                                                >
                                                                    <MenuItem disabled value=""></MenuItem>
                                                                    {columns
                                                                        .filter((col) => col !== selectedDatoCol)
                                                                        .map((col, idx) => (
                                                                            <MenuItem key={idx} value={col}>{col}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </FormControl>
                                                            <Box mt={3}>
                                                                {/* Checkbox Omitir encabezados */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={omitHeaders}
                                                                            onChange={(e) => setOmitHeaders(e.target.checked)}
                                                                            sx={{
                                                                                color: '#7B354D',
                                                                                '&.Mui-checked': {
                                                                                    color: '#7B354D',
                                                                                },
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography sx={{ color: '#330F1B', fontSize: '14px' }}>
                                                                            Omitir encabezados de columna
                                                                        </Typography>
                                                                    }
                                                                />

                                                                {/* Select filtrado de teléfonos en actualizar*/}
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: '16px',
                                                                        color: '#330F1B',
                                                                        mt: 2,
                                                                        mb: 1,
                                                                    }}
                                                                >
                                                                    Seleccionar filtrado de teléfonos
                                                                </Typography>

                                                                <FormControl fullWidth size="small">
                                                                    <Select
                                                                        value={telefonoFilter}
                                                                        onChange={(e) => setTelefonoFilter(e.target.value)}
                                                                        displayEmpty
                                                                        sx={{ borderRadius: '8px' }}
                                                                    >
                                                                        <MenuItem value="">Limpiar</MenuItem>
                                                                        <MenuItem value="10">Verificar</MenuItem>
                                                                        {/* Agrega más reglas si las tienes definidas */}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>

                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>


                                        </Box>
                                    )}
                                </>
                            )}
                            {manageOperation !== 'actualizar' && (

                                <Box
                                    sx={{
                                        flex: 1,
                                        px: 4,
                                        mt: 2,
                                        mb: 1,
                                        maxHeight: 'calc(90vh - 180px)', // o lo que uses
                                        overflowX: 'hidden', // 🔥 Esto evita scroll lateral
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginLeft={'-30px'} opacity={manageByList ? 0.4 : 1}
                                        border={'1px solid #E6E4E4'} borderRdius={'6px'} width={'530px'} height={'57px'} borderRadius={'6px'} pointerEvents={manageByList ? 'none' : 'auto'}

                                    >
                                        <Typography fontSize="18px" fontFamily={"Poppins"} marginLeft={'16px'}>Por registro individual</Typography>
                                        <Switch
                                            checked={manageByIndividual}
                                            onChange={() => {
                                                const newValue = !manageByIndividual;
                                                setManageByIndividual(newValue);
                                                if (newValue) {
                                                    setManageByList(false);
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                            {manageByIndividual && (
                                <Box mt={-2} ml={2.5}>
                                    <Typography sx={{
                                        fontFamily: 'Poppins', fontSize: '16px',
                                        fontWeight: 500, mb: 1, color: '#574B4F'
                                    }}>
                                        Teléfono(s)
                                    </Typography>

                                    <Box
                                        sx={{
                                            maxHeight: '160px',
                                            overflowY: 'auto',
                                            pr: 1,
                                            display: 'flex',
                                            flexDirection: 'column',

                                            gap: 1
                                        }}
                                    >
                                        {individualPhones.map((phone, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <TextField
                                                    value={phone}
                                                    onChange={(e) => {
                                                        const numericValue = e.target.value.replace(/\D/g, '');
                                                        handleIndividualPhoneChange(index, numericValue);
                                                    }}
                                                    placeholder="5255..."
                                                    sx={{
                                                        width: '232px',
                                                        height: '54px',
                                                        '& .MuiInputBase-root': {
                                                            height: '54px',
                                                        },
                                                        '& input': {
                                                            height: '54px',
                                                            boxSizing: 'border-box',
                                                            fontFamily: 'Poppins',
                                                            fontSize: '14px',
                                                        }
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Tooltip
                                                                    title={
                                                                        <Box
                                                                            sx={{
                                                                                backgroundColor: "#FFFFFF",
                                                                                borderRadius: "8px",
                                                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                                                padding: "8px 12px",
                                                                                fontSize: "14px",
                                                                                fontFamily: "Poppins",
                                                                                color: "#000000",
                                                                                whiteSpace: "pre-line",
                                                                                transform: "translate(2px, -15px)",
                                                                                borderColor: "#00131F3D",
                                                                                borderStyle: "solid",


                                                                            }}
                                                                        >
                                                                            <>
                                                                                Teléfono válido de 10 dígitos
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
                                                                    <img src={infoicon} alt="info" style={{ width: 24, height: 24 }} />
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />

                                                {index === individualPhones.length - 1 && individualPhones.length < 5 && (
                                                    <Tooltip title="Agregar número" arrow placement="top"
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
                                                                        offset: [-20, -7] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                                                    }
                                                                }
                                                            ]
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 21,
                                                                height: 21,
                                                                backgroundColor: "#6F565E",
                                                                borderRadius: "50%", // 🔥 clave para hacerlo circular
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <IconButton onClick={handleAddIndividualPhone}>
                                                                <img
                                                                    src={IconPlus2}
                                                                    alt="Agregar teléfono"
                                                                    style={{ width: 21, height: 21, }}
                                                                />
                                                            </IconButton>
                                                        </Box>
                                                    </Tooltip>

                                                )}

                                                {index > 0 && (
                                                    <Tooltip title="Eliminar teléfono">
                                                        <IconButton onClick={() => handleRemoveIndividualPhone(index)}>
                                                            <img src={Thrashicon} alt="Eliminar" style={{ width: 24, height: 24 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}



                        </Box>
                    </Box>

                    <Divider sx={{ width: 'calc(100% + 64px)', marginLeft: '-32px', mt: 2, mb: 1 }} />

                    <Box sx={{
                        px: 3,
                        py: 1,
                        display: 'flex',
                        justifyContent: 'space-between',

                    }}>
                        <SecondaryButton onClick={() => setIsManageModalOpen(false)} text='Cancelar'

                        />
                        <MainButton
                            onClick={handleSendToServer}
                            text='Guardar cambios'
                            disabled={
                                !(
                                    (fileSuccess && selectedSheet !== '') ||
                                    formData.Phones.some(p => p.trim().length === 10)
                                )
                            }
                        />


                    </Box>
                </Box>
            </Modal>


            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        fontFamily: 'Poppins',

                    }
                }}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    openEditModal(selectedBlackList);
                }}
                    sx={{
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        '&:hover': {
                            backgroundColor: '#F2EBED'  // 👈 Fondo al pasar el mouse
                        }
                    }}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1, color: '#7B354D', width: 24, height: 24 }} />
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>

                        Editar
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    if (selectedBlackList) {
                        console.log("✅ Abriendo modal para:", selectedBlackList.name);
                        openInspectModal(selectedBlackList);
                    } else {
                        console.warn("⚠ No se encontró lista seleccionada.");
                    }

                }}
                    sx={{
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        '&:hover': {
                            backgroundColor: '#F2EBED'  // 👈 Fondo al pasar el mouse
                        }
                    }}
                >
                    <VisibilityIcon fontSize="small" sx={{ mr: 1, color: '#7B354D', width: 24, height: 24 }} />
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>
                        Inspeccionar
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    setSelectedBlackList(selectedBlackList); // pasa el objeto de la lista
                    setIsManageModalOpen(true);

                }}
                    sx={{
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        '&:hover': {
                            backgroundColor: '#F2EBED'  // 👈 Fondo al pasar el mouse
                        }
                    }}
                >
                    <ListIcon fontSize="small" sx={{ mr: 1, color: '#7B354D', width: 24, height: 24 }} />
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>Gestionar registros</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {

                        handleOpenDeleteModal(selectedBlackList);

                        handleMenuClose();
                    }}
                    disabled={selectedBlackList?.hasActiveCampaign}
                    sx={{
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        '&:hover': {
                            backgroundColor: '#F2EBED'  // 👈 Fondo al pasar el mouse
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <img
                            src={Thrashicon}
                            alt="Eliminar"
                            style={{ width: 24, height: 24 }}
                        />
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>
                            Eliminar
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>


        </div >
    );
};

export default BlackList;
