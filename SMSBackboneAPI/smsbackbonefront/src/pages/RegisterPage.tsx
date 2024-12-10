import { useState, useContext, useEffect, ChangeEvent } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { AppContext } from '../hooks/useContextInitialState';
import axios, { AxiosError } from 'axios';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import ButtonLoadingSubmit from '../components/commons/ButtonLoadingSubmit';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import { Divider, Modal, Fade, Backdrop } from '@mui/material';
import PublicLayout from '../components/PublicLayout';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
type RegisterUser = {
    name: string;
    lastname: string;
    phone: string;
    birthday: Dayjs | null;
    gender: number;
    email: string;
    password: string;
    termAndConditions: boolean;
};

type AccountInfo = {
    name: string;
    website: string;
};

type errorObj = {
    code: string;
    description: string;
};

const Register: React.FC = () => {
    const { setContextState } = useContext(AppContext);
    const [formData, setFormData] = useState({
        client: '',
        firstName: '',
        lastName: '',
        phone: '',
        extension: '',
        email: '',
        emailConfirmation: '',
        sms: false,
        llamada: false,
    });

    const [accountInfoObj, setAccountInfoObj] = useState<AccountInfo>({
        name: '',
        website: '',
    });
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [messageAlerts, setMessageAlerts] = useState<string[]>([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [phone, setPhone] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [errormail, setErrormail] = useState<boolean>(false);
    const [emailconfirmation, setEmailemailconfirmation] = useState<string>("");
    const [errormailconfirmation, setErrormailconfirmation] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        phone: false,
        email: false,
        emailConfirmation: false,
    });


    useEffect(() => {
        const token = localStorage.getItem('token');

        const isLogin = !!token;

        if (isLogin) {
            navigate('/');
        }
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('token');

        const isLogin = !!token;

        if (isLogin) {
            navigate('/');
        }
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessageAlerts([]);

        try {
            const data = {
                client: formData.client,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                extension: formData.extension,
                emailConfirmation: formData.emailConfirmation,
                sms: formData.sms,
                llamada: formData.llamada
            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };
            const response = await axios.post(
                `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_REGISTER_ACCOUNT_ENDPOINT
                }`,
                data,
                { headers },
            );

            console.log(`Response: ${response}`);
            if (response.status === 200) {
                localStorage.setItem('userData', JSON.stringify(response.data));
                navigate('/chooseroom'); 
                setLoading(false);
                console.log('-----------------');
                console.log(response.data);
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                if (axiosError.response) {
                    console.log('Error de respuesta:', axiosError.response);
                    console.log('Código de estado:', axiosError.response.status);
                    const codes = axiosError.response.data as Array<errorObj>;

                    codes.forEach((codeObj) => {
                        switch (codeObj.code) {
                            case 'PasswordTooShort':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'La contraseña debe tener al menos 6 caracteres.',
                                ]);
                                break;
                            case 'PasswordRequiresNonAlphanumeric':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'La contraseña debe tener al menos un carácter no alfanumérico.',
                                ]);
                                break;
                            case 'PasswordRequiresDigit':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    "La contraseña debe tener al menos un dígito ('0'-'9').",
                                ]);
                                break;
                            case 'PasswordRequiresUpper':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    "La contraseña debe tener al menos una letra mayúscula ('A'-'Z').",
                                ]);
                                break;
                            case 'PasswordRequiresLower':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    "La contraseña debe tener al menos una letra minúscula ('a'-'z').",
                                ]);
                                break;
                            case 'DuplicateUserName':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'El correo electrónico ya está en uso.',
                                ]);
                                break;
                            case 'InvalidEmail':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'El formato o sintaxis del correo electrónico no es correcto.',
                                ]);
                                break;
                            case 'UnverifiedEmail':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'El dominio no existe o no tiene registro MX.',
                                ]);
                                break;
                            case 'ConfirmationUnsent':
                                setMessageAlerts((prevState) => [
                                    ...prevState,
                                    'No se pudo enviar el correo electrónico de confirmación.',
                                ]);
                                break;
                        }
                    });
                    setOpenAlert(true);
                } else {
                    console.log('Error de solicitud:', axiosError.message);
                    setMessageAlerts(['Error de solicitud: ' + axiosError.message]);
                    setOpenAlert(true);
                }
            } else {
                console.log('Error de conexión en el servidor -> ', error);
                setMessageAlerts(['Ocurrio un error de conexión con el servidor']);
                setOpenAlert(true);
            }
        }
    };



    const isFormValid = () => {
        const requiredFields = ['client', 'firstName', 'lastName', 'phone', 'email', 'emailConfirmation'];
        const allFieldsFilled = requiredFields.every((field) => formData[field].trim() !== '');
        const noErrors = !Object.values(errors).some((error) => error);
        return allFieldsFilled && noErrors;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Validar correos y teléfono
        const newErrors = { ...errors };
        if (name === 'email' || name === 'emailConfirmation') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            newErrors[name] = !emailRegex.test(value);
        }
        if (name === 'phone') {
            newErrors.phone = !/^\d{10}$/.test(value);
        }

        setErrors(newErrors);
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleOpenModal = () => {
        setModalOpen(true); // Abre el modal
    };

    const handleModalClose = () => {
        setModalOpen(false); // Cierra el modal
    };


    return (
        <PublicLayout>
            <Container maxWidth="md">
                <Box mt={4}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Registro
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888", marginBottom: 3 }}>
                        <span style={{ fontWeight: "bold" }}>*</span> Los campos con asterisco son obligatorios.
                    </Typography>
                    <Divider sx={{ marginBottom: 3 }} />
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: "12px" }}>
                        <Grid container spacing={2}>
                            {/* Client - Solo en la parte superior */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Cliente"
                                    name="client"
                                    value={formData.client}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Solo caracteres alfabéticos<br />
                                                            - Longitud máxima de 40 caracteres
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Espacio para separación */}
                            <Grid item xs={12} />

                            {/* Name and Last Name */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Nombre"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Solo caracteres alfabéticos<br />
                                                            - Longitud máxima de 40 caracteres
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Apellido Paterno"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Solo caracteres alfabéticos<br />
                                                            - Longitud máxima de 40 caracteres
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Phone and Extension */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Teléfono"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={errors.phone}
                                    helperText={errors.phone ? "Debe tener 10 dígitos" : ""}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Solo caracteres numéricos<br />
                                                            - Longitud exacta de 10 caracteres
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Extensión"
                                    name="extension"
                                    value={formData.extension}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Solo caracteres numéricos<br />
                                                            - Longitud máxima de 5 caracteres
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{
                                        maxLength: 5,
                                    }}
                                />
                            </Grid>

                            {/* Email and Email Confirmation */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Correo Electrónico"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={errors.email}
                                    helperText={errors.email ? "Ingrese un correo válido" : ""}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Debe contener un formato válido<br />
                                                            - Ejemplo: usuario@dominio.com
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Confirmar Correo Electrónico"
                                    name="emailConfirmation"
                                    value={formData.emailConfirmation}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={errors.emailConfirmation}
                                    helperText={errors.emailConfirmation ? "Ingrese un correo válido" : ""}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <>
                                                            - Debe coincidir con el correo electrónico<br />
                                                            - Ejemplo: usuario@dominio.com
                                                        </>
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Services */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    Servicios<span style={{ color: "red" }}>*</span>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.sms}
                                                onChange={(e) =>
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        sms: e.target.checked,
                                                    }))
                                                }
                                            />
                                        }
                                        label="SMS"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.llamada}
                                                onChange={(e) =>
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        llamada: e.target.checked,
                                                    }))
                                                }
                                            />
                                        }
                                        label="Llamada"
                                    />
                                </Box>
                            </Grid>

                            {/* Buttons */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between">
                                    <Button variant="outlined" color="secondary">
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!isFormValid()}
                                        onClick={handleOpenModal}
                                    >
                                        Registrarse
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                    </Paper>
                </Box>
                {/* Modal de términos y condiciones */}
                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={modalOpen}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: '12px',
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                Términos y condiciones
                            </Typography>
                            <Divider sx={{ marginBottom: 3 }} />
                            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {/* Contenido de los términos y condiciones */}
                                <Typography variant="body1" paragraph>
                                    Aparte del crédito disponible en su cuenta, no establecemos un tope en el número de
                                    mensajes que puede enviar a través de nuestro servicio...
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {/* Más texto aquí */}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={3}>
                                <Button variant="outlined" onClick={handleModalClose}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Aceptar
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Container>
        </PublicLayout>
    );
};
export default Register;
