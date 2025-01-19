import { useState, useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { AppContext } from '../hooks/useContextInitialState';
import axios, { AxiosError } from 'axios';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import ButtonLoadingSubmit from '../components/commons/ButtonLoadingSubmit';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import AppIconByNuxiba from '../assets/conect.svg';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import "../Logincss.css";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from '@mui/icons-material/Info';

type errorObj = {
    code: string;
    description: string;
};

type UnconfirmeEmail = {
    sending: boolean;
    isUnconfirmed: boolean;
    email: string;
    isMailSent: boolean;
};


const Login: React.FC = () => {
    const { setContextState } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState(true);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [messageAlert, setMessageAlert] = useState('Ocurrio un error');
    const [openAlert, setOpenAlert] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [UnconfirmedEmail, setUnconfirmedEmail] = useState<UnconfirmeEmail>({
        sending: false,
        isUnconfirmed: false,
        email: '',
        isMailSent: false,
    });
    const navigate = useNavigate();
    const [showPassword] = useState(false);

    //const handleTogglePasswordVisibility = () => {
    //    setShowPassword(!showPassword);
    //};

    useEffect(() => {
        const token = localStorage.getItem('token');

        const isLogin = !!token;

        if (isLogin) {
            navigate('/Autentification');
        }
    }, []);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value; // Convertir a mayúsculas automáticamente
        setEmail(value);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const isValidEmail = emailRegex.test(value);

        // Actualizar el estado de error dependiendo de si es válido o no
        setEmailErr(isValidEmail); // Si no es válido, se pone el error a true
        if (isValidEmail) {

            setLoading(false);
        }
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setUnconfirmedEmail({
            sending: false,
            isUnconfirmed: false,
            email: '',
            isMailSent: false,
        });

        try {


            const data = {
                email,
                password,
            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };


            const response = await axios.post(
                `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_LOGIN_ENDPOINT}`,
                data,
                { headers },
            );

            if (response.status === 200) {
                const { user, token, expiration } = await response.data;
                setLoading(false);
                // root or admin
                setContextState({ user, token, expiration });
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expiration);
                localStorage.setItem('userData', JSON.stringify(user));
                navigate('/Autentification');

            }
        } catch (error) {
            setLoading(false);
            setSpinner(false);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                if (axiosError.response) {
                    console.log('Error de respuesta:', axiosError.response);
                    console.log('Código de estado:', axiosError.response.status);
                    const responseObj = axiosError.response.data as errorObj;
                    switch (responseObj.code) {
                        case 'UnconfirmedEmail':
                            setMessageAlert(
                                'El correo electrónico no está confirmado, confírmelo primero',
                            );
                            setUnconfirmedEmail({
                                sending: false,
                                isUnconfirmed: true,
                                email: email,
                                isMailSent: false,
                            });
                            break;
                        case 'BadCredentials':
                            setMessageAlert('Credenciales inválidas');
                            break;
                        case 'UserLocked':
                            setMessageAlert('El usuario ha sido bloqueado');
                            break;
                    }
                    setOpenAlert(true);
                } else {
                    console.log('Error de solicitud:', axiosError.message);
                    setMessageAlert('Error de solicitud: ' + axiosError.message);
                    setOpenAlert(true);
                }
            } else {
                console.log('Error de conexión en el servidor -> ', error);
                setMessageAlert('Ocurrio un error de conexión con el servidor');
                setOpenAlert(true);
            }
        }
    };
    const onTryToSendEmailConfirmation = async (event: React.FormEvent) => {
        event.preventDefault();
        setUnconfirmedEmail((prevState) => ({
            ...prevState,
            sending: true,
        }));
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_SEND_CONFIRMATION_EMAIL + UnconfirmedEmail.email}&type=confirmation&reason=confirmation`,
            );

            if (response.status === 200) {
                const { success, message } = await response.data;
                console.log(success, ' - ', message);
                setUnconfirmedEmail((prevState) => ({
                    ...prevState,
                    isMailSent: true,
                    sending: false,
                }));
                setOpenAlert(false);
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                if (axiosError.response) {
                    console.log('Error de respuesta:', axiosError.response);
                    console.log('Código de estado:', axiosError.response.status);
                    const responseObj = axiosError.response.data as errorObj;
                    switch (responseObj.code) {
                        case 'InvalidUser':
                            setMessageAlert(
                                'No se encontraron coincidencias con el correo electrónico',
                            );
                            break;
                        case 'ConfirmationUnset':
                            setMessageAlert(
                                'No se pudo enviar el correo electrónico de confirmación',
                            );
                            break;
                    }
                    setOpenAlert(true);
                } else {
                    console.log('Error de solicitud:', axiosError.message);
                    setMessageAlert('Error de solicitud: ' + axiosError.message);
                    setOpenAlert(true);
                }
            } else {
                console.log('Error de conexión en el servidor -> ', error);
                setMessageAlert('Ocurrio un error de conexión con el servidor');
                setOpenAlert(true);
            }
        }
    };

    return (
        <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
            <Grid item xs={12} lg={6}>
                {spinner && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                        }}
                    >
                        <CircularProgress size={50} />
                    </Box>
                )}
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <form onSubmit={handleSubmit} id="formlogin">
                        <Paper elevation={0} sx={{ width: '100%', borderRadius: '20px' }}>
                            <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                                <Typography
                                    variant="h2"
                                    align="center"
                                    sx={{
                                        fontSize: '28px', // Tamaño del texto en píxeles
                                        fontWeight: 'bold',
                                        color: '#330F1B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '50px', // Ajustamos márgenes
                                    }}
                                >
                                    ¡Bienvenida!
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        font: "normal normal medium 22px/55px Poppins",
                                        letterSpacing: "0px",
                                        color: "#330F1B",
                                        opacity: 1,
                                        marginTop: "20px", // Añadimos un margen superior
                                    }}
                                >
                                    Inicio de sesión
                                </Typography>
                                <Box>
                                    <Typography
                                        sx={{
                                            textAlign: 'left', // Alineación a la izquierda
                                            fontFamily: 'Poppins', // Fuente personalizada
                                            fontWeight: '500', // Peso medium
                                            fontSize: '16px', // Tamaño de fuente
                                            lineHeight: '54px', // Altura de línea
                                            letterSpacing: '0px', // Sin espaciado adicional
                                            color: '#330F1B', // Color del texto
                                            opacity: 1, // Opacidad
                                        }}
                                    >
                                        Correo electrónico
                                    </Typography>
                                    <TextField
                                        label="Correo electrónico"
                                        value={email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        margin="dense"
                                        error={!emailErr}
                                        helperText={!emailErr ? "Por favor, ingrese un correo válido" : ""}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    backgroundColor: "transparent !important",
                                                },
                                                "& input:focus": {
                                                    backgroundColor: "transparent !important",
                                                    boxShadow: "none !important",
                                                    outline: "none !important",
                                                },
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Ingrese un correo válido" arrow>
                                                        <IconButton>
                                                            <InfoIcon sx={{ color: '#b3b3b3' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        required
                                    />



                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            textAlign: 'left',
                                            fontFamily: 'Poppins',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            lineHeight: '54px',
                                            letterSpacing: '0px',
                                            color: '#330F1B',
                                            opacity: 1,
                                        }}
                                    >
                                        Contraseña
                                    </Typography>
                                    <TextField
                                        label="Contraseña"
                                        type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        
                                    />



                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
                                    <ButtonLoadingSubmit
                                        label="Ingresar"
                                        loading={loading}
                                    />
                                    <Link
                                        component={LinkDom}
                                        variant="caption"
                                        to={'/password_reset'}
                                        sx={{
                                            textAlign: 'center',
                                            textDecoration: 'underline',
                                            font: 'normal normal 600 14px/54px Poppins',
                                            letterSpacing: '0px',
                                            color: '#8F4D63',
                                            opacity: 1,
                                        }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </Box>

                                <Box sx={{ width: '100%', marginTop: 1 }}>
                                    <Collapse in={openAlert}>
                                        <Alert
                                            severity="error"
                                            action={
                                                <Box>
                                                    {UnconfirmedEmail.isUnconfirmed && (
                                                        <Tooltip
                                                            title={`Reenviar correo de confirmación a ${UnconfirmedEmail.email}`}
                                                        >
                                                            {UnconfirmedEmail.sending ? (
                                                                <CircularProgress size={20}></CircularProgress>
                                                            ) : (
                                                                <Button
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={onTryToSendEmailConfirmation}
                                                                >
                                                                    REENVIAR
                                                                </Button>
                                                            )}
                                                        </Tooltip>
                                                    )}
                                                    <IconButton
                                                        aria-label="close"
                                                        color="inherit"
                                                        size="small"
                                                        onClick={() => {
                                                            setOpenAlert(false);
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            sx={{ mb: 2 }}
                                        >
                                            {messageAlert}
                                        </Alert>
                                    </Collapse>
                                </Box>
                                <Box sx={{ marginTop: 0 }}>
                                    <Collapse in={UnconfirmedEmail.isMailSent}>
                                        <Alert
                                            severity="success"
                                            sx={{ mb: 2 }}
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        setUnconfirmedEmail((prevState) => ({
                                                            ...prevState,
                                                            isMailSent: false,
                                                        }));
                                                    }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                        >
                                            Correo de confirmación enviado a "{UnconfirmedEmail.email}
                                            "
                                        </Alert>
                                    </Collapse>
                                </Box>

                                <Divider />
                                <Box display="flex" justifyContent="center" marginTop={1}>
                                    <Typography variant="caption" marginRight={1} sx={{
                                        textAlign: 'center',
                                        font: 'normal normal 600 14px/54px Poppins',
                                        letterSpacing: '0px',
                                        color: '#330F1B',
                                    }}>
                                        ¿Aún no tienes una cuenta?
                                    </Typography>
                                    <Link component={LinkDom} variant="caption" to={'/register'} sx={{
                                        textAlign: 'center',
                                        textDecoration: 'underline',
                                        font: 'normal normal 600 14px/54px Poppins',
                                        letterSpacing: '0px',
                                        color: '#8F4D63',
                                    }}>
                                        Registrate
                                    </Link>
                                </Box>
                                <Typography
                                    variant="caption"
                                    align="center"
                                    display="block"
                                    mt={2}
                                >
                                    {import.meta.env.PACKAGE_VERSION}
                                </Typography>
                            </Box>
                        </Paper>
                    </form>


                </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Box
                    sx={{
                        background:
                            'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%) 0% 0% no-repeat padding-box;',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img src={AppIconByNuxiba} alt="Nuxiba Logo" width="410" />
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
