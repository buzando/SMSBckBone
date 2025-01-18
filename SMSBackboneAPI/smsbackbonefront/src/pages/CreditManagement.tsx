import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Fade,
    Backdrop,
    Divider,
    TextField,
    Button,
    Select,
    CircularProgress,
    MenuItem as MuiMenuItem,
      List,
    ListItem,
    ListItemText,
    InputAdornment,
    ClickAwayListener,
    Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import TrashIcon from "../assets/Icon-trash.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
type Rooms = {
    id: string | number;
    name: string;
    cliente: string;
    description: string;
    credits: number;
    short_sms: number;
    long_sms: number;
    calls: number;
};

const CreditManagement: React.FC = () => {
    const [rooms, setrooms] = useState<Rooms[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [selectedRoom2, setSelectedRoom2] = useState<Rooms | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [transferAmount, setTransferAmount] = useState<number | null>(null);
    const [searchTerm2, setSearchTerm2] = useState("");
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const [openDropdown2, setOpenDropdown2] = useState<boolean>(false);
    const [searchTerm3, setSearchTerm3] = useState(""); 
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };



    const GetCredits = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        try {
            const request = `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_GetRooms}?email=${obj?.email}`;
            const response = await axios.get(request);

            if (response.status === 200) {
                setrooms(response.data);
                localStorage.setItem('ListRooms', JSON.stringify(response.data));
            }
        } catch {
            console.error("Error al traer los créditos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetCredits();
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, room: Rooms) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedRoom2(room);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOpenModal = () => {
        if (selectedRoom2) {
            setSearchTerm3(selectedRoom2.name); // Preselecciona el nombre en el campo de búsqueda
        }
        setModalOpen(true);
        setMenuAnchorEl(null); // Cierra el menú al abrir el modal
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRoom(null); // Clear selected room
        setSelectedRoom2(null); // Clear selected room2
        setSelectedChannel(""); // Reset the channel selection
        setTransferAmount(null); // Clear the transfer amount
        setSearchTerm2(""); // Clear search term for room
        setSearchTerm3(""); // Clear search term for room2
        setOpenDropdown(false); // Close any open dropdowns
        setOpenDropdown2(false);
        setModalOpen(false);
    };


    const handleSelectRoom = (room: Rooms) => {
        setSelectedRoom(room);
        setSearchTerm2(room.name);
        handleCloseDropdown();
    };

    const filteredRooms = rooms.filter(
        (room) =>
            room.id !== selectedRoom2?.id && // Excluye la sala destino seleccionada
            room.name.toLowerCase().includes(searchTerm2.toLowerCase()) // Aplica el filtro de búsqueda
    );

    const handleOpenDropdown = () => {
        setOpenDropdown(true);
    };

    const handleCloseDropdown = () => {
        setOpenDropdown(false);
    };

    const filteredRooms2 = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm3.toLowerCase())
    );

    const handleSelectRoom2 = (room: Rooms) => {
        setSelectedRoom2(room); // Actualiza la sala seleccionada
        setSearchTerm3(room.name); // Muestra el nombre de la sala seleccionada en el campo de texto
        setOpenDropdown2(false); // Cierra el desplegable
    };

    const handleOpenDropdown2 = () => {
        setOpenDropdown2(true); // Abre el desplegable
    };

    const handleCloseDropdown2 = () => {
        setOpenDropdown2(false); // Cierra el desplegable
    };

    const getAvailableCredits = () => {
        if (!selectedRoom2) return 0; // Si no hay sala seleccionada, retorna 0

        if (selectedChannel === "SMS Cortos") {
            return selectedRoom2.short_sms || 0; // Créditos de SMS Cortos
        } else if (selectedChannel === "SMS Largos") {
            return selectedRoom2.long_sms || 0; // Créditos de SMS Largos
        }

        return 0; // Por defecto, 0 créditos si no hay un canal válido seleccionado
    };

    const handleTransferSubmit = async () => {
        if (!selectedRoom2 || !selectedRoom || !selectedChannel || !transferAmount) {
            
            return;
        }

        setLoading(true);

        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el ID del usuario.");
            setLoading(false);
            return;
        }

        const payload = {
            oldRoom: selectedRoom2.name,
            Channel: selectedChannel,
            transfer: transferAmount,
            newRoom: selectedRoom.name,
            idUser: obj.id,
        };

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_TRANSFER_ROOMS}`;
            const response = await axios.post(requestUrl, payload);

            if (response.status === 200) {
                setToastMessage("La transferencia de créditos fue realizada correctamente.");
                GetCredits();
                handleCloseModal();
            } else {
                setErrorModal({
                    title: "Error al transferir créditos",
                    message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
                });
            }
        } catch {
            setErrorModal({
                title: "Error al transferir créditos",
                message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
            });
        } finally {
            setLoading(false);
        }
    };

    const closeToast = () => {
        setToastMessage(null);
    };

    const closeErrorModal = () => {
        setErrorModal(null);
    };


    return (
        <Box p={4}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Gestión de Créditos
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        width: "400px",
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
                    {rooms.filter((rooms) => {
                        const term = searchTerm.toLowerCase();
                        const nameWords = rooms.name.toLowerCase().split(" ");
                        return nameWords.some((word) => word.startsWith(term));
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
                            .filter((rooms) => {
                                const term = searchTerm.toLowerCase();
                                const nameWords = rooms.name.toLowerCase().split(" ");
                                return nameWords.some((word) => word.startsWith(term));
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
                                                    sx={{ fontSize: '14px', color: '#888', fontStyle: 'italic' }}
                                                >
                                                    {room.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ textAlign: 'right', marginRight: '16px' }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textAlign: 'right',
                                                        font: 'normal normal medium 12px/54px Poppins',
                                                        letterSpacing: '0px',
                                                        color: '#8D4B62',
                                                        opacity: 1,
                                                    }}
                                                >
                                                    SMS # Cortos: {room.short_sms.toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textAlign: 'right',
                                                        font: 'normal normal medium 12px/54px Poppins',
                                                        letterSpacing: '0px',
                                                        color: '#8D4B62',
                                                        opacity: 1,
                                                    }}
                                                >
                                                    SMS # Largos: {room.long_sms.toLocaleString()}
                                                </Typography>
                                            </Box>
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
                                                <MenuItem onClick={handleOpenModal}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img
                                                            src={TrashIcon}
                                                            alt="Distribución de créditos"
                                                            width="24"
                                                            height="24"
                                                            style={{ marginRight: "8px" }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                fontSize: '14px',
                                                                fontWeight: 'medium',
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            Distribución de créditos
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))
                    )}
                </Grid>
            )}
            
            {/* Modal */}
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
                            width: 500,
                            maxHeight: "80vh", // Limita la altura máxima
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "12px",
                            overflowY: "auto", // Habilita el scroll vertical
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Distribución de créditos
                            </Typography>
                            <IconButton onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Seleccionar sala destino
                        </Typography>
                        <ClickAwayListener onClickAway={handleCloseDropdown2}>
                            <Box>
                                <TextField
                                    fullWidth
                                    placeholder="Seleccionar sala destino"
                                    value={searchTerm3}
                                    onClick={handleOpenDropdown2}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ArrowDropDownIcon style={{ color: "#A05B71" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            border: "1px solid #A05B71",
                                            backgroundColor: "#f5f5f5",
                                            "&:hover fieldset": {
                                                borderColor: "#833A53",
                                            },
                                        },
                                    }}
                                />
                                {openDropdown2 && (
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            position: "absolute",
                                            zIndex: 10,
                                            width: "87%",
                                            maxHeight: 300,
                                            overflowY: "auto",
                                            mt: 1,
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Box p={2} display="flex" alignItems="center">
                                            <TextField
                                                fullWidth
                                                placeholder="Buscar sala..."
                                                value={searchTerm3}
                                                onChange={(e) => setSearchTerm3(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <HomeIcon style={{ color: "#A05B71" }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setSearchTerm3("")}
                                                            >
                                                                <ClearIcon style={{ color: "#A05B71" }} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    mb: 2,
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: "8px",
                                                        border: "1px solid #A05B71",
                                                        backgroundColor: "#f5f5f5",
                                                        "&:hover fieldset": {
                                                            borderColor: "#833A53",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                        <List>
                                            {filteredRooms2.length > 0 ? (
                                                filteredRooms2.map((room) => (
                                                    <ListItem
                                                        key={room.id}
                                                        component="button"
                                                        onClick={() => handleSelectRoom2(room)}
                                                    >
                                                        <HomeIcon style={{ color: "#A05B71", marginRight: 10 }} />
                                                        <ListItemText
                                                            primary={room.name}
                                                            secondary={room.description}
                                                        />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary="No se encontraron resultados" />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>
                                )}
                            </Box>
                        </ClickAwayListener>

                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Seleccionar canal
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                        >
                            <MuiMenuItem value="SMS Cortos">SMS # Cortos</MuiMenuItem>
                            <MuiMenuItem value="SMS Largos">SMS # Largos</MuiMenuItem>
                        </Select>
                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Créditos disponibles (sala destino)
                        </Typography>
                        <TextField
                            fullWidth
                            value={getAvailableCredits()} // Valor dinámico calculado
                            InputProps={{ readOnly: true }} // Hace el campo de solo lectura
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    border: "1px solid #A05B71",
                                    backgroundColor: "#f5f5f5",
                                    "&:hover fieldset": {
                                        borderColor: "#833A53",
                                    },
                                },
                            }}
                        />

                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Créditos a transferir
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={transferAmount}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (value <= (getAvailableCredits())) {
                                    setTransferAmount(value);
                                }
                            }}
                            inputProps={{
                                min: 0,
                                max: selectedRoom?.credits || 0,
                            }}
                        />
                        {/* Nuevo Select Activo */}
                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Seleccionar nueva sala
                        </Typography>
                        <ClickAwayListener onClickAway={handleCloseDropdown}>
                            <Box>
                                <TextField
                                    fullWidth
                                    placeholder="Seleccionar nueva sala"
                                    value={searchTerm2}
                                    onChange={(e) => setSearchTerm2(e.target.value)}
                                    onClick={handleOpenDropdown}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ArrowDropDownIcon style={{ color: "#A05B71" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            border: "1px solid #A05B71",
                                            backgroundColor: "#f5f5f5",
                                            "&:hover fieldset": {
                                                borderColor: "#833A53",
                                            },
                                        },
                                    }}
                                />

                                {openDropdown && (
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            position: "absolute",
                                            zIndex: 10,
                                            width: "88%",
                                            maxHeight: 200,
                                            overflowY: "auto",
                                            mt: 1,
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Box p={2} display="flex" alignItems="center">
                                            <TextField
                                                fullWidth
                                                placeholder="Buscar sala..."
                                                value={searchTerm2}
                                                onChange={(e) => setSearchTerm2(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <HomeIcon style={{ color: "#A05B71" }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setSearchTerm2("")}
                                                            >
                                                                <ClearIcon style={{ color: "#A05B71" }} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    mb: 2,
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: "8px",
                                                        border: "1px solid #A05B71",
                                                        backgroundColor: "#f5f5f5",
                                                        "&:hover fieldset": {
                                                            borderColor: "#833A53",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                        <List>
                                            {filteredRooms.length > 0 ? (
                                                filteredRooms.map((room) => (
                                                    <ListItem
                                                        key={room.id}
                                                        component="button"
                                                        onClick={() => handleSelectRoom(room)}
                                                    >
                                                        <ListItemText primary={room.name} />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary="No se encontraron resultados" />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>
                                )}
                            </Box>
                        </ClickAwayListener>


                        {/* Nuevo Select Canal */}
                        {/*<Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>*/}
                        {/*    Seleccionar nuevo canal*/}
                        {/*</Typography>*/}
                        {/*<Select*/}
                        {/*    fullWidth*/}
                        {/*    value={selectedNewChannel}*/}
                        {/*    onChange={(e) => setSelectedNewChannel(e.target.value)}*/}
                        {/*>*/}
                        {/*    <MuiMenuItem value="SMS Cortos">SMS # Cortos</MuiMenuItem>*/}
                        {/*    <MuiMenuItem value="SMS Largos">SMS # Largos</MuiMenuItem>*/}
                        {/*</Select>*/}
                        <Box display="flex" justifyContent="space-between" mt={3}>
                            <Button
                                variant="outlined"
                                onClick={handleCloseModal}
                                sx={{ color: "#A05B71", borderColor: "#A05B71" }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                disabled={loading} // Evita múltiples clics mientras se transfiere.
                                onClick={handleTransferSubmit}
                                sx={{
                                    background: "#833A53 0% 0% no-repeat padding-box",
                                    border: "1px solid #60293C",
                                    borderRadius: "4px",
                                    opacity: 0.9,
                                    textAlign: "center",
                                    color: "#FFFFFF",
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 400,
                                    fontSize: "12px",
                                    lineHeight: "54px",
                                    letterSpacing: "1.12px",
                                    textTransform: "uppercase",
                                    "&:hover": {
                                        backgroundColor: "#60293C",
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                                ) : (
                                    "Transferir"
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            {/* Toast de éxito */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '630px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '15px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1000,
                    minWidth: '300px',
                }}>
                    <span>{toastMessage}</span>
                    <button
                        onClick={closeToast}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {/* Modal de error */}
            {errorModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '400px',
                        textAlign: 'center',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>{errorModal.title}</h3>
                        <p style={{ marginBottom: '20px', color: '#6a6a6a' }}>
                            {errorModal.message}
                        </p>
                        <button
                            onClick={closeErrorModal}
                            style={{
                                backgroundColor: '#fff',
                                color: '#8d406d',
                                border: '2px solid #8d406d',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}


        </Box>
    );
};

export default CreditManagement;
