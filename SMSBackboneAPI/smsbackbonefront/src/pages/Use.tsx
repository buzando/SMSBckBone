import React, { useState } from 'react';
import { IconButton,Button, Typography, Divider, Box, Popper, Paper, RadioGroup, FormControlLabel, Radio, MenuItem, Checkbox, ListItemText, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BoxEmpty from '../assets/Nousers.svg';
import MainButton from '../components/commons/MainButton'
import SecondaryButton from '../components/commons/SecondaryButton'
import DatePicker from '../components/commons/DatePicker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import ClearIcon from '@mui/icons-material/Clear';

const Use: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOption, setSelectedOption] = useState("corto");
    const [loading, setLoading] = useState(false);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!datePickerOpen) { // Solo permite abrirlo si el DatePicker está cerrado
            setAnchorEl(anchorEl ? null : event.currentTarget);
        }
    };
    const [buttonText, setButtonText] = useState("SMS # CORTOS");
    const [selectedDates, setSelectedDates] = useState<{ start: Date, end: Date, startHour: number, startMinute: number, endHour: number, endMinute: number } | null>(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [data, setData] = useState(false); // Nueva variable para simular datos disponibles
    const [searchingData, setSearchingData] = useState(true);
    const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget); // Asegurar que el anchor es el botón de fecha
        setDatePickerOpen(true);
    };

    const handleCancelDatePicker = () => {
        setDatePickerOpen(false); // Cierra el DatePicker
    };
    const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
    const [anchorElC, setAnchorElC] = useState<HTMLElement | null>(null);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [campaignSearch, setCampaignSearch] = useState('');
    const [campaignData, setCampaignData] = useState<string[]>([]);

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState('');

    const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setUserAnchorEl(event.currentTarget);
        setUserMenuOpen(true);
    };

    const handleUserSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserSearch(event.target.value.toLowerCase());
    };

    const handleUserSelection = (user: string) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(user)
                ? prevSelected.filter((u) => u !== user)
                : [...prevSelected, user]
        );
    };

    const handleSelectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map((user) => user));
        }
    };

    const handleClearUserSelection = () => {
        setSelectedUsers([]);
    };

    const users = ['Usuario 1', 'Usuario 2', 'Usuario 3', 'Usuario 4'];


    const handleCampaignClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElC(event.currentTarget);
        setCampaignMenuOpen(true);
    };

    const handleCampaignSelection = (campaign: string) => {
        setSelectedCampaigns((prev) =>
            prev.includes(campaign) ? prev.filter((item) => item !== campaign) : [...prev, campaign]
        );
    };
    const campaigns = ['Campaña 1', 'Campaña 2', 'Campaña 3', 'Campaña 4'];
    const handleSelectAllCampaigns = () => {
        if (selectedCampaigns.length === campaigns.length) {
            setSelectedCampaigns([]); // Si todo estaba seleccionado, deseleccionar todo
        } else {
            setSelectedCampaigns([...campaigns]); // Si no, seleccionar todas las campañas
        }
    };

    const handleClearSelection = () => {
        setSelectedCampaigns([]);
    };


    const handleApplySelection = () => {
        setCampaignMenuOpen(false);
        setCampaignData([...selectedCampaigns]); // Actualiza los datos de la selección
    };

    const handleApply = () => {
        // Cambiar el texto del botón basado en la selección
        if (selectedOption === "largo") {
            setButtonText("SMS # LARGOS");
        } else {
            setButtonText("SMS # CORTOS");
        }
        setAnchorEl(null); // Cerrar el Popper
    };

    const handleDateSelectionApply = (start: Date, end: Date, startHour: number, startMinute: number, endHour: number, endMinute: number) => {
        setSelectedDates({ start, end, startHour, startMinute, endHour, endMinute });
        setDatePickerOpen(false);
        setAnchorEl(null);
        setSearchingData(false); // Cambia la bandera para que desaparezca la imagen de vacío
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setData(true);
        }, 2000);
    };

    const formatDateRange = () => {
        if (!selectedDates) return 'FECHA'; // Muestra "FECHA" si no hay fechas seleccionadas
        return `${format(selectedDates.start, "dd MMM", { locale: es })}, ${String(selectedDates.startHour).padStart(2, '0')}:${String(selectedDates.startMinute).padStart(2, '0')} - ${format(selectedDates.end, "d MMM", { locale: es })} ${String(selectedDates.endHour).padStart(2, '0')}:${String(selectedDates.endMinute).padStart(2, '0')}`;
    };

    const open = Boolean(anchorEl);
    const id = open ? 'sms-popper' : undefined;


    const dataChart = [
        { date: '14 may', value: 10 },
        { date: '15 may', value: 20 },
        { date: '16 may', value: 20 },
        { date: '17 may', value: 30 },
        { date: '18 may', value: 40 },
        { date: '19 may', value: 60 },
        { date: '20 may', value: 70 },
        { date: '21 may', value: 50 },
        { date: '22 may', value: 65 },
        { date: '23 may', value: 80 },
        { date: '24 may', value: 90 },
        { date: '25 may', value: 100 },
        { date: '26 may', value: 85 },
        { date: '27 may', value: 80 },
        { date: '28 may', value: 78 }
    ];


    return (
        <Box sx={{ padding: '20px', maxWidth: '1000px', marginLeft: 0 }}>
            {/* Encabezado */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#330F1B', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px', cursor: 'pointer' }}>⬅</span> Uso
            </Typography>
            <Divider sx={{ marginTop: '10px', marginBottom: '20px' }} />

            {/* Botones de filtro */}
            <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {/* Botón con Popper */}
                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={handleClick}
                    aria-describedby={id}
                >
                    {buttonText}
                </Button>

                {/* Popper para mostrar opciones */}
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <Paper sx={{
                        width: '280px',  // Ancho del Popper
                        height: '157px', // Alto del Popper
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <RadioGroup
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <FormControlLabel
                                value="corto"
                                control={
                                    <Radio
                                        sx={{
                                            color: "#000000",
                                            "&.Mui-checked": {
                                                color: "#8F4D63",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 24,
                                            },
                                        }}
                                    />
                                }
                                label="SMS # cortos"
                                sx={{
                                    color: selectedOption === "corto" ? "#8F4D63" : "#000000",
                                    fontWeight: selectedOption === "corto" ? "bold" : "normal",
                                }}
                            />

                            <FormControlLabel
                                value="largo"
                                control={
                                    <Radio
                                        sx={{
                                            color: "#000000",
                                            "&.Mui-checked": {
                                                color: "#8F4D63",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 24,
                                            },
                                        }}
                                    />
                                }
                                label="SMS # largos"
                                sx={{
                                    color: selectedOption === "largo" ? "#8F4D63" : "#000000",
                                    fontWeight: selectedOption === "largo" ? "bold" : "normal",
                                }}
                            />
                        </RadioGroup>
                        <Divider sx={{ margin: '10px 0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <SecondaryButton text='Limpiar' onClick={() => setSelectedOption("corto")} />
                            <MainButton text='Aplicar' onClick={handleApply} />
                        </Box>
                    </Paper>
                </Popper>

                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={handleDateClick}
                >
                    {formatDateRange()}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleCampaignClick}
                    sx={buttonStyle}
                >
                    CAMPAÑA
                </Button>
                <Popper open={campaignMenuOpen} anchorEl={anchorElC} placement="bottom-start">
                <Paper sx={{ width: '250px', padding: '10px' }}>
                        <TextField
                            placeholder="Buscar campaña"
                            variant="outlined"
                            fullWidth
                            value={campaignSearch}
                            onChange={(e) => setCampaignSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: campaignSearch && (
                                    <IconButton onClick={() => setCampaignSearch('')}>
                                        <ClearIcon /> {/* Icono de tache para limpiar */}
                                    </IconButton>
                                )
                            }}
                        />

                        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {/* Checkbox de "Seleccionar todo" */}
                            <MenuItem onClick={handleSelectAllCampaigns}>
                                <Checkbox checked={selectedCampaigns.length === campaigns.length}
                                sx={{
                                    color: '#6C3A52',
                                    '&.Mui-checked': { color: '#6C3A52' },
                                
                                }} />
                                
                                <ListItemText primary="Seleccionar todo" />
                            </MenuItem>

                            {/* Lista de campañas */}
                            {campaigns.filter((campaign) => campaign.toLowerCase().includes(campaignSearch)).map((campaign) => (
                                <MenuItem key={campaign} value={campaign} onClick={() => handleCampaignSelection(campaign)}>
                                    <Checkbox checked={selectedCampaigns.includes(campaign)}
                                    sx={{
                                        color: '#6C3A52',
                                        '&.Mui-checked': { color: '#6C3A52' },
                                    
                                    }} />
                                    <ListItemText primary={campaign} />
                                </MenuItem>
                            ))}

                            {/* Mostrar mensaje si no hay resultados */}
                            {campaigns.filter((campaign) => campaign.toLowerCase().includes(campaignSearch)).length === 0 && (
                                <Box sx={{ textAlign: 'center', padding: '10px', color: '#833A53', fontSize: '14px', fontWeight: '500' }}>
                                    No se encontraron resultados.
                                </Box>
                            )}
                        </Box>

                    <Box
                        p={1}
                        display="flex"
                        justifyContent="space-between"
                        sx={{ borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleClearSelection}
                            style={{ color: '#8d406d', borderColor: '#8d406d' }}
                        >
                            LIMPIAR
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleApplySelection}
                            style={{ backgroundColor: '#8d406d', color: '#fff' }}
                        >
                            APLICAR
                        </Button>
                    </Box>
                </Paper>
            </Popper>
                <Button variant="outlined" sx={buttonStyle} onClick={handleUserClick}>USUARIO</Button>
                {/* Popper de Usuarios */}
                <Popper open={userMenuOpen} anchorEl={userAnchorEl} placement="bottom-start">
                    <Paper sx={{ width: '250px', padding: '10px' }}>
                        <TextField
                            placeholder="Buscar usuario"
                            variant="outlined"
                            fullWidth
                            value={userSearch}
                            onChange={handleUserSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: userSearch && (
                                    <IconButton onClick={() => setUserSearch('')}>
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }}
                        />
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                            <MenuItem onClick={handleSelectAllUsers}>
                                <Checkbox checked={selectedUsers.length === users.length}
                                sx={{
                                    color: '#6C3A52',
                                    '&.Mui-checked': { color: '#6C3A52' },
                                
                                }} />
                                <ListItemText primary="Seleccionar todo" />
                            </MenuItem>
                            {users.filter((user) => user.toLowerCase().includes(userSearch)).map((user) => (
                                <MenuItem key={user} value={user} onClick={() => handleUserSelection(user)}>
                                    <Checkbox checked={selectedUsers.includes(user)}
                                    sx={{
                                        color: '#6C3A52',
                                        '&.Mui-checked': { color: '#6C3A52' },
                                    
                                    }} />
                                    <ListItemText primary={user} />
                                </MenuItem>
                            ))}
                            {users.filter((user) => user.toLowerCase().includes(userSearch)).length === 0 && (
                                <Typography sx={{ textAlign: 'center', marginTop: '10px', color: '#8d406d' }}>
                                    No se encontraron resultados.
                                </Typography>
                            )}
                        </Box>
                        <Box
                            p={1}
                            display="flex"
                            justifyContent="space-between"
                            sx={{
                                borderTop: '1px solid #e0e0e0',
                                backgroundColor: '#fff',
                                position: 'sticky',
                                bottom: 0,
                            }}
                        >
                            <Button variant="outlined" onClick={handleClearUserSelection} style={{ color: '#8d406d', borderColor: '#8d406d' }}>
                                LIMPIAR
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: '#8d406d', color: '#fff' }}>
                                APLICAR
                            </Button>
                        </Box>
                    </Paper>
                </Popper>
            </Box>
            <DatePicker
                open={datePickerOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                onApply={handleDateSelectionApply}
                onClose={handleCancelDatePicker}
            />

            <Divider sx={{ marginBottom: '20px' }} />
            {loading && (
                <Box sx={loadingStyle}>
                    <CircularProgress sx={{ color: '#8F4D63' }} size={80} />
                </Box>
            )}

            {!loading && data && (
                <>
                    <Paper sx={paperStyle}>
                        <Typography variant="h6" sx={{
                            textAlign: 'left',
                            fontSize: '16px',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif',
                            letterSpacing: '0px',
                            color: '#574B4F',
                            opacity: 1,
                            marginBottom: '10px'
                        }}>
                            Detalle de consumo
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                            {[
                                { title: "Total de créditos gastados:", value: "100,000" },
                                { title: "Total de mensajes enviados:", value: "80,000" },
                                { title: "Total de recargas realizadas:", value: "22" },
                                { title: "Última recarga realizada:", value: "Créditos 1,000\nFecha 11/09/24" }
                            ].map((item, index) => (
                                <Box key={index} sx={boxStyle}>
                                    <Typography sx={titleBoxStyle}>{item.title}</Typography>
                                    <Typography sx={valueBoxStyle}>{item.value}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                    <Paper sx={graphPaperStyle}>
                        <Typography variant="h6" sx={graphTitleStyle}>
                            Promedio de consumo
                        </Typography>
                        <Typography sx={{ textAlign: 'center', fontSize: '12px', color: '#574B4F', opacity: 0.8 }}>
                            Información de los últimos 20 días
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={dataChart}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#833A53" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#833A53" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <Tooltip />

                                {/* Línea con Sombreado */}
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#833A53"
                                    strokeWidth={2}
                                    fill="url(#colorGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>


                    </Paper>
                </>
            )}
            {/* Imagen de vacío y mensaje */}
            {searchingData && (
                <Box sx={emptyContainerStyle}>
                    <Box component="img" src={BoxEmpty} alt="Caja Vacía" sx={{ width: '150px', height: 'auto' }} />
                    <Typography sx={{ marginTop: '10px', color: '#8F4D63', fontWeight: '500' }}>
                        Seleccione un rango para comenzar.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

/* 🎨 Estilos */
const buttonStyle = {
    background: '#F6F6F6',
    border: '1px solid #C6BFC2',
    borderRadius: '18px',
    padding: '8px 16px',
    fontWeight: 'bold',
    color: '#8F4D63',
    textTransform: 'none',
    opacity: 1,
    '&:hover': {
        background: '#F2E9EC',
        border: '1px solid #BE93A066',
    },
    '&:active': {
        background: '#E6C2CD',
        border: '1px solid #BE93A0',
    }
};

const boxStyle = {
    background: '#D7CED21A',
    border: '1px solid #D6CED2',
    borderRadius: '10px',
    padding: '15px',
    width: '197px',
    height: '133px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

const titleBoxStyle = {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Poppins, sans-serif',
    lineHeight: '18px',
    letterSpacing: '0px',
    color: '#574B4F',
    opacity: 0.8
};

const valueBoxStyle = {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    lineHeight: '18px',
    letterSpacing: '0px',
    color: '#833A53',
    opacity: 1
};

const paperStyle = {
    background: '#FFFFFF',
    boxShadow: '4px 4px 4px #E1E4E6',
    border: '1px solid #E6E4E44D',
    padding: '20px',
    borderRadius: '10px',
    width: '892px',
    height: '212px'
};

const emptyContainerStyle = { textAlign: 'center', marginTop: '50px' };
const loadingStyle = { display: 'flex', justifyContent: 'center', marginTop: '50px' };

const graphPaperStyle = {
    background: '#FFFFFF',
    boxShadow: '4px 4px 4px #E1E4E6',
    border: '1px solid #E6E4E44D',
    padding: '20px',
    borderRadius: '10px',
    width: '892px',
    height: '280px',
    marginTop: '20px'
};

const graphTitleStyle = {
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Poppins, sans-serif',
    letterSpacing: '0px',
    color: '#574B4F',
    opacity: 1,
    marginBottom: '5px'
};

export default Use;
