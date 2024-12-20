import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from 'react-modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../chooseroom.css'
import { useNavigate } from 'react-router-dom';
import Backdrop from "@mui/material/Backdrop";
import HomeIcon from "@mui/icons-material/Home";


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

type Room = {
    id: string | number;
    name: string;
    client: string;
    description: string; // Ajustado desde "dscription"
    credits: number;
    long_sms: number;
    calls: number;
};


const Chooseroom: React.FC = () => {
    const [loading, setLoading] = useState(false);
    Modal.setAppElement('#root');
    /*  let subtitle;*/
    const [modalIsOpen, setIsOpen] = useState(false);
    const [rooms, setrooms] = useState<Room[]>([]);
    const [dontAskAgain, setDontAskAgain] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDontAskAgain(event.target.checked);
    }

    const SaveAutenticator = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);


        try {
            if (dontAskAgain) {

                const usuario = localStorage.getItem("userData");

                const obj = JSON.parse(usuario!);


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

        const obj = JSON.parse(usuario!);

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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    function closeModal() {
        setIsOpen(false);
    }


    useEffect(() => {

        const usuario = localStorage.getItem("userData");

        GetRooms();
        const obj = JSON.parse(usuario!);
        if (!obj.twoFactorAuthentication) {
            openModal();
        }



    }, [])


    const navigate = useNavigate();
    const handleRoomSelection = (room: Room) => {
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
            {rooms.filter((room) => {
                const term = searchTerm.toLowerCase();
                const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
            }).length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", marginTop: "20px", color: "#833A53" }}>
                    No se encontraron resultados.
                </Typography>
            ) : (
                rooms
                    .filter((room) => {
                        const term = searchTerm.toLowerCase();
                        const nameWords = room.name.toLowerCase().split(" "); // Divide el nombre en palabras
                        return nameWords.some((word) => word.startsWith(term)); // Verifica si alguna palabra comienza con el término
                    })
                    .map((room) => (
                        <div key={room.id} className="room-box">
                            <div className="room-info">
                                <HomeIcon style={{ color: "#B56576", fontSize: "30px", marginRight: "10px" }} />
                                <div className="room-details">
                                    <h6>{room.name}</h6>
                                    <p>{room.client}</p>
                                    <p>{room.description}</p>
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
                    ))
            )}


            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Guardar Información Modal"
                >
                    <Typography variant="h6" align="center" sx={{
                        textAlign: "left",
                        font: "normal normal medium 20px/22px Poppins",
                        letterSpacing: "0px",
                        color: "#330F1B",
                        opacity: 1,
                    }}>
                        Guardar información
                    </Typography>
                    <Typography variant="body1" align="center" sx={{
                        textAlign: "left",
                        font: "normal normal normal 16px/20px Poppins",
                        letterSpacing: "0px",
                        color: "#330F1B",
                        opacity: 1, }}>
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
                        sx={{ marginBottom: '20px', color: "#8F4D63" }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={closeModal} variant="outlined" color="secondary" sx={{
                            border: "1px solid #60293C",
                            borderRadius: "4px",
                            color: "#833A53",
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: "#f3e6eb",
                            },
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={SaveAutenticator} variant="contained" color="primary" sx={{
                            background: "#833A53 0% 0% no-repeat padding-box",
                            border: "1px solid #60293C",
                            borderRadius: "4px",
                            opacity: 0.9,
                            color: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#a54261",
                            },
                        }}>
                            Guardar
                        </Button>
                    </div>
                </Modal>
            </div>


        </Box>
    );

};
export default Chooseroom;