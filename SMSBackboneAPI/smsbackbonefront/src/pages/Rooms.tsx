import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Paper,
    IconButton,
    CircularProgress,
    Divider,
    Modal,
    Fade,
    Backdrop,
    Tooltip,
    Menu,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface Room {
    id: number;
    name: string;
    client: string;
    description: string;
}

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [newRoom, setNewRoom] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({
        name: false,
        description: false,
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); // Estado del modal de eliminación
    const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");

    const handleOpenErrorModal = (title: string) => {
        setErrorTitle(title);
        setErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setErrorModalOpen(false);
    };
    const handleOpenDeleteModal = (room: Room) => {
        setSelectedRoom(room); // Almacena la sala seleccionada
        setDeleteModalOpen(true); // Abre el modal
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false); // Cierra el modal
        setSelectedRoom(null); // Limpia la sala seleccionada
    };
    const handleDeleteRoom = async () => {
        if (selectedRoom) {
            setLoading(true);
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                };
                const response = await axios.get(
                    `${import.meta.env.VITE_SMS_API_URL +
                    import.meta.env.VITE_API_DELETE_ROOM}?id=${selectedRoom.id}`,
                    { headers }
                );

                if (response.status === 200) {
                    console.log(`Room ${selectedRoom.id} eliminado`);
                    GetRooms(); // Refresca la lista de salas
                }
            } catch (error) {
                handleOpenErrorModal("Error al eliminar sala");
            } finally {
                setLoading(false);
                handleCloseDeleteModal(); // Cierra el modal
            }
        }
    };

    const GetRooms = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        try {
            const request = `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_GetRooms}?email=${obj?.email}`;
            const response = await axios.get(request);

            if (response.status === 200) {
                setRooms(response.data);
            }
        } catch (error) {
            handleOpenErrorModal("Error al traer sala");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetRooms();
    }, []);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleOpenEditModal = () => {
        if (selectedRoom) {
            setNewRoom({
                name: selectedRoom.name,
                description: selectedRoom.description,
            });
            setEditModalOpen(true); // Abre el modal de edición
            handleMenuClose(); // Cierra el menú después de abrir el modal
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedRoom(null); // Limpia el room seleccionado
    };

    const handleUpdateRoom = async () => {
        setLoading(true); // Muestra el loader mientras se procesa la solicitud
        const usuario = localStorage.getItem("userData");
        const formData = JSON.parse(usuario);

        try {
            // Define los datos que se enviarán en la solicitud
            const data = {
                id: selectedRoom.id,
                iduser: formData.id,
                name: newRoom.name,
                description: newRoom.description,
                credits: 0,
                long_sms: 0,
                calls: 0,
                idClient: formData.idCliente,
            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };

            // Realiza la solicitud POST al endpoint
            const response = await axios.post(
                `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_UPDATE_ROOM}`,
                data,
                { headers },
            );

            console.log(`Response: ${response}`);
            if (response.status === 200) {
                // Refresca la lista de salas después de la actualización
                GetRooms();
            }
        } catch (error) {
            handleOpenErrorModal("Error al actualizar sala");
        } finally {
            setLoading(false); // Detén el loader
            handleCloseEditModal(); // Cierra el modal
        }
    };



    const handleCreateRoom = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");

        const formData = JSON.parse(usuario);
        try {
            const data = {
                iduser: formData.id,
                name: newRoom.name,
                description: newRoom.description,
                credits: 0,
                long_sms: 0,
                calls: 0,
                idClient: formData.idCliente,

            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };
            const response = await axios.post(
                `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_NEW_ROOM
                }`,
                data,
                { headers },
            );

            console.log(`Response: ${response}`);
            if (response.status === 200) {

                setLoading(false);

            }
        } catch (error) {
            handleOpenErrorModal("Error al crear sala");
        }
        // Logic to create a new room
        console.log("Room Created:", newRoom);
        GetRooms();
        handleCloseModal();
    };

    const handleInputChange = (
        field: "name" | "description",
        value: string
    ) => {
        setNewRoom((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: !validateInput(value) }));
    };

    const validateInput = (value: string) => {
        return /^[a-zA-ZÀ-ÿ\s]*$/.test(value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, room: Room) => {
        setMenuAnchorEl(event.currentTarget); // Abre el menú contextual
        setSelectedRoom(room); // Selecciona el room correctamente
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null); // Cierra el menú
    };


    return (
        <Box p={4}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Salas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" alignItems="center" mb={2}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mr: 2, backgroundColor: "#A05B71" }}
                    onClick={handleOpenModal}
                >
                    Añadir Sala
                </Button>
                <TextField
                    placeholder="Buscar"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {rooms
                        .filter((room) =>
                            room.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((room, index) => (
                            <Grid item xs={12} md={6} lg={4} key={room.id}>
                                <Paper elevation={3} sx={{ p: 2, borderRadius: "12px" }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <HomeIcon sx={{ fontSize: 40, mr: 2, color: "#A05B71" }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                {room.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Cliente: {room.client}
                                            </Typography>
                                        </Box>
                                        <Box flexGrow={1} />
                                        <IconButton onClick={(e) => handleMenuOpen(e, room)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleOpenEditModal}>Editar</MenuItem>
                                            <MenuItem onClick={() => handleOpenDeleteModal(room)}>Eliminar</MenuItem>
                                        </Menu>

                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Descripción: {room.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                </Grid>
            )}

            {/* Modal for adding room */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
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
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Añadir sala
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            label="Nombre de la sala"
                            variant="outlined"
                            value={newRoom.name}
                            onChange={(e) =>
                                setNewRoom((prev) => ({ ...prev, name: e.target.value }))
                            }
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <InfoOutlinedIcon color="action" />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            variant="outlined"
                            value={newRoom.description}
                            onChange={(e) =>
                                setNewRoom((prev) => ({ ...prev, description: e.target.value }))
                            }
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <InfoOutlinedIcon color="action" />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="outlined" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateRoom}
                                disabled={!newRoom.name || !newRoom.description}
                            >
                                Crear
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Modal for editing room */}
            <Modal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={editModalOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Editar sala
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            label="Nombre de la sala"
                            variant="outlined"
                            value={newRoom.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            error={errors.name}
                            helperText={errors.name ? "Nombre inválido, solo caracteres alfabéticos." : ""}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <InfoOutlinedIcon color="action" />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            variant="outlined"
                            value={newRoom.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            error={errors.description}
                            helperText={errors.description ? "Descripción inválida, solo caracteres alfabéticos." : ""}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <InfoOutlinedIcon color="action" />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="outlined" onClick={handleCloseEditModal}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateRoom}
                                disabled={
                                    !newRoom.name || !newRoom.description || errors.name || errors.description
                                } // Desactiva si hay errores o campos vacíos
                            >
                                Guardar cambios
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={deleteModalOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Eliminar sala
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            ¿Está seguro de que desea eliminar la sala? Esta acción no puede ser revertida.
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="outlined" onClick={handleCloseDeleteModal}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteRoom}
                            >
                                Eliminar
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={errorModalOpen}
                onClose={handleCloseErrorModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={errorModalOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            {errorTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Algo salió mal. Inténtelo de nuevo o regrese más tarde.
                        </Typography>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                onClick={handleCloseErrorModal}
                                sx={{ backgroundColor: "#A05B71", color: "#fff" }}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Rooms;
