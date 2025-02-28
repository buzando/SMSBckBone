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
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
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
    cliente: string;
    description: string; // Ajustado desde "dscription"
    credits: number;
    long_sms: number;
    calls: number;
    short_sms: number;
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
                localStorage.setItem('ListRooms', JSON.stringify(response.data));
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
        <Box
            className="container"
            sx={{
                backgroundColor: "#F2F2F2", // Fondo blanco
                minHeight: "100vh", // Asegúrate de que cubra toda la pantalla
                padding: "5px", // Espaciado interno
            }}
        >
            {/* Spinner de pantalla completa */}
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography
                variant="h5"
                className="centered-title"
                sx={{
                    textAlign: 'center', // Centrado
                    font: 'normal normal medium 28px/55px Poppins', // Estilo de la fuente
                    letterSpacing: '0px', // Sin espaciado adicional
                    color: '#330F1B', // Color del texto
                    opacity: 1, // Totalmente visible
                    fontSize: '28px', // Tamaño de texto
                    lineHeight: '55px', // Altura de línea
                }}
            >
                Seleccionar una sala para continuar
            </Typography>


            {/* Campo de búsqueda */}
            <div
                className="search-container"
                style={{
                    width: '430px', // Mismo ancho que las tarjetas
                    margin: '0 auto 20px', // Centrado horizontal y separación inferior
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #CED2D54D',
                    borderRadius: '4px',
                    padding: '10px', // Espaciado interno
                    boxShadow: '0px 4px 4px #E1E4E6',
                    background: '#FFFFFF',
                }}
            >
                <SearchIcon style={{ marginRight: '8px', color: '#8D4B62' }} /> {/* Lupa */}
                <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'Poppins, sans-serif',
                        color: searchTerm ? '#7B354D' : '#574B4F', // Cambiar color si hay texto
                    }}
                />
                {searchTerm && (
                    <CloseIcon
                        onClick={() => setSearchTerm('')} // Limpiar campo de texto
                        style={{
                            cursor: 'pointer',
                            color: '#8D4B62', // Mismo color que el borde
                            marginLeft: '8px',
                        }}
                    />
                )}
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
                        <div key={room.id} className="room-box"
                            style={{
                                background: "#FFFFFF 0% 0% no-repeat padding-box",
                                boxShadow: "0px 4px 4px #E1E4E6",
                                border: "1px solid #CED2D54D",
                                borderRadius: "4px",
                                opacity: 1,
                                width: "430px", // Ajuste del ancho del recuadro
                                padding: "20px", // Espaciado interno
                                margin: "10px auto", // Centrado horizontal y separación entre recuadros
                            }}>
                            <div className="room-info">
                                <Box className="icon-container">
                                    <HomeIcon /> {/* Usa tu ícono preferido */}
                                </Box>
                                <div className="room-details" style={{ marginLeft: "10px" }}>
                                    <h6 style={{ margin: "0", fontSize: "16px", color: "#330F1B"}}>{room.name}</h6>
                                    <p style={{ margin: "0", fontSize: "14px", color: "#8F4D63" }}>{room.cliente}</p>
                                </div>

                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end', // Alineación al lado derecho
                                    gap: '4px', // Espaciado entre los elementos
                                }}
                            >
                                <span
                                    style={{
                                        textAlign: 'right',
                                        fontFamily: 'Poppins',
                                        fontWeight: '500', // medium
                                        fontSize: '12px',
                                        lineHeight: '18px', // Ajuste de altura para mayor proximidad
                                        letterSpacing: '0px',
                                        color: '#8D4B62',
                                        opacity: 1,
                                    }}
                                >
                                    SMS cortos: {room.short_sms}
                                </span>
                                <span
                                    style={{
                                        textAlign: 'right',
                                        fontFamily: 'Poppins',
                                        fontWeight: '500', // medium
                                        fontSize: '12px',
                                        lineHeight: '18px', // Ajuste de altura para mayor proximidad
                                        letterSpacing: '0px',
                                        color: '#8D4B62',
                                        opacity: 1,
                                    }}
                                >
                                    SMS largos: {room.long_sms}
                                </span>
                            </div>

                            {/* Botón para seleccionar la sala */}
                            <Button
                                onClick={() => handleRoomSelection(room)}
                                sx={{
                                    minWidth: 'auto', // Elimina el ancho mínimo predeterminado
                                    padding: 0, // Sin relleno interno
                                    color: '#000', // Color negro para el ícono
                                    backgroundColor: 'transparent', // Fondo transparente
                                    border: 'none', // Sin borde
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Sin fondo al pasar el mouse
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: '24px', // Tamaño del ícono
                                        lineHeight: 1, // Ajusta el espaciado vertical
                                    }}
                                >
                                    &gt;
                                </Box>
                            </Button>
                        </div>
                    ))
            )}


            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={{
                        content: {
                            ...customStyles.content,
                            maxWidth: "500px", // Más angosto
                            padding: "20px",
                        },
                    }}
                    contentLabel="Guardar Información Modal"
                >
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "left",
                            font: "normal normal medium 20px/22px Poppins",
                            letterSpacing: "0px",
                            color: "#330F1B",
                            opacity: 1,
                            marginBottom: "16px",
                        }}
                    >
                        Guardar información
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: "left",
                            font: "normal normal normal 16px/20px Poppins",
                            letterSpacing: "0px",
                            color: "#330F1B",
                            opacity: 1,
                            marginBottom: "20px",
                        }}
                    >
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
                        sx={{
                            marginBottom: "20px",
                            color: "#8F4D63",
                        }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            onClick={closeModal}
                            variant="outlined"
                            color="secondary"
                            sx={{
                                border: "1px solid #60293C",
                                borderRadius: "4px",
                                color: "#833A53",
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: "#f3e6eb",
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={SaveAutenticator}
                            variant="contained"
                            color="primary"
                            sx={{
                                background: "#833A53 0% 0% no-repeat padding-box",
                                border: "1px solid #60293C",
                                borderRadius: "4px",
                                opacity: 0.9,
                                color: "#FFFFFF",
                                "&:hover": {
                                    backgroundColor: "#a54261",
                                },
                            }}
                        >
                            Guardar
                        </Button>
                    </div>
                </Modal>

            </div>


        </Box>
    );

};
export default Chooseroom;