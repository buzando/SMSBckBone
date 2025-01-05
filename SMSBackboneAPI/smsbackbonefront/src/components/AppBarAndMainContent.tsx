import React, { useState, useContext, useEffect } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../hooks/useContextInitialState'
import { getColorRole } from '../types/Types';
import nuxiba_svg from '../assets/nuxiba.svg'
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import HelpIcon from "@mui/icons-material/Help";
import Modal from "@mui/material/Modal";
import {
    Box,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Button,
    TextField,
    MenuList,
    Popper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DropDownIcon from '../assets/icon-punta-flecha-bottom.svg';
import HomeIcon from '@mui/icons-material/Home';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
const drawerWidth = 280;

type Page = {
    id: number,
    title: string,
    path: string,
    icon: React.ReactNode,
    hasSubMenus: boolean,
    subMenus: SubMenu[]
}
type SubMenu = {
    id: number,
    title: string,
    path: string,
    icon: React.ReactNode,
}



const pages: Page[] = [
    { id: 0, title: 'Inicio', path: '/', icon: <HomeIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    { id: 1, title: 'Usuarios', path: '/users', icon: <PeopleAltIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    {
        id: 2, title: 'Administración', path: '', icon: <PeopleAltIcon sx={{ color: 'white' }} />, hasSubMenus: true, subMenus: [
            { id: 1, title: 'Usuarios', path: '/users', icon: <PeopleAltIcon sx={{ color: 'white' }} /> },
            { id: 2, title: 'Salas', path: '/rooms', icon: <HomeIcon sx={{ color: 'white' }} /> },
        ]
    },
    {
        id: 3, title: 'Facturación', path: '/billing', icon: <LocalAtmIcon sx={{ color: 'white' }} />, hasSubMenus: true, subMenus: [
            { id: 1, title: 'Historial de pagos', path: '/billing/paymenthistory', icon: <HistoryIcon sx={{ color: 'white' }} /> },
            { id: 2, title: 'Métodos de pago', path: '/billing/paymentmethods', icon: <PaymentIcon sx={{ color: 'white' }} /> },
            { id: 3, title: 'Uso', path: '/billing/paymentusage', icon: <DataUsageIcon sx={{ color: 'white' }} /> },
            { id: 4, title: 'Costos', path: '/billing/paymentcost', icon: <AttachMoneyIcon sx={{ color: 'white' }} /> },
            { id: 5, title: 'Ajustes de pago', path: '/billing/paymentsettings', icon: <SettingsSuggestIcon sx={{ color: 'white' }} /> },
        ]
    },
    { id: 4, title: 'Reportes', path: '/reports', icon: <AssessmentIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    {
        id: 5, title: 'SMS', path: '/numbers', icon: <SmartphoneIcon sx={{ color: 'white' }} />, hasSubMenus: true, subMenus: [
            { id: 1, title: 'Configuración SMS', path: '/sms', icon: <ChecklistRtlIcon sx={{ color: 'white' }} /> },
        ]
    },
    { id: 6, title: 'Ayuda', path: '/help', icon: <HelpOutlineIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },

    // Opciones del botón de usuario
    { id: 7, title: 'Editar cuenta', path: '/ManageAccount', icon: <EditIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    { id: 8, title: 'Administrar cuentas', path: '/UserAdministration', icon: <PeopleAltIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    { id: 9, title: 'Cerrar sesión', path: '', icon: <Avatar sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
];

type Room = {
    id: string | number;
    name: string;
    client: string;
    description: string; // Ajustado desde "dscription"
    credits: number;
    long_sms: number;
    calls: number;
    short_sms: number;
};

type Props = {
    children: React.ReactNode;
}


const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        //marginLeft: drawerWidth,
        // width: `calc(100% - ${drawerWidth}px)`,
        width: `calc(100%)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                ...openedMixin(theme),
                background: 'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%)',
                borderRight: '1px solid #E6E4E4',
                color: '#FFFFFF',
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                background: 'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%)',
                borderRight: '1px solid #E6E4E4',
                color: '#FFFFFF',
            },
        }),
    })
);



const NavBarAndDrawer: React.FC<Props> = props => {
    const [searchOpen, setSearchOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredPages, setFilteredPages] = useState<Page[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [openSubMenuBilling, setOpenSubMenuBilling] = useState(false);
    const [openSubMenuNumbers, setOpenSubMenuNumbers] = useState(false);
    const { contextState, setContextState } = useContext(AppContext)
    const { user } = contextState
    const [openSubMenu, setOpenSubMenu] = useState(false); // Submenú de administración
    const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);



    const openHelpModal = () => setHelpModalIsOpen(true);
    const closeHelpModal = () => setHelpModalIsOpen(false);

    const isAdmin = user?.rol === 'Administrador'

    const handleLogout = () => {
        // Limpiar localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Redirigir al login
        navigate('/login');
    };


    useEffect(() => {
        // Cargar datos desde localStorage
        const storedRooms = localStorage.getItem('ListRooms');

        const currentRoom = localStorage.getItem('selectedRoom');

        if (storedRooms) {
            try {
                const parsedRooms = JSON.parse(storedRooms);
                if (Array.isArray(parsedRooms)) {
                    setRooms(parsedRooms);
                } else {
                    console.error('Los datos de las salas no están en el formato correcto.');
                }
            } catch (error) {
                console.error('Error al parsear las salas desde localStorage', error);
            }
        }
        if (currentRoom) {
            try {
                const room = JSON.parse(currentRoom);
                setSelectedRoom(room);  // Esto debería ser un solo objeto Room, no un array
            } catch (error) {
                console.error('Error al parsear la sala seleccionada desde localStorage', error);
            }
        }
        setFilteredPages([]);

        // Actualizar los resultados de búsqueda
        const results: Page[] = pages
            .flatMap((page) =>
                // Solo considerar páginas que no tengan submenús
                !page.hasSubMenus
                    ? [page]
                    : [] // No agregamos las páginas con submenús
            )
            .filter((item) =>
                searchTerm && item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const search = searchTerm.toLowerCase();
                const aTitle = a.title.toLowerCase();
                const bTitle = b.title.toLowerCase();

                const aStartsWith = aTitle.startsWith(search);
                const bStartsWith = bTitle.startsWith(search);

                // Priorizar los resultados que comienzan con el término buscado
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                // Ordenar alfabéticamente los demás resultados
                return aTitle.localeCompare(bTitle);
            });

        setFilteredPages(results);
    }, [searchTerm, openSubMenuBilling, openSubMenuNumbers]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);  // Establecer correctamente el anchorEl
    };

    //const handleMenuClose = () => {
    //    setAnchorEl(null);
    //};

    // Función para seleccionar una sala
    const handleRoomChange = (room: Room) => {
        setSelectedRoom(room);
        localStorage.setItem('selectedRoom', JSON.stringify(room));
        setAnchorEl(null);
    };


    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(null);
        switch (Number(event.currentTarget.id)) {
            case 1:
                console.log("Profile settings")
                break;
            case 2:
                console.log("Account settings")
                break;
            case 3:
                setContextState({
                    user: {
                        userName: '',
                        email: '',
                        rol: ''
                    },
                    token: '',
                    expiration: ''
                })
                localStorage.clear();
                navigate('/login')
                break;
        }
    };


    const handleSubMenuToggle = () => {
        setOpenSubMenu(!openSubMenu);
    };


    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ bgcolor: '#290013' }}>
                <Toolbar>
                    {/* Sección Izquierda */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={() => console.log('Drawer opened')}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" sx={{ ml: 2 }}>
                            connectSMS
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            marginRight: '50px', // Ajusta este valor para mover toda la sección hacia la izquierda
                        }}
                    >
                        {/* Buscador */}
                        {!searchOpen ? (
                            <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                                <SearchIcon />
                            </IconButton>
                        ) : (
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'background.paper',
                                    borderRadius: '5px',
                                    boxShadow: 2,
                                    border: '1px solid #7B354D', // Borde del mismo color que las letras
                                    height: '40px',
                                    width: '300px',
                                }}
                            >
                                {/* Campo de texto para búsqueda */}
                                <TextField
                                    fullWidth
                                    placeholder="Buscar"
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon sx={{ color: '#7B354D', marginRight: 1 }} />
                                        ),
                                        endAdornment: (
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setFilteredPages([]);
                                                }}
                                                sx={{ color: '#7B354D' }} // Color del ícono de limpiar
                                            >
                                                ✖
                                            </IconButton>
                                        ),
                                        style: {
                                            height: '100%',
                                            textAlign: 'left',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '16px',
                                            lineHeight: '25px',
                                            letterSpacing: '0px',
                                            color: '#7B354D',
                                            opacity: 1,
                                        },
                                    }}
                                />
                                {/* Mostrar resultados filtrados */}
                                {searchTerm ? (
                                    filteredPages.length > 0 ? (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '40px',
                                                left: 0,
                                                width: '100%',
                                                bgcolor: 'background.paper',
                                                boxShadow: 3,
                                                zIndex: 1500,
                                                borderRadius: '0 0 5px 5px',
                                                border: '1px solid #7B354D',
                                                borderTop: 'none',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                padding: 2,
                                            }}
                                        >
                                            {filteredPages.map((page) => (
                                                <MenuItem
                                                    key={page.id}
                                                    onClick={() => {
                                                        navigate(page.path);
                                                        setSearchOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            textAlign: 'left',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontSize: '16px',
                                                            lineHeight: '25px',
                                                            color: '#7B354D', // Color del texto
                                                        }}
                                                    >
                                                        {page.title}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '40px',
                                                left: 0,
                                                width: '100%',
                                                bgcolor: 'background.paper',
                                                boxShadow: 3,
                                                zIndex: 1500,
                                                borderRadius: '0 0 5px 5px',
                                                border: '1px solid #7B354D',
                                                borderTop: 'none',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                padding: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textAlign: 'center',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '16px',
                                                    lineHeight: '25px',
                                                    color: '#7B354D',
                                                    opacity: 1,
                                                }}
                                            >
                                                No se encontraron resultados
                                            </Typography>
                                        </Box>
                                    )
                                ) : null}


                            </Box>
                        )}
                    </Box>

                    {/* Selector de salas */}
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            ml: 2,
                            padding: '4px 8px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #ddd',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            justifyContent: 'space-between',
                            minWidth: '300px',
                            maxWidth: '350px',
                            height: '50px',
                            position: 'relative', // Es importante mantener esto para el Popper
                            marginLeft: '-5px'
                        }}
                    >
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            {/* Ícono de la casa */}
                            <HomeIcon
                                sx={{
                                    backgroundColor: '#B0B0B0',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    fontSize: 35,
                                    color: 'white',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                            <Box sx={{ marginLeft: '10px' }}>
                                {/* Nombre y Descripción de la sala */}
                                <Typography
                                    variant="body1"
                                    color="inherit"
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        color: '#000',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {selectedRoom && selectedRoom.name ? selectedRoom.name : 'Sin nombre'}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        fontSize: '12px',
                                        color: '#888',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {selectedRoom && selectedRoom.description ? selectedRoom.description : 'Sin descripción'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Ícono del menú */}
                        <IconButton
                            color="inherit"
                            onClick={handleMenuOpen}
                            sx={{ color: 'black' }}
                        >
                            <img src={DropDownIcon} alt="dropdown" width="24" height="24" />
                        </IconButton>

                        {/* Usamos Popper para controlar el posicionamiento */}
                        <Popper
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            placement="bottom"
                            modifiers={[
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [-120, 8], // Ajusta el desplazamiento (horizontal, vertical)
                                    },
                                },
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        boundary: 'window', // Evita que se salga de los bordes de la ventana
                                    },
                                },
                            ]}
                            sx={{
                                zIndex: 1300,
                                backgroundColor: 'white',
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                                width: '100%',
                                maxWidth: '300px',
                                marginTop: '8px',
                            }}
                        >
                            {/* Buscador */}
                            <Box sx={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar sala..."
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            padding: '2px 8px',
                                            '& .MuiInputAdornment-root': {
                                                position: 'absolute',
                                                right: 0, // Lupa alineada a la derecha dentro del recuadro
                                                marginRight: '8px',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon sx={{ color: '#7B354D', marginRight: 1 }} />
                                        ),
                                        endAdornment: (
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSearchTerm('');  // Limpiar el término de búsqueda
                                                    setFilteredPages([]); // Opcional, para limpiar los resultados filtrados
                                                }}
                                                sx={{ color: '#7B354D' }} // Color del tache
                                            >
                                                <ClearIcon sx={{ color: '#7B354D' }} />
                                            </IconButton>
                                        ),
                                        style: {
                                            height: '100%',
                                            textAlign: 'left',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '16px',
                                            lineHeight: '25px',
                                            letterSpacing: '0px',
                                            color: '#7B354D',
                                            opacity: 1,
                                        },
                                    }}
                                />
                            </Box>

                            {/* Resultados de la lista de salas */}
                            <MenuList sx={{ paddingLeft: 0 }}>
                                {rooms
                                    .filter((room) =>
                                        room.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((room, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => handleRoomChange(room)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px 16px',
                                            }}
                                        >
                                            <HomeIcon
                                                sx={{
                                                    backgroundColor: '#B0B0B0',
                                                    borderRadius: '50%',
                                                    padding: '8px',
                                                    fontSize: 32,
                                                    color: 'white',
                                                    marginRight: '8px',
                                                }}
                                            />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '14px',
                                                        color: '#000',
                                                    }}
                                                >
                                                    {room.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#888',
                                                    }}
                                                >
                                                    {room.description}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                            </MenuList>
                        </Popper>


                    </Box>






                    {/* Usuario */}
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                        <Avatar alt={user.userName} sx={{ bgcolor: getColorRole(user.rol) }} />
                    </IconButton>

                    {/* Nombre del usuario */}
                    <Typography variant="body2" sx={{ color: '#fff', marginLeft: '8px' }}>
                        {user.userName || 'Usuario'}
                    </Typography>
                    <Menu
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        sx={{ mt: 1 }} // Espaciado opcional entre el avatar y el menú
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center', // Anclar el menú al centro horizontal del avatar
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center', // El inicio del menú se alinea con el centro del avatar
                        }}
                    >
                        <MenuItem onClick={() => navigate('/ManageAccount')}>
                            <Typography textAlign="center">
                                <Box display="flex" alignItems="center">
                                    <EditIcon sx={{ fontSize: 20, mr: 1 }} />
                                    Editar cuenta
                                </Box>
                            </Typography>
                        </MenuItem>
                        {isAdmin && (
                            <MenuItem onClick={() => navigate('/UserAdministration')}>
                                <Typography textAlign="center">
                                    <Box display="flex" alignItems="center">
                                        <PeopleAltIcon sx={{ fontSize: 20, mr: 1 }} />
                                        Administrar cuentas
                                    </Box>
                                </Typography>
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => navigate('/TermsAndConditions')}>
                            <Typography textAlign="center">
                                <Box display="flex" alignItems="center">
                                    <DescriptionIcon sx={{ fontSize: 20, mr: 1 }} />
                                    Términos y condiciones
                                </Box>
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Typography textAlign="center">
                                <Box display="flex" alignItems="center">
                                    <Avatar sx={{ fontSize: 20, mr: 1 }} />
                                    Cerrar sesión
                                </Box>
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>



            <Drawer variant="permanent" open={true} PaperProps={{ sx: { background: 'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%) 0% 0% no-repeat padding-box;', color: 'white' } }}>
                <DrawerHeader />

                <Box
                    sx={{
                        background: '#FFFFFF', // Fondo blanco
                        border: '1px solid #DDD8DA',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '90%', // Mantener el ancho del contenedor principal
                        marginX: 'auto',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra general
                    }}
                >
                    {/* Contenedor para el encabezado y los botones */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between', // Asegura que los elementos se separen
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        {/* Créditos totales con sombra */}
                        <Box
                            sx={{
                                background: '#DDD8D933', // Fondo semitransparente
                                border: '1px solid #DDD8DA',
                                borderRadius: '8px',
                                padding: '12px',
                                width: '80%', // Más pequeño y pegado a la izquierda
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: 'left',
                                    font: 'normal normal bold 14px/20px Poppins',
                                    color: '#833A53',
                                }}
                            >
                                Créditos Totales SMS
                            </Typography>
                            <Typography
                                sx={{
                                    textAlign: 'left',
                                    font: 'normal normal bold 24px/32px Poppins',
                                    color: '#833A53',
                                    marginTop: '4px',
                                }}
                            >
                                {selectedRoom?.credits || 0}
                            </Typography>
                            {/* Créditos cortos y largos */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '8px',
                                }}
                            >
                                <Box sx={{ textAlign: 'left', flex: 1 }}>
                                    <Typography
                                        sx={{
                                            font: 'normal normal 500 12px Poppins',
                                            color: '#833A53',
                                        }}
                                    >
                                        # Cortos
                                    </Typography>
                                    <Typography
                                        sx={{
                                            font: 'normal normal bold 14px Poppins',
                                            color: '#833A53',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {selectedRoom?.short_sms || 0}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'left', flex: 1 }}>
                                    <Typography
                                        sx={{
                                            font: 'normal normal 500 12px Poppins',
                                            color: '#833A53',
                                        }}
                                    >
                                        # Largos
                                    </Typography>
                                    <Typography
                                        sx={{
                                            font: 'normal normal bold 14px Poppins',
                                            color: '#833A53',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {selectedRoom?.long_sms || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Botones redondos */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px', // Espacio entre los botones
                                alignItems: 'center',
                            }}
                        >
                            {/* Botón circular con ícono de cambio */}
                            <IconButton
                                sx={{
                                    background: '#FFFFFF',
                                    border: '1px solid #DDD8DA',
                                    borderRadius: '50%', // Botón redondo
                                    padding: '8px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src="/path-to-icon" // Reemplaza con el ícono correcto
                                    alt="Icono"
                                    style={{ width: '20px', height: '20px' }}
                                />
                            </IconButton>

                            <IconButton
                                sx={{
                                    background: 'transparent', // Fondo transparente
                                    border: 'none', // Sin borde
                                    borderRadius: '50%', // Botón redondo
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#833A53', // Color del texto
                                    boxShadow: 'none', // Sin sombra
                                    '&:hover': {
                                        background: '#F5F5F5', // Fondo suave al pasar el mouse
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        font: 'normal normal bold 16px Poppins',
                                        color: '#833A53', // Color del texto
                                    }}
                                >
                                    {'>'}
                                </Typography>
                            </IconButton>

                        </Box>
                    </Box>

                    {/* Botones Gestionar y Recargar */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: '16px',
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                textAlign: 'center',
                                font: 'normal normal 600 14px/20px Poppins',
                                color: '#833A53',
                                background: '#FFF',
                                borderRadius: '8px',
                                padding: '6px 16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    background: '#F5F5F5',
                                },
                            }}
                            onClick={() => navigate('/CreditManagement')}
                        >
                            Gestionar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                textAlign: 'center',
                                font: 'normal normal 600 14px/20px Poppins',
                                color: '#833A53',
                                background: '#FFF',
                                borderRadius: '8px',
                                padding: '6px 16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    background: '#F5F5F5',
                                },
                            }}
                        >
                            Recargar
                        </Button>
                    </Box>
                </Box>






                <List>
                    {/* Menú de Administración */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleSubMenuToggle} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Administración"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                }}
                            />
                            {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenu} timeout="auto">
                        <List component="div" disablePadding>
                            <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/users')}>
                                    <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                        <PeopleAltIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Usuarios"
                                        primaryTypographyProps={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            color: '#FFFFFF',
                                        }}
                                    />
                                </ListItemButton>
                            </Link>
                            <Link to="/rooms" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/rooms')}>
                                    <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Salas"
                                        primaryTypographyProps={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            color: '#FFFFFF',
                                        }}
                                    />
                                </ListItemButton>
                            </Link>
                        </List>
                    </Collapse>

                    {/* Menú de SMS */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setOpenSubMenuNumbers(!openSubMenuNumbers)} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <SmartphoneIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="SMS"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                }}
                            />
                            {openSubMenuNumbers ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenuNumbers} timeout="auto">
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/sms')}>
                                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                    <ChecklistRtlIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Configuración SMS"
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        color: '#FFFFFF',
                                    }}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Menú de Reportes */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/reports')} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Reportes"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Menú de Facturación */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setOpenSubMenuBilling(!openSubMenuBilling)} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <LocalAtmIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Facturación"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                }}
                            />
                            {openSubMenuBilling ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenuBilling} timeout="auto">
                        <List component="div" disablePadding>
                            {pages[2].subMenus.map((subMenu) => (
                                <ListItemButton key={subMenu.id} sx={{ pl: 4 }} onClick={() => navigate(subMenu.path)}>
                                    <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                        {subMenu.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={subMenu.title}
                                        primaryTypographyProps={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            color: '#FFFFFF',
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    {/* Menú de Ayuda */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/help')} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <HelpOutlineIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Ayuda"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>


            </Drawer >
            <Container
                fixed
                maxWidth="xl"
                sx={{
                    marginLeft: `${drawerWidth}px`, // Respeta el ancho del Drawer
                    marginTop: '5px', // Ajusta la altura de la AppBar (64px es el alto estándar)
                    paddingBottom: '16px', // Opcional: espacio extra para evitar superposición con el footer
                }}
            >
                <Box sx={{ height: '4.5rem' }} />
                {props.children}
            </Container>
            <footer>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        padding: '16px',
                        borderTop: '1px solid #E6E4E4',
                        background: '#FFFFFF',
                        zIndex: 1200,
                    }}
                >
                    <Typography variant="caption" color="textSecondary">
                        {'Copyright © '}
                        {new Date().getFullYear()}
                        {' Nuxiba. Todos los derechos reservados. Se prohíbe el uso no autorizado.'}
                    </Typography>
                    <img src={nuxiba_svg} alt="Nuxiba Logo" width="80" />
                    {/* Botón circular con el icono de ayuda */}
                    <Fab
                        color="primary"
                        aria-label="help"
                        onClick={openHelpModal} // Llamada correcta sin parámetros
                        sx={{
                            position: "fixed",
                            bottom: 70,
                            right: 30,
                            zIndex: 1500,
                        }}
                    >
                        <HelpIcon />
                    </Fab>
                </Box>
            </footer>
            {/* Modal de ayuda */}
            <Modal
                open={helpModalIsOpen} // Controla si el modal está abierto
                onClose={closeHelpModal} // Cierra el modal cuando se hace clic afuera o presiona Escape
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: "500px",
                        bgcolor: "background.paper",
                        borderRadius: "10px",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-title" variant="h6" align="center" gutterBottom>
                        Ayuda
                    </Typography>
                    <Typography id="modal-description" variant="body1" gutterBottom>
                        Por favor, contáctenos:
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Horarios de atención</strong>
                    </Typography>
                    <Typography variant="body2">
                        Lunes a viernes<br />
                        Teléfono: 55 1107 8510 Opción 3<br />
                        <br />
                        Sábado<br />
                        9:00-18:00 CST<br />
                        Teléfono: 55 1107 8510 Opción 3<br />
                        <br />
                        Domingo<br />
                        9:00-15:00 CST<br />
                        Teléfono: 55 1107 8510 Opción 3<br />
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Línea de emergencia</strong>
                    </Typography>
                    <Typography variant="body2">
                        Lunes a viernes 21:00 - 07:00<br />
                        Teléfono: 55 5437 6175<br />
                        <br />
                        Sábado y domingo<br />
                        Teléfono: 55 5437 6175<br />
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "10px" }}>
                        Soporte: cwsoporte@nuxiba.com
                    </Typography>
                    <Box sx={{ marginTop: "20px", textAlign: "right" }}>
                        <Button onClick={closeHelpModal} variant="contained" color="primary">
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </>
    )
}

export default NavBarAndDrawer;
