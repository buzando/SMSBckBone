﻿import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress, IconButton, Menu, MenuItem, Tooltip, Modal, Divider } from "@mui/material";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../components/commons/CSS/DatePicker.css';
import { es } from 'date-fns/locale';
import MainButton from '../components/commons/MainButton'
import SecondaryButton from '../components/commons/SecondaryButton'
import DatePicker from '../components/commons/DatePicker';
import { format } from 'date-fns';
import boxclose from '../assets/Nousers.svg'
import axios from 'axios';
import boxopen from '../assets/NoResultados.svg'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EyeIcon from '../assets/eye-icon.svg';
import DownloadIcon from '../assets/download-icon.svg';
import ModalError from '../components/commons/ModalError'
import Snackbar from '../components/commons/ChipBar'
interface Historic {
    id: number,
    quantityMoney: number,
    Client: string,
    RechargeDate: Date,
    PaymentMethod: string,
    Estatus: string,
}

const PaymentHistoric: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedDates, setSelectedDates] = useState<{ start: Date, end: Date, startHour: number, startMinute: number, endHour: number, endMinute: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [Historic, setHistoric] = useState<Historic | null | undefined>(undefined);
    const [selectedRecarga, setSelectedRecarga] = useState<number | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const invoiceData = {
        name: "Nuxiba",
        rfc: "VECJ880326",
        postalCode: "45678",
        fiscalRegime: "Régimen ejemplo",
        description: "Régimen ejemplo",
        credits: "8,000",
        unitPrice: "$0.10",
        totalCost: "$0.10",
    };
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [TitleErrorModal, setTitleErrorModal] = useState('');
    const [BodyErrorModal, setBodyErrorModal] = useState('');

    const formatDateRange = () => {
        if (!selectedDates) return 'FECHA'; // Muestra "FECHA" si no hay fechas seleccionadas
        return `${format(selectedDates.start, "dd MMM", { locale: es })}, ${String(selectedDates.startHour).padStart(2, '0')}:${String(selectedDates.startMinute).padStart(2, '0')} - ${format(selectedDates.end, "d MMM", { locale: es })} ${String(selectedDates.endHour).padStart(2, '0')}:${String(selectedDates.endMinute).padStart(2, '0')}`;
    };

    const handleDateSelectionApply = async (start: Date, end: Date, startHour: number, startMinute: number, endHour: number, endMinute: number) => {
        setSelectedDates({ start, end, startHour, startMinute, endHour, endMinute });
        setDatePickerOpen(false);
        setAnchorEl(null);
        setLoading(true);
        try {
            const usuario = localStorage.getItem("userData");
            const obj = usuario ? JSON.parse(usuario) : null;

            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_RECHARGE}`;
            const payload = {
                FechaInicio: start?.toISOString(), // Formato ISO 8601
                FechaFin: end?.toISOString(),
                IdUser: obj.id
            };

            const response = await axios.post(requestUrl, payload);

            if (response.status === 200 && response.data.length > 0) {
                setHistoric(response.data);
            } else {
                setHistoric(null);
            }
        } catch {
            setHistoric(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget); // Asegurar que el anchor es el botón de fecha
        setDatePickerOpen(true);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRecarga(null);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number, paymentMethod: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecarga(id);
        setSelectedPaymentMethod(paymentMethod); // Guarda el método de pago seleccionado
    };

    const handleAsyncAction = async (actionType: 'Consultar' | 'Descargar') => {
        try {
            setLoading(true); // Simula la carga

            // Simular una llamada a la API con un retraso de 2 segundos
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simular error para probar el modal
            throw new Error(`Error al intentar ${actionType.toLowerCase()} la factura`);

        } catch {
            if (actionType == 'Consultar') {
                setTitleErrorModal(`Error al consultar Factura`);
                setBodyErrorModal('La factura que desea consultar no existe.');
            }
            if (actionType == 'Descargar') {
                setTitleErrorModal('Error al descargar factura');
                setBodyErrorModal('La factura que desea descargar no existe.');
            }
            
            setIsErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', marginTop: '-70px', marginLeft: "35px" }}>
            <th
                style={{
                    textAlign: 'left',
                    fontFamily: 'Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1,
                    fontSize: '26px',
                    fontWeight: "600",

                }}
            >
                Historial de pago
            </th>
            <Divider sx={{ marginBottom: "17px", marginTop: "16px" }} />
            <Button
                variant="outlined"
                sx={buttonStyle}
                onClick={handleDateClick}
            >
                {formatDateRange()}
            </Button>
            <DatePicker
                open={datePickerOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                onApply={handleDateSelectionApply}
                onClose={() => setAnchorEl(null)}
            />

            <Divider sx={{ marginBottom: "17px", marginTop: "16px" }} />

            {/* Lógica para mostrar el contenido correcto */}
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
            ) : Historic === undefined ? (
                // Imagen de caja cerrada cuando NO se ha seleccionado ninguna fecha
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
                    <img src={boxclose} alt="No data" style={{ width: '150px', height: '150px' }} />
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
                        Seleccione un período para comenzar.
                    </Typography>
                </Box>
            ) : Historic === null ? (
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
                    <img src={boxopen} alt="No results" style={{ width: '150px', height: '150px' }} />
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
            ) : (
                <Box
                    sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E6E4E4',
                        borderRadius: '8px',
                        width: '100%',
                        padding: '20px',
                        marginTop: '20px',
                        overflowX: 'auto'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        {/* Encabezados */}
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E6E4E4' }}>
                                <th style={{
                                    width: '200px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    
                                }}>
                                    Fecha
                                </th>
                                <th style={{
                                    width: '200px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    Cliente
                                </th>
                                <th style={{
                                    width: '150px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    ID de pago
                                </th>
                                <th style={{
                                    width: '150px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    Cantidad
                                </th>
                                <th style={{
                                    width: '250px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    Métodos de pago
                                </th>
                                <th style={{
                                    width: '150px',
                                    textAlign: 'left',
                                    padding: '10px',
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0px',
                                    color: '#330F1B',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    Estatus
                                </th>
                            </tr>
                        </thead>

                        {/* Datos */}
                        <tbody>
                            {Historic.map((recarga, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E6E4E4' }}>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {new Date(recarga.rechargeDate).toLocaleString()}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.client}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.id}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        ${recarga.quantityMoney.toLocaleString()}
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        <Tooltip title={recarga.paymentMethod} arrow>
                                            <span style={truncatedStyle}>
                                                {recarga.paymentMethod.split('-')[0]} - ...
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td style={{
                                        padding: '10px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#000000',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {recarga.estatus}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>
                                        <IconButton onClick={(event) => handleMenuClick(event, recarga.id, recarga.paymentMethod)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Menú de opciones */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        <MenuItem style={menuItemStyle} onClick={() => {
                            setIsInvoiceModalOpen(true);
                            handleClose();
                        }} >
                            Generar Factura
                        </MenuItem>
                        <MenuItem onClick={() => { handleAsyncAction('Consultar'); handleClose(); }} style={menuItemStyle}disabled>
                            <img src={EyeIcon} alt="Consultar" style={iconStyle}/>
                            Consultar Factura
                        </MenuItem>
                        <MenuItem onClick={() => { handleAsyncAction('Descargar'); handleClose(); }} style={menuItemStyle}disabled>
                            <img src={DownloadIcon} alt="Descargar" style={iconStyle} />
                            Descargar Factura
                        </MenuItem>

                    </Menu>
                </Box>
            )}


            <Modal open={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '130px',
                    left: '415px',
                    width: '556px',
                    height: '520px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: 24,
                }}>
                    <Typography sx={{
                        textAlign: 'left',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '54px',
                        letterSpacing: '0px',
                        color: '#574B4F',
                        opacity: 1,
                    }}>
                        Datos de Factura
                    </Typography>
                    <Divider sx={{ margin: '10px 0' }} />

                    <Box sx={{
                        backgroundColor: '#F5F4F4',
                        padding: '15px',
                        borderRadius: '5px',
                        textAlign: 'left',
                        fontSize: '16px',
                        color: '#6a6a6a'
                    }}>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Nombre o razón social:</strong> {invoiceData.name}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>RFC:</strong> {invoiceData.rfc}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Código postal:</strong> {invoiceData.postalCode}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Régimen fiscal:</strong> {invoiceData.fiscalRegime}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Descripción de los bienes o servicios:</strong> {invoiceData.description}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Créditos:</strong> {invoiceData.credits}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Precio unitario:</strong> {invoiceData.unitPrice}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px', }}><strong>Costo total:</strong> {invoiceData.totalCost}</Typography>
                        <Typography sx={{ marginBottom: '10px', fontFamily: 'Poppins', fontSize: '16px' }}>
                            <strong>Método de pago:</strong> {selectedPaymentMethod ?? 'No disponible'}
                        </Typography>
                    </Box>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <SecondaryButton text='Cancelar' onClick={() => setIsInvoiceModalOpen(false)} />
                        <MainButton text='Aceptar' disabled={true} onClick={() => {
                            setIsInvoiceModalOpen(false); // Cierra el modal  
                        }} />
                    </Box>
                </Box>
            </Modal>

            <ModalError
                isOpen={isErrorModalOpen}
                title={TitleErrorModal}
                message={BodyErrorModal}
                buttonText="Cerrar"
                onClose={() => setIsErrorModalOpen(false)}
            />
        </div>
    );
};

const buttonStyle = {
    fontFamily: 'Poppins, sans-serif',
    background: '#F6F6F6',
    border: '1px solid #C6BFC2',
    borderRadius: '18px',
    padding: '8px 16px',
    fontWeight: 'bold',
    color: '#8F4D63',
    textTransform: 'none',
    opacity: 1,
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
    width: '200px',
    textAlign: 'left',
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    letterSpacing: '0px',
    color: '#330F1B',
    fontSize: '13px',
    backgroundColor: '#FFFFFF'
};

const tdStyle = {
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    color: '#000000',
    textAlign: 'left'
};

const menuItemStyle = {
    fontFamily: 'Poppins, sans-serif', // ✅ Aplica la fuente correcta
    fontSize: '14px', // ✅ Tamaño de fuente 14px
    color: '#675C60' // ✅ Color del texto
};

const truncatedStyle = {
    display: 'inline-block',
    maxWidth: '200px', // ✅ Ajusta el ancho según sea necesario
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
};
const iconStyle = {
    width: '18px',
    height: '18px',
    marginRight: '10px' // Para que haya espacio entre el icono y el texto
};


export default PaymentHistoric;
