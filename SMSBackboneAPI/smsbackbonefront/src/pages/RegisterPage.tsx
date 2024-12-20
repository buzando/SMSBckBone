import { useState, useContext, ChangeEvent, useRef } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { AppContext } from '../hooks/useContextInitialState';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Divider, Modal, Fade, Backdrop } from '@mui/material';
import PublicLayout from '../components/PublicLayout';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

type RegisterFormData = {
    client: string;
    firstName: string;
    lastName: string;
    phone: string;
    extension: string;
    email: string;
    emailConfirmation: string;
    sms: boolean;
    llamada: boolean;
    password: string;
    [key: string]: string | boolean; // Firma de índice
};

const Register: React.FC = () => {
    const { setContextState } = useContext(AppContext);
    const [formData, setFormData] = useState<RegisterFormData>({
        client: "",
        firstName: "",
        lastName: "",
        phone: "",
        extension: "",
        email: "",
        emailConfirmation: "",
        sms: false,
        llamada: false,
        password: "",
    });




    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        phone: false,
        email: false,
        emailConfirmation: false,
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [hasPasswordInput, setHasPasswordInput] = useState(false);
    const termsContainerRef = useRef<HTMLDivElement>(null);
    const handleScroll = () => {
        const container = termsContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;

            console.log(`scrollTop: ${scrollTop}, clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}`);

            // Margen amplio para tolerancia
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

            console.log(`isAtBottom: ${isAtBottom}`);
            setIsButtonEnabled(isAtBottom);
        }
    };


    const handleOpenErrorModal = (message: string) => {
        setErrorMessage(message);
        setErrorModalOpen(true);
    };

    const handleErrorModalClose = () => {
        setErrorModalOpen(false);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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
                llamada: formData.llamada,
                Password: password,// Incluye la contraseña en el payload
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
                const { user, token, expiration } = await response.data;
                setContextState({ user, token, expiration });
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expiration);
                localStorage.setItem('userData', JSON.stringify(user));
                navigate('/chooseroom');
                console.log('-----------------');
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
            handleOpenErrorModal("Ocurrió un error al intentar registrar al usuario. Por favor, inténtelo de nuevo.");
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (!hasPasswordInput) {
            setHasPasswordInput(true); // Activar la bandera solo la primera vez que se escribe
        }
        validatePassword(value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const validatePassword = (password: string) => {
        const errors = {
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
        };
        setPasswordErrors(errors);
    };

    const arePasswordsValid = (): boolean => {
        return (
            Object.values(passwordErrors).every((valid) => valid) &&
            password === confirmPassword
        );
    };


    const isFormValid = () => {
        const requiredFields: (keyof RegisterFormData)[] = [
            'client',
            'firstName',
            'lastName',
            'phone',
            'email',
            'emailConfirmation',
        ];

        const allFieldsFilled = requiredFields.every((field) => {
            const value = formData[field];
            return typeof value === 'string' && value.trim() !== '';
        });

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

        // Actualización del estado
        setFormData((prevState: RegisterFormData) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleOpenModal = () => {
        setModalOpen(true);
        setTimeout(() => initializeScrollListener(), 0); // Espera el renderizado del modal
    };
    const handleModalClose = () => {
        setModalOpen(false);
        removeScrollListener(); // Elimina el evento de scroll al cerrar el modal
    };
    const initializeScrollListener = () => {
        setTimeout(() => {
            const container = termsContainerRef.current;
            if (container) {
                console.log("Scroll listener añadido.");
                console.log("Contenedor actual:", container);
                console.log("scrollHeight inicial:", container.scrollHeight);
                console.log("clientHeight inicial:", container.clientHeight);

                container.addEventListener("scroll", handleScroll);
            } else {
                console.error("No se encontró el contenedor para el scroll.");
            }
        }, 0); // Espera el siguiente ciclo de renderizado
    };

    const removeScrollListener = () => {
        const container = termsContainerRef.current;
        if (container) {
            console.log("Scroll listener eliminado.");
            container.removeEventListener("scroll", handleScroll);
        } else {
            console.error("No se encontró el contenedor para eliminar el scroll listener.");
        }
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={hasPasswordInput && !Object.values(passwordErrors).every((valid) => valid)} // Mostrar error solo si ha tipeado
                                    helperText={
                                        hasPasswordInput && ( // Mostrar los errores solo si se ha tipeado
                                            <>
                                                {!passwordErrors.minLength && (
                                                    <Typography variant="caption" color="error">
                                                        - La contraseña debe tener al menos 8 caracteres.
                                                    </Typography>
                                                )}
                                                {!passwordErrors.uppercase && (
                                                    <Typography variant="caption" color="error">
                                                        - Debe contener al menos una letra mayúscula.
                                                    </Typography>
                                                )}
                                                {!passwordErrors.lowercase && (
                                                    <Typography variant="caption" color="error">
                                                        - Debe contener al menos una letra minúscula.
                                                    </Typography>
                                                )}
                                                {!passwordErrors.number && (
                                                    <Typography variant="caption" color="error">
                                                        - Debe contener al menos un número.
                                                    </Typography>
                                                )}
                                            </>
                                        )
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <Box>
                                                            <Typography
                                                                variant="caption"
                                                                color={passwordErrors.minLength ? "green" : "red"}
                                                            >
                                                                - Mínimo 8 caracteres.
                                                            </Typography>
                                                            <br />
                                                            <Typography
                                                                variant="caption"
                                                                color={passwordErrors.uppercase ? "green" : "red"}
                                                            >
                                                                - Una letra mayúscula.
                                                            </Typography>
                                                            <br />
                                                            <Typography
                                                                variant="caption"
                                                                color={passwordErrors.lowercase ? "green" : "red"}
                                                            >
                                                                - Una letra minúscula.
                                                            </Typography>
                                                            <br />
                                                            <Typography
                                                                variant="caption"
                                                                color={passwordErrors.number ? "green" : "red"}
                                                            >
                                                                - Un número.
                                                            </Typography>
                                                        </Box>
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
                                    label="Confirmar Contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={!!(confirmPassword && confirmPassword !== password)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        confirmPassword && confirmPassword !== password
                                                            ? "Las contraseñas no coinciden"
                                                            : "Las contraseñas coinciden"
                                                    }
                                                >
                                                    <IconButton>
                                                        <InfoOutlinedIcon color={confirmPassword && confirmPassword !== password ? "error" : "success"} />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                {password && confirmPassword && !arePasswordsValid() && (
                                    <Typography variant="caption" color="red" sx={{ marginBottom: 2 }}>
                                        Asegúrate de cumplir con los requisitos de contraseña y que coincidan.
                                    </Typography>
                                )}
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
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                                        {/* Botón de registro */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isFormValid() || !arePasswordsValid()}
                                            onClick={handleOpenModal}
                                            sx={{
                                                background: "#833A53 0% 0% no-repeat padding-box",
                                                border: "1px solid #60293C",
                                                borderRadius: "4px",
                                                opacity: 0.9,
                                                color: "#FFFFFF", // Letra blanca
                                            }}
                                        >
                                            Registrarse
                                        </Button>
                                    </Box>


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
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 4,
                                borderRadius: "12px",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                                Términos y condiciones
                            </Typography>
                            <Divider sx={{ marginBottom: 3 }} />
                            <Box
                                ref={termsContainerRef}
                                sx={{ maxHeight: "400px", overflowY: "auto", paddingRight: 2 }}
                            >
                                {/* Contenido de los términos y condiciones */}
                                <Typography variant="body1" paragraph>
                                    Aparte del crédito disponible en su cuenta, no establecemos un tope en el número de mensajes que puede enviar a través de nuestro servicio.
                                </Typography>
                                <Typography component="ul" variant="body1">
                                    <li>Siguiendo estos términos y condiciones.</li>
                                    <li>Con fines estrictamente apegados a la ley.</li>
                                    <li>Respetando todas las leyes y normativas aplicables, tanto locales como internacionales.</li>
                                    <li>Para los objetivos por los que fueron creados.</li>
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Al emplear nuestros servicios, deberá evitar:
                                </Typography>
                                <Typography component="ul" variant="body1">
                                    <li>Enviar mensajes SMS no solicitados o spam.</li>
                                    <li>Alterar los detalles de origen en cualquier mensaje electrónico.</li>
                                    <li>
                                        Enviar mensajes que sean difamatorios, discriminatorios, obscenos, ofensivos,
                                        amenazantes, abusivos, acosadores, dañinos, o violentos.
                                    </li>
                                    <li>Participar en fraudes o esquemas piramidales.</li>
                                    <li>Transmitir códigos maliciosos como virus o troyanos.</li>
                                    <li>Violar la privacidad de terceros.</li>
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Además de los términos ya establecidos, esta sección es aplicable si se emplea nuestro servicio de API.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Hemos habilitado la posibilidad de que las empresas o los individuos se conecten a nuestro servidor para facilitar el envío de mensajes de texto directamente a nuestro sistema de SMS.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Nos reservamos el derecho de aprobar o rechazar conexiones de clientes y APIs según nuestro propio criterio.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Promovemos activamente las políticas contra el envío de spam (mensajes no solicitados).
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Proporcionaremos especificaciones para las conexiones API y nos esforzaremos por mantenerlas actualizadas. Estas especificaciones pueden estar incompletas y estar sujetas a cambios sin previo aviso.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Para todos los servicios de mensajería SMS, le proporcionaremos un nombre de usuario y contraseña. Cualquier medida de seguridad adicional, incluyendo pero no limitado a la gestión de accesos y contraseñas, uso indebido, etc., quedará bajo responsabilidad del usuario.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    EL CLIENTE será responsable totalmente de la gestión de las contraseñas y acceso al sistema donde se utiliza el servicio de SMS. CENTERNEXT quedará exento de cualquier uso inapropiado o indebido realizado por cuentas que gestionan el SMS.
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={3}>
                                <Button variant="outlined" onClick={handleModalClose} sx={{
                                    border: "1px solid #60293C",
                                    borderRadius: "4px",
                                    color: "#833A53",
                                    backgroundColor: "transparent",
                                    "&:hover": {
                                        backgroundColor: "#f3e6eb",
                                    },
                                }}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={!isButtonEnabled}
                                    sx={{
                                        background: "#833A53 0% 0% no-repeat padding-box",
                                        border: "1px solid #60293C",
                                        borderRadius: "4px",
                                        opacity: 0.9,
                                        color: "#FFFFFF",
                                        "&:hover": {
                                            backgroundColor: "#a54261",
                                        },
                                    }}
                                >
                                    Aceptar
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>

                <Modal
                    open={errorModalOpen}
                    onClose={handleErrorModalClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={errorModalOpen}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '40%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: '12px',
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                Error al registrar usuario
                            </Typography>
                            <Divider sx={{ marginBottom: 3 }} />
                            <Typography variant="body1" sx={{ marginBottom: 3 }}>
                                {errorMessage}
                            </Typography>
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#833A53",
                                        color: "#FFF",
                                    }}
                                    onClick={() => {
                                        handleErrorModalClose();
                                        navigate('/login');
                                    }}
                                >
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
