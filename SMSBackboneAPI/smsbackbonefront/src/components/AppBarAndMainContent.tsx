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
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
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
                            {userSettings.map(({ idMenu, title, enable }) => (
                                enable &&
                                <MenuItem key={idMenu} id={idMenu.toString()} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={openDrawer} PaperProps={{ sx: { background: 'transparent linear-gradient(311deg, #0B0029 0%, #B9A0A8 100%) 0% 0% no-repeat padding-box;', color: 'white' } }}>
                <DrawerHeader />
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: 2, ...(!openDrawer && { display: 'none' }) }}>
                    <Paper elevation={20} sx={{ width: '100%', borderRadius: '20px', border: 'solid 1px gray' }}>
                        <Box sx={{ margin: '15px' }}>
                            <Typography variant="subtitle2" fontWeight="bold" align="left" color="#574B4F">
                                Saldo
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" align="center" my={1} color={'#330F1B'}>
                                $10,000.00 mxn
                            </Typography>
                            <Box display="flex" justifyContent="space-between" >
                                <Button variant="text" color="primary" >
                                    Gestionar
                                </Button>
                                <Button variant="text" color="primary">
                                    Recargar
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <List>
                    <ListSubheader sx={{
                        background: 'transparent', color: 'white', fontSize: '1rem', fontWeight: 'bold',
                        ...(!openDrawer && { display: 'none' })
                    }}>
                        MENÚ
                    </ListSubheader>
                    {pages.map((page) => (

                        <ListItem key={page.id} disablePadding sx={{ display: 'block' }}>
                            {
                                !page.hasSubMenus ?
                                    (<Link to={page.path} style={{ textDecoration: 'none', color: 'currentColor' }} onClick={handleDrawerClose}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: openDrawer ? 'initial' : 'center',
                                                px: 2.5,
                                            }}>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: openDrawer ? 2 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {page.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={page.title} sx={{ opacity: openDrawer ? 1 : 0 }} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
                                        </ListItemButton>
                                    </Link>) :
                                    (
                                        <>
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: openDrawer ? 'initial' : 'center',
                                                    px: 2.5,
                                                }}
                                                onClick={getToggleFunction(page.id)}>

                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: openDrawer ? 2 : 'auto',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {page.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={page.title} sx={{ opacity: openDrawer ? 1 : 0 }} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
                                                {page.hasSubMenus && page.id === 2 && openDrawer && (openSubMenuBilling ? <ExpandLess /> : <ExpandMore />)}
                                                {page.hasSubMenus && page.id === 4 && openDrawer && (openSubMenuNumbers ? <ExpandLess /> : <ExpandMore />)}
                                            </ListItemButton>
                                            <Collapse in={page.id === 2 ? openSubMenuBilling : page.id === 4 && openSubMenuNumbers} timeout="auto">
                                                <List component="div" disablePadding sx={{ borderLeft: 'solid 1px white', ml: 4 }}>
                                                    {
                                                        page.subMenus.map((subMenu) => (
                                                            <Link key={subMenu.id} to={subMenu.path} style={{ textDecoration: 'none', color: 'currentColor' }} onClick={handleDrawerClose}>

                                                                <ListItemButton key={subMenu.id} sx={{ pl: 3 }}>
                                                                    <ListItemIcon
                                                                        sx={{
                                                                            minWidth: 0,
                                                                            mr: openDrawer ? 2 : 'auto',
                                                                            justifyContent: 'center',
                                                                        }}>
                                                                        {subMenu.icon}
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={subMenu.title} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
                                                                </ListItemButton>
                                                            </Link>
                                                        ))
                                                    }
                                                </List>
                                            </Collapse>
                                        </>
                                    )
                            }
                        </ListItem>
                    ))}
                </List>
            </Drawer >
            <Container fixed maxWidth="xl" sx={{ marginBottom: 8 }}>
                <Box sx={{ height: '4.5rem' }} />
                {props.children}
            </Container>
            <footer>
                <Box display="flex" justifyContent="space-between" sx={{ position: 'fixed', bottom: 0, width: '100%', padding: 1, borderTop: 'solid 1px #E6E4E4', background: '#FFFFFF', zIndex: 1200 }}>
                    <Typography variant="caption" color="textSecondary" align="left">
                        {'Copyright © '}
                        {new Date().getFullYear()}
                        {' Nuxiba. Todos los derechos reservados. Se prohíbe el uso no autorizado.'}
                    </Typography>

                    <img src={nuxiba_svg} alt="Description" width="70" />
                </Box>
            </footer>
        </>
    )
}

export default NavBarAndDrawer;
