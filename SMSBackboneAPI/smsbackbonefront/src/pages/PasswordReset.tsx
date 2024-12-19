import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import {
    Container, Typography, Box, TextField, Button, Link, Paper, Stepper,
    Step,
    StepLabel,
    Checkbox,
    FormControlLabel, } from '@mui/material';
import PublicLayout from '../components/PublicLayout';
import axios from 'axios';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Countdown from 'react-countdown';
import CircularProgress from '@mui/material/CircularProgress';
import "../chooseroom.css"

const TermsAndConditions: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0); // Estado del paso actual
    const [SendType, setSendType] = useState('');
    const [token, settoken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [enableTwoFactor, setEnableTwoFactor] = useState(false); // Checkbox para 2FA
    const navigate = useNavigate();
   const [resendAttempts, setResendAttempts] = useState(0); // Contador de reenvíos
    const maxResendAttempts = 5; // Límite de reenvíos
    const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isCodeValid, setIsCodeValid] = useState(true);
    const [authCode, setAuthCode] = useState<string[]>(Array(6).fill(""));
    const [countdownTime, setCountdownTime] = useState(60000);
    const [codeExpired, setCodeExpired] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(4).fill(""));
    const [isPhoneDigitsValid, setIsPhoneDigitsValid] = useState(false);

    useEffect(() => {
        const checkLockout = async () => {
            const usuario = localStorage.getItem("userData");
            if (!usuario) return;

            const obj = JSON.parse(usuario);

            if (obj.lockoutEnabled) {
                const lockoutEnd = new Date(obj.lockoutEndDateUtc);
                const now = new Date();
                setLoading(true);

                if (now < lockoutEnd) {
                    // Si el bloqueo aún está vigente, calcular tiempo restante
                    setLockoutEndTime(lockoutEnd);
                    setActiveStep(4); // Ir al Step 4 directamente
                } else {
                    // Si el bloqueo expiró, resetear valores en el usuario
                    const userObj = { ...obj }; // Clonar objeto usuario para modificarlo
                    try {
                        userObj.lockoutEnabled = false;
                        const data = {
                            Id: userObj.id, // ID del usuario, asegurarte de que esté presente en el JSON almacenado.
                            email: userObj.email, // Email del usuario.
                            lockoutEnabled: userObj.lockoutEnabled, // Indica que el bloqueo está habilitado.
                            lockoutEndDateUtc: lockoutEnd.toISOString(), // Fecha y hora en formato ISO 8601.
                        };


                        // Definir encabezados
                        const headers = {
                            'Content-Type': 'application/json',
                            "Access-Control-Allow-Headers": "X-Requested-With",
                            "Access-Control-Allow-Origin": "*",
                        };

                        const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_LOCKOUT_USER}`; // Cambia por tu endpoint real
                        await axios.post(apiEndpoint, data, {
                            headers
                        });
                    } catch (error) {
                        console.error("Error al registrar el desbloqueo:", error);
                    }

                    userObj.lockoutEnabled = false;
                    userObj.lockoutEndDateUtc = null;
                    localStorage.setItem("userData", JSON.stringify(userObj));
                    setLoading(false);
                }
            }
        };

        checkLockout(); // Llamar la función async
    }, []);



    const handleSendNewPassword = async () => {
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {

            const data = {
                Email:  email,
                NewPassword: password,
                TwoFactorAuthentication: enableTwoFactor
            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };

            const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_NEWPASSWORD_USER}`; // Cambia por tu endpoint real
            const response = await axios.post(apiEndpoint, data, {
                headers
            });
            if (response.status === 200) {
                navigate('/chooseroom');
            }
        } catch (error) {
            console.error("Error al registrar el desbloqueo:", error);

        }

    };

    function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSendType(event.target.value);
        return true;
    }


    const SendToken = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        if (resendAttempts + 1 >= maxResendAttempts) {
            // Activar bloqueo
            const currentDate = new Date();
            const lockoutDuration = 30; // En minutos
            const lockoutEnd = new Date(currentDate.getTime() + lockoutDuration * 60000);
            // Actualizar lockout en JSON del usuario
            const usuario = localStorage.getItem("userData");
            if (usuario) {
                const userObj = JSON.parse(usuario);
                userObj.lockoutEnabled = true;
                userObj.lockoutEndDateUtc = lockoutEnd.toISOString();
                localStorage.setItem("userData", JSON.stringify(userObj));


                try {

                    const data = {
                        Id: userObj.id, // ID del usuario, asegurarte de que esté presente en el JSON almacenado.
                        email: userObj.email, // Email del usuario.
                        lockoutEnabled: userObj.lockoutEnabled, // Indica que el bloqueo está habilitado.
                        lockoutEndDateUtc: lockoutEnd.toISOString(), // Fecha y hora en formato ISO 8601.
                    };

                    // Definir encabezados
                    const headers = {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Headers": "X-Requested-With",
                        "Access-Control-Allow-Origin": "*",
                    };

                    const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_LOCKOUT_USER}`; 
                    await axios.post(apiEndpoint, data, {
                        headers
                    });
                } catch (error) {
                    console.error("Error al registrar el bloqueo:", error);
                }

            }


            setLockoutEndTime(lockoutEnd);
            setActiveStep(4);


        }
        else {


            const usuario = localStorage.getItem("userData");

            const obj = JSON.parse(usuario!);
            let dato = "";
            if (SendType == "SMS") {
                dato = obj.phonenumber;
                if (activeStep === 1) {
                    setActiveStep(5);
                    return;
                }
            }
            if (SendType == "EMAIL") {
                dato = obj.email;
            }
            try {
                const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_AUTENTIFICATION_ENDPOINT}?dato=${dato}&tipo=${SendType}`;
                const response = await axios.get(
                    request
                );

                if (response.status === 200) {
                    settoken(response.data);
                    setActiveStep(2);
                    setCountdownTime(60000);
                    setResendAttempts(resendAttempts + 1);
                }
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }

        }
    }
    


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {


            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GETUSERBYEMAIL_USER + email}`;
            const response = await axios.get(
                request
            );

            if (response.status === 200) {
                setActiveStep(1);
                localStorage.setItem('userData', JSON.stringify(response.data));
            }
            setLoading(false);
        }
        catch {
            setErrorMessage(
                "Tu correo no se encuentra en el sistema. ¿Desea registrarte?"
            );
        }

    }



    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            // Permitir solo un número
            const newCode = [...authCode];
            newCode[index] = value;
            setAuthCode(newCode);

            // Saltar al siguiente cuadro automáticamente
            if (value && index < authCode.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && index > 0 && !authCode[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    const Return = async (event: React.FormEvent) => {
        event.preventDefault();
        setActiveStep(0);
        setCountdownTime(60000);
        return true;
    }

    const ValidateToken = async (event: React.FormEvent) => {
        event.preventDefault();

        if (countdownTime === 0) { // Verificar si el contador expiró
            setCodeExpired(true); // Mostrar mensaje de expiración
            return;
        }


        if (authCode.join("") != token) {
            setIsCodeValid(false);
        } else {
            setActiveStep(3);
        }
        return true;
    }

    const handlePhoneDigitsChange = (index: number, value: string) => {
        if (/^\d$/.test(value) || value === "") {
            const updatedDigits = [...phoneDigits];
            updatedDigits[index] = value;
            setPhoneDigits(updatedDigits);

            // Mover el foco automáticamente al siguiente campo
            if (value !== "" && index < phoneDigits.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            // Comprobar si todos los dígitos están llenos y son válidos
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const phoneNumber = userData?.phonenumber || "";

            setIsPhoneDigitsValid(
                updatedDigits.join("") === phoneNumber.slice(-4) &&
                updatedDigits.every((digit) => digit !== "")
            );
        }
    };


    const handleValidatePhoneDigits = () => {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const phoneNumber = userData?.phonenumber || "";

        // Verificar si los 4 últimos dígitos coinciden
        const isValid = phoneDigits.join("") === phoneNumber.slice(-4);

        if (isValid) {
            setIsPhoneDigitsValid(true);
            setActiveStep(2); // Avanzar al Step 2 si es válido
        } else {
            setIsPhoneDigitsValid(false); // Mostrar error en los cuadros
        }
    };

    return (
        <PublicLayout>
            <Container maxWidth="sm" fixed sx={{ marginTop: 2, marginBottom: 8 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Recupera tu cuenta
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: 4 }}>
                    <Step>
                        <StepLabel>Ingresar correo</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Verificar código</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirmar identidad</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Nueva contraseña</StepLabel>
                    </Step>
                </Stepper>
                <Box padding={1}>
                    {activeStep === 0 && (
                        <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                            <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                                <TextField
                                    label="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                {errorMessage && (
                                    <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                                        {errorMessage}{" "}
                                        <Link component={LinkDom} to="/register" color="primary">
                                            Registrarte
                                        </Link>
                                    </Typography>
                                )}
                                <Box display="flex" justifyContent="right" pt={2}>
                                    <Button variant="outlined" onClick={() => navigate('/')}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ marginLeft: 2 }}
                                        onClick={handleSubmit}
                                        disabled={loading} // Deshabilita el botón mientras está en estado de carga
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Recuperar'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {activeStep === 1 && (
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "20px",
                                maxWidth: "400px",
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="body1" gutterBottom>
                                Selecciona el canal por el cual prefiere recibir su código de
                                autentificación
                            </Typography>
                            <RadioGroup
                                value={SendType}
                                onChange={onChangeValue}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                    padding: "0 20px",
                                }}
                            >
                                <FormControlLabel
                                    value="SMS"
                                    control={<Radio />}
                                    label="SMS"
                                    sx={{ textAlign: "left" }}
                                />
                                <FormControlLabel
                                    value="EMAIL"
                                    control={<Radio />}
                                    label="Email"
                                    sx={{ textAlign: "right" }}
                                />
                            </RadioGroup>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={SendToken}
                                sx={{ marginTop: "20px" }}
                            >
                                Aceptar
                            </Button>
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "20px",
                                maxWidth: "600px",
                                width: "90%",
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            {/* Parte 1: Reenviar código */}
                            <Box
                                sx={{
                                    borderBottom: "1px solid #ddd",
                                    paddingBottom: "10px",
                                    marginBottom: "10px",

                                }}
                            >
                                <Typography variant="body2">
                                    ¿El código no fue recibido o caduco?{" "}
                                    <Link
                                        component="button"
                                        onClick={SendToken}
                                        sx={{ fontWeight: "bold", cursor: "pointer" }}
                                    >
                                        REENVIAR
                                    </Link>
                                    <Typography sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", // Centra horizontalmente.
                                        color: "#f44336", // Rojo.
                                        fontWeight: "bold",
                                        marginTop: "10px", // Separación del texto superior.
                                    }}>
                                        <span>Tu código expirará en:</span>
                                        <Countdown
                                            date={Date.now() + countdownTime}
                                            renderer={({ minutes, seconds }) => (
                                                <span>
                                                    {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                                                </span>
                                            )}
                                        />
                                    </Typography>

                                </Typography>
                            </Box>

                            {/* Parte 2: Cajas de texto y contador */}
                            <Box
                                sx={{
                                    borderBottom: "1px solid #ddd",
                                    paddingBottom: "50px",
                                    marginBottom: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ color: isCodeValid ? "inherit" : "red" }}
                                >
                                    Código
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "20px",
                                    }}
                                >
                                    {authCode.map((digit, index) => (
                                        <TextField
                                            key={index}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
                                            inputRef={(el) => (inputRefs.current[index] = el)}
                                            inputProps={{
                                                maxLength: 1,
                                                style: { textAlign: "center" },
                                            }}
                                            error={!isCodeValid}
                                            sx={{
                                                width: "40px",
                                                height: "40px",
                                                margin: "0 5px",
                                            }}
                                        />
                                    ))}
                                </Box>
                                {!isCodeValid && (
                                    <Typography variant="body2" sx={{ color: "red", fontSize: "12px", marginTop: "50px" }}>
                                        Código Inválido
                                    </Typography>
                                )}
                                {codeExpired && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "red", fontSize: "12px", marginTop: "10px" }}
                                    >
                                        El código expiró
                                    </Typography>
                                )}
                            </Box>
                            {/* Parte 3: Botones */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                                <Button variant="outlined" onClick={Return}>
                                    Regresar
                                </Button>
                                <Button variant="contained" color="primary" onClick={ValidateToken}>
                                    Validar
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeStep === 3 && (
                        <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                            <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                                <Typography variant="h6" gutterBottom>
                                    Ingrese una nueva contraseña
                                </Typography>
                                <TextField
                                    label="Nueva contraseña"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Confirmar nueva contraseña"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ marginBottom: 2 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={enableTwoFactor}
                                            onChange={(e) => setEnableTwoFactor(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Habilitar verificación en 2 pasos"
                                />
                                <Box display="flex" justifyContent="space-between" pt={2}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setActiveStep(0)} 
                                    >
                                        Regresar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSendNewPassword} 
                                    >
                                        Validar
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                    {activeStep === 4 && (
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "20px",
                                maxWidth: "500px",
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Se ha llegado al límite de envíos de códigos
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                El ingreso a la cuenta quedará bloqueado por:
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#f44336", // Rojo
                                    fontWeight: "bold",
                                    marginTop: "10px",
                                }}
                            >
                                <Countdown
                                    date={lockoutEndTime || new Date()} 
                                    renderer={({ hours, minutes, seconds, completed }) =>
                                        completed ? (
                                            <span>¡El bloqueo ha terminado! Intente nuevamente.</span>
                                        ) : (
                                            <span>
                                                {hours}h {minutes}m {seconds}s
                                            </span>
                                        )
                                    }
                                />
                            </Typography>
                        </Box>
                    )}
                    {activeStep === 5 && (
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "20px",
                                maxWidth: "500px",
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Recuperación de la cuenta
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Ingresa los 4 últimos dígitos del teléfono configurado
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                {phoneDigits.map((digit, index) => (
                                    <TextField
                                        key={index}
                                        value={digit}
                                        type="text"
                                        inputProps={{
                                            maxLength: 1,
                                            style: { textAlign: "center" },
                                        }}
                                        inputRef={(el) => (inputRefs.current[index] = el)} // Asignar referencia
                                        onChange={(e) => handlePhoneDigitsChange(index, e.target.value)} // Manejar cambios
                                        onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
                                        error={!isPhoneDigitsValid && digit === ""} // Mostrar error si es inválido
                                        sx={{ width: "50px", height: "50px" }}
                                    />
                                ))}
                            </Box>

                            {!isPhoneDigitsValid && (
                                <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                    Los dígitos ingresados son incorrectos. Por favor, inténtalo nuevamente.
                                </Typography>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                }}
                            >
                                <Button variant="outlined" onClick={() => setActiveStep(1)}>
                                    Regresar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleValidatePhoneDigits}
                                >
                                    Validar
                                </Button>
                            </Box>
                        </Box>
                    )}


                </Box>
            </Container>
        </PublicLayout>
    );
};

export default TermsAndConditions;
