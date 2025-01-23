﻿import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Tooltip,
    Modal,
    TextField,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    RadioGroup,
    Radio,
    Grid,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import usrAdmin from "../assets/usrAdmin.svg";
import usrSup from "../assets/usrSup.svg";
import usrMon from "../assets/usrMon.svg"
import Nousers from "../assets/Nousers.svg"
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Account = {
    id: number;
    name: string;
    email: string;
    rooms: string;
    status: boolean;
    role: string;
    phoneNumber?: string;
};

type Room = {
    id: number; // Identificador único de la sala
    name: string; // Nombre de la sala
    long_sms: boolean; // Indicador para SMS largos
    calls: boolean; // Indicador para llamadas
    credits: number; // Saldo de la sala
};

type FormData = {
    name: string; // Nombre del usuario
    email: string; // Correo principal
    confirmEmail: string; // Confirmación del correo
    phone: string; // Teléfono
    useRecoveryEmail: boolean; // Indicador de uso de correo para recuperación
    password: string; // Contraseña
    confirmPassword: string; // Confirmación de contraseña
    allAndFuture: boolean; // Indicador para "todas y futuras salas"
    profile: string; // Perfil/rol del usuario
    rooms: string; // Lista de IDs de salas separados por comas
};



const ManageAccounts: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [ConfirmationEmail, setConfirmationEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false); // Para saber si es edición
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        confirmEmail: "",
        phone: "",
        useRecoveryEmail: false,
        password: "",
        confirmPassword: "",
        allAndFuture: false,
        profile: "",
        rooms: "",
    });



    const isPasswordValid = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };




    const handleCheckboxChange = (id: number) => {
        setSelectedRooms((prev) => {
            const newSelectedRooms = prev.includes(id)
                ? prev.filter((roomId) => roomId !== id)
                : [...prev, id];

            // Actualizar formData.rooms como una lista separada por comas
            setFormData((prevFormData) => ({
                ...prevFormData,
                rooms: newSelectedRooms.join(","),
            }));

            return newSelectedRooms;
        });
    };
    const navigate = useNavigate();


    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            // Seleccionar todas las salas
            setSelectedRooms(rooms.map((room) => room.id));
        } else {
            // Deseleccionar todas las salas
            setSelectedRooms([]);
        }
    };
    const handleSelectAllAndFuture = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedRooms(rooms.map((room) => room.id)); // Seleccionar todas las salas
            setFormData((prev) => ({ ...prev, allAndFuture: true })); // Establecer allAndFuture como true
        } else {
            setSelectedRooms([]); // Deseleccionar todas las salas
            setFormData((prev) => ({ ...prev, allAndFuture: false })); // Establecer allAndFuture como false
        }
    };

    const areAllRoomsSelected = rooms.length > 0 && selectedRooms.length === rooms.length;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, account: Account) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedAccount(account); // Asegúrate de configurar el estado correctamente
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOpenModal = () => {
        fetchRooms();
        setOpenAddUserModal(true);
    };

    const handleCloseModal = () => {
        setOpenAddUserModal(false);
        setIsEditing(false);
        setFormData({
            name: "",
            email: "",
            confirmEmail: "",
            phone: "",
            useRecoveryEmail: false,
            password: "",
            confirmPassword: "",
            allAndFuture: false,
            profile: "",
            rooms: "",
        });
    };




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleDeleteUser = async () => {
        if (selectedAccount) {
            try {
                const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_DELETE_USERS}?id=${selectedAccount.id}`;
                const response = await axios.get(requestUrl);

                if (response.status === 200) {
                    setAccounts((prevAccounts) =>
                        prevAccounts.filter((account) => account.id !== selectedAccount.id)
                    );
                    console.log("Usuario eliminado correctamente.");
                } else {
                    console.error("Error al eliminar la cuenta.");
                }
            } catch (error) {
                console.error("Error en la solicitud de eliminación:", error);
            } finally {
                setOpenDeleteModal(false);
                setSelectedAccount(null);
            }
        }
    };

    const handleAddUser = async () => {
        try {
            const userData = localStorage.getItem("userData");
            if (!userData) {
                navigate('/');
                return;
            }

            const parsedUserData = JSON.parse(userData);
            const clientId = parsedUserData.idCliente;
            // Prepare data to match the DTO
            if (formData.useRecoveryEmail) {
                setConfirmationEmail(parsedUserData.email);
            } else {
                setConfirmationEmail(formData.email);
            }
            const data = {
                FirstName: formData.name,
                Email: formData.email,
                ConfirmationEmail: ConfirmationEmail,
                FutureRooms: formData.allAndFuture,
                Profile: formData.profile,
                PhoneNumber: formData.phone,
                Password: !isEditing ? formData.password : '123', // Solo enviar si no es edición
                Rooms: selectedRooms.join(","),
                IdCliente: clientId,
                IdUsuario: parsedUserData.id,
            };

            // Make POST request
            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*",
            };

            if (isEditing) {
                // Lógica para actualizar un usuario existente
                const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_UPDATE_USERS}`; // Cambiar por el endpoint real de actualización
                const response = await axios.post(apiEndpoint, data, { headers });

                if (response.status === 200) {
                    console.log("Usuario actualizado correctamente.");
                    fetchAccounts(); // Refrescar la lista de usuarios
                    setOpenAddUserModal(false); // Cerrar el modal
                    setIsEditing(false); // Salir del modo de edición
                }
            } else {
                const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_USERS}`; // Cambia por tu endpoint real
                const response = await axios.post(apiEndpoint, data, {
                    headers
                });

                if (response.status === 200) {
                    fetchAccounts();
                    setFormData({
                        name: "",
                        email: "",
                        confirmEmail: "",
                        phone: "",
                        useRecoveryEmail: false,
                        password: "",
                        confirmPassword: "",
                        allAndFuture: false,
                        profile: "",
                        rooms: "",
                    });
                    setOpenAddUserModal(false);
                }
            }


        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorCode = error.response.data?.code;

                if (errorCode === "DuplicateUserName") {
                    setErrorMessage(
                        "Email Registrado previamente."
                    );
                }
                if (errorCode === "ConfirmationUnsent") {
                    setErrorMessage(
                        "No se pudo enviar el mail de confirmacion"
                    );
                }
                if (errorCode === "agregarusuario") {
                    setErrorMessage(
                        "Error al Agregar un usuario. por favor intente más tarde"
                    );
                }
            }
            // Establece el mensaje de error
            setErrorModalOpen(true); // Abre el modal de error
        }
        finally {
            fetchRooms();
        }
    };

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const userData = localStorage.getItem("userData");
            if (!userData) {
                navigate("/login");
                return;
            }

            const parsedUserData = JSON.parse(userData);
            const clientId = parsedUserData.idCliente;

            if (!clientId) {
                console.error("El idCliente no está disponible en los datos del usuario.");
                return;
            }

            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GETBYCLIENT_USERS}?Client=${clientId}`;
            const response = await axios.get(request);
            if (response.status === 200) {
                setAccounts(response.data);
            }
        } catch {
            setErrorMessage(
                "Error al traer los usuarios. por favor intente más tarde"
            );
            setErrorModalOpen(true);
        }
        finally {
            setLoading(false); // Desactiva el estado de carga
        }
    };
    const fetchRooms = async () => {
        try {
            const userData = localStorage.getItem("userData");
            if (!userData) {
                navigate("/login");
                return;
            }

            const parsedUserData = JSON.parse(userData);
            const clientId = parsedUserData.idCliente;

            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ROOMBYCLIENTE_ROOM}?Client=${clientId}`;
            const response = await axios.get(request);
            if (response.status === 200) {
                const roomsData = Array.isArray(response.data) ? response.data : [];
                // Asegurarse de que los datos coincidan con el tipo Room
                const validRooms = roomsData.map((room: Room) => ({
                    id: room.id,
                    name: room.name,
                    long_sms: room.long_sms || false,
                    calls: room.calls || false,
                    credits: room.credits || 0,
                }));
                setRooms(validRooms) // Actualizar conexiones
            }
        } catch (error) {
            console.error("Error al obtener los rooms:", error);
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleEditClick = async (account: Account) => {
        // Asegúrate de que las salas estén cargadas
        if (rooms.length === 0) {
            await fetchRooms();
        }

        // Parsear los nombres de las salas desde el campo `rooms` del usuario
        const selectedRoomNames = account.rooms
            ? account.rooms.split(", ").map((name) => name.trim())
            : [];

        // Filtrar los IDs de las salas basándose en los nombres
        const selectedRoomIds = rooms
            .filter((room) => selectedRoomNames.includes(room.name))
            .map((room) => room.id);

        setSelectedRooms(selectedRoomIds); // Actualiza los IDs seleccionados

        // Establece los datos del formulario
        setFormData({
            name: account.name || "", // Nombre del usuario
            email: account.email || "", // Correo principal
            confirmEmail: account.email || "", // Confirmación del correo (igual al correo principal en edición)
            phone: account.phoneNumber || "", // Teléfono del usuario, o vacío si no está disponible
            useRecoveryEmail: false, // No aplica en edición
            password: "", // Se deja vacío en edición para no sobrescribir la contraseña
            confirmPassword: "", // Confirmación de contraseña, también vacío en edición
            allAndFuture: false, // Ajusta según sea necesario para "todas y futuras salas"
            profile: account.role || "", // Rol del usuario
            rooms: selectedRoomIds.join(","), // Lista de IDs de salas seleccionadas como una cadena separada por comas
        });




        setIsEditing(true); // Activa el modo de edición
        setOpenAddUserModal(true); // Abre el modal
    };

    const isFormValid = (): boolean => {
        const nameRegex = /^[a-zA-Z\s]*$/; // Permite solo letras y espacios
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida formato de correo
        const phoneRegex = /^[0-9]*$/; // Permite solo números

        return (
            nameRegex.test(formData.name.trim()) && // Validación de nombre
            phoneRegex.test(formData.phone.trim()) && // Validación de teléfono
            emailRegex.test(formData.email) && // Validación de formato de correo
            formData.email === formData.confirmEmail && // Validación de correos coincidentes
            isPasswordValid(formData.password) && // Validación de contraseña
            formData.password === formData.confirmPassword && // Validación de contraseñas coincidentes
            formData.profile.trim() !== "" && // Verificar que el perfil esté seleccionado
            selectedRooms.length > 0 // Verificar que al menos una sala esté seleccionada
        );
    };


    return (
        <Box p={3}>
            <Backdrop
                open={loading}
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h4" fontWeight="bold" mb={2}>
                Administrar cuentas
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mb: 3, backgroundColor: "#A05B71" }}
                onClick={handleOpenModal}
            >
                Añadir usuario
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#5A2836' }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#5A2836' }}>Correo Electrónico</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#5A2836' }}>Rol</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#5A2836' }}>Ícono</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#5A2836' }}>Salas</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            py: 4,
                                        }}
                                    >
                                        <img src={Nousers} alt="Sin usuarios" width="150" />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#A05B71",
                                                fontWeight: "bold",
                                                mt: 2,
                                            }}
                                        >
                                            Agrega un usuario para comenzar
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell>{account.email}</TableCell>
                                    <TableCell>{account.role}</TableCell>
                                    {/* Ícono condicional */}
                                    <TableCell>
                                        {account.role === "Administrador" && (
                                            <img src={usrAdmin} alt="Administrador" width="32" height="32" />
                                        )}
                                        {account.role === "Supervisor" && (
                                            <img src={usrSup} alt="Supervisor" width="32" height="32" />
                                        )}
                                        {account.role === "Monitor" && (
                                            <img src={usrMon} alt="Monitor" width="32" height="32" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {account.rooms.length > 30 ? (
                                            <Tooltip
                                                title={account.rooms}
                                                placement="top"
                                                arrow
                                            >
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        maxWidth: "200px", // Ajusta el ancho máximo visible
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {account.rooms}
                                                </Typography>
                                            </Tooltip>
                                        ) : (
                                            <Typography
                                                noWrap
                                                sx={{
                                                    maxWidth: "200px", // Ajusta el ancho máximo visible
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {account.rooms}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            sx={{
                                                position: "absolute",
                                                height: "100%", // Ocupa todo el alto de la celda
                                                left: "10%", // Ajusta la posición hacia la izquierda
                                                transform: "translateX(-50%)", // Centra la línea respecto a `left`
                                                backgroundColor: "#ccc", // Color opcional
                                                zIndex: 1,
                                            }}
                                        />
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, account)}
                                            aria-label="more"
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleEditClick(selectedAccount!); // Pasamos el account seleccionado
                                                    handleMenuClose(); // Cerramos el menú
                                                }}
                                            >
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setOpenDeleteModal(true);
                                                    handleMenuClose();
                                                }}
                                            >
                                                Eliminar
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openAddUserModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 700,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {/* Botón de cierre */}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{
                        textAlign: "left",
                        font: "normal normal 600 20px/54px Poppins",
                        letterSpacing: "0px",
                        color: "#574B4F",
                        opacity: 1,
                        fontSize: "20px",
                    }}>
                        {isEditing ? "Editar usuario" : "Añadir usuario"}
                    </Typography>
                    <Divider sx={{ my: 2, backgroundColor: "#CCC" }} />
                    {/* Form */}
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        {/* Nombre */}
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            error={!/^[a-zA-Z\s]*$/.test(formData.name)}
                            helperText={!/^[a-zA-Z\s]*$/.test(formData.name) && "Solo letras y espacios."}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Nombre completo del usuario">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            error={!/^[0-9]{10}$/.test(formData.phone)}
                            helperText={!/^[0-9]{10}$/.test(formData.phone) && "Debe tener 10 dígitos."}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Número telefónico">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Teléfono */}
                        {/* Correo y Confirmación de Correo */}
                        {/* Correo Electrónico */}
                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                            helperText={
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && "Ingrese un correo válido."
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Ejemplo: usuario@dominio.com">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            required
                        />

                        {/* Confirmar Correo Electrónico */}
                        <TextField
                            fullWidth
                            label="Confirmar Correo Electrónico"
                            name="confirmEmail"
                            value={formData.confirmEmail}
                            onChange={handleInputChange}
                            error={formData.email !== formData.confirmEmail}
                            helperText={
                                formData.email !== formData.confirmEmail && "Los correos electrónicos no coinciden."
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Debe coincidir con el correo ingresado.">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            required
                        />

                        {/* Contraseña y Confirmar Contraseña */}
                        {!isEditing && (
                            <>
                                {/* Contraseña */}
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={!isPasswordValid(formData.password)}
                                    helperText={
                                        !isPasswordValid(formData.password) && "La contraseña debe cumplir con los requisitos."
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Debe tener al menos 8 caracteres, incluir una letra mayúscula, una minúscula y un número.">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                />

                                {/* Confirmar contraseña */}
                                <TextField
                                    fullWidth
                                    label="Confirmar contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    error={formData.password !== formData.confirmPassword}
                                    helperText={
                                        formData.password !== formData.confirmPassword && "Las contraseñas no coinciden."
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Debe coincidir con la contraseña.">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                />

                            </>
                        )}
                    </Box>

                    {/* Checkbox */}
                    {!isEditing && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.useRecoveryEmail}
                                    onChange={handleInputChange}
                                    name="useEmailForRecovery"
                                />
                            }
                            label="Usar el correo de registro para la recuperación de cuenta"
                            sx={{ mt: 2 }}
                        />
                    )}
                    {/* Selección de roles */}
                    {/* Roles en línea horizontal */}
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                        Rol de usuario*
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        Seleccione el rol que el colaborador podrá desempeñar.
                    </Typography>
                    <RadioGroup
                        row
                        value={formData.profile}
                        onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    >
                        <Box display="flex" justifyContent="space-between" gap={2}>
                            <Box sx={{ border: "2px solid #C3B5E6", borderRadius: 2, padding: 2, textAlign: "center", width: "30%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                                <Radio value="Monitor" />
                                <img src={usrMon} alt="Monitor" width="50" height="50" />
                                <Typography fontWeight="bold" color="#9C27B0" mt={1}>
                                    Monitor
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    - Iniciar/detener campañas <br />
                                    - Consultar reportes
                                </Typography>
                            </Box>
                            <Box sx={{ border: "2px solid #FBC02D", borderRadius: 2, padding: 2, textAlign: "center", width: "30%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                                <Radio value="Supervisor" />
                                <img src={usrSup} alt="Supervisor" width="50" height="50" />
                                <Typography fontWeight="bold" color="#FB8C00" mt={1}>
                                    Supervisor
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    - Iniciar/detener campañas <br />
                                    - Consultar reportes <br />
                                    - Crear/eliminar campañas
                                </Typography>
                            </Box>
                            <Box sx={{ border: "2px solid #F48FB1", borderRadius: 2, padding: 2, textAlign: "center", width: "30%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                                <Radio value="Administrador" />
                                <img src={usrAdmin} alt="Administrador" width="50" height="50" />
                                <Typography fontWeight="bold" color="#F06292" mt={1}>
                                    Administrador
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    - Iniciar/detener campañas <br />
                                    - Consultar reportes <br />
                                    - Crear usuarios
                                </Typography>
                            </Box>
                        </Box>
                    </RadioGroup>



                    <Box p={3}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Salas a las que podrá acceder <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Typography variant="body2" mb={2}>
                            Seleccione las salas a las que el usuario tendrá acceso.
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* Checkboxes principales */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={areAllRoomsSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        indeterminate={selectedRooms.length > 0 && selectedRooms.length < rooms.length}
                                    />
                                }
                                label="Todas"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.allAndFuture}
                                        onChange={(e) => handleSelectAllAndFuture(e.target.checked)}
                                    />
                                }
                                label="Todas y futuras"
                            />

                            {/* Repetidor de Rooms */}
                            {rooms.map((room) => (
                                <Paper
                                    key={room.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 2,
                                        border: selectedRooms.includes(room.id) ? "2px solid #A05B71" : "1px solid #E0E0E0",
                                        backgroundColor: selectedRooms.includes(room.id) ? "#F8E1E7" : "#FFFFFF",
                                        borderRadius: 2,
                                        marginY: 1, // Espaciado vertical entre las salas
                                    }}
                                >
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            {/* Checkbox */}
                                            <Checkbox
                                                checked={selectedRooms.includes(room.id)}
                                                onChange={() => handleCheckboxChange(room.id)}
                                            />
                                        </Grid>
                                        <Grid item display="flex" alignItems="center">
                                            <HomeIcon sx={{ color: "#A05B71", mr: 1 }} />
                                            <Typography fontWeight="bold" color="#5A2836">
                                                {room.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {/* Información adicional */}
                                    <Box display="flex" gap={4} alignItems="center" pr={2}>
                                        <Box display="flex" alignItems="center" whiteSpace="nowrap">
                                            <Typography variant="caption" color="textSecondary" mr={0.5}>
                                                SMS largos:
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" fontWeight="bold">
                                                {room.long_sms}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" whiteSpace="nowrap">
                                            <Typography variant="caption" color="textSecondary" mr={0.5}>
                                                Llamada:
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" fontWeight="bold">
                                                {room.calls}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" whiteSpace="nowrap">
                                            <Typography variant="caption" color="textSecondary" mr={0.5}>
                                                Saldo:
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" fontWeight="bold">
                                                {room.credits}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}



                        </Box>
                    </Box>
                    {/* Buttons */}
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                        <Button onClick={handleCloseModal} color="secondary">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            variant="contained"
                            sx={{ backgroundColor: "#A05B71" }}
                            disabled={
                                !isFormValid() ||
                                formData.email !== formData.confirmEmail ||
                                (!isEditing && formData.password !== formData.confirmPassword)
                            }
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Eliminar cuenta
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        ¿Está seguro de que desea eliminar la cuenta?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button
                            onClick={() => setOpenDeleteModal(false)}
                            color="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
                            variant="contained"
                            sx={{ backgroundColor: "#A05B71" }}
                        >
                            Eliminar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal de error */}
            <Modal
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Error al agregar un usuario
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button
                            onClick={() => {
                                setErrorModalOpen(false); // Cierra el modal 
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Aceptar
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Box>
    );
};

export default ManageAccounts;
