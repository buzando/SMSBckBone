import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Tooltip,
    Modal,
} from "@mui/material";
import axios from "axios";
const ManageAccount: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        alternateEmail: "",
        password: "",
        confirmPassword: "",
        email: "",
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    // Load user data from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const parsedData = JSON.parse(userData);
            setFormData({
                firstName: parsedData.firstName || "",
                lastName: parsedData.lastName || "",
                phone: parsedData.phonenumber || "",
                email: parsedData.email || "",
                alternateEmail: parsedData.secondaryEmail || "",
                password: "", // For security reasons, do not prefill passwords
                confirmPassword: "", // For security reasons, do not prefill passwords
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Restringir el número de teléfono solo a números
        if (name === "phone" && !/^[0-9]*$/.test(value)) return;

        setFormData({ ...formData, [name]: value });

        // Validar la contraseña en tiempo real
        if (name === "password") {
            if (!value || passwordRegex.test(value)) {
                setPasswordError("");
            } else {
                setPasswordError(
                    "La contraseña debe tener mínimo 8 caracteres, una letra mayúscula, una letra minúscula y un número."
                );
            }
        }

        // Validar la confirmación de contraseña en tiempo real
        if (name === "confirmPassword") {
            if (!value || value === formData.password) {
                setConfirmPasswordError("");
            } else {
                setConfirmPasswordError("Las contraseñas no coinciden.");
            }
        }
    };



    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            setModalMessage("Las contraseñas no coinciden");
            setModalOpen(true);
            return;
        }
        if (!validateEmail(formData.alternateEmail)) {
            setModalMessage("El correo alternativo no es válido");
            setModalOpen(true);
            return;
        }
        try {

            const data = {
                FirstName: formData.firstName,
                LastName: formData.lastName,
                Email: formData.email,
                ConfirmationEmail: formData.alternateEmail,
                PhoneNumber: formData.phone,
                Password: formData.password,
            };

            // Make POST request
            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*",
            };

            const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_UPDATE_USER}`; // Cambiar por el endpoint real de actualización
            const response = await axios.post(apiEndpoint, data, { headers });

            if (response.status === 200) {

                alert("Usuario actualizado con éxito");
            }



        } catch  {
            setModalMessage("Error al actualizar usuario");
            setModalOpen(true);
        }
    };

    return (
        <Box p={4} maxWidth={600} mx="auto">
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Editar cuenta
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <Tooltip title="Introduce tu nombre." arrow>
                        <TextField
                            label="Nombre"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Tooltip>
                    <Tooltip title="Introduce tu apellido." arrow>
                        <TextField
                            label="Apellido"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Tooltip>
                    <Tooltip title="Introduce tu número de teléfono." arrow>
                        <TextField
                            label="Teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Tooltip>
                    <Tooltip title="Introduce tu correo alternativo." arrow>
                        <TextField
                            label="Correo alternativo"
                            name="alternateEmail"
                            value={formData.alternateEmail}
                            onChange={handleChange}
                            required
                        />
                    </Tooltip>
                    <Tooltip title="Introduce una contraseña segura." arrow>
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </Tooltip>
                    <Tooltip title="Confirma tu contraseña." arrow>
                        <TextField
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
                        />
                    </Tooltip>
                </Box>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    *El asterisco indica los campos obligatorios.
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={3}>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={
                            !formData.firstName ||
                            !formData.lastName ||
                            !formData.phone ||
                            !formData.alternateEmail
                        }

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
                        Guardar cambios
                    </Button>
                </Box>
            </Paper>

            {/* Modal de error */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Error al registrar usuario!
                    </Typography>
                    <Typography>{modalMessage}</Typography>
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setModalOpen(false)}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ManageAccount;
