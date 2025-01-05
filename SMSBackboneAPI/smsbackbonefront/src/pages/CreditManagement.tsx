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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import TrashIcon from "../assets/Icon-trash.svg";

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
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [transferAmount, setTransferAmount] = useState<number | null>(null);
    const [transferRoom, setTransferRoom] = useState<Rooms | null>(null);
    const [selectedNewChannel, setSelectedNewChannel] = useState<string>("");

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
        setSelectedRoom(room);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        setMenuAnchorEl(null); // Cierra el menú al abrir el modal
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRoom(null); // Limpia el room seleccionado al cerrar el modal
    };

    const handleTransferClick = () => {
        setLoading(true);
        // Simula una operación asincrónica, como una llamada a la API.
        setTimeout(() => {
            setLoading(false);
            alert("Transferencia completada"); // O maneja el resultado de la transferencia.
        }, 2000);
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
                                                    Créditos: {room.credits.toLocaleString()}
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
                                                    SMS # Cortos: {room.long_sms.toLocaleString()}
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
                                                    SMS # Largos: {room.short_sms.toLocaleString()}
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
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                            Seleccionar sala origen
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedRoom?.name || ""}
                            disabled // Hace que el Select esté deshabilitado
                        >
                            {/* Solo muestra el selectedRoom en la lista, ya que está deshabilitado */}
                            <MuiMenuItem value={selectedRoom?.name || ""}>
                                {selectedRoom?.name || ""}
                            </MuiMenuItem>
                        </Select>
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
                            Créditos disponibles
                        </Typography>
                        <TextField
                            fullWidth
                            value={selectedRoom?.credits || 0}
                            InputProps={{ readOnly: true }}
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
                                if (value <= (selectedRoom?.credits || 0)) {
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
                        <Select
                            fullWidth
                            value={transferRoom?.name || ""}
                            onChange={(e) =>
                                setTransferRoom(rooms.find((room) => room.name === e.target.value) || null)
                            }
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300, // Limitar la altura del menú desplegable
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {/* Renderizar un buscador en el menú */}
                            <MuiMenuItem disableRipple style={{ paddingBottom: 0 }}>
                                <TextField
                                    placeholder="Buscar sala..."
                                    fullWidth
                                    variant="standard"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                        },
                                    }}
                                />
                            </MuiMenuItem>

                            {/* Filtrar y mostrar las opciones */}
                            {rooms
                                .filter(
                                    (room) =>
                                        room.name !== selectedRoom?.name &&
                                        room.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((room) => (
                                    <MuiMenuItem key={room.id} value={room.name}>
                                        {room.name}
                                    </MuiMenuItem>
                                ))}
                        </Select>

                        {/* Nuevo Select Canal */}
                        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                            Seleccionar nuevo canal
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedNewChannel}
                            onChange={(e) => setSelectedNewChannel(e.target.value)}
                        >
                            <MuiMenuItem value="SMS Cortos">SMS # Cortos</MuiMenuItem>
                            <MuiMenuItem value="SMS Largos">SMS # Largos</MuiMenuItem>
                        </Select>
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
                                onClick={handleTransferClick}
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


        </Box>
    );
};

export default CreditManagement;
