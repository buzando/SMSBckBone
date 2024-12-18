import React, { useState, useEffect } from "react";
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
    FormControl,
    FormLabel,
    Radio,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import usrAdmin from "../assets/usrAdmin.svg";
import usrSup from "../assets/usrSup.svg";
import usrMon from "../assets/usrMon.svg"

type Account = {
    id: number;
    name: string;
    email: string;
    rooms: string;
    status: boolean;
};

const ManageAccounts: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [rooms, setrooms] = useState<string[]>([]); 
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [ConfirmationEmail, setConfirmationEmail] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        useRecoveryEmail: false,
        allAndFuture: false,
        profile: "", // Nuevo campo para el rol seleccionado
        rooms: "",   // Nuevo campo para los IDs de salas seleccionadas
    });
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
        setSelectedAccount(account);
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
                Rooms: selectedRooms.join(","),
                IdCliente: clientId,
                IdUsuario: parsedUserData.id
            };

            // Make POST request
            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*",
            };

            const apiEndpoint = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_USERS}`; // Cambia por tu endpoint real
            const response = await axios.post(apiEndpoint, data, {
                headers
            });

            if (response.status === 200) {
                fetchAccounts();
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    rooms: "",
                });
                setOpenAddUserModal(false);
            }
        } catch (error) {
            if (error.response.data.code === "DuplicateUserName") {
                setErrorMessage(
                    "Email Registrado previamente."
                );
            }
            if (error.response.data.code === "ConfirmationUnsent") {
                setErrorMessage(
                    "No se pudo enviar el mail de confirmacion"
                );
            }
            if (error.response.data.code === "agregarusuario") {
                setErrorMessage(
                    "Error al Agregar un usuario. por favor intente más tarde"
                );
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
        } catch (error) {
            console.error("Error al obtener las cuentas:", error);
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
                const roomsData = Array.isArray(response.data) ? response.data : []; // Asegurarse de que es un array
                setrooms(roomsData); // Actualizar conexiones
            }
        } catch (error) {
            console.error("Error al obtener los rooms:", error);
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, []);

 

    return (
        <Box p={3}>
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
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{account.email}</TableCell>
                                <TableCell>{account.role}</TableCell>
                                {/* Ícono condicional */}
                                <TableCell>
                                    {account.role === "Admin" && (
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
                                    <Tooltip title={account.rooms || "No hay salas asignadas"} arrow>
                                        <Typography
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: 200,
                                            }}
                                        >
                                            {account.rooms || "No hay salas asignadas"}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
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
                                        {/*<MenuItem onClick={() => handleEditClick(account)}>*/}
                                        {/*    Editar*/}
                                        {/*</MenuItem>*/}
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
                        ))}
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
                        maxHeight: "80vh", // Altura máxima
                        overflowY: "auto", // Habilitar scroll vertical
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" mb={3}>
                        Añadir usuario
                    </Typography>

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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Ingrese el nombre completo del usuario">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Correo */}
                        <TextField
                            fullWidth
                            label="Correo"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Ingrese el correo electrónico del usuario">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Teléfono */}
                        <TextField
                            fullWidth
                            label="Teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Ingrese el número telefónico del usuario">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Checkbox */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.useEmailForRecovery}
                                onChange={handleInputChange}
                                name="useEmailForRecovery"
                            />
                        }
                        label="Usar el correo de registro para la recuperación de cuenta"
                        sx={{ mt: 2 }}
                    />
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
                            {/* Monitor */}
                            <Box
                                sx={{
                                    border: "2px solid #C3B5E6",
                                    borderRadius: 2,
                                    padding: 2,
                                    textAlign: "center",
                                    width: "30%", // Ancho ajustable
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
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

                            {/* Supervisor */}
                            <Box
                                sx={{
                                    border: "2px solid #FBC02D",
                                    borderRadius: 2,
                                    padding: 2,
                                    textAlign: "center",
                                    width: "30%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
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

                            {/* Administrador */}
                            <Box
                                sx={{
                                    border: "2px solid #F48FB1",
                                    borderRadius: 2,
                                    padding: 2,
                                    textAlign: "center",
                                    width: "30%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
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
                        <Button onClick={handleAddUser} variant="contained" sx={{ backgroundColor: "#A05B71" }}>
                            Guardar
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
