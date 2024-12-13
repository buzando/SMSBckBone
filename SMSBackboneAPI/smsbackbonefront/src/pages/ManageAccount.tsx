import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Tooltip,
} from "@mui/material";

const ManageAccount: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        alternateEmail: "",
        password: "",
        confirmPassword: "",
    });

    // Load user data from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const parsedData = JSON.parse(userData);
            setFormData({
                firstName: parsedData.firstName || "",
                lastName: parsedData.lastName || "",
                phone: parsedData.phone || "",
                alternateEmail: parsedData.alternateEmail || "",
                password: "", // For security reasons, do not prefill passwords
                confirmPassword: "", // For security reasons, do not prefill passwords
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Updated user data:", formData);
        // Here, you can send the updated data to your backend API
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
                            required
                        />
                    </Tooltip>
                    <Tooltip title="Confirma tu contraseña." arrow>
                        <TextField
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </Tooltip>
                </Box>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    *El asterisco indica los campos obligatorios.
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => console.log("Cancel clicked")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={
                            !formData.firstName ||
                            !formData.lastName ||
                            !formData.phone ||
                            !formData.alternateEmail ||
                            !formData.password ||
                            !formData.confirmPassword
                        }
                    >
                        Guardar cambios
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageAccount;
