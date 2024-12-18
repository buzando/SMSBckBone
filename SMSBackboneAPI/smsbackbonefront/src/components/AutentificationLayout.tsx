import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../hooks/useContextInitialState";
import { getColorRole } from "../types/Types";
import appIcon_svg from "../assets/AppIcon.svg";
import nuxiba_svg from "../assets/nuxiba.svg";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import HelpIcon from "@mui/icons-material/Help";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(() => ({
    zIndex: 1200,
}));

type Props = {
    children: React.ReactNode;
};

const AutentificationLayout: React.FC<Props> = (props) => {
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const { contextState, setContextState } = useContext(AppContext);
    const { user } = contextState;

    const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const openHelpModal = () => setHelpModalIsOpen(true);
    const closeHelpModal = () => setHelpModalIsOpen(false);

    const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(null);
        switch (Number(event.currentTarget.id)) {
            case 3: // Cerrar sesión
                setContextState({
                    user: {},
                    token: "",
                    expiration: "",
                });
                localStorage.clear();
                navigate("/login");
                break;
            default:
                console.log("Opción no implementada");
                break;
        }
    };

    return (
        <>
            <CssBaseline />
            {/* Barra superior */}
            <AppBar position="fixed" sx={{ borderBottom: 1, borderColor: "primary.main" }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: "flex" }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => navigate("/")}
                        >
                            <img src={appIcon_svg} alt="App Icon" width="170" />
                        </IconButton>
                    </Box>

                    {/* Información del usuario */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title={user.userName}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user.userName} sx={{ bgcolor: getColorRole(user.rol) }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem id="1" onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Perfil</Typography>
                            </MenuItem>
                            <MenuItem id="2" onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Cuenta</Typography>
                            </MenuItem>
                            <MenuItem id="3" onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Cerrar sesión</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Contenedor principal */}
            <Container fixed maxWidth="xl" sx={{ marginTop: "4.5rem", marginBottom: "8rem" }}>
                {props.children}
            </Container>

            {/* Pie de página */}
            <footer>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        width: "100%",
                        padding: 1,
                        borderTop: "solid 1px #E6E4E4",
                        background: "#FFFFFF",
                        zIndex: 1200,
                    }}
                >
                    <Typography variant="caption" color="textSecondary" align="left">
                        {"Copyright © "}
                        {new Date().getFullYear()} {" Nuxiba. Todos los derechos reservados."}
                    </Typography>

                    <img src={nuxiba_svg} alt="Nuxiba Logo" width="70" />

                    {/* Botón circular con el icono de ayuda */}
                    <Fab
                        color="primary"
                        aria-label="help"
                        onClick={openHelpModal}
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
    );
};

export default AutentificationLayout;