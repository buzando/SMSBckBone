import React, { useState, useEffect } from 'react';
import {
    Typography,
    Divider,
    Grid,
    Paper,
    Box,
    IconButton,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    Button,
    Checkbox,
    LinearProgress,
} from "@mui/material";
import seachicon from '../assets/icon-lupa.svg'
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import iconplus from "../assets/Icon-plus.svg"; // 🔥 Importado correctamente
import iconclose from "../assets/icon-close.svg"
import smsico from '../assets/Icon-sms.svg'
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MainButton from '../components/commons/MainButton'
const Campains: React.FC = () => {
    const [Serchterm, setSerchterm] = useState('');



    const handleSearch2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSerchterm(value); // Actualiza el estado de búsqueda

        //ToDo: buscador campañas
    };

    const campaigns = [
        { name: "Nombre de campaña 1", numeroInicial: 8, numeroActual: 8 },
        { name: "Nombre de campaña 2", numeroInicial: 10, numeroActual: 1 },
        { name: "Nombre de campaña 3", numeroInicial: 10, numeroActual: 1 },
        { name: "Nombre de campaña 4", numeroInicial: 10, numeroActual: 5 },
        { name: "Nombre de campaña 5", numeroInicial: 20, numeroActual: 10 },
        { name: "Nombre de campaña 6", numeroInicial: 15, numeroActual: 7 },
    ];


    return (
        <Box sx={{ padding: "20px" }}>
            {/* Título principal */}
            <Typography
                variant="h4"
                sx={{
                    textAlign: "left",
                    fontFamily: "Poppins",
                    letterSpacing: "0px",
                    color: "#330F1B",
                    opacity: 1,
                    fontSize: "26px",
                }}
            >
                Campañas SMS
            </Typography>

            {/* Línea divisoria */}
            <Divider sx={{ marginBottom: "20px" }} />

            <Grid container spacing={2}>
                {/* Listado de campañas */}
                <Grid item>
                    <Paper
                        sx={{
                            padding: "15px",
                            borderRadius: "8px",
                            width: "350px", // 🔥 Ancho fijo
                            height: "581px", // 🔥 Alto fijo
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "279px",
                                marginBottom: "10px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: "left",
                                    fontFamily: "Poppins",
                                    letterSpacing: "0px",
                                    color: "#330F1B",
                                    opacity: 1,
                                    fontSize: "18px",
                                }}
                            >
                                Listado de campañas
                            </Typography>
                            <IconButton>
                                <img src={iconplus} alt="Agregar" style={{ width: "20px", height: "20px" }} />
                            </IconButton>
                        </Box>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar"
                            value={Serchterm}
                            onChange={handleSearch2}
                            autoFocus
                            onKeyDown={(e) => e.stopPropagation()} // Evita la navegación automática
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "4px",
                                height: "40px",
                                width: "279px",
                                marginBottom: "15px",
                                "& .MuiOutlinedInput-root": {
                                    padding: "8px 12px",
                                    height: "40px",
                                    borderColor: Serchterm ? "#7B354D" : "#9B9295",
                                },
                                "& .MuiOutlinedInput-input": {
                                    fontSize: "16px",
                                    fontFamily: "Poppins, sans-serif",
                                    color: Serchterm ? "#7B354D" : "#9B9295",
                                    padding: "8px 12px",
                                    height: "100%",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img
                                            src={seachicon}
                                            alt="Buscar"
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                filter: Serchterm
                                                    ? "invert(19%) sepia(34%) saturate(329%) hue-rotate(312deg) brightness(91%) contrast(85%)"
                                                    : "none",
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: Serchterm ? (
                                    <InputAdornment position="end">
                                        <img
                                            src={iconclose}
                                            alt="Limpiar búsqueda"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setSerchterm("")} // Borra el texto al hacer clic
                                        />
                                    </InputAdornment>
                                ) : null,
                            }}
                        />

                        <Select
                            fullWidth
                            size="small"
                            displayEmpty
                            sx={{
                                marginTop: "10px",
                                width: "279px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px"
                            }}
                            renderValue={(selected) =>
                                selected && typeof selected === "string" ? selected : <em>Seleccionar estatus</em>
                            }
                        >
                            <MenuItem sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px"
                            }} value="">Seleccionar estatus</MenuItem>
                            <MenuItem sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px"
                            }} value="Encendidas">Encendidas</MenuItem>
                            <MenuItem sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px"
                            }} value="Detenidas">Detenidas</MenuItem>
                        </Select>

                        <Checkbox
                            sx={{
                                color: '#6C3A52',
                                '&.Mui-checked': { color: '#6C3A52' },
                                alignSelf: 'flex-start'
                            }}
                        />
                        <Divider sx={{ marginBottom: "5px" }} />

                        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
                            {campaigns.map((campaign, index) => {
                                const progreso = (campaign.numeroActual / campaign.numeroInicial) * 100;
                                return (
                                    <ListItem key={index} sx={{
                                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                                        border: "1px solid #AE78884D",
                                        opacity: 1,
                                        width: "100%",
                                        height: "73px",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        padding: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                            <Box sx={{ marginTop: "-5px", display: "flex", alignItems: "center" }}>
                                                <Checkbox sx={{ color: '#6C3A52', '&.Mui-checked': { color: '#6C3A52' } }} />
                                                <img src={smsico} alt="SMS" style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                                                <Typography sx={{ fontSize: "12px", fontWeight: "500", fontFamily: "Poppins", color: "#574B4F" }}>
                                                    {campaign.name}
                                                </Typography>
                                            </Box>
                                            <MoreVertIcon />
                                            <PushPinIcon sx={{ color: "#6C3A52", fontSize: "18px" }} />
                                        </Box>
                                        <Box sx={{ width: "65%", backgroundColor: "#E0E0E0", borderRadius: "6px", height: "10px", position: "relative", marginBottom: "10px", marginX: "auto" }}>
                                            <Box sx={{ width: `${progreso}%`, backgroundColor: "#8F4D63", borderRadius: "3px", height: "6px", position: "absolute" }} />
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: "0px", paddingLeft: "45px" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: "600", color: "#574B4FCC", marginRight: "8px" }}>{Math.round(progreso)}%</Typography>
                                            <Typography sx={{ fontSize: "12px", color: "#574B4FCC" }}>{campaign.numeroActual}/{campaign.numeroInicial}</Typography>
                                        </Box>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>

                {/* Visualización de campaña */}
                <Grid item xs>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "left",
                            fontFamily: "Poppins",
                            letterSpacing: "0px",
                            color: "#330F1B",
                            opacity: 1,
                            fontSize: "18px",
                        }}
                    >
                        Visualización
                    </Typography>


                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "527px", height: "256px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    textAlign: "left",
                                    fontFamily: "Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                }}
                            >
                                Nombre de campaña 1
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <MoreVertIcon sx={{ color: "#574B4F", fontSize: "20px", cursor: "pointer" }} />
                                <PushPinIcon sx={{ color: "#6C3A52", fontSize: "20px", cursor: "pointer" }} />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #D6CED2",
                                borderRadius: "10px",
                                opacity: 1,
                                width: "495px",
                                height: "131px",
                                padding: "12px",
                                marginTop: "10px",
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontWeight: "bold" }}>Progreso: <span style={{ color: "#8F4D63" }}>Completada 100%</span></Typography>
                                <Typography>30/30</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <AccessTimeIcon sx={{ fontSize: "16px" }} />
                                    <Typography>02:10 min</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <AutorenewIcon sx={{ fontSize: "16px" }} />
                                    <Typography>1</Typography>
                                </Box>
                            </Box>
                            <LinearProgress variant="determinate" value={100} sx={{ marginTop: "8px", height: "6px", borderRadius: "3px", backgroundColor: "#E0E0E0", '& .MuiLinearProgress-bar': { backgroundColor: "#8F4D63" } }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                                <Typography sx={{ fontSize: "12px" }}>Procesados: <strong>30</strong></Typography>
                                <Typography sx={{ fontSize: "12px" }}>Respondidos: <strong>4</strong></Typography>
                                <Typography sx={{ fontSize: "12px" }}>Fuera de horario: <strong>6</strong></Typography>
                                <Typography sx={{ fontSize: "12px" }}>Bloqueados: <strong>6</strong></Typography>
                                <Typography sx={{ fontSize: "12px" }}>Totales: <strong>30</strong></Typography>
                            </Box>
                        </Box>

                        <MainButton text='DETENER' onClick={() => console.log('') } />
                            DETENER
                      
                    </Paper>

                    {/* Horarios */}
                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "8px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Horarios
                            </Typography>
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>

                        <List>
                            {["25 Mar, 09:30 - 10:30", "25 Mar, 11:00 - 11:30", "26 Mar, 12:00 - 28 Mar, 12:30"].map(
                                (horario, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <CalendarTodayIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={horario} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Campains;
