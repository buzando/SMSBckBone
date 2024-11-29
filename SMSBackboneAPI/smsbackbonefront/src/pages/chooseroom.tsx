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
import Countdown from 'react-countdown';
import Modal from 'react-modal';

type errorObj = {
    code: string;
    description: string;
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


const chooseroom: React.FC = () => {
    const [loading, setLoading] = useState(false);
    Modal.setAppElement('#root');
    /*  let subtitle;*/
    const [modalIsOpen, setIsOpen] = useState(false);
    const [user, setuser] = useState(false);
    const [rooms, setrooms] = useState([]);

    const SaveAutenticator = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {
            const usuario = localStorage.getItem("userData");

            const obj = JSON.parse(usuario);


            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_AUTENTIFICATIONSAVE_ENDPOINT}?email=${obj.email}`;
            const response = await axios.get(
                request
            );

            if (response.status === 200) {
                obj.twoFactorAuthentication = true;
                localStorage.setItem('userData', JSON.stringify(obj));
                setLoading(false);
                closeModal();
            }
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }

    const GetRooms = async () => {

        const usuario = localStorage.getItem("userData");

        const obj = JSON.parse(usuario);


        const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GetRooms}?email=${obj.email}`;
        const response = await axios.get(
            request
        );

        if (response.status === 200) {
            setrooms(response.data);
        }

    }
    function openModal() {
        setIsOpen(true);
    }

    //function afterOpenModal() {
    //    // references are now sync'd and can be accessed.
    //    subtitle.style.color = '#f00';
    //}

    function closeModal() {
        setIsOpen(false);
    }


    useEffect(() => {

        const usuario = localStorage.getItem("userData");

        GetRooms();
        const obj = JSON.parse(usuario);
        if (!obj.twoFactorAuthentication) {
            openModal();
        }



    }, [])

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

                <form name="formType" id="formType" noValidate>
                    <Paper elevation={10} sx={{ width: '100%', borderRadius: '20px' }}>
                        <Box sx={{ margin: '20px', paddingX: '20px', paddingY: '30px' }}>
                            <Typography variant="h4" fontWeight="bold" align="center">
                                Autenticación de la cuenta
                            </Typography>
                            {rooms.map((room, i) => {
                                console.log("Entered");
                                // Return the element. Also pass key     
                                return (<Box key={room.id} answer={room.id} />) 
                            })}
                        </Box>
                    </Paper>
                </form>
            </Box>

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <button onClick={closeModal}>close</button>
            <div>Guardar información</div>
            <form>
                <div>¿Desea que guardemos su información para la próxima vez que inicie sesión en este dispositivo?</div>
                <Button onClick={SaveAutenticator}>Guardar</Button>
            </form>
            </Modal>

        </Grid>
    );

};
export default chooseroom;