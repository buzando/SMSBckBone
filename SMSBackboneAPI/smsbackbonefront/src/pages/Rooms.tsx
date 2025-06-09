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
import ChipBar from "../components/commons/ChipBar";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import iconlupa from "../assets/icon-lupa.svg";
import ClearIcon from "@mui/icons-material/Clear";
import infoicon from '../assets/Icon-info.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'
import NoResult from '../assets/NoResultados.svg'
import ArrowBackIosNewIcon from '../assets/icon-punta-flecha-bottom.svg';
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
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
    const [showChipBar, setShowChipBar] = useState(false);
    const [showEditChipBar, setShowEditChipBar] = useState(false);
    const [showDeleteChipBar, setShowDeleteChipBar] = useState(false);
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
                    setShowDeleteChipBar(true); // Mostrar ChipBar para eliminación exitosa
                    setTimeout(() => setShowDeleteChipBar(false), 3000);
                    GetRooms(); // Refresca la lista de salas
                }
            } catch {
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
        } catch {
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
                setShowEditChipBar(true); // Mostrar ChipBar para edición exitosa
                setTimeout(() => setShowEditChipBar(false), 3000);
                // Refresca la lista de salas después de la actualización
                GetRooms();
            }
        } catch {
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
                setShowChipBar(true); // Mostrar ChipBar
                setTimeout(() => setShowChipBar(false), 3000);
                setLoading(false);

            }
        } catch {
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

    const clearSearch = () => {
        setSearchTerm("");
    };

    return (
        <Box p={3} sx={{ marginTop: "-80px", width: '90%', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{ color: "#5A2836", mr: 1 }}
                >
                    <img
                        src={ArrowBackIosNewIcon}
                        alt="Regresar"
                        style={{ width: 24, height: 24, transform: 'rotate(270deg)' }}
                    />
                </IconButton>

                <Typography
                    variant="h4"
                    fontFamily="Poppins"
                    sx={{ color: "#5A2836", fontWeight: "bold" }}
                >
                    Salas
                </Typography>
            </Box>

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
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        width: "400px", // Ancho fijo como estaba antes
                    }}
                >
                    <img
                        src={iconlupa}
                        alt="Buscar"
                        style={{
                            height: "20px",
                            width: "20px",
                            marginRight: "8px",
                        }}
                    />
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
                    {searchTerm && (
                        <IconButton onClick={clearSearch} size="small" sx={{ color: "#A05B71" }}>
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gap: '16px',          // Espacio vertical (entre filas)
                        columnGap: '24px',    // Espacio horizontal (entre columnas)
                        gridTemplateColumns: '500px 500px',
                    }}
                >
                    {rooms.filter((room) => {
                        const term = searchTerm.toLowerCase();
                        const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                        return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
                    }).length === 0 ? (
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                mt={3}

                            >
                                <img
                                    src={NoResult}
                                    alt="No hay resultados"
                                    style={{
                                        width: "150px", // Tamaño ajustable
                                        height: "150px", // Tamaño ajustable
                                        marginBottom: "16px", // Espacio debajo de la imagen
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        color: "#833A53",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}
                                >
                                    No se encontraron resultados.
                                </Typography>
                            </Box>
                        </Grid>

                    ) : (
                        rooms
                            .filter((room) => {
                                const term = searchTerm.toLowerCase();
                                const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                                return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
                            })
                            .map((room) => (
                                <Grid item xs={12} sm={6} md={6} display="flex" justifyContent="flex-start"
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
                                            width: '100%',
                                            height: '108|px',
                                            maxWidth: 600, // << Cambia este valor para ajustar el tamaño
                                        }}
                                    >
                                        {/* Left Section: Icon and Room Details */}
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <HomeIcon
                                                sx={{
                                                    backgroundColor: '#796E71',
                                                    borderRadius: '50%',
                                                    padding: '8px',
                                                    fontSize: 40,
                                                    color: 'white',
                                                    width: "46px",
                                                    height: "46px",
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                    marginRight: '16px',
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: '500', fontSize: '16px', color: '#574B4F', fontFamily: "Poppins", }}
                                                >
                                                    {room.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontSize: '14px', color: '#574B4F', fontFamily: "Poppins", }}
                                                >
                                                    Cliente: {room.cliente}
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
                                                        color: '#8D4B62',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    SMS cortos: {room.short_sms.toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '14px',
                                                        color: '#8D4B62',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    SMS largos: {room.long_sms.toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '14px',
                                                        color: '#8D4B62',
                                                        fontWeight: '500',
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
                                </Grid> //Cerración del GRID items
                            ))
                    )}
                </Box>

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
                            width: 500, // Más ancho
                            height: 430, // Más alto
                            bgcolor: "background.paper",
                            fontFamily: "Poppins",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "left",
                                fontStyle: "normal",
                                fontVariant: "normal",
                                fontFamily: "Poppins",
                                fontWeight: "600",
                                letterSpacing: "1.12px",
                                color: "#574B4F",
                                opacity: 1,
                                fontSize: "28px",
                                marginBottom: "16px", // Separación con el contenido siguiente
                            }}
                        >
                            Añadir sala
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            sx={{
                                textAlign: "left",
                                font: "normal normal medium 16px/54px Poppins",
                                letterSpacing: "0px",
                                color: "#330F1B",
                                opacity: 1,
                                fontSize: "22px",
                                marginBottom: "8px", // Separación del texto y el input
                            }}
                        >
                            Nombre de la sala
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={newRoom.name}
                            error={errors.name}
                            helperText={errors.name ? "Nombre inválido, solo caracteres alfabéticos." : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewRoom((prev) => ({ ...prev, name: value }));
                                setErrors((prev) => ({ ...prev, name: !validateInput(value) }));
                            }}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <img
                                            src={errors.name ? infoiconerror : infoicon}
                                            alt="Info"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                marginLeft: "8px",
                                            }}
                                        />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <Typography
                            sx={{
                                textAlign: "left",
                                font: "normal normal medium 16px/54px Poppins",
                                letterSpacing: "0px",
                                color: "#330F1B",
                                opacity: 1,
                                fontSize: "22px",
                                marginBottom: "8px", // Separación del texto y el input
                            }}
                        >
                            Descripción
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={newRoom.description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewRoom((prev) => ({ ...prev, description: value }));
                                setErrors((prev) => ({ ...prev, description: !validateInput(value) }));
                            }}
                            error={errors.description}
                            helperText={errors.description ? "Descripción inválida, solo caracteres alfabéticos." : ""}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                        <img
                                            src={errors.description ? infoiconerror : infoicon}
                                            alt="Info"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                marginLeft: "8px",
                                            }}
                                        />
                                    </Tooltip>
                                ),
                            }}
                            inputProps={{ maxLength: 40 }}
                            sx={{ mb: 2 }}
                        />
                        <Divider sx={{ mt: 2, mb: 2 }} />
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
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: "#fff",
                                        }}
                                    />
                                ) : (
                                    "Crear"
                                )}
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
                            width: 500, // Más ancho
                            height: 430, // Más alto
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "left",
                                font: "normal normal 600 20px/54px Poppins",
                                letterSpacing: "0px",
                                color: "#574B4F",
                                opacity: 1,
                                fontSize: "28px",
                                marginBottom: "16px", // Separación con el contenido siguiente
                            }}
                        >
                            Editar sala
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                sx={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#330F1B",
                                    opacity: 1,
                                    fontSize: "22px",
                                    marginBottom: "8px", // Separación del texto y el input
                                }}
                            >
                                Nombre de la sala
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={newRoom.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                error={errors.name}
                                helperText={
                                    errors.name ? "Nombre inválido, solo caracteres alfabéticos." : ""
                                }
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                            <img
                                                src={errors.name ? infoiconerror : infoicon}
                                                alt="Info"
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    marginLeft: "8px",
                                                }}
                                            />
                                        </Tooltip>
                                    ),
                                }}
                                inputProps={{ maxLength: 40 }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                sx={{
                                    textAlign: "left",
                                    font: "normal normal medium 16px/54px Poppins",
                                    letterSpacing: "0px",
                                    color: "#330F1B",
                                    opacity: 1,
                                    fontSize: "22px",
                                    marginBottom: "8px", // Separación del texto y el input
                                }}
                            >
                                Descripción
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={newRoom.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                error={errors.description}
                                helperText={
                                    errors.description
                                        ? "Descripción inválida, solo caracteres alfabéticos."
                                        : ""
                                }
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip title="Solo caracteres alfabéticos. Longitud máxima de 40 caracteres">
                                            <img
                                                src={errors.description ? infoiconerror : infoicon}
                                                alt="Info"
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    marginLeft: "8px",
                                                }}
                                            />
                                        </Tooltip>
                                    ),
                                }}
                                inputProps={{ maxLength: 40 }}
                            />
                        </Box>
                        <Divider sx={{ mt: 2, mb: 2 }} />
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
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: "#fff",
                                        }}
                                    />
                                ) : (
                                    "Guardar Cambios"
                                )}
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
                            width: 450,
                            height: 280,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "left",
                                font: "normal normal 600 20px/54px Poppins",
                                letterSpacing: "0px",
                                color: "#574B4F",
                                opacity: 1,
                                fontSize: "20px", // Aplicación del tamaño de fuente específico
                                mb: 2, // Margen inferior opcional para espaciar el título del contenido
                            }}
                        >
                            Eliminar sala
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "left",
                                font: "normal normal normal 16px/22px Poppins",
                                letterSpacing: "0px",
                                color: "#574B4F",
                                opacity: 1,
                                fontSize: "16px", // Aplicación del tamaño de fuente específico
                                mb: 3, // Margen inferior opcional para espaciar del contenido posterior
                            }}
                        >
                            ¿Está seguro de que desea eliminar la sala? Esta acción no puede ser revertida.
                        </Typography>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 450,
                                height: 300,
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 4,
                                borderRadius: "12px",
                                display: "flex", // Contenedor flexible
                                flexDirection: "column", // Dirección de los elementos
                                justifyContent: "space-between", // Espaciado entre contenido y botones
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textAlign: "left",
                                        font: "normal normal 600 20px/54px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "20px",
                                        mb: 2,
                                    }}
                                >
                                    Eliminar sala
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        textAlign: "left",
                                        font: "normal normal normal 16px/22px Poppins",
                                        letterSpacing: "0px",
                                        color: "#574B4F",
                                        opacity: 1,
                                        fontSize: "16px",
                                        mb: 3,
                                    }}
                                >
                                    ¿Está seguro de que desea eliminar la sala? Esta acción no puede ser revertida.
                                </Typography>
                            </Box>

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseDeleteModal}
                                    sx={{
                                        font: "normal normal 600 12px/16px Poppins",
                                        letterSpacing: "1.12px",
                                        color: "#833A53",
                                        textTransform: "uppercase",
                                        opacity: 1,
                                        borderColor: "#833A53",
                                        padding: "0 12px",
                                        height: "50px",
                                        width: "100px",
                                        minWidth: "80px",
                                        lineHeight: "16px",
                                        fontSize: "12px",
                                        "&:hover": {
                                            backgroundColor: "#f9f4f5",
                                        },
                                    }}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteRoom}
                                    sx={{
                                        font: "normal normal 600 12px/16px Poppins",
                                        letterSpacing: "1.12px",
                                        color: "#fff",
                                        textTransform: "uppercase",
                                        opacity: 1,
                                        backgroundColor: "#833A53",
                                        padding: "0 12px",
                                        height: "50px",
                                        width: "100px",
                                        minWidth: "80px",
                                        lineHeight: "16px",
                                        fontSize: "12px",
                                        "&:hover": {
                                            backgroundColor: "#A54261",
                                        },
                                    }}
                                >
                                    Eliminar
                                </Button>
                            </Box>
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
            {showChipBar && (
                <ChipBar
                    message="La sala ha sido añadida correctamente."
                    buttonText="Cerrar"
                    onClose={() => setShowChipBar(false)}
                />
            )}
            {showEditChipBar && (
                <ChipBar
                    message="La sala ha sido editada correctamente."
                    buttonText="Cerrar"
                    onClose={() => setShowEditChipBar(false)}
                />
            )}

            {showDeleteChipBar && (
                <ChipBar
                    message="La sala ha sido eliminada correctamente."
                    buttonText="Cerrar"
                    onClose={() => setShowDeleteChipBar(false)}
                />
            )}

        </Box>
    );
};

export default Rooms;
