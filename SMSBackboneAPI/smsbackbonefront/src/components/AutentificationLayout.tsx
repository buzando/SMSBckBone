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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../hooks/useContextInitialState";
import { getColorRole } from "../types/Types";
import appIcon_svg from "../assets/AppIcon.svg";
import nuxiba_svg from "../assets/nuxiba.svg";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

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

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

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
                </Box>
            </footer>
        </>
    );
};

export default AutentificationLayout;