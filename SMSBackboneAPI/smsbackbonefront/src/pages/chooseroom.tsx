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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../chooseroom.css'
import { useNavigate, Link as LinkDom } from 'react-router-dom';
import Backdrop from "@mui/material/Backdrop";
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
    const [dontAskAgain, setDontAskAgain] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDontAskAgain(event.target.checked);
    }

    const SaveAutenticator = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {
            if (dontAskAgain) {

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
            } else {
                closeModal();
            }
        }
        catch {
            console.log(`MODE: ${import.meta.env.MODE}`)
        }

    }

    const GetRooms = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");

        const obj = JSON.parse(usuario);

        try {
            const request = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GetRooms}?email=${obj.email}`;
            const response = await axios.get(
                request
            );

            if (response.status === 200) {
                setrooms(response.data);
            }
        } catch (error) {
            console.error("Error al obtener las salas", error);
        } finally {
            setLoading(false); // Ocultar el spinner cuando termine
        }

    }
    function openModal() {
        setIsOpen(true);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

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

    // Abrir el modal ayuda
    const openHelpModal = () => {
        setHelpModalIsOpen(true);
    };

    // Cerrar el modal ayuda
    const closeHelpModal = () => {
        setHelpModalIsOpen(false);
    };

    const navigate = useNavigate();
    const handleRoomSelection = (room: any) => {
        // Guardar la sala seleccionada en localStorage
        localStorage.setItem('selectedRoom', JSON.stringify(room));

        // Navegar a "/"
        navigate('/');
    };

    return (
        <Box className="container">
            {/* Spinner de pantalla completa */}
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h5" className="centered-title">
                Seleccionar una sala para continuar
            </Typography>

            {/* Campo de búsqueda */}
            <div className="search-container">
                <span className="material-icons">search</span>
                <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {/* Lista de salas */}
            {rooms
                .filter((room) =>
                    room.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((room) => (
                    <div key={room.id} className="room-box">
                        <div className="room-info">
                            <span className="material-icons room-icon">home</span>
                            <div className="room-details">
                                <h6>{room.name}</h6>
                                <p>{room.client}</p>
                                <p>{room.dscription}</p>
                            </div>
                        </div>
                        <div className="room-extra">
                            <span>Créditos: {room.credits}</span>
                            <span>SMS largos: {room.long_sms}</span>
                            <span>Llamadas: {room.calls}</span>
                        </div>
                        {/* Botón para seleccionar la sala */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleRoomSelection(room)}
                        >
                            &gt;
                        </Button>

                    </div>
                ))}

            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Guardar Información Modal"
                >
                    <Typography variant="h6" align="center">
                        Guardar información
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ marginBottom: '20px' }}>
                        ¿Desea que guardemos su información para la próxima vez que inicie sesión en este dispositivo?
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={dontAskAgain}
                                onChange={handleCheckboxChange}
                                color="primary"
                            />
                        }
                        label="No preguntar esto de nuevo"
                        sx={{ marginBottom: '20px' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={closeModal} variant="outlined" color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={SaveAutenticator} variant="contained" color="primary">
                            Guardar
                        </Button>
                    </div>
                </Modal>
            </div>
            {/* Botón flotante */}
            <Button
                className="floating-button"
                onClick={openHelpModal}
            >
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>?</span>
            </Button>


            {/* Modal de Ayuda */}
            <Modal
                isOpen={helpModalIsOpen}
                onRequestClose={closeHelpModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '500px',
                        borderRadius: '10px',
                        padding: '20px',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <Box>
                    <Typography variant="h6" align="center" gutterBottom>
                        Ayuda
                    </Typography>
                    <Typography variant="body1" gutterBottom>
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
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                        Soporte: cwsoporte@nuxiba.com
                    </Typography>
                    <Box style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button onClick={closeHelpModal} variant="contained" color="primary">
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Box>
    );

};
export default chooseroom;