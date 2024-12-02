import { useState } from 'react';
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import { Container, Divider, Typography, Box, TextField, Button, Link, Paper } from '@mui/material';
import PublicLayout from '../components/PublicLayout';
import axios, { AxiosError } from 'axios';

const TermsAndConditions: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [SendType, setSendType] = useState('');
    const [token, settoken] = useState('');
    const [StarCountdown, setStarCountdown] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const ValidateToken = async (event: React.FormEvent) => {
        event.preventDefault();
        if (tokenuser != token) {
            setmessageAlert('Codigo Invalido');
        } else {
            navigate('/chooseroom');
        }
        return true;
    }



    const SendToken = async (event: React.FormEvent) => {
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
                setStarCountdown(true);
            }
            setLoading(false);
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {


            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GETUSERBYEMAIL_USER + email}`;
            const response = await axios.get(
                request
            );

            if (response.status === 200) {
                settoken(response.data);
                setStarCountdown(true);
            }
            setLoading(false);
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }

    const SendNewPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {


            const data = {
                email,
                password,
            };

            const headers = {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Access-Control-Allow-Origin": "*"
            };


            const response = await axios.post(
                `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_NEWPASSWORD_USER}`,
                data,
                { headers },
            );

            if (response.status === 200) {
                navigate("/chooseroom");
            }
         
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }



    return (
        <PublicLayout>
            <Container maxWidth="sm" fixed sx={{ marginTop: 2, marginBottom: 8 }} >
                <Typography variant='h4' align='center' gutterBottom sx={{ fontWeight: 'bold' }}>Recupera tu cuenta</Typography>
                <Box padding={1}>
                    <form >
                        <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                            <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                                <TextField
                                    label="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                <Box display="flex" justifyContent="right" pt={2} >
                                    <Button variant='outlined' onClick={() => navigate('/')}>Cancelar</Button>
                                    <Button variant='contained' sx={{ marginLeft: 2 }} >Recuperar</Button>
                                </Box>
                                <Box display="flex" justifyContent="center" marginTop={2}>
                                    <Typography variant='caption' marginRight={1}>¿Aún no tienes cuenta?</Typography>
                                    <Link component={LinkDom} variant="caption" to={'/register'}>
                                        Registrate
                                    </Link>
                                </Box>
                            </Box>
                        </Paper>
                    </form>
                </Box>
            </Container>
        </PublicLayout >
    );
};

export default TermsAndConditions;
