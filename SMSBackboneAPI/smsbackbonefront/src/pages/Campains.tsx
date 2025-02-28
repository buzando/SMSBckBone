import React from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import iconplus from "../assets/Icon-plus.svg"; // 🔥 Importado correctamente

const Campains: React.FC = () => {
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
                            size="small"
                            placeholder="Buscar"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginBottom: "10px" }}
                        />

                        <Select fullWidth size="small" displayEmpty sx={{ marginBottom: "10px" }}>
                            <MenuItem value="">Seleccionar estatus</MenuItem>
                        </Select>

                        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
                            {["Campaña 1", "Campaña 2", "Campaña 3", "Campaña 4"].map((campaña, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        backgroundColor: "#E6C2CD",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        padding: "10px",
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <Tooltip title="Más opciones" arrow>
                                                <IconButton>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Fijar campaña" arrow>
                                                <IconButton>
                                                    <PushPinIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                >
                                    <ListItemIcon>
                                        <ChatBubbleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={campaña}
                                        secondary="100% | 8/8"
                                        primaryTypographyProps={{ fontWeight: "bold" }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Visualización de campaña */}
                <Grid item xs>
                    <Paper sx={{ padding: "15px", borderRadius: "8px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>

                        <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "8px" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Nombre de campaña 1
                            </Typography>
                            <Typography variant="body2" color="error">
                                Progreso: Completada 100%
                            </Typography>

                            <Divider sx={{ marginY: "10px" }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2">Procesados: 30</Typography>
                                <Typography variant="body2">Respondidos: 4</Typography>
                                <Typography variant="body2">Fuera de horario: 6</Typography>
                                <Typography variant="body2">Bloqueados: 6</Typography>
                                <Typography variant="body2">Totales: 30</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ marginTop: "10px", borderRadius: "8px" }}
                            >
                                DETENER
                            </Button>
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
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Campains;
