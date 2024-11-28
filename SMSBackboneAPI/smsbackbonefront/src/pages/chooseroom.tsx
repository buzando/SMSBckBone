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
    Modal.setAppElement('#root');
  /*  let subtitle;*/
    const [modalIsOpen, setIsOpen] = useState(false);

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

        const obj = JSON.parse(usuario);
        if (!obj.twoFactorAuthentication) {
            openModal();
        }
}, [])

    return (
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
                <button>Guardar</button>
            </form>
        </Modal>
  );

};
export default chooseroom;