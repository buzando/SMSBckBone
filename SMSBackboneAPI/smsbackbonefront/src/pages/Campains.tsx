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
    TableRow,
    Button
} from "@mui/material";
import seachicon from '../assets/icon-lupa.svg'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import welcome from '../assets/icon-welcome.svg'
import PushPinIcon from "@mui/icons-material/PushPin";
import iconplus from "../assets/Icon-plus.svg"; 
import CloseIcon from '@mui/icons-material/Close';
import IconTache from "../assets/icon-close.svg"
import iconclose from "../assets/icon-close.svg"

import IconTrash from "../assets/IconTrash.svg";

import MainModal from '../components/commons/MainModal';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"


import smsico from '../assets/Icon-sms.svg'
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MainButton from '../components/commons/MainButton'
import infoicon from '../assets/Icon-info.svg'
import infoiconerror from '../assets/Icon-infoerror.svg'

import boxopen from '../assets/NoResultados.svg';
import RemoveIcon from "@mui/icons-material/Remove";


import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { Tooltip } from "@mui/material";
import IconSMS from '../assets/IconSMS.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
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

    const [openModal, setOpenModal] = useState(false);
    
    const [openInfoModal, setOpenInfoModal] = useState(false);

    const [isRunning, setIsRunning] = useState(true);
    
    const [infoChecks, setInfoChecks] = useState<Record<string, boolean>>({
        "Horarios": true,
        "Prueba de envío de mensaje": true,
        "Registros": true,
        "Mapa de concentración de mensajes": true,
        "Resultados de envío por día": true,
      });


    const campaigns = [
        { name: "Nombre de campaña 1", numeroInicial: 8, numeroActual: 8 },
        { name: "Nombre de campaña 2", numeroInicial: 10, numeroActual: 1 },
        { name: "Nombre de campaña 3", numeroInicial: 10, numeroActual: 1 },
        { name: "Nombre de campaña 4", numeroInicial: 10, numeroActual: 5 },
        { name: "Nombre de campaña 5", numeroInicial: 20, numeroActual: 10 },
        { name: "Nombre de campaña 6", numeroInicial: 15, numeroActual: 7 },
    ];

    const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

    const filteredCampaigns = campaigns.filter((c) =>
        c.name.toLowerCase().includes(Serchterm.toLowerCase())
      );

    const [pinnedCampaigns, setPinnedCampaigns] = useState<number[]>([]);

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
                                fontSize: "12px",
                                "&:hover": {
                                    backgroundColor: "#F2EBED"
                                }
                            }} value="Todos">Todos</MenuItem>

                            <MenuItem sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px",
                                "&:hover": {
                                    backgroundColor: "#F2EBED"
                                }
                            }} value="Encendidas">Campañas encendidas</MenuItem>

                            <MenuItem sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                textAlign: "left",
                                fontFamily: "Poppins",
                                letterSpacing: "0px",
                                color: "#645E60",
                                opacity: 1,
                                fontSize: "12px",
                                "&:hover": {
                                    backgroundColor: "#F2EBED"
                                }
                            }} value="Detenidas">Campañas detenidas</MenuItem>
                        </Select>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <Checkbox
                            checked={selectedCampaigns.length > 0}
                            onChange={() => setSelectedCampaigns([])} // 🔥 Limpiar todos los seleccionados
                            icon={
                                <Box
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "4px",
                                    border: "2px solid #6C3A52",
                                }}
                                />
                            }
                            checkedIcon={
                                <Box
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "4px",
                                    backgroundColor: "#8F4D63",
                                    border: "2px solid #8F4D63",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px",
                                    color: "#FFFFFF",
                                    fontWeight: "bold",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                                >
                                −
                                </Box>
                            }
                            sx={{
                                color: "#6C3A52",
                                "&.Mui-checked": { color: "#6C3A52" },
                                alignSelf: "flex-start",
                            }}
                            />

                            <Tooltip title="Eliminar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "rgba(0, 0, 0, 0.8)"
                                    }
                                }
                                }}
                            >
                                <IconButton onClick={() => setOpenModal(true)} sx={{ padding: 0 }}>
    <Box
        component="img"
        src={IconTrash}
        alt="Eliminar"
        sx={{ width: "20px", height: "20px", cursor: "pointer" }}
    />
</IconButton>
                            </Tooltip>
                            </Box>


                        <Divider sx={{ marginBottom: "5px" }} />

                        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
    {filteredCampaigns.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
            <Box component="img" src={boxopen} alt="Caja Vacía" sx={{ width: '250px', height: 'auto' }} />
            <Typography sx={{ marginTop: '10px', color: '#8F4D63', fontWeight: '500', fontFamily: 'Poppins' }}>
                No se encontraron resultados.
            </Typography>
        </Box>
    ) : (
        filteredCampaigns.map((campaign, index) => {
            const isSelected = selectedCampaigns.includes(index);
            const progreso = (campaign.numeroActual / campaign.numeroInicial) * 100;

            return (
                                    <ListItem key={index} sx={{
                                        background: "#FFFFFF",
                                        backgroundColor: isSelected ? "rgba(209, 119, 154, 0.15)" : "#FFFFFF",
                                        border: "1px solid #AE78884D",
                                        opacity: 1,
                                        width: "100%",
                                        height: "73px",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        padding: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "background-color 0.3s",
                                        "&:hover": {
                                        backgroundColor: "#F2EBEDCC" // 🔥 Fondo cuando pasas el mouse
                                        }
                                    }}>
                                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                            <Box sx={{ marginTop: "-5px", display: "flex", alignItems: "center" }}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => {
                                                    setSelectedCampaigns(prev =>
                                                    isSelected ? prev.filter(i => i !== index) : [...prev, index]
                                                    );
                                                }}
                                                icon={
                                                    <Box
                                                    sx={{
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "4px",
                                                        border: "2px solid #8F4D63",
                                                    }}
                                                    />
                                                }
                                                checkedIcon={
                                                    <Box
                                                    sx={{
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "#8F4D63",
                                                        border: "2px solid #8F4D63",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                    >
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                        color: "#FFFFFF",
                                                        fontSize: "13px",
                                                        fontWeight: "bold",
                                                        lineHeight: "1",
                                                        fontFamily: "Poppins, sans-serif",
                                                        }}
                                                    >
                                                        ✓
                                                    </Box>
                                                    </Box>
                                                }
                                                sx={{
                                                    color: "#8F4D63",
                                                    "&.Mui-checked": { color: "#8F4D63" },
                                                    alignSelf: "flex-start",
                                                }}
                                                />

                                                <img src={smsico} alt="SMS" 
                                                style={{ 
                                                    width: "18px", 
                                                    height: "18px", 
                                                    marginRight: "8px",
                                                    color: isSelected ? "#8E5065" : "#574B4F", 
                                                 }} />
                                                <Typography sx={{
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                                fontFamily: "Poppins",
                                                                color: isSelected ? "#8E5065" : "#574B4F", // 👈 Cambia de color cuando está seleccionado
                                                                marginBottom: "6px"
                                                                }}
                                                            >
                                                    {campaign.name}
                                                </Typography>
                                            </Box>
                                            <MoreVertIcon
                                                sx={{
                                                    position: "absolute", // 3 puntillos fijos
                                                    top: "30px",          // distancia desde el top de su contenedor padre #6C3A52
                                                    right: "30px",
                                                    height: "24px",
                                                    width: "24px"
                                                }}
                                                />
                                            <IconButton
                                                onClick={() => {
                                                    setPinnedCampaigns(prev =>
                                                    prev.includes(index)
                                                        ? prev.filter(i => i !== index)
                                                        : [...prev, index]
                                                    );
                                                }}
                                                sx={{ padding: 0 }}
                                                >
                                                <PushPinIcon
                                                    sx={{
                                                    color: pinnedCampaigns.includes(index) ? "#8E5065" : "#574B4F",
                                                    fontSize: "20px",
                                                    transform: pinnedCampaigns.includes(index) ? "rotate(45deg)" : "none",
                                                    transition: "transform 0.3s ease, color 0.3s ease"
                                                    }}
                                                />
                                                </IconButton>
                                        </Box>
                                        <Box sx={{ width: "65%", backgroundColor: "#E0E0E0", borderRadius: "6px", height: "10px", position: "relative", marginBottom: "10px", marginX: "auto" }}>
                                            <Box sx={{ width: `${progreso}%`, backgroundColor: "#AE7888", borderRadius: "3px", 
                                            height: "8px", 
                                            position: "absolute", 
                                            marginTop: "-9px",
                                            }} />
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%", marginTop: "0px", paddingLeft: "45px" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: "600", color: "#574B4FCC", marginLeft: "7px", marginTop: "-7px", color: isSelected ? "#8E5065" : "#574B4F"}}>{Math.round(progreso)}%</Typography>
                                            <Typography sx={{ fontSize: "12px", color: "#574B4FCC", marginTop: "-7px", marginLeft: "7px", color: isSelected ? "#8E5065" : "#574B4F", fontFamily: "Poppins" }}>{campaign.numeroActual}/{campaign.numeroInicial}</Typography>
                                        </Box>
                                    </ListItem>
                                );
                            })
                        )}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: "8px" }}>
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

                        <Tooltip title="Añadir información" arrow placement="top"
                         componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo negro con transparencia
                                    color: "#CCC3C3",            
                                    fontFamily: "Poppins, sans-serif",    
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" // Sombra opcional
                                  }
                                },
                                arrow: {
                                  sx: {
                                    color: "rgba(0, 0, 0, 0.8)" // Flecha negra con transparencia
                                  }
                                }
                              }}
                            >
                        <IconButton
  style={{
    backgroundColor: "#FFFFFF",
    left: "84%",
    border: '1px solid #CCCFD2',
    borderRadius: '8px',
    color: '#8F4D63',
    background: '#FFFFFF',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.background = '#F2E9EC';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.border = '1px solid #CCCFD2';
  }}
  onClick={() => setOpenInfoModal(true)} // 👈 Aquí
>
  <img src={welcome} alt="Welcome" style={{ width: '24px', height: '24px' }} />
</IconButton>

                        </Tooltip>
                </Box>

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
                            <MainButton
                                text={isRunning ? 'Detener' : 'Iniciar'}
                                onClick={() => setIsRunning(prev => !prev)}
                            />
                        </Box>


                    </Paper>

                {/* Paper Horarios */}
            {infoChecks["Horarios"] && (
                <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", maxWidth: "100%", height: "auto" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                        Horarios
                    </Typography>
                    <Tooltip title="Cerrar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "#000000",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "#000000"
                                    }
                                }
                                }}
                                PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                        }
                                      }
                                    ]
                                  }}
                            >
                    <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, Horarios: false }))}>
                <CloseIcon />
                </IconButton>
                </Tooltip>
                    </Box>

                    <Box sx={{ display: "flex", gap: "16px", paddingLeft: "10px", paddingTop: "4px" }}>
                    {[
                        { label: "Vencido", color: "#B0B0B0" },
                        { label: "Vigente", color: "#5CB85C" },
                        { label: "Próximo", color: "#E38C28" }
                    ].map((item, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box
                            sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: item.color
                            }}
                        />
                        <Typography sx={{ fontSize: "14px", fontFamily: "Poppins", color: "#574B4F" }}>
                            {item.label}
                        </Typography>
                        </Box>
                    ))}
                    </Box>

                    <Box sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto", backgroundColor: "#D6D6D64D" }}>
                    <List sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        {[
                        { texto: "25 MAR–26 MAR, 09:30–22:00", estado: "vencido" },
                        { texto: "26 JUL, 09:00–21:00", estado: "vigente" },
                        { texto: "27 MAR, 09:30–22:00", estado: "proximo" },
                        { texto: "28 MAR, 09:30–22:00", estado: "proximo", alineadoDerecha: true }
                        ].map((horario, index) => (
                        <Box
                            key={index}
                            sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: horario.alineadoDerecha ? "flex-end" : "flex-start",
                            width: horario.alineadoDerecha ? "100%" : "auto",
                            paddingY: "2px",
                            paddingX: "8px"
                            }}
                        >
                            <Typography
                            sx={{
                                fontFamily: "Poppins",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "22px",
                                color:
                                horario.estado === "vencido"
                                    ? "#B4ACAC"
                                    : horario.estado === "vigente"
                                    ? "#5CB85C"
                                    : "#E38C28"
                            }}
                            >
                            {horario.texto}
                            </Typography>
                        </Box>
                        ))}
                    </List>
                    </Box>
                </Paper>
                )}

            {/*Paper Mensaje*/}
                    {infoChecks["Prueba de envío de mensaje"] && (
  <Paper
    sx={{
      padding: "10px",
      marginTop: "10px",
      borderRadius: "10px",
      width: "100%",
      height: "auto"
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
            Mensaje
        </Typography>
        <Tooltip title="Cerrar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "#000000",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "#000000"
                                    }
                                }
                                }}
                                PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                        }
                                      }
                                    ]
                                  }}
                            >
        <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Prueba de envío de mensaje": false }))}>
            <CloseIcon />
        </IconButton>
        </Tooltip>
    </Box>

    <Box
      sx={{
        padding: "10px",
        borderRadius: "10px",
        width: "100%",
        height: "auto",
        backgroundColor: "#D6D6D64D",
        opacity: 0.6
      }}
    >
      <Typography sx={{ textAlign: "left", fontFamily: "Poppins", fontSize: "14px", color: "#574B4F" }}>
        A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.
      </Typography>
    </Box>

    <Divider sx={{ marginY: "15px" }} />

    <Paper
      sx={{
        padding: "10px",
        marginTop: "15px",
        borderRadius: "10px",
        width: "100%",
        height: "auto",
        boxShadow: "none"
      }}
    >
      <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginBottom: "5px" }}>
        Prueba de envío
      </Typography>
      <Box
        sx={{
          padding: "16px",
          marginTop: "10px",
          borderRadius: "10px",
          backgroundColor: "#F5F5F5"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "#574B4F",
                marginBottom: "6px"
              }}
            >
              Teléfono
            </Typography>
            <TextField
              fullWidth
              value={phone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setPhone(onlyNumbers);
                setError(!validatePhone(onlyNumbers));
              }}
              error={error}
              helperText={error ? "Formato inválido" : ""}
              placeholder="5255"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 12
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
                )
              }}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "4px",
                "& .MuiInputBase-input": {
                  fontFamily: "Poppins, sans-serif"
                },
                "& .MuiFormHelperText-root": {
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#F2F2F2",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  margin: 0
                }
              }}
            />
          </Box>
          <MainButton text="Enviar" onClick={() => console.log("Enviar")} disabled={error} />
        </Box>
      </Box>
    </Paper>
  </Paper>
)}

                    {/*Paper Gestión de registros*/}
                    {infoChecks["Registros"] && (
                    <Paper sx={{ padding: "10px", marginTop: "10px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                                Gestión de registros
                            </Typography>
                            <Tooltip title="Cerrar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "#000000",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "#000000"
                                    }
                                }
                                }}
                                PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                        }
                                      }
                                    ]
                                  }}
                            >
                            <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, Registros: false }))}>
                                <CloseIcon />
                            </IconButton>
                            </Tooltip>
                        </Box>
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
                                                <Box
                                                    component="img"
                                                    src={IconTrash}
                                                    alt="Eliminar"
                                                    sx={{ width: "25px", height: "25px", cursor: "pointer", opacity: 0.6 }}
                                                />
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
                )}

                    {/*Paper Resultados de envío*/}
                    {infoChecks["Resultados de envío por día"] && (
                    <Paper sx={{ padding: "10px", marginTop: "25px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                            Resultados de envío
                            </Typography>
                            <Tooltip title="Cerrar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "#000000",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "#000000"
                                    }
                                }
                                }}
                                PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                        }
                                      }
                                    ]
                                  }}
                            >
                            <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Resultados de envío por día": false }))}>
                                <CloseIcon />
                            </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px", border: "2px solid #F2F2F2", borderRadius: "10px", marginBottom: "20px", }}>
                            {indicadores.map((indicador, index) => (
                                <Box key={index} sx={{ textAlign: "center" }}>
                                    <img src={infoicon} width="24px" height="24px" />
                                    <Typography sx={{ fontSize: "14px", color: "#9B9295", fontWeight: "bold" }}>{indicador.label}</Typography>
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
                    )}

                    {/*Paper Mapa */}
                        {infoChecks["Mapa de concentración de mensajes"] && (
                    <Paper sx={{ padding: "10px", marginTop: "30px", borderRadius: "10px", width: "100%", height: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins", marginLeft: "10px" }}>
                                Mapa de concentración de mensajes
                            </Typography>
                            <Tooltip title="Cerrar" arrow placement="top"
                                componentsProps={{
                                tooltip: {
                                    sx: {
                                    backgroundColor: "#000000",
                                    color: "#CCC3C3",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.7)"
                                    }
                                },
                                arrow: {
                                    sx: {
                                    color: "#000000"
                                    }
                                }
                                }}
                                PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -15] // [horizontal, vertical] — aquí movemos 3px hacia abajo
                                        }
                                      }
                                    ]
                                  }}
                            >
                            <IconButton onClick={() => setInfoChecks(prev => ({ ...prev, "Mapa de concentración de mensajes": false }))}>
                                <CloseIcon />
                            </IconButton>
                            </Tooltip>
                        </Box>
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
                    )}
                </Grid>
            </Grid>
            <MainModal
    isOpen={openModal}
    Title="Eliminar campañas"
    message="Esta seguro de quedesea eliminar las campañas seleccionadas? Esta acción no podrá revertirse."
    primaryButtonText="Eliminar"
    secondaryButtonText="Cancelar"
    onPrimaryClick={() => {
        setOpenModal(false);
        // Aquí puedes meter la lógica de eliminación
        console.log("Campañas eliminadas");
    }}
    onSecondaryClick={() => setOpenModal(false)}
/>

<Dialog
  open={openInfoModal}
  onClose={() => setOpenInfoModal(false)}
  PaperProps={{
    sx: {
      width: "585px",
      height: "435px",
      padding: "24px",
      borderRadius: "12px",
      boxSizing: "border-box",
    }
  }}
>
  <DialogTitle
    sx={{
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: "20px",
      color: "#574B4F",
      paddingBottom: 0,
      textTransform: "none",
      pl: "5px" ,
      marginTop: "-20px"
    }}
  >
    Información visible en la sección campañas
  </DialogTitle>
  {/* Línea divisoria */}
  <Divider
  sx={{
    position: "absolute",
    marginY: "47px",
    left: "0px",
    backgroundColor: "#9F94A5", // Rojo o tono vino
    height: "1px",
    width: "100%",
    opacity: 0.3
  }}
/>

  <DialogContent sx={{ paddingTop: "10px" }}>
     <List sx={{ pl: "-20px" }}>
      <ListItem disablePadding sx={{ opacity: 0.5, marginBottom: "4px", marginTop: "15px" }}>
        <Checkbox
  checked
  icon={
    <Box
      sx={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: "2px solid #8F4D63",
      }}
    />
  }
  checkedIcon={
    <Box
      sx={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        backgroundColor: "#8F4D63",
        border: "2px solid #8F4D63",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          color: "#FFFFFF",
          fontSize: "13px",
          fontWeight: "bold",
          lineHeight: "1",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        ✓
      </Box>
    </Box>
  }
  sx={{
    color: "#8F4D63",
    "&.Mui-checked": { color: "#8F4D63" },
    alignSelf: "flex-start",
  }} disabled />
        <ListItemText
          primary="Progreso de la campaña seleccionada"
          primaryTypographyProps={{
            sx: { fontFamily: "Poppins", color: "#D3CED0", fontSize: "16px" }
          }}
        />
      </ListItem>
      {[
  "Horarios",
  "Prueba de envío de mensaje",
  "Registros",
  "Mapa de concentración de mensajes",
  "Resultados de envío por día"
].map((text, i) => (
  <ListItem key={i} disablePadding sx={{ marginBottom: "4px" }}>
    <Checkbox
      checked={infoChecks[text]}
      onChange={() =>
        setInfoChecks((prev) => ({ ...prev, [text]: !prev[text] }))
      }
      icon={
        <Box
          sx={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: "2px solid #8F4D63",
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            backgroundColor: "#8F4D63",
            border: "2px solid #8F4D63",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="span"
            sx={{
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: "bold",
              lineHeight: "1",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            ✓
          </Box>
        </Box>
      }
      sx={{
        color: "#8F4D63",
        "&.Mui-checked": { color: "#8F4D63" },
        alignSelf: "flex-start",
      }}
    />
    <ListItemText
      primary={text}
      primaryTypographyProps={{
        sx: {
          fontFamily: "Poppins",
          color: "#8F4D63",
          fontWeight: 500,
          fontSize: "16px",
        },
      }}
    />
  </ListItem>
))}
    </List>
  </DialogContent>

{/* Línea divisoria */}
<Divider
  sx={{
    position: "absolute",
    marginY: "332px",
    left: "0px",
    backgroundColor: "#9F94A5",
    height: "1px",
    width: "100%",
    opacity: 0.3
  }}
/>


  <DialogActions sx={{ justifyContent: "space-between", paddingX: "24px", paddingBottom: "8px", 
    marginLeft: "-20px", 
    marginRight: "-20px",
    marginBottom: "-15px",
    }}>


    <Button
      variant="outlined"
      onClick={() => setOpenInfoModal(false)}
      sx={{
        border: "1px solid #CCCFD2",
        borderRadius: "4px",
        color: "#833A53",
        backgroundColor: "transparent",
        fontVariant: "normal",
        letterSpacing: "1.12px",
        fontWeight: "500",
        fontSize: "14px",
        fontFamily: "Poppins",
        opacity: 1,
        "&:hover": {
            backgroundColor: "#f3e6eb",
            fontSize: "14px",
            fontFamily: "Poppins",
            color: "#833A53",
            letterSpacing: "1.12px",
            opacity: 1,
        },
    }}
    >
      Cancelar
    </Button>
    <Button
      variant="contained"
      onClick={() => setOpenInfoModal(false)}
      sx={{
        background: "#833A53 0% 0% no-repeat padding-box",
        border: "1px solid #D4D1D1",
        borderRadius: "4px",
        opacity: 1,
        fontVariant: "normal",
        fontWeight: "500",
        fontSize: "14px",
        fontFamily: "Poppins",
        letterSpacing: "1.12px",
        color: "#FFFFFF", // Letra blanca
    }}
    >
      Guardar cambios
    </Button>
  </DialogActions>
</Dialog>    
        
        </Box>
    );
};

export default Campains;
