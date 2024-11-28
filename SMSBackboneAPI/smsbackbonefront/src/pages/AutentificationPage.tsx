import { useState, useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AppContext } from '../hooks/useContextInitialState';
import axios, { AxiosError } from 'axios';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import ButtonLoadingSubmit from '../components/commons/ButtonLoadingSubmit';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Role } from '../types/Types';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';


type errorObj = {
    code: string;
    description: string;
};


const Autentification: React.FC = () => {
    const [SendType, setSendType] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, settoken] = useState('');
    const [tokenuser, settokenuser] = useState('');
    const [formraddio, setformraddio] = useState('none');
    const [formtoken, setformtoken] = useState('visible');
    function onChangeValue(event) {
        setSendType(event.target.value);
    }

    function Return(event) {
        setformraddio('visible');
        setformtoken('none');
    }

    function ValidateToken(event) {
        if (tokenuser != token) {
            console.log(error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const usuario = localStorage.getItem("userData");

        const obj = JSON.parse(usuario);
        let dato = "";
        if (SendType == "SMS") {
            dato = obj.phonenumber;
        }
        if (SendType == "EMAIL") {
            dato = obj.email;
        }
        try {
            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_AUTENTIFICATION_ENDPOINT}?dato=${dato}&tipo=${SendType}`;
            const response = await axios.get(
                request
            );

            if (response.status === 200) {
                settoken(response.data);
                setformraddio('none');
                setformtoken('visible');
            }
            setLoading(false);
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }

    return (

        <Grid item xs={12} lg={6}>
            <div className="App">
                <button style={{ position: "fixed", bottom: 0, right: "0%" }}>
                    Centro borde inferior
                </button>
            </div>
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >

                <form onSubmit={handleSubmit} id="formType">
                    <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                        <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                            <Typography variant="h4" fontWeight="bold" align="center">
                                Autenticación de la cuenta
                            </Typography>
                            <Avatar
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.primary.main,
                                    margin: 'auto',
                                })}
                            >
                                <LockOutlinedIcon />
                            </Avatar>
                            <div style={{ display: formraddio }} >
                                <Typography variant="h6" align="center">
                                    Seleccione el canal por el cual prefiere recibir su código de autenticación
                                </Typography>
                                <div onChange={onChangeValue}>
                                    <input type="radio" value="SMS" name="Type" checked={SendType === "SMS"} readOnly /> SMS
                                    <input type="radio" value="EMAIL" name="Type" checked={SendType === "EMAIL"} readOnly /> Email
                                </div>

                                <Box display="flex" justifyContent="center" py={2}>
                                    <ButtonLoadingSubmit
                                        label="ENVIAR"
                                        loading={loading}
                                    />
                                </Box>
                            </div>
                            <div style={{ display: formtoken }} >
                                <Typography variant="h6" align="center">
                                    ¿El código no fue recibido o caducó? REENVIAR
                                </Typography>
                                Tiempo de expiración de codigo: 

                                <TextField
                                    label="token"
                                    onChange={(e) => settokenuser(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                />

                           {/*     <Button*/}
                           {/*         color="inherit"*/}
                           {/*         size="small"*/}
                           {/*         onClick={Return}*/}
                           {/*         / >*/}
                           {/*         Regresar*/}
                         


                           {/*     <Button*/}
                           {/*         color="inherit"*/}
                           {/*     size="small"*/}
                           {/*     onClick={ValidateToken}*/}
                           {/*/ >*/}
                           {/*         Validar*/}
                         

                            </div>
                        </Box>
                    </Paper>
                </form>

            </Box>
        </Grid>

    );

};
export default Autentification;