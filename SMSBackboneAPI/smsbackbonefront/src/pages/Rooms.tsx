import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

type Room = {
    id: string | number;
    name: string;
    cliente: string;
    description: string;
    credits: number;
    short_sms: number;
    long_sms: number;
    calls: number;
};

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newRoom, setNewRoom] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({
        name: false,
        description: false,
    });
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); // Estado del modal de eliminación
    const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


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
            } catch  {
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
        } catch  {
            handleOpenErrorModal("Error al traer las salas");
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
        if (selectedRoom!) {
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
        const formData = JSON.parse(usuario!);

        try {
            // Define los datos que se enviarán en la solicitud
            const data = {
                id: selectedRoom?.id || 0,
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
        } catch  {
            handleOpenErrorModal("Error al actualizar sala");
        } finally {
            setLoading(false); // Detén el loader
            handleCloseEditModal(); // Cierra el modal
        }
    };



    const handleCreateRoom = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");

        const formData = JSON.parse(usuario!);
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
        } catch  {
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
            <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
                {/* Botón de Añadir Sala */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: "#A05B71",
                        height: "100%", // Asegura que coincida con la altura del input
                        marginRight: "16px", // Espacio entre el botón y el buscador
                    }}
                    onClick={handleOpenModal}
                >
                    Añadir Sala
                </Button>

                {/* Contenedor del Buscador */}
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        width: "400px", // Ancho fijo como estaba antes
                    }}
                >
                    <span className="material-icons" style={{ color: "#A05B71", marginRight: "8px" }}>
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: "14px",
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: "transparent",
                        }}
                    />
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                    <Grid container spacing={2}>
                        {rooms.filter((room) => {
                            const term = searchTerm.toLowerCase();
                            const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                            return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
                        }).length === 0 ? (
                            <Grid item xs={12}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        marginTop: "20px",
                                        color: "#833A53",
                                    }}
                                >
                                    No se encontraron resultados.
                                </Typography>
                            </Grid>
                        ) : (
                            rooms
                                .filter((room) => {
                                    const term = searchTerm.toLowerCase();
                                    const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                                    return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
                                })
                                .map((room) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={room.id}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '8px',
                                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                                padding: '16px',
                                                height: '100%',
                                            }}
                                        >
                                            {/* Left Section: Icon and Room Details */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <HomeIcon
                                                    sx={{
                                                        backgroundColor: '#B0B0B0',
                                                        borderRadius: '50%',
                                                        padding: '8px',
                                                        fontSize: 40,
                                                        color: 'white',
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                        marginRight: '16px',
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}
                                                    >
                                                        {room.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontSize: '14px', color: '#888' }}
                                                    >
                                                        Cliente: {room.cliente}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#888',
                                                            fontStyle: 'italic',
                                                        }}
                                                    >
                                                        {room.description}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Right Section: Metrics and Button */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ textAlign: 'right', marginRight: '16px' }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#833A53',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        SMS cortos: {room.short_sms.toLocaleString()}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#833A53',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        SMS largos: {room.long_sms.toLocaleString()}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#833A53',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Llamada: {room.calls.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <IconButton onClick={(event) => handleMenuOpen(event, room)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={menuAnchorEl}
                                                        open={Boolean(menuAnchorEl)}
                                                        onClose={handleMenuClose}
                                                        PaperProps={{
                                                            sx: {
                                                                borderRadius: '8px',
                                                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem onClick={handleOpenEditModal}>
                                                            <EditIcon sx={{ marginRight: 1, color: '#A05B71' }} />
                                                            <Typography>Editar</Typography>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleOpenDeleteModal(room)}>
                                                            <DeleteIcon sx={{ marginRight: 1, color: '#A05B71' }} />
                                                            <Typography>Eliminar</Typography>
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))
                        )}
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
                                sx={{
                                    backgroundColor: "#A05B71", // Mismo color que el botón "Añadir Sala"
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "#8B4D61", // Color más oscuro para el hover
                                    },
                                    height: "100%",
                                    marginLeft: "8px", // Espaciado opcional si se requiere
                                }}
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
                                sx={{
                                    backgroundColor: "#A05B71", // Mismo color que el botón "Añadir Sala"
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "#8B4D61", // Color más oscuro para el hover
                                    },
                                    height: "100%",
                                    marginLeft: "8px", // Espaciado opcional si se requiere
                                }}
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
