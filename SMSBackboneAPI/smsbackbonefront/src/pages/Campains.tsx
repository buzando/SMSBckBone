import React, { useState } from 'react';
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
    Checkbox,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import seachicon from '../assets/icon-lupa.svg'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import iconplus from "../assets/Icon-plus.svg"; // 🔥 Importado correctamente
import iconclose from "../assets/icon-close.svg"
import smsico from '../assets/Icon-sms.svg'
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MainButton from '../components/commons/MainButton'
import infoicon from '../assets/Icon-info.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import IconSMS from '../assets/IconSMS.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ComposableMap, Geographies, Geography, GeographyProps } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/mexico/mexico-states.json";

const Campains: React.FC = () => {
    const [Serchterm, setSerchterm] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(false);

    const dataCountry = [
        { id: "01", state: "Aguascalientes", value: 10 },
        { id: "02", state: "Baja California", value: 20 },
        { id: "03", state: "Baja California Sur", value: 30 },
        { id: "04", state: "Campeche", value: 40 },
        { id: "05", state: "Coahuila", value: 50 }
    ];

    const registros = [
        { tipo: "Respondidos", total: 4, porcentaje: "4%" },
        { tipo: "Fuera de horario", total: 4, porcentaje: "4%" },
        { tipo: "Bloqueados", total: 4, porcentaje: "4%" }
    ];

    const indicadores = [
        { label: "Tasa de recepción", value: "90%", color: "#A17EFF" },
        { label: "Tasa de no recepción", value: "90%", color: "#F6B960" },
        { label: "Tasa de espera", value: "90%", color: "#5EBBFF" },
        { label: "Tasa de entrega-falla", value: "90%", color: "#FF88BB" },
        { label: "Tasa de rechazos", value: "90%", color: "#F6B960" },
        { label: "Tasa de no envío", value: "90%", color: "#A6A6A6" },
        { label: "Tasa de excepción", value: "90%", color: "#7DD584" }
    ];

    const data = [
        { name: "Recibidos", value: 90, color: "#A17EFF" },
        { name: "No recibidos", value: 10, color: "#F6B960" },
        { name: "En espera", value: 90, color: "#5EBBFF" },
        { name: "Entrega-falla", value: 90, color: "#FF88BB" },
        { name: "Rechazados", value: 90, color: "#F6B960" },
        { name: "No enviados", value: 90, color: "#A6A6A6" },
        { name: "Excepciones", value: 90, color: "#7DD584" }
    ];

    const validatePhone = (value: string) => {
        const phoneRegex = /^\d{10,12}$/; // Acepta entre 10 y 12 dígitos
        return phoneRegex.test(value);
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPhone(value);
        setError(!validatePhone(value)); // Actualiza error según la validación
    };

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

    const colorScale = scaleLinear<string>()
        .domain([0, 50])
        .range(["#F5E8EA", "#7B354D"]);
        
    const [panelAbierto, setPanelAbierto] = useState(true);    
    return (
        <Box sx={{ padding: "20px", marginLeft: "56px", maxWidth: "81%" }}>
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
            <Divider sx={{ marginBottom: "20px", marginTop: "17px" }} />
            
            <Grid container spacing={2}>
                {/* Listado de campañas */}
                
                <Grid item sx={{ display: 'flex' }}>
                    <Box sx={{ display: "flex", }}>
                    {/* Panel de campañas */}
                    {panelAbierto && (
                    <Paper
                        sx={{
                            padding: "15px",
                            borderRadius: "8px 0 0 8px", // borde izquierdo redondeado
                            width: "370px",
                            height: "581px",
                            display: "flex",
                            flexDirection: "column"
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
                            }} value="">Todos</MenuItem>
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
                                                <Typography sx={{ fontSize: "12px", fontWeight: "500", fontFamily: "Poppins", color: "#574B4F", marginBottom: "6px" }}>
                                                    {campaign.name}
                                                </Typography>
                                            </Box>
                                            <MoreVertIcon
                                                sx={{
                                                    position: "absolute", // o "relative"
                                                    top: "30px",          // distancia desde el top de su contenedor padre
                                                    right: "30px",
                                                    height: "24px",
                                                    width: "24px"
                                                }}
                                                />
                                            <PushPinIcon sx={{ color: "#6C3A52", fontSize: "18px" }} />
                                        </Box>
                                        <Box sx={{ width: "65%", backgroundColor: "#E0E0E0", borderRadius: "6px", height: "10px", position: "relative", marginBottom: "10px", marginX: "auto" }}>
                                            <Box sx={{ width: `${progreso}%`, backgroundColor: "#AE7888", borderRadius: "3px", 
                                            height: "8px", 
                                            position: "absolute", 
                                            marginTop: "-9px",
                                            }} />
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: "0px", paddingLeft: "45px" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: "600", color: "#574B4FCC", marginLeft: "7px", marginTop: "-7px" }}>{Math.round(progreso)}%</Typography>
                                            <Typography sx={{ fontSize: "12px", color: "#574B4FCC", marginTop: "-7px", marginLeft: "7px" }}>{campaign.numeroActual}/{campaign.numeroInicial}</Typography>
                                        </Box>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                )}
    <IconButton
      onClick={() => setPanelAbierto(!panelAbierto)}
      sx={{
        height: "581px",
        width: "30px",
        borderRadius: "0 8px 8px 0", // redondeado derecho
        borderLeft: "1px solid #D6D6D6", // 👉 esta es la línea gris
        backgroundColor: "#FFFFFF",
        '&:hover': { backgroundColor: "#FFFFFF" },
        paddingX: "10px"
      }}
    >
      <Typography sx={{
        fontSize: "20px",
        transform: panelAbierto ? "rotate(0deg)" : "rotate(180deg)",
        transition: "transform 0.3s"
      }}
      >
        ❮
      </Typography>
    </IconButton>
    </Box>
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


                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", maxWidth: "100%", height: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                <img alt="IconSMS" src={IconSMS}
                                    style={{ width: 35, height: 20, marginRight: "10px" }} // 👈 Ajusta el espacio aquí
                                />
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                    textAlign: "left",
                                    fontFamily: "Poppins",
                                    letterSpacing: "0px",
                                    color: "#574B4F",
                                    opacity: 1,
                                    fontSize: "18px",
                                    }}
                                >
                                    Nombre de campaña 1
                                </Typography>
                                </Box>
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
                                width: "100%", height: "auto",
                                padding: "12px",
                                marginTop: "10px",
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",  }}>
                                <Typography sx={{ fontFamily: "Poppins", }}>Progreso: <span style={{ color: "#8F4D63" }}>Completada 100%</span></Typography>
                                
                                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <AccessTimeIcon sx={{ fontSize: "16px" }} />
                                    <Typography sx={{fontFamily: "Poppins", opacity: 0.7, fontSize: "14px"}}>02:10 min</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <AutorenewIcon sx={{ fontSize: "16px" }} />
                                    <Typography>1</Typography>
                                </Box>
                            </Box>
                            <LinearProgress variant="determinate" value={100} sx={{ marginTop: "8px", height: "12px", borderRadius: "6px", backgroundColor: "#E0E0E0", '& .MuiLinearProgress-bar': { backgroundColor: "#AE7888" } }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "8px"}}>
                                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center"  }}>
                                Registros <br />procesados:<br />
                                <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                                    30
                                </Box>
                                </Typography>
                                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center"  }}>
                                Registros <br />respondidos:<br />
                                <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                                    4
                                </Box>
                                </Typography>
                                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center"  }}>
                                Registros <br />fuera de horario:<br />
                                <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                                    6
                                </Box>
                                </Typography>
                                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center"  }}>
                                Registros <br />bloqueados:<br />
                                <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F", }}>
                                    6
                                </Box>
                                </Typography>
                                <Typography sx={{ fontSize: "12px", fontFamily: "Poppins", opacity: 0.7, textAlign: "center"  }}>
                                Total de <br />registros:<br />
                                <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold", color: "#574B4F" }}>
                                    30
                                </Box>
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "right", marginTop: "8px" }}>

                            <MainButton text='DETENER' onClick={() => console.log('')} />
                        </Box>


                    </Paper>

                    {/* Horarios */}
                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", maxWidth: "100%", height: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", }}>
                                Horarios
                            </Typography>
                            <IconButton>
                                <img src={iconclose} width="24px" height="24px" />
                            </IconButton>
                        </Box>
                        <Box sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto", backgroundColor: "#D6D6D64D" }}>
                            <List>
                                {["25 Mar, 09:30 - 10:30", "25 Mar, 11:00 - 11:30", "26 Mar, 12:00 - 28 Mar, 12:30"].map(
                                    (horario, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <CalendarTodayIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={horario} sx={{
                                                textAlign: "left",
                                                fontFamily: "Poppins",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                lineHeight: "22px",
                                                letterSpacing: "0px",
                                                color: "#844D5F",
                                                opacity: 1,
                                            }} />
                                        </ListItem>
                                    )
                                )}
                            </List>
                        </Box>
                    </Paper>
                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px" }}>
                            Mensaje
                        </Typography>
                        <Box sx={{ padding: "10px", borderRadius: "10px", width: "100%", height: "auto", backgroundColor: "#D6D6D64D", opacity: 0.6 }}>
                            <Typography sx={{ textAlign: "left", fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
                                A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.
                            </Typography>
                        </Box>
                        <Divider sx={{ marginY: "15px" }} />
                        <Paper sx={{ padding: "10px", marginTop: "15px", borderRadius: "10px", width: "100%", height: "auto", marginLeft: "-10px" }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px" }}>
                                Prueba de envío
                            </Typography>
                            <Box sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto", backgroundColor: "#F5F5F5" }}>
                                <Typography sx={{ textAlign: "left", fontFamily: "Poppins", fontSize: "14px", color: "#574B4F", marginBottom: "5px" }}>Teléfono</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <TextField
                                    value={phone}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea número
                                        setPhone(onlyNumbers);
                                        setError(!validatePhone(onlyNumbers));
                                    }}
                                        error={error}
                                        helperText={error ? "Formato inválido" : ""}
                                        placeholder="5255"
                                        inputProps={{
                                            inputMode: 'numeric', // muestra teclado numérico en móviles
                                            pattern: '[0-9]*',    // ayuda extra para validar numérico
                                            maxLength: 12         // opcional: máximo 12 dígitos
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img
                                                        src={error ? infoiconerror : infoicon}
                                                        alt="Info"
                                                        style={{ width: "18px", height: "18px" }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                            sx={{
                                                width: "75%",
                                                backgroundColor: "#FFFFFF",
                                                borderRadius: "4px",
                                                "& .MuiInputBase-input": {
                                                    fontFamily: "Poppins, sans-serif",
                                                },
                                                "& .MuiFormHelperText-root": {
                                                    fontFamily: "Poppins, sans-serif",
                                                    backgroundColor: "#F2F2F2",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    margin: 0,
                                                }
                                            }}
                                        />
                                    <MainButton text='Enviar' onClick={() => console.log('Enviar')} disabled={error} />
                                </Box>
                            </Box>
                        </Paper>
                    </Paper>

                    <Paper sx={{ padding: "10px", marginTop: "60px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px", marginLeft: "10px",  }}>
                            Gestión de registros
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontFamily: "Poppins, sans-serif", padding: "10px 8px", opacity: 0.8 }}>Tipo</TableCell>
                                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Total</TableCell>
                                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Porcentaje</TableCell>
                                        <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", opacity: 0.8, padding: "10px 8px", }}>Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registros.map((registro, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontSize: "13px", fontFamily: "Poppins, sans-serif", padding: "6px 8px", opacity: 0.5,  }}>{registro.tipo}</TableCell>
                                            <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.6 }}>{registro.total}</TableCell>
                                            <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.7 }}>{registro.porcentaje}</TableCell>
                                            <TableCell align="center" sx={{ fontFamily: "Poppins, sans-serif", padding: "2px 8px", opacity: 0.6 }}>
                                                <IconButton>
                                                    <DeleteIcon sx={{ color: "#9B9295" }} />
                                                </IconButton>
                                                <IconButton>
                                                    <RestoreIcon sx={{ color: "#9B9295" }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Paper sx={{ padding: "10px", marginTop: "25px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "10px", marginLeft: "10px" }}>
                            Resultados de envío
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px", border: "2px solid #F2F2F2", borderRadius: "10px", marginBottom: "20px" }}>
                            {indicadores.map((indicador, index) => (
                                <Box key={index} sx={{ textAlign: "center" }}>
                                    <img src={infoicon} width="24px" height="24px" />
                                    <Typography sx={{ fontSize: "10px", color: "#9B9295" }}>{indicador.label}</Typography>
                                    <Typography sx={{ fontSize: "22px", color: indicador.color, fontWeight: "bold" }}>{indicador.value}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                    <Paper sx={{ padding: "10px", marginTop: "30px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px" }}>
                            Mapa de concentración de mensajes
                        </Typography>
                        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1200 }} style={{ width: "100%", height: "auto" }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }: { geographies: GeographyProps[] }) =>
                                    geographies.map((geo: GeographyProps) => {
                                        const cur = dataCountry.find(s => s.id === geo.id);
                                        return (
                                            <Geography
                                                key={`geo-${geo.id}`}
                                                geography={geo}
                                                fill={cur ? colorScale(cur.value) : "#ECECEC"}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: "#7B354D", outline: "none" },
                                                    pressed: { fill: "#7B354D", outline: "none" }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Campains;
