﻿import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, MenuItem, Typography, Paper } from '@mui/material';
import SecondaryButton from '../components/commons/SecondaryButton';
import MainButton from '../components/commons/MainButton';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import ChipBar from "../components/commons/ChipBar";
import ModalError from "../components/commons/ModalError"
import MainModal from "../components/commons/MainModal"
import { useNavigate } from 'react-router-dom';

const BillingInformation: React.FC = () => {
    const navigate = useNavigate();

    const [businessName, setBusinessName] = useState('');
    const [rfc, setRfc] = useState('');
    const [taxRegime, setTaxRegime] = useState('');
    const [cfdi, setCfdi] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [rfcError, setRfcError] = useState(false);
    const [postalCodeError, setPostalCodeError] = useState(false);
    const [businessNameError, setBusinessNameError] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [Modal, setModal] = useState(false);
    const [errors] = useState({
        businessName: false,
        rfc: false,
        taxRegime: false,
        cfdi: false,
        postalCode: false,
    });
    const [showChipBarAdd, setshowChipBarAdd] = useState(false);
    const handleSave = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }
        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_USERS_BILLING}`;
            const Billing = {
                Email: obj.userName,
                BusinessName: businessName,
                taxRegime: taxRegime,
                TaxId: rfc,
                Cfdi: cfdi,
                PostalCode: postalCode,
            };

            const response = await axios.post(requestUrl, Billing);

            if (response.status === 200) {
                setshowChipBarAdd(true);
                setTimeout(() => setshowChipBarAdd(false), 3000);

            }
        } catch {
            setErrorModal(true);
        }
    };

    useEffect(() => {
        const fetchBillingData = async () => {
            const usuario = localStorage.getItem("userData");
            if (!usuario) {
                navigate('/Login'); 
                return;
            }
            const obj = JSON.parse(usuario);
            if (!obj?.userName) {
                navigate('/Login');
                return;
            }
            try {
                const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_USERS_BILLING + obj.userName}`;
                const response = await axios.get(requestUrl);
                // Supongamos que la respuesta tiene la información en response.data
                const billingData = response.data;
                if (billingData) {
                    setBusinessName(billingData.businessName || "");
                    setRfc(billingData.taxId || "");
                    setTaxRegime(billingData.taxRegime || "");
                    setCfdi(billingData.cfdi || "");
                    setPostalCode(billingData.postalCode || "");
                }
            } catch (error) {
                console.error("Error al traer los datos de facturación", error);
            }
        };

        fetchBillingData();
    }, []);


    const handleCancel = () => {
        setBusinessName("");
        setRfc("");
        setTaxRegime("");
        setCfdi("");
        setPostalCode("");
        setModal(false);
    };

    const handleRfcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setRfc(value);

        // Regex para validar el RFC
        const rfcRegex = /^([A-ZÑ&]{3,4})?(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([A\d])?$/;
        setRfcError(!rfcRegex.test(value)); // Si no pasa el regex, se muestra error
    };

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Verificar que solo sean números y longitud de 5
        if (/^\d{0,5}$/.test(value)) {
            setPostalCode(value);
            setPostalCodeError(value.length !== 5);
        }
    };

    const validateBusinessName = (value: string) => {
        const trimmedValue = value.trim();

        if (!trimmedValue || trimmedValue.length < 3 || trimmedValue.length > 255) {
            return false; // Marca el error como true si no cumple las condiciones
        }

        const regex = /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s.,&-]*$/;
        return regex.test(trimmedValue); // Devuelve true si es válido, false si no
    };


    const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBusinessName(value);

        // Validar y actualizar el estado de error
        setBusinessNameError(!validateBusinessName(value));
    };

    return (

        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography
                style={{
                    textAlign: 'left',
                    font: 'normal normal medium 26px/55px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1,
                    fontSize: '26px',
                }}
            >
                Datos de facturación
            </Typography>
            <hr style={{ margin: '20px 0', border: '1px solid #dcdcdc' }} />
            <Paper
                elevation={3}
                style={{
                    backgroundColor: '#FFFFFF',
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '850px'  // Aquí aumentamos la altura del Paper
                }}
            >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <Typography
                            style={{
                                textAlign: 'left',
                                font: 'normal normal medium 16px/54px Poppins',
                                letterSpacing: '0px',
                                color: businessNameError ? '#D01247' : '#330F1B',
                                opacity: 1,
                                fontSize: '16px',
                                marginBottom: '4px',
                            }}
                        >
                            Nombre o razón social*
                        </Typography>
                        <TextField
                            value={businessName}
                            onChange={handleBusinessNameChange}
                            fullWidth
                            error={businessNameError}
                            helperText={businessNameError ? "Formato Invalido" : ""}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InfoIcon style={{ color: businessNameError ? '#D01247' : '#6a6a6a' }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <Typography
                            style={{
                                textAlign: 'left',
                                font: 'normal normal medium 16px/54px Poppins',
                                letterSpacing: '0px',
                                color: rfcError ? '#D01247' : '#330F1B', // Rojo si hay error, negro si es válido
                                opacity: 1,
                                fontSize: '16px',
                            }}
                        >
                            RFC*
                        </Typography>
                        <TextField
                            value={rfc}
                            onChange={handleRfcChange}
                            fullWidth
                            error={rfcError} // Marca el campo como error si no es válido
                            helperText={rfcError ? 'Formato Invalido' : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InfoIcon style={{ color: rfcError ? '#D01247' : '#6a6a6a' }} />
                                    </InputAdornment>
                                ),
                            }}
                            style={{
                                width: '400px',
                                height: '54px',
                                borderColor: rfcError ? '#D01247' : undefined, // Bordes rojos si hay error
                            }}
                            inputProps={{
                                maxLength: 13, // Limitar a 13 caracteres
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <Typography
                            style={{
                                textAlign: 'left',
                                font: 'normal normal medium 16px/54px Poppins',
                                letterSpacing: '0px',
                                color: errors.taxRegime ? '#D01247' : '#000000',
                                opacity: 1,
                                fontSize: '16px',
                            }}
                        >
                            Régimen fiscal*
                        </Typography>
                        <TextField
                            value={taxRegime}
                            onChange={(e) => setTaxRegime(e.target.value)}
                            style={{ width: '400px', height: '54px' }}
                            select
                        >
                            <MenuItem value="general">General de Ley Personas Morales</MenuItem>
                            <MenuItem value="fines_no_lucrativos">Personas Morales con Fines no Lucrativos</MenuItem>
                            <MenuItem value="sueldos_salarios">Sueldos y Salarios e Ingresos Asimilados a Salarios</MenuItem>
                            <MenuItem value="arrendamiento">Arrendamiento</MenuItem>
                            <MenuItem value="enajenacion_bienes">Régimen de Enajenación o Adquisición de Bienes</MenuItem>
                            <MenuItem value="demas_ingresos">Demás Ingresos</MenuItem>
                            <MenuItem value="incorporacion_fiscal">Régimen de Incorporación Fiscal</MenuItem>
                            <MenuItem value="actividades_empresariales">Actividades Empresariales y Profesionales</MenuItem>
                            <MenuItem value="agricolas_ganaderas">Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</MenuItem>
                            <MenuItem value="grupos_sociedades">Opcional para Grupos de Sociedades</MenuItem>
                            <MenuItem value="coordinados">Coordinados</MenuItem>
                            <MenuItem value="hidrocarburos">Hidrocarburos</MenuItem>
                            <MenuItem value="plataformas_tecnologicas">Actividades Empresariales con Ingresos a través de Plataformas Tecnológicas</MenuItem>
                            <MenuItem value="simplificado_confianza">Régimen Simplificado de Confianza</MenuItem>
                        </TextField>

                    </div>

                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <Typography
                            style={{
                                textAlign: 'left',
                                font: 'normal normal medium 16px/54px Poppins',
                                letterSpacing: '0px',
                                color: errors.cfdi ? '#D01247' : '#000000',
                                opacity: 1,
                                fontSize: '16px',
                            }}
                        >
                            CFDI*
                        </Typography>
                        <TextField
                            value={cfdi}
                            onChange={(e) => setCfdi(e.target.value)}
                            style={{ width: '400px', height: '54px' }}
                            select
                        >
                            <MenuItem value="G01">G01 - Adquisición de mercancías</MenuItem>
                            <MenuItem value="G02">G02 - Devoluciones, descuentos o bonificaciones</MenuItem>
                            <MenuItem value="G03">G03 - Gastos en general</MenuItem>
                            <MenuItem value="I01">I01 - Construcciones</MenuItem>
                            <MenuItem value="I02">I02 - Mobiliario y equipo de oficina por inversiones</MenuItem>
                            <MenuItem value="I03">I03 - Equipo de transporte</MenuItem>
                            <MenuItem value="I04">I04 - Equipo de cómputo y accesorios</MenuItem>
                            <MenuItem value="I05">I05 - Dados, troqueles, moldes, matrices y herramental</MenuItem>
                            <MenuItem value="I06">I06 - Comunicaciones telefónicas</MenuItem>
                            <MenuItem value="I07">I07 - Comunicaciones satelitales</MenuItem>
                            <MenuItem value="I08">I08 - Otra maquinaria y equipo</MenuItem>
                            <MenuItem value="D01">D01 - Honorarios médicos, dentales y gastos hospitalarios</MenuItem>
                            <MenuItem value="D02">D02 - Gastos médicos por incapacidad o discapacidad</MenuItem>
                            <MenuItem value="D03">D03 - Gastos funerarios</MenuItem>
                            <MenuItem value="D04">D04 - Donativos</MenuItem>
                            <MenuItem value="D05">D05 - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)</MenuItem>
                            <MenuItem value="D06">D06 - Aportaciones voluntarias al SAR</MenuItem>
                            <MenuItem value="D07">D07 - Primas por seguros de gastos médicos</MenuItem>
                            <MenuItem value="D08">D08 - Gastos de transportación escolar obligatoria</MenuItem>
                            <MenuItem value="D09">D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones</MenuItem>
                            <MenuItem value="D10">D10 - Pagos por servicios educativos (colegiaturas)</MenuItem>
                            <MenuItem value="P01">P01 - Por definir</MenuItem>
                        </TextField>

                    </div>
                </div>

                <div style={{ marginBottom: '20px', maxWidth: '128px' }}>
                    <Typography
                        style={{
                            textAlign: 'left',
                            font: 'normal normal medium 16px/54px Poppins',
                            letterSpacing: '0px',
                            color: postalCodeError ? '#D01247' : '#330F1B',
                            opacity: 1,
                            fontSize: '16px',
                        }}
                    >
                        Código postal*
                    </Typography>
                    <TextField
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        fullWidth
                        error={postalCodeError}
                        helperText={postalCodeError ? 'Formato Invalido' : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <InfoIcon style={{ color: postalCodeError ? '#D01247' : '#6a6a6a' }} />
                                </InputAdornment>
                            ),
                        }}
                        style={{
                            width: '128px', // Cambiar el ancho del input
                            height: '54px',
                            borderColor: postalCodeError ? '#D01247' : undefined,
                        }}
                        inputProps={{
                            maxLength: 5, // Máximo de 5 caracteres
                        }}
                    />
                </div>

                <Typography
                    style={{
                        textAlign: 'left',
                        font: 'normal normal normal 14px/22px Poppins',
                        letterSpacing: '0px',
                        color: '#330F1B',
                        opacity: 0.3,
                        fontSize: '14px',
                        marginTop: '10px',
                    }}
                >
                    *El asterisco indica los campos obligatorios.
                </Typography>
            </Paper>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '600px',
                    marginTop: '30px'
                }}
            >
                <div style={{ position: 'relative', left: '-10px' }}>
                    <SecondaryButton onClick={() => setModal(true)} text="CANCELAR" />
                </div>

                <MainButton onClick={handleSave} text="GUARDAR" />
            </div>
            {showChipBarAdd && (
                <ChipBar
                    message="Los datos de facturaciín han sido agregados correctamente"
                    buttonText="Cerrar"
                    onClose={() => setshowChipBarAdd(false)}
                />
            )}
            <ModalError
                isOpen={errorModal}
                title="Error al añadir datos de facturación"
                message="Algo salió mal. Inténtelo de nuevo o regrese más tarde."
                buttonText="Cerrar"
                onClose={() => setErrorModal(false)}
            />
            <MainModal
                isOpen={Modal}
                Title="Cancelación"
                message="¿Está seguro de que desea cancelar? los datos ingresados no serán almacenados"
                primaryButtonText="Aceptar"
                secondaryButtonText="Cancelar"
                onPrimaryClick={handleCancel}
                onSecondaryClick={() => setModal (false)}
            />
        </div>

    );
};

export default BillingInformation;
