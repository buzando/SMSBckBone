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
    Tabs,
    Tab,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem as MuiMenuItem,
    Stepper,
    Step,
    StepLabel,
    RadioGroup,
    Radio,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

type Account = {
    id: number;
    name: string;
    email: string;
    conecctions: string;
    restrictions: string;
    status: boolean;
};

const ManageAccounts: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [conections, setConections] = useState<string[]>([]); // Inicializar como array vacío
    const [restriction, setRestriction] = useState<string[]>([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, account: Account) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedAccount(account);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
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
                setOpenDeleteModal(false); // Cerrar el modal
                setSelectedAccount(null); // Limpiar la cuenta seleccionada
            }
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

            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GETBYCLIENT_USERS
                }?Client=${clientId}`;
            const response = await axios.get(request);
            if (response.status === 200) {
                setAccounts(response.data);
            }
        } catch (error) {
            console.error("Error al obtener las cuentas:", error);
        }
    };
    useEffect(() => {

        fetchAccounts();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        birthDate: "",
        gender: "",
        email: "",
        password: "",
        phone: "",
        twoFactorEnabled: false,
        twoFactorMethod: "",
        connections: [],
        restrictions: [],
        tabIndex: 0,
    });

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
                setConections(roomsData); // Actualizar conexiones
                setRestriction(roomsData); // También actualizar restricciones
                setActiveStep(1); // Mueve al siguiente paso solo si se obtiene la data correctamente
            }
        } catch (error) {
            console.error("Error al obtener los rooms:", error);
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
            const data = {
                FirstName: formData.name,
                LastName: formData.lastName,
                BirthDate: new Date(formData.birthDate).toISOString(),
                Gender: formData.gender,
                Email: formData.email,
                Password: formData.password,
                PhoneNumber: formData.phone,
                TwoFactorEnabled: formData.twoFactorEnabled,
                Conecctions: conections
                    .filter((connection) => formData.connections.includes(connection.id))
                    .map((connection) => connection.id)
                    .join(", "),
                Restrictions: restriction
                    .filter((restrictionItem) => formData.restrictions.includes(restrictionItem.id))
                    .map((restrictionItem) => restrictionItem.id)
                    .join(", "),
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
                setActiveStep(0); // Reset step to 0
                setFormData({ // Reset form fields
                    name: "",
                    lastName: "",
                    birthDate: "",
                    gender: "",
                    email: "",
                    password: "",
                    phone: "",
                    twoFactorEnabled: false,
                    twoFactorMethod: "",
                    connections: [],
                    restrictions: [],
                    tabIndex: 0,
                });
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
    };

    const isFormValid = () => {
        const requiredFields = [
            formData.name,
            formData.lastName,
            formData.birthDate,
            formData.gender,
            formData.email,
            formData.password,
            formData.phone,
        ];

        // Verifica que todos los campos requeridos estén llenos
        const areFieldsFilled = requiredFields.every((field) => field.trim() !== "");

        // Verifica que al menos una conexión esté seleccionada
        const hasConnectionSelected = formData.connections.length > 0;

        return areFieldsFilled && hasConnectionSelected;
    };

    return (
        <Box p={3}>

            {activeStep === 0 && (
                <>
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                        Administrar cuentas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mb: 3, backgroundColor: "#A05B71" }}
                        onClick={fetchRooms} // Llama a la función al hacer clic
                    >
                        Añadir colaborador
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Correo Electrónico</TableCell>
                                    <TableCell>Conexiones</TableCell>
                                    <TableCell>Restricciones</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>
                                            <Tooltip title={account.conecctions || "No hay conexiones"} arrow>
                                                <Typography
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: 200,
                                                    }}
                                                >
                                                    {account.conecctions || "No hay conexiones"}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={account.restrictions || "No hay restricciones"} arrow>
                                                <Typography
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: 200,
                                                    }}
                                                >
                                                    {account.restrictions || "No hay restricciones"}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {account.status ? "Activo" : "Inactivo"}
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
                                                <MenuItem
                                                    onClick={() => {
                                                        console.log("Editar:", account);
                                                        handleMenuClose();
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                </>
            )}

            {activeStep === 1 && (
                <Box>
                    <Tabs
                        value={formData.tabIndex}
                        onChange={(e, value) => setFormData({ ...formData, tabIndex: value })}
                    >
                        <Tab label="Añadir colaborador" />
                        <Tab label="Conexiones" />
                    </Tabs>

                    {formData.tabIndex === 0 && (
                        <Box p={3}>
                            <Typography variant="h6">Añadir Colaborador</Typography>
                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={2}>
                                <TextField
                                    label="Nombre"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                                <TextField
                                    label="Apellidos"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, lastName: e.target.value })
                                    }
                                    required
                                />
                                <TextField
                                    label="Fecha de nacimiento"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    type="date"
                                    onChange={(e) =>
                                        setFormData({ ...formData, birthDate: e.target.value })
                                    }
                                    required
                                />
                                <FormControl>
                                    <InputLabel>Género</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={(e) =>
                                            setFormData({ ...formData, gender: e.target.value })
                                        }
                                    >
                                        <MuiMenuItem value="Masculino">Masculino</MuiMenuItem>
                                        <MuiMenuItem value="Femenino">Femenino</MuiMenuItem>
                                        <MuiMenuItem value="Otro">Otro</MuiMenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Correo electrónico"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                                <TextField
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                />
                                <TextField
                                    label="Teléfono"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.twoFactorEnabled}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    twoFactorEnabled: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Activar verificación en dos pasos"
                                />
                            </Box>
                        </Box>
                    )}

                    {formData.tabIndex === 1 && (
                        <Box p={3}>
                            <Typography variant="h6" gutterBottom>
                                Conexiones
                            </Typography>
                            <Box display="flex" justifyContent="space-between" gap={4}>
                                {/* Conexiones */}
                                <Box flex={1}>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 2, mt: 2, maxHeight: 300, overflowY: "auto" }}
                                    >
                                        <RadioGroup
                                            value={formData.assignFutureConnections}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    assignFutureConnections: e.target.value === "true",
                                                })
                                            }
                                        >
                                            <FormControlLabel
                                                value={true}
                                                control={<Radio />}
                                                label="Asignar futuras conexiones"
                                                sx={{ alignItems: "center" }}
                                            />
                                        </RadioGroup>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1 }}>
                                            {/* Seleccionar todo */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                                }}
                                            >
                                                <Checkbox
                                                    checked={
                                                        formData.connections.length === conections.length // Total de conexiones disponibles
                                                    }
                                                    indeterminate={
                                                        formData.connections.length > 0 &&
                                                        formData.connections.length < conections.length
                                                    }
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                connections: conections.map((c: any) => c.id), // Usar el ID u otra propiedad relevante
                                                            }));
                                                        } else {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                connections: [],
                                                            }));
                                                        }
                                                    }}
                                                    sx={{ marginRight: 2 }}
                                                />
                                                <Typography>Seleccionar todo</Typography>
                                            </Box>
                                            {/* Lista de conexiones */}
                                            {Array.isArray(conections) && conections.map((connection: any) => (
                                                <Box
                                                    key={connection.id}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <Checkbox
                                                        value={connection.id}
                                                        checked={formData.connections.includes(connection.id)}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value, 10);
                                                            const checked = e.target.checked;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                connections: checked
                                                                    ? [...prev.connections, value]
                                                                    : prev.connections.filter((c) => c !== value),
                                                            }));
                                                        }}
                                                        sx={{ marginRight: 2 }}
                                                    />
                                                    <Typography>{connection.name}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Box>
                                {/* Restricciones */}
                                <Box flex={1}>
                                    <Typography variant="h6" gutterBottom>
                                        Restricciones
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 2, maxHeight: 300, overflowY: "auto" }}
                                    >
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 1 }}>
                                            {/* Seleccionar todo */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                                }}
                                            >
                                                <Checkbox
                                                    checked={
                                                        formData.restrictions.length === restriction.length // Total de restricciones disponibles
                                                    }
                                                    indeterminate={
                                                        formData.restrictions.length > 0 &&
                                                        formData.restrictions.length < restriction.length
                                                    }
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                restrictions: restriction.map((r: any) => r.id), // Usar el ID u otra propiedad relevante
                                                            }));
                                                        } else {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                restrictions: [],
                                                            }));
                                                        }
                                                    }}
                                                    sx={{ marginRight: 2 }}
                                                />
                                                <Typography>Seleccionar todo</Typography>
                                            </Box>
                                            {/* Lista de restricciones */}
                                            {Array.isArray(restriction) && restriction.map((restrictionItem: any) => (
                                                <Box
                                                    key={restrictionItem.id}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <Checkbox
                                                        value={restrictionItem.id}
                                                        checked={formData.restrictions.includes(restrictionItem.id)}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value, 10);
                                                            const checked = e.target.checked;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                restrictions: checked
                                                                    ? [...prev.restrictions, value]
                                                                    : prev.restrictions.filter((r) => r !== value),
                                                            }));
                                                        }}
                                                        sx={{ marginRight: 2 }}
                                                    />
                                                    <Typography>{restrictionItem.name}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" gap={2} p={3}>
                        <Button onClick={() => setActiveStep(0)} color="secondary">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            variant="contained"
                            sx={{ backgroundColor: "#A05B71" }}
                            disabled={!isFormValid()} // Deshabilitar si no es válido
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            )}
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
                                setActiveStep(0); // Regresa al paso 0
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

