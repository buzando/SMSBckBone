import { useState, useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AppContext } from '../hooks/useContextInitialState';
import axios, { AxiosError } from 'axios';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import ButtonLoadingSubmit from '../components/commons/ButtonLoadingSubmit';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Role } from '../types/Types';
import Link from '@mui/material/Link';
import AppIconByNuxiba from '../assets/AppIconByNuxiba.svg';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import App from '../App';


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
    const validEmail = new RegExp(
        '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );
    const { setContextState } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageAlert, setMessageAlert] = useState('Ocurrio un error');
    const [openAlert, setOpenAlert] = useState(false);
    const [UnconfirmedEmail, setUnconfirmedEmail] = useState<UnconfirmeEmail>({
        sending: false,
        isUnconfirmed: false,
        email: '',
        isMailSent: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        const isLogin = !!token;

        if (isLogin) {
        /*   navigate('/Autentification');*/
        }
    }, []);


    const validate = (values: string) => {


        if (!validEmail.test(values)) {
            setEmailErr(true);
            setLoading(false);
      
        }

        return "";
    }



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
                if (
                    user.idRole === Role.ROOT ||
                    user.idRole === Role.ADMIN ||
                    user.idRole === Role.SUPPORT
                ) {
                    // root or admin
                    setContextState({ user, token, expiration });
                    localStorage.setItem('token', token);
                    localStorage.setItem('expirationDate', expiration);
                    localStorage.setItem('userData', JSON.stringify(user));
                    navigate('/Autentification');
                } else {
                    setMessageAlert('Privilegios insuficientes para acceder');
                    setOpenAlert(true);
                }
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                if (axiosError.response) {
                    console.log('Error de respuesta:', axiosError.response);
                    console.log('C�digo de estado:', axiosError.response.status);
                    const responseObj = axiosError.response.data as errorObj;
                    switch (responseObj.code) {
                        case 'UnconfirmedEmail':
                            setMessageAlert(
                                'El correo electr�nico no est� confirmado, conf�rmelo primero',
                            );
                            setUnconfirmedEmail({
                                sending: false,
                                isUnconfirmed: true,
                                email: email,
                                isMailSent: false,
                            });
                            break;
                        case 'BadCredentials':
                            setMessageAlert('Credenciales inv�lidas');
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
                console.log('Error de conexi�n en el servidor -> ', error);
                setMessageAlert('Ocurrio un error de conexi�n con el servidor');
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
                `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_SEND_CONFIRMATION_EMAIL + UnconfirmedEmail.email}&type=confirmation`,
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
                    console.log('C�digo de estado:', axiosError.response.status);
                    const responseObj = axiosError.response.data as errorObj;
                    switch (responseObj.code) {
                        case 'InvalidUser':
                            setMessageAlert(
                                'No se encontraron coincidencias con el correo electr�nico',
                            );
                            break;
                        case 'ConfirmationUnset':
                            setMessageAlert(
                                'No se pudo enviar el correo electr�nico de confirmaci�n',
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
                console.log('Error de conexi�n en el servidor -> ', error);
                setMessageAlert('Ocurrio un error de conexi�n con el servidor');
                setOpenAlert(true);
            }
        }
    };

    return (
        <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
            <div className="App">
                <button style={{ position: "fixed", bottom: 0, right: "50%" }}>
                    Centro borde inferior
                </button>
            </div>
            <Grid item xs={12} lg={6}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <form onSubmit={handleSubmit} id="formlogin">
                        <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                            <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                                <Typography variant="h2" fontWeight="bold" align="center">
                                    Bienven�do
                                </Typography>
                                <Avatar
                                    sx={(theme) => ({
                                        backgroundColor: theme.palette.primary.main,
                                        margin: 'auto',
                                    })}
                                >
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography variant="h5" align="center">
                                    Iniciar sesi�n
                                </Typography>
                                <TextField
                                    label="Correo electr�nico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                {emailErr && <p>Your email is invalid</p>}
                                <TextField
                                    label="Contrase�a"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                <Box display="flex" justifyContent="right">
                                    <Link
                                        component={LinkDom}
                                        variant="caption"
                                        to={'/password_reset'}
                                    >
                                        �Olvidaste tu contrase�a?
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
                                                            title={`Reenviar correo de confirmaci�n a ${UnconfirmedEmail.email}`}
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
                                            Correo de confirmaci�n enviado a "{UnconfirmedEmail.email}
                                            "
                                        </Alert>
                                    </Collapse>
                                </Box>
                                <Box display="flex" justifyContent="center" py={2}>
                                    <ButtonLoadingSubmit
                                        label="Iniciar sesi�n pvtos"
                                        loading={loading}
                                    />
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="center" marginTop={1}>
                                    <Typography variant="caption" marginRight={1}>
                                        �A�n no tienes cuenta?
                                    </Typography>
                                    <Link component={LinkDom} variant="caption" to={'/register'}>
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
                    <img  src={AppIconByNuxiba} alt="Nuxiba Logo" width="410" />
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
