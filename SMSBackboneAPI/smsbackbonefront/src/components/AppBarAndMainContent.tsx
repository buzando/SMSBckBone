import React, { useState, useContext, useEffect } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../hooks/useContextInitialState'
import { getColorRole } from '../types/Types';
import appIcon_svg from '../assets/AppIcon.svg'
import nuxiba_svg from '../assets/nuxiba.svg'
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import StoreIcon from '@mui/icons-material/Store';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import HelpIcon from "@mui/icons-material/Help";
import Modal from "@mui/material/Modal";

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

type userMenu = {
    idMenu: number;
    title: string;
    enable: boolean;
}

const pages: Page[] = [
    { id: 0, title: 'Inicio', path: '/', icon: <HomeIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    { id: 1, title: 'Usuarios', path: '/users', icon: <PeopleAltIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    {
        id: 2, title: 'Facturación', path: '/billing', icon: <LocalAtmIcon sx={{ color: 'white' }} />, hasSubMenus: true, subMenus: [
            { id: 1, title: 'Historial de pagos', path: '/billing/paymenthistory', icon: <HistoryIcon sx={{ color: 'white' }} /> },
            { id: 2, title: 'Métodos de pago', path: '/billing/paymentmethods', icon: <PaymentIcon sx={{ color: 'white' }} /> },
            { id: 3, title: 'Uso', path: '/billing/paymentusage', icon: <DataUsageIcon sx={{ color: 'white' }} /> },
            { id: 4, title: 'Costos', path: '/billing/paymentcost', icon: <AttachMoneyIcon sx={{ color: 'white' }} /> },
            { id: 5, title: 'Ajustes de pago', path: '/billing/paymentsettings', icon: <SettingsSuggestIcon sx={{ color: 'white' }} /> },
        ]
    },
    { id: 3, title: 'Reportes', path: '/reports', icon: <AssessmentIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    {
        id: 4, title: 'Números', path: '/numbers', icon: <SmartphoneIcon sx={{ color: 'white' }} />, hasSubMenus: true, subMenus: [
            { id: 1, title: 'Mis números', path: '/numbers/mynumbers', icon: <ChecklistRtlIcon sx={{ color: 'white' }} /> },
            { id: 2, title: 'Comprar números', path: '/numbers/buynumbers', icon: <StoreIcon sx={{ color: 'white' }} /> },
        ]
    },
    { id: 5, title: 'Prueba de API', path: '/apitest', icon: <CloudSyncIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
    { id: 6, title: 'Ayuda', path: '/help', icon: <HelpOutlineIcon sx={{ color: 'white' }} />, hasSubMenus: false, subMenus: [] },
];
const userSettings: userMenu[] = [
    { idMenu: 1, title: 'Perfil', enable: false },
    { idMenu: 2, title: 'Cuenta', enable: false },
    { idMenu: 3, title: 'Cerrar sesión', enable: true }
];

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
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openSubMenuBilling, setOpenSubMenuBilling] = useState(false);
    const [openSubMenuNumbers, setOpenSubMenuNumbers] = useState(false);
    const { contextState, setContextState } = useContext(AppContext)
    const { user } = contextState
    const [openSubMenu, setOpenSubMenu] = useState(false); // Submenú de administración

    const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
    const openHelpModal = () => setHelpModalIsOpen(true);
    const closeHelpModal = () => setHelpModalIsOpen(false);


    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setOpenSubMenuBilling(false);
        setOpenSubMenuNumbers(false);
    };

    useEffect(() => {
        if (openSubMenuBilling || openSubMenuNumbers) {
            setOpenDrawer(true);
        }
    }, [openSubMenuBilling, openSubMenuNumbers]);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
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
                    user: {},
                    token: '',
                    expiration: ''
                })
                localStorage.clear();
                navigate('/login')
                break;
        }
    };

    const getToggleFunction = (pageId: number) => {
        if (pageId === 2) {
            return () => setOpenSubMenuBilling(!openSubMenuBilling);
        } else if (pageId === 4) {
            return () => setOpenSubMenuNumbers(!openSubMenuNumbers);
        }
    }

    const handleSubMenuToggle = () => {
        setOpenSubMenu(!openSubMenu);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" open={openDrawer} sx={{ borderBottom: 1, borderColor: 'primary.main' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 2,
                                ...(openDrawer && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            color='inherit'
                            onClick={handleDrawerClose}
                            edge="start"
                            sx={{
                                marginRight: 2,
                                ...(!openDrawer && { display: 'none' }),
                            }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'block' },
                            }}
                        >
                            {pages.map((page) => (
                                <Link to={page.path} key={page.id} style={{ textDecoration: 'none', color: 'currentColor' }}>
                                    <MenuItem key={page.id} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page.title}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate('/')}>
                            <img src={appIcon_svg} alt="App Icon" width="170" />
                        </IconButton>
                    </Box>

                    {/* Información y menú del Usuario */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title={user.userName}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user.userName} sx={{ bgcolor: getColorRole(user.rol) }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => navigate('/ManageAccount')}>
                                <Typography textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <EditIcon sx={{ fontSize: 20, mr: 1 }} />
                                        Editar cuenta
                                    </Box>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/UserAdministration')}>
                                <Typography textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <PeopleAltIcon sx={{ fontSize: 20, mr: 1 }} />
                                        Administrar cuentas
                                    </Box>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => console.log("Datos de facturación")}>
                                <Typography textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <LocalAtmIcon sx={{ fontSize: 20, mr: 1 }} />
                                        Datos de facturación
                                    </Box>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => console.log("Términos y condiciones")}>
                                <Typography textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistRtlIcon sx={{ fontSize: 20, mr: 1 }} />
                                        Términos y condiciones
                                    </Box>
                                </Typography>
                            </MenuItem>
                            <MenuItem id="3" onClick={handleCloseUserMenu}>
                                <Typography textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ fontSize: 20, mr: 1 }} />
                                        Cerrar sesión
                                    </Box>
                                </Typography>
                            </MenuItem>
                        </Menu>


                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={openDrawer} PaperProps={{ sx: { background: 'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%) 0% 0% no-repeat padding-box;', color: 'white' } }}>
                <DrawerHeader />
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: 2, ...(!openDrawer && { display: 'none' }) }}>
                    <Paper
                        elevation={20}
                        sx={{
                            width: '90%',
                            borderRadius: '16px',
                            border: '1px solid gray',
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        <Box sx={{ padding: '16px' }}>
                            <Typography variant="subtitle2" fontWeight="bold" align="left" color="#574B4F">
                                Créditos SMS
                            </Typography>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                align="center"
                                my={1}
                                color="#330F1B"
                            >
                                10,000
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button variant="outlined" color="primary" size="small">
                                    Gestionar
                                </Button>
                                <Button variant="outlined" color="primary" size="small">
                                    Recargar
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleSubMenuToggle} sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <HomeIcon />
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
                </List>

            </Drawer >
            <Container fixed maxWidth="xl" sx={{ marginBottom: 8 }}>
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
