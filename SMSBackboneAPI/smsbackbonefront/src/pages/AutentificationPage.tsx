import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Countdown from 'react-countdown';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import "../chooseroom.css"



const Autentification: React.FC = () => {
    const [SendType, setSendType] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, settoken] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(true);
    const [countdownTime, setCountdownTime] = useState(60000);
    const [step, setStep] = useState(1);
    const [authCode, setAuthCode] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [resendAttempts, setResendAttempts] = useState(0); // Contador de reenvíos
    const maxResendAttempts = 5; // Límite de reenvíos
    const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
    const [codeExpired, setCodeExpired] = useState(false);
    useEffect(() => {
        const checkLockout = async () => {
            const usuario = localStorage.getItem("userData");
            if (!usuario) return;

            const obj = JSON.parse(usuario);

            if (obj.twoFactorAuthentication) {
               navigate('/chooseroom');
            }

            if (obj.lockoutEnabled) {
                const lockoutEnd = new Date(obj.lockoutEndDateUtc);
                const now = new Date();
                setLoading(true);

                if (now < lockoutEnd) {
                    // Si el bloqueo aún está vigente, calcular tiempo restante
                    setLockoutEndTime(lockoutEnd);
                    setStep(3); // Ir al Step 3 directamente
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


    function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSendType(event.target.value);
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

    const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
        //const target = event.target as HTMLInputElement;

        if (event.key === "Backspace" && !authCode[index] && index > 0) {
            // Retroceder al cuadro anterior si está vacío
            inputRefs.current[index - 1]?.focus();
        }
    };
    const Return = async (event: React.FormEvent) => {
        event.preventDefault();
        setStep(1);
        setCountdownTime(60000);
        return true;
    }
    const navigate = useNavigate();
    const ValidateToken = async (event: React.FormEvent) => {
        event.preventDefault();

        if (countdownTime === 0) { // Verificar si el contador expiró
            setCodeExpired(true); // Mostrar mensaje de expiración
            return;
        }


        if (authCode.join("") != token) {
            setIsCodeValid(false);
        } else {
            navigate('/chooseroom');
        }
        return true;
    }

    const handleSubmit = async (event: React.FormEvent) => {
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

                    const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_LOCKOUT_USER}`; // Cambia por tu endpoint real
                    await axios.post(apiEndpoint, data, {
                        headers
                    });
                } catch (error) {
                    console.error("Error al registrar el bloqueo:", error);
                }

            }


            setLockoutEndTime(lockoutEnd);
            setStep(3);


        }
        else {


            const usuario = localStorage.getItem("userData");

            const obj = JSON.parse(usuario!);
            let dato = "";
            if (SendType == "SMS") {
                dato = obj.phonenumber;
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
                    setStep(2);
                    setCountdownTime(60000);
                    setResendAttempts(resendAttempts + 1);
                }
                setLoading(false);
            }
            catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    setErrorModalOpen(true); // Mostrar el modal en caso de error BadRequest
                } else {
                    console.error("Error inesperado:", error);
                }
            }

        }
    }



    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Autentificación de cuenta
            </Typography>

            {step === 1 ? (
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
                        onClick={handleSubmit}
                        sx={{ marginTop: "20px" }}
                    >
                        Aceptar
                    </Button>
                </Box>
            ) : step === 2 ? (
                <Box
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        maxWidth: "500px",
                        width: "40%",
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
                                onClick={handleSubmit}
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
                                    onKeyDown={(e) => handleKeyDown(index, e)}
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
            ) : step === 3 ? (
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
                                    date={lockoutEndTime ? lockoutEndTime : undefined}
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
            ) : null}

            {/* Modal de error */}
            <Dialog
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">
                    {"Error al enviar el número de identificación"}
                </DialogTitle>
                <DialogContent>
                    <Typography id="error-dialog-description">
                        Algo salió mal, inténtelo de nuevo o más tarde.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setErrorModalOpen(false)}
                        color="primary"
                        variant="outlined"
                        sx={{ color: "red" }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>



        </Box>
    );
};

export default Autentification;