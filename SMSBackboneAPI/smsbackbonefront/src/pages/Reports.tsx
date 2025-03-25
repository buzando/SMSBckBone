import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Divider,
    Tabs,
    Tab,
    Popper,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DatePicker from '../components/commons/DatePicker';
import BoxEmpty from '../assets/Nousers.svg';

// Datos simulados de campañas y usuarios
const campaigns = ['Campaña 1', 'Campaña 2', 'Campaña 3', 'Campaña 4'];
const users = ['Usuario 1', 'Usuario 2', 'Usuario 3', 'Usuario 4'];

const Reports: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("SMS");

    // Estados para DatePicker
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedDates, setSelectedDates] = useState<any>(null);

    // Estados para el Popper de Campañas
    const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
    const [anchorElC, setAnchorElC] = useState<HTMLElement | null>(null);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [campaignSearch, setCampaignSearch] = useState('');

    // Estados para el Popper de Usuarios
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState('');

    // Maneja el cambio de tabs (SMS / Llamada)
    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    // Abre el DatePicker al hacer clic en el botón
    const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setDatePickerOpen(true);
    };

    // Cierra el DatePicker sin aplicar cambios
    const handleCancelDatePicker = () => {
        setDatePickerOpen(false);
    };

    // Aplica las fechas seleccionadas en el DatePicker
    const handleDateSelectionApply = (start: Date, end: Date) => {
        setSelectedDates({ start, end });
        setDatePickerOpen(false);
        setAnchorEl(null);
    };

    // Abre o cierra el menú de campañas
    const handleCampaignClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (campaignMenuOpen) {
            setCampaignMenuOpen(false);
            setAnchorElC(null);
        } else {
            setAnchorElC(event.currentTarget);
            setCampaignMenuOpen(true);
        }
    };

    // Alterna selección de una campaña
    const handleCampaignSelection = (campaign: string) => {
        setSelectedCampaigns((prev) =>
            prev.includes(campaign) ? prev.filter((item) => item !== campaign) : [...prev, campaign]
        );
    };

    // Selecciona o deselecciona todas las campañas
    const handleSelectAllCampaigns = () => {
        setSelectedCampaigns(selectedCampaigns.length === campaigns.length ? [] : [...campaigns]);
    };

    // Limpia todas las campañas seleccionadas
    const handleClearCampaignSelection = () => {
        setSelectedCampaigns([]);
    };

    // Aplica la selección de campañas y cierra el menú
    const handleApplyCampaignSelection = () => {
        setCampaignMenuOpen(false);
    };

    // Abre o cierra el menú de usuarios
    const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (userMenuOpen) {
            setUserMenuOpen(false);
            setUserAnchorEl(null);
        } else {
            setUserAnchorEl(event.currentTarget);
            setUserMenuOpen(true);
        }
    };

    // Alterna selección de un usuario
    const handleUserSelection = (user: string) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(user)
                ? prevSelected.filter((u) => u !== user)
                : [...prevSelected, user]
        );
    };

    // Selecciona o deselecciona todos los usuarios
    const handleSelectAllUsers = () => {
        setSelectedUsers(selectedUsers.length === users.length ? [] : [...users]);
    };

    // Limpia todos los usuarios seleccionados
    const handleClearUserSelection = () => {
        setSelectedUsers([]);
    };

    return (
        <Box p={4} sx={{ padding: '20px', marginTop: "-76px" }}>
            {/* Título principal */}
            <Typography variant="h4" fontWeight="medium" sx={{ textAlign: "left", fontSize: "26px", lineHeight: "55px", fontFamily: "Poppins, sans-serif", color: "#330F1B" }}>
                Reportes
            </Typography>

            {/* Tabs para SMS y Llamada */}
            <Divider sx={{ mt: 2, mb: 1, marginBottom: "0px" }} />
            <Tabs value={selectedTab} onChange={handleTabChange} TabIndicatorProps={{ style: { display: 'none' } }}>
            <Tab label="SMS" value="SMS" 
                sx={{ 
                    height: "43px",
                    width: "109px",
                    fontFamily: "Poppins", 
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "25px",
                    color: "#574B4F !important",  // 🔥 Forzamos el color del texto
                    backgroundColor: "transparent", // Fondo normal
                    transition: "background-color 0.3s ease, color 0.3s ease", // Transición suave
                    "&:hover": { 
                        backgroundColor: "#EDD5DC99", // 🔥 Fondo cuando el mouse esté encima
                        color: "#574B4F !important",  // 🔥 Forzamos el color del texto en hover
                    },
                    "&.Mui-selected": { 
                        color: "#574B4F !important", // 🔥 Forzamos el color cuando está seleccionado
                    }
                }}  />
                
                
                
                <Tab label="Llamada" value="Llamada" 
                sx={{ 
                    minHeight: "auto", 
                    padding: "4px 12px", 
                    fontFamily: "Poppins", 
                    textTransform: "none",
                    fontSize: "16px" 
                }} disabled={true} />
            
            
            
            </Tabs>
            <Divider sx={{ mt: 1, mb: 2, marginTop: "0px" }} />

            {/* Filtros de Fecha, Campaña y Usuario */}
            <Box display="flex" gap={2} mb={4} marginBottom={2}>
                <Button variant="outlined" sx={buttonStyle} onClick={handleDateClick}>
                    {selectedDates ? `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()}` : 'FECHA'}
                </Button>
                <Button variant="outlined" sx={buttonStyle} onClick={handleCampaignClick}>CAMPAÑA</Button>
                <Button variant="outlined" sx={buttonStyle} onClick={handleUserClick}>USUARIO</Button>
            </Box>

            {/* Popper Campañas */}
            <Popper open={campaignMenuOpen} anchorEl={anchorElC} placement="bottom-start">
                <Paper sx={{ width: 250, p: 2 }}>
                    <TextField
                        placeholder="Buscar campaña"
                        fullWidth
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            endAdornment: campaignSearch && <IconButton onClick={() => setCampaignSearch('')}><ClearIcon /></IconButton>
                        }}
                    />
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        <MenuItem onClick={handleSelectAllCampaigns}>
                            <Checkbox checked={selectedCampaigns.length === campaigns.length} />
                            <ListItemText primary="Seleccionar todo" />
                        </MenuItem>
                        {campaigns.filter(c => c.toLowerCase().includes(campaignSearch.toLowerCase())).map(c => (
                            <MenuItem key={c} onClick={() => handleCampaignSelection(c)}>
                                <Checkbox checked={selectedCampaigns.includes(c)} />
                                <ListItemText primary={c} />
                            </MenuItem>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={handleClearCampaignSelection}>Limpiar</Button>
                        <Button variant="contained" onClick={handleApplyCampaignSelection}>Aplicar</Button>
                    </Box>
                </Paper>
            </Popper>

            {/* Popper Usuarios */}
            <Popper open={userMenuOpen} anchorEl={userAnchorEl} placement="bottom-start">
                <Paper sx={{ width: 250, p: 2 }}>
                    <TextField
                        placeholder="Buscar usuario"
                        fullWidth
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            endAdornment: userSearch && <IconButton onClick={() => setUserSearch('')}><ClearIcon /></IconButton>
                        }}
                    />
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        <MenuItem onClick={handleSelectAllUsers}>
                            <Checkbox checked={selectedUsers.length === users.length} />
                            <ListItemText primary="Seleccionar todo" />
                        </MenuItem>
                        {users.filter(u => u.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                            <MenuItem key={u} onClick={() => handleUserSelection(u)}>
                                <Checkbox checked={selectedUsers.includes(u)} />
                                <ListItemText primary={u} />
                            </MenuItem>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={handleClearUserSelection}>Limpiar</Button>
                        <Button variant="contained" onClick={() => setUserMenuOpen(false)}>Aplicar</Button>
                    </Box>
                </Paper>
            </Popper>

            <Divider sx={{ mb: 4 }} />

            {/* Contenido por defecto cuando no hay selección */}
            <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 5, textAlign: "center", width: "83%" }}>
                <CardContent>
                    <Box component="img" src={BoxEmpty} alt="Caja Vacía" sx={{ width: '200px' }} />
                    <Typography mt={2} sx={{ color: '#8F4D63', fontWeight: '500', fontFamily: 'Poppins', fontSize: '14px' }}>
                        Seleccione un canal del menú superior para comenzar.
                    </Typography>
                </CardContent>
            </Card>

            {/* Componente de selección de fechas */}
            <DatePicker
                open={datePickerOpen}
                anchorEl={anchorEl}
                onApply={handleDateSelectionApply}
                onClose={handleCancelDatePicker}
            />
        </Box>
    );
};

// Estilo para los botones de filtros
const buttonStyle = {
    background: '#F6F6F6',
    border: '1px solid #C6BFC2',
    borderRadius: '18px',
    padding: '8px 16px',
    fontWeight: '600',
    letterSpacing: "1.12px",
    height: "36px",
    fontFamily: 'Poppins',
    color: '#8F4D63',
    opacity: 1,
    textTransform: 'none',
    '&:hover': {
        background: '#F2E9EC',
        border: '1px solid #BE93A066',
    },
    '&:active': {
        background: '#E6C2CD',
        border: '1px solid #BE93A0',
    }
};

export default Reports;
