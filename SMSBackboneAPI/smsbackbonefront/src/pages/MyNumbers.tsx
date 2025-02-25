import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { TextField, InputAdornment, MenuItem, Box, Select, Menu, Modal, Button, Typography, ListItemText, Checkbox, Grid, IconButton } from '@mui/material';
import HelpIco from '../assets/Icono_ayuda.svg';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { SelectChangeEvent } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Snackbar, Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import NoResult from '../assets/NoResultados.svg'
import backarrow from '../assets/MoveTable.svg'
import backarrowD from '../assets/MoveTabledesactivated.svg'
interface CreditCard {
    id: number;
    user_id: number;
    card_number: string;
    card_name: string;
    expiration_month: number;
    expiration_year: number;
    CVV: string;
    is_default: boolean;
    created_at: string;
    updated_at?: string;
    type: string;
}
interface NumberData {
    id: number;
    number: string;
    type: string;
    service: string;
    cost: number;
    nextPaymentDate: string;
    state: string;
    municipality: string;
    lada: string;
}

const MyNumbers: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Calcular los elementos de la página actual
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numberQuantity, setNumberQuantity] = useState(1);
    const [monthlyCost, setMonthlyCost] = useState(50);
    const [totalCost, settotalCost] = useState(50);
    const [costSetup, setcostSetup] = useState(100);
    const [currentStep, setCurrentStep] = useState(1);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]); // Uso del tipo CreditCard[]
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [isLongNumber, setIsLongNumber] = useState(false); // Nuevo estado para determinar si es largo o corto
    const [selectedState, setSelectedState] = useState('');
    const [municipalities, setMunicipalities] = useState<{ name: string; lada: string }[]>([]);
    const [selectedLada, setSelectedLada] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [municipalitySearch, setMunicipalitySearch] = useState('');
    const [anchorElState, setAnchorElState] = useState<null | HTMLElement>(null);
    const [anchorElMunicipality, setAnchorElMunicipality] = useState<null | HTMLElement>(null);
    const costPerNumberlong = 50;
    const costPerNumbershort = 50;
    const [isModalAyudaOpen, setIsModalAyudaOpen] = useState(false);
    const [stateSearch2, setStateSearch2] = useState('');
    const [selectedStates2, setSelectedStates2] = useState<string[]>([]);
    const [municipalities2, setMunicipalities2] = useState<string[]>([]);
    const [selectedMunicipalities2, setSelectedMunicipalities2] = useState<string[]>([]);
    const [municipalitySearch2, setMunicipalitySearch2] = useState('');
    const [stateMenuOpen, setStateMenuOpen] = useState(false);
    const [municipalityMenuOpen, setMunicipalityMenuOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'darDeBaja' | 'eliminar' | ''>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
    const [loading, setLoading] = useState<boolean>(false);
    const [numbersData, setNumbersData] = useState<NumberData[]>([]);
    const [totalPages, settotalPages] = useState(0);
    const [startIndex, setstartIndex] = useState(0);
    const [currentItems, setcurrentItems] = useState<NumberData[]>([]);
    const navigate = useNavigate(); // Inicializa el hook de navegación
    const [filteredData, setFilteredData] = useState<NumberData[]>([]); // Datos filtrados
    // Función para manejar la navegación a la página de ayuda
    const handleNavigateToHelp = () => {
        navigate('/help'); // Reemplaza '/help' con la ruta correcta a tu componente Help
    };



    const statesOfMexico = [
        {
            state: 'Aguascalientes',
            municipalities: [
                { name: 'Aguascalientes', lada: '449' },
                { name: 'Asientos', lada: '458' },
                { name: 'Calvillo', lada: '495' },
                { name: 'Cosío', lada: '449' },
                { name: 'Jesús María', lada: '449' },
                { name: 'Pabellón de Arteaga', lada: '449' },
                { name: 'Rincón de Romos', lada: '449' },
                { name: 'San José de Gracia', lada: '449' },
                { name: 'Tepezalá', lada: '449' },
                { name: 'El Llano', lada: '449' },
                { name: 'San Francisco de los Romo', lada: '449' },
            ],
        },
        {
            state: 'Baja California',
            municipalities: [
                { name: 'Ensenada', lada: '646' },
                { name: 'Mexicali', lada: '686' },
                { name: 'Tecate', lada: '665' },
                { name: 'Tijuana', lada: '664' },
                { name: 'Playas de Rosarito', lada: '661' },
                { name: 'San Quintín', lada: '616' },
                { name: 'San Felipe', lada: '686' },
            ],
        },
        {
            state: 'Baja California Sur',
            municipalities: [
                { name: 'Comondú', lada: '613' },
                { name: 'La Paz', lada: '612' },
                { name: 'Loreto', lada: '613' },
                { name: 'Los Cabos', lada: '624' },
                { name: 'Mulegé', lada: '615' },
            ],
        },
        {
            state: 'Campeche',
            municipalities: [
                { name: 'Calkiní', lada: '996' },
                { name: 'Campeche', lada: '981' },
                { name: 'Candelaria', lada: '982' },
                { name: 'Carmen', lada: '938' },
                { name: 'Champotón', lada: '982' },
                { name: 'Hecelchakán', lada: '996' },
                { name: 'Hopelchén', lada: '996' },
                { name: 'Palizada', lada: '982' },
                { name: 'Tenabo', lada: '996' },
                { name: 'Escárcega', lada: '982' },
                { name: 'Calakmul', lada: '982' },
            ],
        },
        {
            state: 'Chiapas',
            municipalities: [
                { name: 'Tuxtla Gutiérrez', lada: '961' },
                { name: 'San Cristóbal de las Casas', lada: '967' },
                { name: 'Tapachula', lada: '962' },
                { name: 'Comitán de Domínguez', lada: '963' },
                { name: 'Palenque', lada: '916' },
                { name: 'Arriaga', lada: '966' },
                { name: 'Ocosingo', lada: '919' },
                { name: 'Tonalá', lada: '966' },
                { name: 'Villaflores', lada: '965' },
                { name: 'Pichucalco', lada: '993' },
                { name: 'Motozintla', lada: '964' },
                { name: 'Cintalapa', lada: '968' },
                { name: 'Huixtla', lada: '962' },
                { name: 'Chiapa de Corzo', lada: '961' },
                { name: 'Mapastepec', lada: '964' },
                { name: 'Las Margaritas', lada: '963' },
                { name: 'Jiquipilas', lada: '968' },
                { name: 'Suchiapa', lada: '961' },
                { name: 'Huehuetán', lada: '962' },
                { name: 'Frontera Comalapa', lada: '963' },
            ],
        },
        {
            state: 'Chihuahua',
            municipalities: [
                { name: 'Chihuahua', lada: '614' },
                { name: 'Ciudad Juárez', lada: '656' },
                { name: 'Delicias', lada: '639' },
                { name: 'Cuauhtémoc', lada: '625' },
                { name: 'Parral', lada: '627' },
                { name: 'Nuevo Casas Grandes', lada: '636' },
                { name: 'Camargo', lada: '648' },
                { name: 'Ojinaga', lada: '626' },
                { name: 'Jiménez', lada: '629' },
                { name: 'Meoqui', lada: '639' },
                { name: 'Aldama', lada: '614' },
                { name: 'Guachochi', lada: '649' },
                { name: 'Madera', lada: '652' },
                { name: 'Saucillo', lada: '639' },
                { name: 'Santa Bárbara', lada: '627' },
                { name: 'Gómez Farías', lada: '636' },
                { name: 'Allende', lada: '627' },
                { name: 'Ascensión', lada: '636' },
                { name: 'Rosales', lada: '639' },
                { name: 'Bachíniva', lada: '625' },
            ],
        },
        {
            state: 'Ciudad de México',
            municipalities: [
                { name: 'Álvaro Obregón', lada: '55' },
                { name: 'Azcapotzalco', lada: '55' },
                { name: 'Benito Juárez', lada: '55' },
                { name: 'Coyoacán', lada: '55' },
                { name: 'Cuajimalpa de Morelos', lada: '55' },
                { name: 'Cuauhtémoc', lada: '55' },
                { name: 'Gustavo A. Madero', lada: '55' },
                { name: 'Iztacalco', lada: '55' },
                { name: 'Iztapalapa', lada: '55' },
                { name: 'La Magdalena Contreras', lada: '55' },
                { name: 'Miguel Hidalgo', lada: '55' },
                { name: 'Milpa Alta', lada: '55' },
                { name: 'Tláhuac', lada: '55' },
                { name: 'Tlalpan', lada: '55' },
                { name: 'Venustiano Carranza', lada: '55' },
                { name: 'Xochimilco', lada: '55' },
            ],
        },
        {
            state: 'Coahuila',
            municipalities: [
                { name: 'Abasolo', lada: '872' },
                { name: 'Acuña', lada: '877' },
                { name: 'Allende', lada: '862' },
                { name: 'Arteaga', lada: '844' },
                { name: 'Candela', lada: '869' },
                { name: 'Castaños', lada: '866' },
                { name: 'Cuatro Ciénegas', lada: '869' },
                { name: 'Escobedo', lada: '861' },
                { name: 'Francisco I. Madero', lada: '872' },
                { name: 'Frontera', lada: '866' },
                { name: 'General Cepeda', lada: '844' },
                { name: 'Guerrero', lada: '877' },
                { name: 'Hidalgo', lada: '877' },
                { name: 'Jiménez', lada: '861' },
                { name: 'Juárez', lada: '861' },
                { name: 'Lamadrid', lada: '869' },
                { name: 'Matamoros', lada: '871' },
                { name: 'Monclova', lada: '866' },
                { name: 'Morelos', lada: '862' },
                { name: 'Múzquiz', lada: '861' },
                { name: 'Nadadores', lada: '869' },
                { name: 'Nava', lada: '878' },
                { name: 'Ocampo', lada: '873' },
                { name: 'Parras', lada: '842' },
                { name: 'Piedras Negras', lada: '878' },
                { name: 'Progreso', lada: '869' },
                { name: 'Ramos Arizpe', lada: '844' },
                { name: 'Sabinas', lada: '861' },
                { name: 'Sacramento', lada: '869' },
                { name: 'Saltillo', lada: '844' },
                { name: 'San Buenaventura', lada: '866' },
                { name: 'San Juan de Sabinas', lada: '861' },
                { name: 'San Pedro', lada: '872' },
                { name: 'Sierra Mojada', lada: '872' },
                { name: 'Torreón', lada: '871' },
                { name: 'Viesca', lada: '871' },
                { name: 'Villa Unión', lada: '862' },
                { name: 'Zaragoza', lada: '878' },
            ],
        },
        {
            state: 'Colima',
            municipalities: [
                { name: 'Armería', lada: '313' },
                { name: 'Colima', lada: '312' },
                { name: 'Comala', lada: '312' },
                { name: 'Coquimatlán', lada: '312' },
                { name: 'Cuauhtémoc', lada: '312' },
                { name: 'Ixtlahuacán', lada: '313' },
                { name: 'Manzanillo', lada: '314' },
                { name: 'Minatitlán', lada: '312' },
                { name: 'Tecomán', lada: '313' },
                { name: 'Villa de Álvarez', lada: '312' },
            ],
        },
        {
            state: 'Durango',
            municipalities: [
                { name: 'Canatlán', lada: '677' },
                { name: 'Canelas', lada: '674' },
                { name: 'Coneto de Comonfort', lada: '675' },
                { name: 'Cuencamé', lada: '674' },
                { name: 'Durango', lada: '618' },
                { name: 'El Oro', lada: '677' },
                { name: 'General Simón Bolívar', lada: '676' },
                { name: 'Gómez Palacio', lada: '871' },
                { name: 'Guadalupe Victoria', lada: '676' },
                { name: 'Guanaceví', lada: '674' },
                { name: 'Hidalgo', lada: '677' },
                { name: 'Indé', lada: '677' },
                { name: 'Lerdo', lada: '871' },
                { name: 'Mapimí', lada: '872' },
                { name: 'Mezquital', lada: '618' },
                { name: 'Nazas', lada: '872' },
                { name: 'Nombre de Dios', lada: '618' },
                { name: 'Ocampo', lada: '677' },
                { name: 'El Salto', lada: '618' },
                { name: 'Peñón Blanco', lada: '676' },
                { name: 'Poanas', lada: '676' },
                { name: 'Pueblo Nuevo', lada: '618' },
                { name: 'Rodeo', lada: '677' },
                { name: 'San Bernardo', lada: '677' },
                { name: 'San Dimas', lada: '618' },
                { name: 'San Juan de Guadalupe', lada: '676' },
                { name: 'San Juan del Río', lada: '676' },
                { name: 'San Luis del Cordero', lada: '676' },
                { name: 'San Pedro del Gallo', lada: '677' },
                { name: 'Santa Clara', lada: '676' },
                { name: 'Santiago Papasquiaro', lada: '674' },
                { name: 'Súchil', lada: '676' },
                { name: 'Tamazula', lada: '674' },
                { name: 'Tepehuanes', lada: '674' },
                { name: 'Tlahualilo', lada: '677' },
                { name: 'Topia', lada: '674' },
                { name: 'Vicente Guerrero', lada: '676' },
            ],
        },
        {
            state: 'Guanajuato',
            municipalities: [
                { name: 'Abasolo', lada: '429' },
                { name: 'Acámbaro', lada: '417' },
                { name: 'Apaseo el Alto', lada: '413' },
                { name: 'Apaseo el Grande', lada: '413' },
                { name: 'Atarjea', lada: '468' },
                { name: 'Celaya', lada: '461' },
                { name: 'Comonfort', lada: '412' },
                { name: 'Coroneo', lada: '419' },
                { name: 'Cortazar', lada: '411' },
                { name: 'Cuerámaro', lada: '429' },
                { name: 'Doctor Mora', lada: '419' },
                { name: 'Dolores Hidalgo Cuna de la Independencia Nacional', lada: '418' },
                { name: 'Guanajuato', lada: '473' },
                { name: 'Huanímaro', lada: '429' },
                { name: 'Irapuato', lada: '462' },
                { name: 'Jaral del Progreso', lada: '411' },
                { name: 'Jerécuaro', lada: '421' },
                { name: 'León', lada: '477' },
                { name: 'Manuel Doblado', lada: '429' },
                { name: 'Moroleón', lada: '445' },
                { name: 'Ocampo', lada: '418' },
                { name: 'Pénjamo', lada: '429' },
                { name: 'Pueblo Nuevo', lada: '462' },
                { name: 'Purísima del Rincón', lada: '476' },
                { name: 'Romita', lada: '462' },
                { name: 'Salamanca', lada: '464' },
                { name: 'Salvatierra', lada: '466' },
                { name: 'San Diego de la Unión', lada: '418' },
                { name: 'San Felipe', lada: '428' },
                { name: 'San Francisco del Rincón', lada: '476' },
                { name: 'San José Iturbide', lada: '419' },
                { name: 'San Luis de la Paz', lada: '468' },
                { name: 'Santa Catarina', lada: '419' },
                { name: 'Santa Cruz de Juventino Rosas', lada: '412' },
                { name: 'Santiago Maravatío', lada: '466' },
                { name: 'Silao de la Victoria', lada: '472' },
                { name: 'Tarandacuao', lada: '421' },
                { name: 'Tarimoro', lada: '466' },
                { name: 'Tierra Blanca', lada: '468' },
                { name: 'Uriangato', lada: '445' },
                { name: 'Valle de Santiago', lada: '456' },
                { name: 'Victoria', lada: '419' },
                { name: 'Villagrán', lada: '411' },
                { name: 'Xichú', lada: '419' },
                { name: 'Yuriria', lada: '445' },
            ],
        },
        {
            state: 'Guerrero',
            municipalities: [
                { name: 'Acapulco de Juárez', lada: '744' },
                { name: 'Ahuacuotzingo', lada: '756' },
                { name: 'Ajuchitlán del Progreso', lada: '732' },
                { name: 'Alcozauca de Guerrero', lada: '756' },
                { name: 'Alpoyeca', lada: '756' },
                { name: 'Apaxtla', lada: '732' },
                { name: 'Arcelia', lada: '732' },
                { name: 'Atenango del Río', lada: '732' },
                { name: 'Atlamajalcingo del Monte', lada: '756' },
                { name: 'Atlixtac', lada: '756' },
                { name: 'Atoyac de Álvarez', lada: '742' },
                { name: 'Ayutla de los Libres', lada: '745' },
                { name: 'Azoyú', lada: '745' },
                { name: 'Benito Juárez', lada: '741' },
                { name: 'Buenavista de Cuéllar', lada: '732' },
                { name: 'Chilapa de Álvarez', lada: '756' },
                { name: 'Chilpancingo de los Bravo', lada: '747' },
                { name: 'Coahuayutla de José María Izazaga', lada: '755' },
                { name: 'Cocula', lada: '733' },
                { name: 'Copala', lada: '745' },
                { name: 'Copalillo', lada: '732' },
                { name: 'Copanatoyac', lada: '756' },
                { name: 'Coyuca de Benítez', lada: '742' },
                { name: 'Coyuca de Catalán', lada: '732' },
                { name: 'Cuajinicuilapa', lada: '741' },
                { name: 'Cualác', lada: '756' },
                { name: 'Cuautepec', lada: '745' },
                { name: 'Cuetzala del Progreso', lada: '732' },
                { name: 'Cutzamala de Pinzón', lada: '732' },
                { name: 'Eduardo Neri', lada: '747' },
                { name: 'Florencio Villarreal', lada: '745' },
                { name: 'General Canuto A. Neri', lada: '732' },
                { name: 'General Heliodoro Castillo', lada: '747' },
                { name: 'Huamuxtitlán', lada: '756' },
                { name: 'Huitzuco de los Figueroa', lada: '732' },
                { name: 'Iguala de la Independencia', lada: '733' },
                { name: 'Igualapa', lada: '741' },
                { name: 'Iliatenco', lada: '745' },
                { name: 'Juan R. Escudero', lada: '747' },
                { name: 'La Unión de Isidoro Montes de Oca', lada: '755' },
                { name: 'Leonardo Bravo', lada: '747' },
                { name: 'Malinaltepec', lada: '756' },
                { name: 'Marquelia', lada: '745' },
                { name: 'Mártir de Cuilapan', lada: '747' },
                { name: 'Metlatónoc', lada: '756' },
                { name: 'Mochitlán', lada: '747' },
                { name: 'Olinalá', lada: '756' },
                { name: 'Ometepec', lada: '741' },
                { name: 'Pedro Ascencio Alquisiras', lada: '732' },
                { name: 'Petatlán', lada: '755' },
                { name: 'Pilcaya', lada: '721' },
                { name: 'Pungarabato', lada: '732' },
                { name: 'Quechultenango', lada: '747' },
                { name: 'San Luis Acatlán', lada: '745' },
                { name: 'San Marcos', lada: '745' },
                { name: 'San Miguel Totolapan', lada: '732' },
                { name: 'Taxco de Alarcón', lada: '762' },
                { name: 'Tecoanapa', lada: '745' },
                { name: 'Técpan de Galeana', lada: '742' },
                { name: 'Teloloapan', lada: '732' },
                { name: 'Tepecoacuilco de Trujano', lada: '733' },
                { name: 'Tetipac', lada: '762' },
                { name: 'Tixtla de Guerrero', lada: '747' },
                { name: 'Tlacoachistlahuaca', lada: '741' },
                { name: 'Tlacoapa', lada: '756' },
                { name: 'Tlalchapa', lada: '732' },
                { name: 'Tlalixtaquilla de Maldonado', lada: '756' },
                { name: 'Tlapa de Comonfort', lada: '756' },
                { name: 'Tlapehuala', lada: '732' },
                { name: 'Xalpatláhuac', lada: '756' },
                { name: 'Xochihuehuetlán', lada: '756' },
                { name: 'Xochistlahuaca', lada: '741' },
                { name: 'Zapotitlán Tablas', lada: '756' },
                { name: 'Zihuatanejo de Azueta', lada: '755' },
                { name: 'Zirándaro', lada: '732' },
                { name: 'Zitlala', lada: '756' },
            ],
        },
        {
            state: 'Jalisco',
            municipalities: [
                { name: 'Acatic', lada: '378' },
                { name: 'Acatlán de Juárez', lada: '33' },
                { name: 'Ahualulco de Mercado', lada: '386' },
                { name: 'Amacueca', lada: '342' },
                { name: 'Amatitán', lada: '374' },
                { name: 'Ameca', lada: '375' },
                { name: 'San Juanito de Escobedo', lada: '386' },
                { name: 'Arandas', lada: '348' },
                { name: 'El Arenal', lada: '33' },
                { name: 'Atemajac de Brizuela', lada: '343' },
                { name: 'Atengo', lada: '317' },
                { name: 'Atenguillo', lada: '317' },
                { name: 'Atotonilco el Alto', lada: '391' },
                { name: 'Atoyac', lada: '372' },
                { name: 'Autlán de Navarro', lada: '317' },
                { name: 'Ayotlán', lada: '391' },
                { name: 'Ayutla', lada: '317' },
                { name: 'Bolívar', lada: '388' },
                { name: 'Chapala', lada: '376' },
                { name: 'Chimaltitán', lada: '499' },
                { name: 'Cihuatlán', lada: '315' },
                { name: 'Cocula', lada: '377' },
                { name: 'Colotlán', lada: '499' },
                { name: 'Concepción de Buenos Aires', lada: '376' },
                { name: 'Cuautitlán de García Barragán', lada: '357' },
                { name: 'Cuautla', lada: '317' },
                { name: 'Cuquío', lada: '373' },
                { name: 'Degollado', lada: '345' },
                { name: 'Ejutla', lada: '317' },
                { name: 'El Grullo', lada: '321' },
                { name: 'El Limón', lada: '321' },
                { name: 'El Salto', lada: '33' },
                { name: 'Encarnación de Díaz', lada: '475' },
                { name: 'Etzatlán', lada: '386' },
                { name: 'Gómez Farías', lada: '372' },
                { name: 'Guachinango', lada: '388' },
                { name: 'Guadalajara', lada: '33' },
                { name: 'Hostotipaquillo', lada: '388' },
                { name: 'Huejúcar', lada: '499' },
                { name: 'Huejuquilla el Alto', lada: '499' },
                { name: 'Ixtlahuacán de los Membrillos', lada: '376' },
                { name: 'Ixtlahuacán del Río', lada: '33' },
                { name: 'Jalostotitlán', lada: '344' },
                { name: 'Jamay', lada: '393' },
                { name: 'Jesús María', lada: '499' },
                { name: 'Jilotlán de los Dolores', lada: '371' },
                { name: 'Jocotepec', lada: '387' },
                { name: 'Juanacatlán', lada: '33' },
                { name: 'Juchitlán', lada: '372' },
                { name: 'Lagos de Moreno', lada: '474' },
                { name: 'La Barca', lada: '393' },
                { name: 'La Huerta', lada: '357' },
                { name: 'Magdalena', lada: '386' },
                { name: 'Mazamitla', lada: '376' },
                { name: 'Mexticacán', lada: '344' },
                { name: 'Mezquitic', lada: '499' },
                { name: 'Mixtlán', lada: '317' },
                { name: 'Ocotlán', lada: '392' },
                { name: 'Ojuelos de Jalisco', lada: '478' },
                { name: 'Pihuamo', lada: '357' },
                { name: 'Poncitlán', lada: '391' },
                { name: 'Puerto Vallarta', lada: '322' },
                { name: 'Quitupan', lada: '371' },
                { name: 'San Cristóbal de la Barranca', lada: '33' },
                { name: 'San Diego de Alejandría', lada: '345' },
                { name: 'San Gabriel', lada: '343' },
                { name: 'San Ignacio Cerro Gordo', lada: '348' },
                { name: 'San Juan de los Lagos', lada: '395' },
                { name: 'San Julián', lada: '348' },
                { name: 'San Marcos', lada: '388' },
                { name: 'San Martín de Bolaños', lada: '499' },
                { name: 'San Martín Hidalgo', lada: '377' },
                { name: 'San Miguel el Alto', lada: '348' },
                { name: 'San Sebastián del Oeste', lada: '322' },
                { name: 'Santa María de los Ángeles', lada: '499' },
                { name: 'Santa María del Oro', lada: '317' },
                { name: 'Sayula', lada: '342' },
                { name: 'Tala', lada: '384' },
                { name: 'Talpa de Allende', lada: '388' },
                { name: 'Tamazula de Gordiano', lada: '358' },
                { name: 'Tapalpa', lada: '343' },
                { name: 'Tecalitlán', lada: '371' },
                { name: 'Techaluta de Montenegro', lada: '342' },
                { name: 'Tenamaxtlán', lada: '372' },
                { name: 'Teocaltiche', lada: '344' },
                { name: 'Teocuitatlán de Corona', lada: '342' },
                { name: 'Tepatitlán de Morelos', lada: '378' },
                { name: 'Tequila', lada: '374' },
                { name: 'Tetlán de los Guzmán', lada: '377' },
                { name: 'Tlajomulco de Zúñiga', lada: '33' },
                { name: 'Tlaquepaque', lada: '33' },
                { name: 'Tolimán', lada: '357' },
                { name: 'Tomatlán', lada: '322' },
                { name: 'Tonala', lada: '33' },
                { name: 'Tonaya', lada: '342' },
                { name: 'Tonila', lada: '357' },
                { name: 'Totatiche', lada: '499' },
                { name: 'Tototlán', lada: '391' },
                { name: 'Tuxcacuesco', lada: '317' },
                { name: 'Tuxcueca', lada: '387' },
                { name: 'Tuxpan', lada: '358' },
                { name: 'Unión de San Antonio', lada: '345' },
                { name: 'Unión de Tula', lada: '317' },
                { name: 'Valle de Guadalupe', lada: '344' },
                { name: 'Valle de Juárez', lada: '376' },
                { name: 'Villa Corona', lada: '376' },
                { name: 'Villa Guerrero', lada: '499' },
                { name: 'Villa Hidalgo', lada: '474' },
                { name: 'Villa Purificación', lada: '317' },
                { name: 'Yahualica de González Gallo', lada: '378' },
                { name: 'Zacoalco de Torres', lada: '342' },
                { name: 'Zapopan', lada: '33' },
                { name: 'Zapotiltic', lada: '341' },
                { name: 'Zapotitlán de Vadillo', lada: '357' },
                { name: 'Zapotlanejo', lada: '373' },
            ],
        },
        {
            state: 'Estado de México',
            municipalities: [
                { name: 'Acambay', lada: '718' },
                { name: 'Acolman', lada: '594' },
                { name: 'Aculco', lada: '718' },
                { name: 'Almoloya de Alquisiras', lada: '714' },
                { name: 'Almoloya de Juárez', lada: '722' },
                { name: 'Almoloya del Río', lada: '728' },
                { name: 'Amanalco', lada: '726' },
                { name: 'Amatepec', lada: '718' },
                { name: 'Amecameca', lada: '597' },
                { name: 'Apaxco', lada: '593' },
                { name: 'Atenco', lada: '595' },
                { name: 'Atizapán de Zaragoza', lada: '55' },
                { name: 'Atizapán', lada: '712' },
                { name: 'Atlacomulco', lada: '712' },
                { name: 'Axapusco', lada: '592' },
                { name: 'Ayapango', lada: '597' },
                { name: 'Calimaya', lada: '722' },
                { name: 'Capulhuac', lada: '728' },
                { name: 'Chalco', lada: '55' },
                { name: 'Chapa de Mota', lada: '712' },
                { name: 'Chapultepec', lada: '722' },
                { name: 'Chiautla', lada: '595' },
                { name: 'Chicoloapan', lada: '595' },
                { name: 'Chiconcuac', lada: '595' },
                { name: 'Chimalhuacán', lada: '55' },
                { name: 'Coacalco de Berriozábal', lada: '55' },
                { name: 'Coatepec Harinas', lada: '714' },
                { name: 'Cocotitlán', lada: '597' },
                { name: 'Coyotepec', lada: '593' },
                { name: 'Cuautitlán', lada: '55' },
                { name: 'Cuautitlán Izcalli', lada: '55' },
                { name: 'Donato Guerra', lada: '726' },
                { name: 'Ecatepec de Morelos', lada: '55' },
                { name: 'Ecatzingo', lada: '597' },
                { name: 'El Oro', lada: '712' },
                { name: 'Huehuetoca', lada: '593' },
                { name: 'Hueypoxtla', lada: '593' },
                { name: 'Huixquilucan', lada: '55' },
                { name: 'Isidro Fabela', lada: '55' },
                { name: 'Ixtapaluca', lada: '55' },
                { name: 'Ixtapan de la Sal', lada: '721' },
                { name: 'Ixtapan del Oro', lada: '726' },
                { name: 'Jaltenco', lada: '593' },
                { name: 'Jilotepec', lada: '761' },
                { name: 'Jilotzingo', lada: '55' },
                { name: 'Jiquipilco', lada: '712' },
                { name: 'Jocotitlán', lada: '712' },
                { name: 'Joquicingo', lada: '728' },
                { name: 'Juchitepec', lada: '597' },
                { name: 'Lerma', lada: '728' },
                { name: 'Malinalco', lada: '714' },
                { name: 'Melchor Ocampo', lada: '593' },
                { name: 'Metepec', lada: '722' },
                { name: 'Mexicaltzingo', lada: '722' },
                { name: 'Morelos', lada: '712' },
                { name: 'Naucalpan de Juárez', lada: '55' },
                { name: 'Nextlalpan', lada: '593' },
                { name: 'Nezahualcóyotl', lada: '55' },
                { name: 'Nicolás Romero', lada: '55' },
                { name: 'Nopaltepec', lada: '592' },
                { name: 'Ocoyoacac', lada: '728' },
                { name: 'Ocuilan', lada: '714' },
                { name: 'Otumba', lada: '592' },
                { name: 'Otzoloapan', lada: '726' },
                { name: 'Otzolotepec', lada: '728' },
                { name: 'Ozumba', lada: '597' },
                { name: 'Papalotla', lada: '595' },
                { name: 'Polotitlán', lada: '761' },
                { name: 'Rayón', lada: '714' },
                { name: 'San Antonio la Isla', lada: '722' },
                { name: 'San Felipe del Progreso', lada: '712' },
                { name: 'San José del Rincón', lada: '712' },
                { name: 'San Martín de las Pirámides', lada: '592' },
                { name: 'San Mateo Atenco', lada: '728' },
                { name: 'San Simón de Guerrero', lada: '714' },
                { name: 'Santo Tomás', lada: '712' },
                { name: 'Soyaniquilpan de Juárez', lada: '761' },
                { name: 'Sultepec', lada: '714' },
                { name: 'Tecámac', lada: '55' },
                { name: 'Tejupilco', lada: '714' },
                { name: 'Temamatla', lada: '597' },
                { name: 'Temascalapa', lada: '592' },
                { name: 'Temascalcingo', lada: '718' },
                { name: 'Temascaltepec', lada: '714' },
                { name: 'Tenancingo', lada: '714' },
                { name: 'Tenango del Aire', lada: '597' },
                { name: 'Tenango del Valle', lada: '714' },
                { name: 'Teoloyucán', lada: '593' },
                { name: 'Teotihuacán', lada: '592' },
                { name: 'Tepetlaoxtoc', lada: '595' },
                { name: 'Tepetlixpa', lada: '597' },
                { name: 'Tepotzotlán', lada: '593' },
                { name: 'Tequixquiac', lada: '593' },
                { name: 'Texcaltitlán', lada: '714' },
                { name: 'Texcalyacac', lada: '728' },
                { name: 'Texcoco', lada: '595' },
                { name: 'Tezoyuca', lada: '595' },
                { name: 'Tianguistenco', lada: '714' },
                { name: 'Timilpan', lada: '712' },
                { name: 'Tlalmanalco', lada: '597' },
                { name: 'Tlalnepantla de Baz', lada: '55' },
                { name: 'Tlatlaya', lada: '714' },
                { name: 'Toluca', lada: '722' },
                { name: 'Tonanitla', lada: '55' },
                { name: 'Tonatico', lada: '721' },
                { name: 'Tultepec', lada: '55' },
                { name: 'Tultitlán', lada: '55' },
                { name: 'Valle de Bravo', lada: '726' },
                { name: 'Valle de Chalco Solidaridad', lada: '55' },
                { name: 'Villa de Allende', lada: '718' },
                { name: 'Villa del Carbón', lada: '55' },
                { name: 'Villa Guerrero', lada: '714' },
                { name: 'Villa Victoria', lada: '718' },
                { name: 'Xalatlaco', lada: '728' },
                { name: 'Xonacatlán', lada: '728' },
                { name: 'Zacazonapan', lada: '726' },
                { name: 'Zacualpan', lada: '714' },
                { name: 'Zinacantepec', lada: '722' },
                { name: 'Zumpahuacán', lada: '714' },
                { name: 'Zumpango', lada: '593' },
            ],
        },
        {
            state: 'Michoacán',
            municipalities: [
                { name: 'Acuitzio', lada: '434' },
                { name: 'Aguililla', lada: '425' },
                { name: 'Álvaro Obregón', lada: '443' },
                { name: 'Angamacutiro', lada: '438' },
                { name: 'Angangueo', lada: '715' },
                { name: 'Apatzingán', lada: '453' },
                { name: 'Aporo', lada: '786' },
                { name: 'Aquila', lada: '313' },
                { name: 'Ario', lada: '451' },
                { name: 'Arteaga', lada: '425' },
                { name: 'Briseñas', lada: '355' },
                { name: 'Buenavista', lada: '453' },
                { name: 'Carácuaro', lada: '459' },
                { name: 'Charapan', lada: '423' },
                { name: 'Charo', lada: '443' },
                { name: 'Chavinda', lada: '355' },
                { name: 'Cherán', lada: '423' },
                { name: 'Chilchota', lada: '423' },
                { name: 'Chinicuila', lada: '313' },
                { name: 'Chucándiro', lada: '438' },
                { name: 'Churintzio', lada: '438' },
                { name: 'Churumuco', lada: '459' },
                { name: 'Coahuayana', lada: '313' },
                { name: 'Coalcomán de Vázquez Pallares', lada: '425' },
                { name: 'Coeneo', lada: '438' },
                { name: 'Contepec', lada: '447' },
                { name: 'Copándaro', lada: '438' },
                { name: 'Cotija', lada: '428' },
                { name: 'Cuitzeo', lada: '443' },
                { name: 'Ecuandureo', lada: '355' },
                { name: 'Epitacio Huerta', lada: '447' },
                { name: 'Erongarícuaro', lada: '434' },
                { name: 'Gabriel Zamora', lada: '452' },
                { name: 'Hidalgo', lada: '786' },
                { name: 'Huandacareo', lada: '438' },
                { name: 'Huaniqueo', lada: '438' },
                { name: 'Huetamo', lada: '459' },
                { name: 'Huiramba', lada: '434' },
                { name: 'Indaparapeo', lada: '443' },
                { name: 'Irimbo', lada: '786' },
                { name: 'Ixtlán', lada: '428' },
                { name: 'Jacona', lada: '351' },
                { name: 'Jiménez', lada: '428' },
                { name: 'Jiquilpan', lada: '353' },
                { name: 'José Sixto Verduzco', lada: '438' },
                { name: 'Juárez', lada: '786' },
                { name: 'Jungapeo', lada: '786' },
                { name: 'La Huacana', lada: '452' },
                { name: 'La Piedad', lada: '352' },
                { name: 'Lagunillas', lada: '434' },
                { name: 'Los Reyes', lada: '354' },
                { name: 'Lázaro Cárdenas', lada: '753' },
                { name: 'Madero', lada: '452' },
                { name: 'Maravatío', lada: '447' },
                { name: 'Marcos Castellanos', lada: '386' },
                { name: 'Morelia', lada: '443' },
                { name: 'Morelos', lada: '438' },
                { name: 'Múgica', lada: '453' },
                { name: 'Nahuatzen', lada: '423' },
                { name: 'Nocupétaro', lada: '459' },
                { name: 'Nuevo Parangaricutiro', lada: '452' },
                { name: 'Nuevo Urecho', lada: '452' },
                { name: 'Numarán', lada: '352' },
                { name: 'Ocampo', lada: '715' },
                { name: 'Pajacuarán', lada: '355' },
                { name: 'Panindícuaro', lada: '438' },
                { name: 'Paracho', lada: '423' },
                { name: 'Parácuaro', lada: '453' },
                { name: 'Pátzcuaro', lada: '434' },
                { name: 'Penjamillo', lada: '438' },
                { name: 'Peribán', lada: '354' },
                { name: 'Purépero', lada: '423' },
                { name: 'Puruándiro', lada: '438' },
                { name: 'Queréndaro', lada: '443' },
                { name: 'Quiroga', lada: '434' },
                { name: 'Sahuayo', lada: '353' },
                { name: 'Salvador Escalante', lada: '434' },
                { name: 'San Lucas', lada: '459' },
                { name: 'Santa Ana Maya', lada: '443' },
                { name: 'Senguio', lada: '786' },
                { name: 'Susupuato', lada: '786' },
                { name: 'Tacámbaro', lada: '459' },
                { name: 'Tancítaro', lada: '452' },
                { name: 'Tangamandapio', lada: '355' },
                { name: 'Tangancícuaro', lada: '355' },
                { name: 'Tanhuato', lada: '355' },
                { name: 'Taretan', lada: '452' },
                { name: 'Tarímbaro', lada: '443' },
                { name: 'Tepalcatepec', lada: '425' },
                { name: 'Tingambato', lada: '434' },
                { name: 'Tingüindín', lada: '354' },
                { name: 'Tiquicheo de Nicolás Romero', lada: '459' },
                { name: 'Tlalpujahua', lada: '447' },
                { name: 'Tlazazalca', lada: '428' },
                { name: 'Tocumbo', lada: '354' },
                { name: 'Tumbiscatío', lada: '425' },
                { name: 'Turicato', lada: '459' },
                { name: 'Tuxpan', lada: '786' },
                { name: 'Tuzantla', lada: '786' },
                { name: 'Tzintzuntzan', lada: '434' },
                { name: 'Tzitzio', lada: '443' },
                { name: 'Uruapan', lada: '452' },
                { name: 'Venustiano Carranza', lada: '353' },
                { name: 'Villamar', lada: '355' },
                { name: 'Vista Hermosa', lada: '393' },
                { name: 'Yurécuaro', lada: '393' },
                { name: 'Zacapu', lada: '436' },
                { name: 'Zamora', lada: '351' },
                { name: 'Zináparo', lada: '438' },
                { name: 'Zinapécuaro', lada: '451' },
                { name: 'Ziracuaretiro', lada: '452' },
                { name: 'Zitácuaro', lada: '715' },
            ],
        },
        {
            state: 'Morelos',
            municipalities: [
                { name: 'Amacuzac', lada: '751' },
                { name: 'Atlatlahucan', lada: '735' },
                { name: 'Axochiapan', lada: '731' },
                { name: 'Ayala', lada: '735' },
                { name: 'Coatlán del Río', lada: '751' },
                { name: 'Cuautla', lada: '735' },
                { name: 'Cuernavaca', lada: '777' },
                { name: 'Emiliano Zapata', lada: '777' },
                { name: 'Huitzilac', lada: '777' },
                { name: 'Jantetelco', lada: '731' },
                { name: 'Jiutepec', lada: '777' },
                { name: 'Jojutla', lada: '734' },
                { name: 'Jonacatepec de Leandro Valle', lada: '735' },
                { name: 'Mazatepec', lada: '751' },
                { name: 'Miacatlán', lada: '751' },
                { name: 'Ocuituco', lada: '735' },
                { name: 'Puente de Ixtla', lada: '751' },
                { name: 'Temixco', lada: '777' },
                { name: 'Temoac', lada: '731' },
                { name: 'Tepalcingo', lada: '731' },
                { name: 'Tepoztlán', lada: '739' },
                { name: 'Tetecala', lada: '751' },
                { name: 'Tetela del Volcán', lada: '735' },
                { name: 'Tlalnepantla', lada: '735' },
                { name: 'Tlaltizapán de Zapata', lada: '734' },
                { name: 'Tlaquiltenango', lada: '734' },
                { name: 'Tlayacapan', lada: '735' },
                { name: 'Totolapan', lada: '735' },
                { name: 'Xochitepec', lada: '777' },
                { name: 'Yautepec', lada: '735' },
                { name: 'Yecapixtla', lada: '735' },
                { name: 'Zacatepec de Hidalgo', lada: '734' },
                { name: 'Zacualpan de Amilpas', lada: '735' },
            ],
        }, {
            state: 'Nayarit',
            municipalities: [
                { name: 'Acaponeta', lada: '394' },
                { name: 'Ahuacatlán', lada: '324' },
                { name: 'Amatlán de Cañas', lada: '327' },
                { name: 'Bahía de Banderas', lada: '329' },
                { name: 'Compostela', lada: '327' },
                { name: 'Del Nayar', lada: '327' },
                { name: 'Huajicori', lada: '389' },
                { name: 'Ixtlán del Río', lada: '324' },
                { name: 'Jala', lada: '324' },
                { name: 'La Yesca', lada: '327' },
                { name: 'Rosamorada', lada: '394' },
                { name: 'Ruiz', lada: '319' },
                { name: 'San Blas', lada: '323' },
                { name: 'San Pedro Lagunillas', lada: '327' },
                { name: 'Santa María del Oro', lada: '324' },
                { name: 'Santiago Ixcuintla', lada: '323' },
                { name: 'Tecuala', lada: '394' },
                { name: 'Tepic', lada: '311' },
                { name: 'Tuxpan', lada: '319' },
                { name: 'Xalisco', lada: '311' },
            ],
        },
        {
            state: 'Nuevo León',
            municipalities: [
                { name: 'Abasolo', lada: '824' },
                { name: 'Agualeguas', lada: '823' },
                { name: 'Allende', lada: '826' },
                { name: 'Anáhuac', lada: '867' },
                { name: 'Apodaca', lada: '81' },
                { name: 'Aramberri', lada: '826' },
                { name: 'Bustamante', lada: '829' },
                { name: 'Cadereyta Jiménez', lada: '828' },
                { name: 'Cerralvo', lada: '892' },
                { name: 'China', lada: '823' },
                { name: 'Ciénega de Flores', lada: '81' },
                { name: 'Doctor Arroyo', lada: '826' },
                { name: 'Doctor Coss', lada: '823' },
                { name: 'Doctor González', lada: '821' },
                { name: 'El Carmen', lada: '81' },
                { name: 'Galeana', lada: '826' },
                { name: 'García', lada: '81' },
                { name: 'General Bravo', lada: '823' },
                { name: 'General Escobedo', lada: '81' },
                { name: 'General Terán', lada: '826' },
                { name: 'General Treviño', lada: '892' },
                { name: 'General Zaragoza', lada: '826' },
                { name: 'Guadalupe', lada: '81' },
                { name: 'Hidalgo', lada: '828' },
                { name: 'Higueras', lada: '821' },
                { name: 'Hualahuises', lada: '826' },
                { name: 'Iturbide', lada: '826' },
                { name: 'Juárez', lada: '81' },
                { name: 'Lampazos de Naranjo', lada: '873' },
                { name: 'Linares', lada: '821' },
                { name: 'Los Aldamas', lada: '892' },
                { name: 'Los Herreras', lada: '821' },
                { name: 'Los Ramones', lada: '821' },
                { name: 'Marín', lada: '821' },
                { name: 'Melchor Ocampo', lada: '823' },
                { name: 'Mier y Noriega', lada: '826' },
                { name: 'Mina', lada: '829' },
                { name: 'Montemorelos', lada: '826' },
                { name: 'Monterrey', lada: '81' },
                { name: 'Parás', lada: '892' },
                { name: 'Pesquería', lada: '892' },
                { name: 'Rayones', lada: '826' },
                { name: 'Sabinas Hidalgo', lada: '824' },
                { name: 'Salinas Victoria', lada: '81' },
                { name: 'San Nicolás de los Garza', lada: '81' },
                { name: 'San Pedro Garza García', lada: '81' },
                { name: 'Santa Catarina', lada: '81' },
                { name: 'Santiago', lada: '826' },
                { name: 'Vallecillo', lada: '892' },
                { name: 'Villaldama', lada: '824' },
            ],
        },
        {
            state: 'Oaxaca',
            municipalities: [
                { name: 'Abejones', lada: '951' },
                { name: 'Acatlán de Pérez Figueroa', lada: '274' },
                { name: 'Asunción Cacalotepec', lada: '951' },
                { name: 'Asunción Cuyotepeji', lada: '953' },
                { name: 'Asunción Ixtaltepec', lada: '972' },
                { name: 'Asunción Nochixtlán', lada: '951' },
                { name: 'Asunción Ocotlán', lada: '951' },
                { name: 'Asunción Tlacolulita', lada: '971' },
                { name: 'Ayoquezco de Aldama', lada: '951' },
                { name: 'Ayotzintepec', lada: '287' },
                { name: 'Calihualá', lada: '953' },
                { name: 'Candelaria Loxicha', lada: '958' },
                { name: 'Capulálpam de Méndez', lada: '951' },
                { name: 'Chahuites', lada: '972' },
                { name: 'Chalcatongo de Hidalgo', lada: '953' },
                { name: 'Chiquihuitlán de Benito Juárez', lada: '951' },
                { name: 'Ciénega de Zimatlán', lada: '951' },
                { name: 'Ciudad Ixtepec', lada: '971' },
                { name: 'Coatecas Altas', lada: '951' },
                { name: 'Cuilápam de Guerrero', lada: '951' },
                { name: 'El Barrio de la Soledad', lada: '972' },
                { name: 'Eloxochitlán de Flores Magón', lada: '236' },
                { name: 'Epitacio Huerta', lada: '951' },
                { name: 'Guelatao de Juárez', lada: '951' },
                { name: 'Guevea de Humboldt', lada: '972' },
                { name: 'Heroica Ciudad de Huajuapan de León', lada: '953' },
                { name: 'Heroica Ciudad de Tlaxiaco', lada: '953' },
                { name: 'Huautepec', lada: '951' },
                { name: 'Huautla de Jiménez', lada: '236' },
                { name: 'Ixtlán de Juárez', lada: '951' },
                { name: 'Juchitán de Zaragoza', lada: '971' },
                { name: 'La Reforma', lada: '951' },
                { name: 'Loma Bonita', lada: '281' },
                { name: 'Magdalena Apasco', lada: '951' },
                { name: 'Magdalena Jaltepec', lada: '953' },
                { name: 'Magdalena Tequisistlán', lada: '972' },
                { name: 'Matías Romero Avendaño', lada: '972' },
                { name: 'Mazatlán Villa de Flores', lada: '287' },
                { name: 'Miahuatlán de Porfirio Díaz', lada: '951' },
                { name: 'Mixistlán de la Reforma', lada: '951' },
                { name: 'Oaxaca de Juárez', lada: '951' },
                { name: 'Ocotlán de Morelos', lada: '951' },
                { name: 'Pochutla', lada: '958' },
                { name: 'Puerto Escondido', lada: '954' },
                { name: 'Salina Cruz', lada: '971' },
                { name: 'San Agustín Etla', lada: '951' },
                { name: 'San Agustín Loxicha', lada: '958' },
                { name: 'San Andrés Huaxpaltepec', lada: '954' },
                { name: 'San Juan Bautista Tuxtepec', lada: '287' },
                { name: 'Santa Cruz Xoxocotlán', lada: '951' },
                { name: 'Santo Domingo Tehuantepec', lada: '971' },
                { name: 'Santiago Pinotepa Nacional', lada: '954' },
                { name: 'Tlacolula de Matamoros', lada: '951' },
                { name: 'Villa de Etla', lada: '951' },
                { name: 'Zimatlán de Álvarez', lada: '951' },
            ],
        },
        {
            state: 'Puebla',
            municipalities: [
                { name: 'Acajete', lada: '223' },
                { name: 'Acateno', lada: '231' },
                { name: 'Acatlán', lada: '953' },
                { name: 'Acatzingo', lada: '223' },
                { name: 'Acteopan', lada: '243' },
                { name: 'Ahuacatlán', lada: '764' },
                { name: 'Ahuatlán', lada: '243' },
                { name: 'Ahuazotepec', lada: '776' },
                { name: 'Ahuehuetitla', lada: '275' },
                { name: 'Ajalpan', lada: '236' },
                { name: 'Albino Zertuche', lada: '275' },
                { name: 'Aljojuca', lada: '223' },
                { name: 'Altepexi', lada: '236' },
                { name: 'Amixtlán', lada: '764' },
                { name: 'Amozoc', lada: '222' },
                { name: 'Aquixtla', lada: '797' },
                { name: 'Atempan', lada: '231' },
                { name: 'Atexcal', lada: '243' },
                { name: 'Atlequizayan', lada: '231' },
                { name: 'Atlixco', lada: '244' },
                { name: 'Atoyatempan', lada: '223' },
                { name: 'Atzala', lada: '243' },
                { name: 'Atzitzihuacán', lada: '243' },
                { name: 'Atzitzintla', lada: '223' },
                { name: 'Axutla', lada: '243' },
                { name: 'Ayotoxco de Guerrero', lada: '233' },
                { name: 'Calpan', lada: '222' },
                { name: 'Caltepec', lada: '236' },
                { name: 'Camocuautla', lada: '764' },
                { name: 'Cañada Morelos', lada: '223' },
                { name: 'Chalchicomula de Sesma', lada: '245' },
                { name: 'Chapulco', lada: '236' },
                { name: 'Chiautla', lada: '275' },
                { name: 'Chiautzingo', lada: '222' },
                { name: 'Chiconcuautla', lada: '797' },
                { name: 'Chichiquila', lada: '231' },
                { name: 'Chietla', lada: '243' },
                { name: 'Chigmecatitlán', lada: '243' },
                { name: 'Chignahuapan', lada: '797' },
                { name: 'Chignautla', lada: '231' },
                { name: 'Chila', lada: '275' },
                { name: 'Chila de la Sal', lada: '243' },
                { name: 'Chilchotla', lada: '231' },
                { name: 'Chinantla', lada: '275' },
                { name: 'Coatepec', lada: '231' },
                { name: 'Coatzingo', lada: '243' },
                { name: 'Cohuecan', lada: '243' },
                { name: 'Coronango', lada: '222' },
                { name: 'Coxcatlán', lada: '236' },
                { name: 'Coyomeapan', lada: '236' },
                { name: 'Cuapiaxtla de Madero', lada: '223' },
                { name: 'Cuautempan', lada: '231' },
                { name: 'Cuautinchán', lada: '222' },
                { name: 'Cuautlancingo', lada: '222' },
                { name: 'Cuayuca de Andrade', lada: '243' },
                { name: 'Cuetzalan del Progreso', lada: '233' },
                { name: 'Cuyoaco', lada: '231' },
                { name: 'Domingo Arenas', lada: '222' },
                { name: 'Eloxochitlán', lada: '236' },
                { name: 'Epatlán', lada: '243' },
                { name: 'Esperanza', lada: '245' },
                { name: 'Francisco Z. Mena', lada: '764' },
                { name: 'General Felipe Ángeles', lada: '223' },
                { name: 'Guadalupe', lada: '231' },
                { name: 'Guadalupe Victoria', lada: '245' },
                { name: 'Hermenegildo Galeana', lada: '275' },
                { name: 'Honey', lada: '764' },
                { name: 'Huaquechula', lada: '243' },
                { name: 'Huatlatlauca', lada: '243' },
                { name: 'Huauchinango', lada: '764' },
                { name: 'Huehuetla', lada: '231' },
                { name: 'Huehuetlán el Chico', lada: '243' },
                { name: 'Huehuetlán el Grande', lada: '222' },
                { name: 'Huejotzingo', lada: '227' },
                { name: 'Hueyapan', lada: '231' },
                { name: 'Hueytamalco', lada: '233' },
                { name: 'Hueytlalpan', lada: '231' },
                { name: 'Huitzilan de Serdán', lada: '231' },
                { name: 'Huitziltepec', lada: '223' },
                { name: 'Ixcamilpa de Guerrero', lada: '275' },
                { name: 'Ixcaquixtla', lada: '243' },
                { name: 'Ixtacamaxtitlán', lada: '231' },
                { name: 'Ixtepec', lada: '243' },
                { name: 'Izúcar de Matamoros', lada: '243' },
                { name: 'Jalpan', lada: '764' },
                { name: 'Jolalpan', lada: '275' },
                { name: 'Jonotla', lada: '233' },
                { name: 'Jopala', lada: '764' },
                { name: 'Juan C. Bonilla', lada: '222' },
                { name: 'Juan Galindo', lada: '764' },
                { name: 'Juan N. Méndez', lada: '223' },
                { name: 'La Magdalena Tlatlauquitepec', lada: '231' },
                { name: 'Lafragua', lada: '245' },
                { name: 'Libres', lada: '231' },
                { name: 'Los Reyes de Juárez', lada: '222' },
                { name: 'Mazapiltepec de Juárez', lada: '223' },
                { name: 'Mixtla', lada: '764' },
                { name: 'Molcaxac', lada: '223' },
                { name: 'Naupan', lada: '797' },
                { name: 'Nauzontla', lada: '231' },
                { name: 'Nealtican', lada: '222' },
                { name: 'Nicolás Bravo', lada: '236' },
                { name: 'Nopalucan', lada: '223' },
                { name: 'Ocotepec', lada: '231' },
                { name: 'Ocoyucan', lada: '222' },
                { name: 'Olintla', lada: '231' },
                { name: 'Oriental', lada: '245' },
                { name: 'Pahuatlán', lada: '764' },
                { name: 'Palmar de Bravo', lada: '223' },
                { name: 'Pantepec', lada: '764' },
                { name: 'Petlalcingo', lada: '275' },
                { name: 'Piaxtla', lada: '275' },
                { name: 'Puebla', lada: '222' },
                { name: 'Quecholac', lada: '223' },
                { name: 'Quimixtlán', lada: '231' },
                { name: 'Rafael Lara Grajales', lada: '223' },
                { name: 'San Andrés Cholula', lada: '222' },
                { name: 'San Antonio Cañada', lada: '236' },
                { name: 'San Diego la Mesa Tochimiltzingo', lada: '223' },
                { name: 'San Felipe Teotlalcingo', lada: '227' },
                { name: 'San Felipe Tepatlán', lada: '231' },
                { name: 'San Gabriel Chilac', lada: '236' },
                { name: 'San Gregorio Atzompa', lada: '222' },
                { name: 'San Jerónimo Tecuanipan', lada: '222' },
                { name: 'San Jerónimo Xayacatlán', lada: '275' },
                { name: 'San José Chiapa', lada: '223' },
                { name: 'San José Miahuatlán', lada: '236' },
                { name: 'San Juan Atenco', lada: '223' },
                { name: 'San Juan Atzompa', lada: '223' },
                { name: 'San Martín Texmelucan', lada: '248' },
                { name: 'San Martín Totoltepec', lada: '223' },
                { name: 'San Matías Tlalancaleca', lada: '222' },
                { name: 'San Miguel Ixitlán', lada: '275' },
                { name: 'San Nicolás Buenos Aires', lada: '223' },
                { name: 'San Nicolás de los Ranchos', lada: '222' },
                { name: 'San Pablo Anicano', lada: '275' },
                { name: 'San Pedro Cholula', lada: '222' },
                { name: 'San Pedro Yeloixtlahuaca', lada: '275' },
                { name: 'San Salvador el Seco', lada: '223' },
                { name: 'San Salvador el Verde', lada: '222' },
                { name: 'San Salvador Huixcolotla', lada: '222' },
                { name: 'San Sebastián Tlacotepec', lada: '236' },
                { name: 'Santa Catarina Tlaltempan', lada: '223' },
                { name: 'Santa Inés Ahuatempan', lada: '223' },
                { name: 'Santa Isabel Cholula', lada: '222' },
                { name: 'Santiago Miahuatlán', lada: '236' },
                { name: 'Santo Tomás Hueyotlipan', lada: '223' },
                { name: 'Soltepec', lada: '223' },
                { name: 'Tecali de Herrera', lada: '223' },
                { name: 'Tecamachalco', lada: '223' },
                { name: 'Tecomatlán', lada: '275' },
                { name: 'Tehuacán', lada: '238' },
                { name: 'Tehuitzingo', lada: '243' },
                { name: 'Tenampulco', lada: '233' },
                { name: 'Teopantlán', lada: '243' },
                { name: 'Teotlalco', lada: '275' },
                { name: 'Tepanco de López', lada: '236' },
                { name: 'Tepango de Rodríguez', lada: '231' },
                { name: 'Tepatlaxco de Hidalgo', lada: '223' },
                { name: 'Tepeaca', lada: '223' },
                { name: 'Tepemaxalco', lada: '223' },
                { name: 'Tepeojuma', lada: '243' },
                { name: 'Tepetzintla', lada: '231' },
                { name: 'Tepexco', lada: '243' },
                { name: 'Tepexi de Rodríguez', lada: '223' },
                { name: 'Tepeyahualco', lada: '223' },
                { name: 'Tepeyahualco de Cuauhtémoc', lada: '223' },
                { name: 'Tetela de Ocampo', lada: '231' },
                { name: 'Teteles de Ávila Castillo', lada: '231' },
                { name: 'Teziutlán', lada: '231' },
                { name: 'Tianguismanalco', lada: '222' },
                { name: 'Tilapa', lada: '243' },
                { name: 'Tlachichuca', lada: '245' },
                { name: 'Tlacotepec de Benito Juárez', lada: '223' },
                { name: 'Tlacuilotepec', lada: '764' },
                { name: 'Tlahuapan', lada: '248' },
                { name: 'Tlaltenango', lada: '222' },
                { name: 'Tlanepantla', lada: '223' },
                { name: 'Tlaola', lada: '764' },
                { name: 'Tlapacoya', lada: '223' },
                { name: 'Tlapanalá', lada: '243' },
                { name: 'Tlatlauquitepec', lada: '231' },
                { name: 'Tlaxco', lada: '231' },
                { name: 'Tochimilco', lada: '222' },
                { name: 'Tochtepec', lada: '223' },
                { name: 'Totoltepec de Guerrero', lada: '223' },
                { name: 'Tulcingo', lada: '275' },
                { name: 'Tuzamapan de Galeana', lada: '231' },
                { name: 'Tzicatlacoyan', lada: '223' },
                { name: 'Venustiano Carranza', lada: '764' },
                { name: 'Vicente Guerrero', lada: '243' },
                { name: 'Xayacatlán de Bravo', lada: '275' },
                { name: 'Xicotepec', lada: '764' },
                { name: 'Xicotlán', lada: '243' },
                { name: 'Xiutetelco', lada: '231' },
                { name: 'Xochiapulco', lada: '231' },
                { name: 'Xochiltepec', lada: '223' },
                { name: 'Xochitlán de Vicente Suárez', lada: '231' },
                { name: 'Xochitlán Todos Santos', lada: '223' },
                { name: 'Yaonáhuac', lada: '231' },
                { name: 'Yehualtepec', lada: '223' },
                { name: 'Zacapala', lada: '243' },
                { name: 'Zacapoaxtla', lada: '231' },
                { name: 'Zacatlán', lada: '797' },
                { name: 'Zapotitlán', lada: '231' },
                { name: 'Zapotitlán de Méndez', lada: '231' },
                { name: 'Zaragoza', lada: '231' },
                { name: 'Zautla', lada: '231' },
                { name: 'Zihuateutla', lada: '764' },
                { name: 'Zinacatepec', lada: '236' },
                { name: 'Zongozotla', lada: '231' },
                { name: 'Zoquiapan', lada: '231' },
                { name: 'Zoquitlán', lada: '236' },
            ],
        },
        {
            state: 'Querétaro',
            municipalities: [
                { name: 'Amealco de Bonfil', lada: '427' },
                { name: 'Arroyo Seco', lada: '441' },
                { name: 'Cadereyta de Montes', lada: '441' },
                { name: 'Colón', lada: '419' },
                { name: 'Corregidora', lada: '442' },
                { name: 'Ezequiel Montes', lada: '441' },
                { name: 'Huimilpan', lada: '442' },
                { name: 'Jalpan de Serra', lada: '441' },
                { name: 'Landa de Matamoros', lada: '441' },
                { name: 'El Marqués', lada: '442' },
                { name: 'Pedro Escobedo', lada: '448' },
                { name: 'Peñamiller', lada: '441' },
                { name: 'Pinal de Amoles', lada: '441' },
                { name: 'Querétaro', lada: '442' },
                { name: 'San Joaquín', lada: '441' },
                { name: 'San Juan del Río', lada: '427' },
                { name: 'Tequisquiapan', lada: '414' },
                { name: 'Tolimán', lada: '441' },
            ],
        },
        {
            state: 'Quintana Roo',
            municipalities: [
                { name: 'Bacalar', lada: '983' },
                { name: 'Benito Juárez (Cancún)', lada: '998' },
                { name: 'Cozumel', lada: '987' },
                { name: 'Felipe Carrillo Puerto', lada: '983' },
                { name: 'Isla Mujeres', lada: '998' },
                { name: 'José María Morelos', lada: '997' },
                { name: 'Lázaro Cárdenas', lada: '984' },
                { name: 'Othón P. Blanco (Chetumal)', lada: '983' },
                { name: 'Puerto Morelos', lada: '998' },
                { name: 'Solidaridad (Playa del Carmen)', lada: '984' },
                { name: 'Tulum', lada: '984' },
            ],
        },
        {
            state: 'San Luis Potosí',
            municipalities: [
                { name: 'Ahualulco', lada: '444' },
                { name: 'Alaquines', lada: '487' },
                { name: 'Aquismón', lada: '481' },
                { name: 'Armadillo de los Infante', lada: '444' },
                { name: 'Axtla de Terrazas', lada: '489' },
                { name: 'Cárdenas', lada: '482' },
                { name: 'Catorce', lada: '488' },
                { name: 'Cedral', lada: '488' },
                { name: 'Cerritos', lada: '444' },
                { name: 'Cerro de San Pedro', lada: '444' },
                { name: 'Ciudad del Maíz', lada: '487' },
                { name: 'Ciudad Fernández', lada: '444' },
                { name: 'Ciudad Valles', lada: '481' },
                { name: 'Coxcatlán', lada: '489' },
                { name: 'Charcas', lada: '488' },
                { name: 'Ebano', lada: '481' },
                { name: 'El Naranjo', lada: '481' },
                { name: 'Guadalcázar', lada: '444' },
                { name: 'Huehuetlán', lada: '489' },
                { name: 'Laguna de San Vicente', lada: '444' },
                { name: 'Matehuala', lada: '488' },
                { name: 'Mexquitic de Carmona', lada: '444' },
                { name: 'Moctezuma', lada: '488' },
                { name: 'Rayón', lada: '487' },
                { name: 'Rioverde', lada: '487' },
                { name: 'Salinas', lada: '496' },
                { name: 'San Antonio', lada: '489' },
                { name: 'San Ciro de Acosta', lada: '487' },
                { name: 'San Luis Potosí', lada: '444' },
                { name: 'San Martín Chalchicuautla', lada: '489' },
                { name: 'San Nicolás Tolentino', lada: '444' },
                { name: 'Santa Catarina', lada: '481' },
                { name: 'Santa María del Río', lada: '444' },
                { name: 'Santo Domingo', lada: '488' },
                { name: 'Soledad de Graciano Sánchez', lada: '444' },
                { name: 'Tamasopo', lada: '481' },
                { name: 'Tamazunchale', lada: '483' },
                { name: 'Tampacán', lada: '489' },
                { name: 'Tampamolón Corona', lada: '489' },
                { name: 'Tamuín', lada: '481' },
                { name: 'Tanlajás', lada: '489' },
                { name: 'Tanquián de Escobedo', lada: '483' },
                { name: 'Tierra Nueva', lada: '487' },
                { name: 'Vanegas', lada: '488' },
                { name: 'Venado', lada: '488' },
                { name: 'Villa de Arista', lada: '444' },
                { name: 'Villa de Guadalupe', lada: '488' },
                { name: 'Villa de la Paz', lada: '488' },
                { name: 'Villa de Ramos', lada: '496' },
                { name: 'Villa de Reyes', lada: '444' },
                { name: 'Villa Hidalgo', lada: '488' },
                { name: 'Villa Juárez', lada: '487' },
                { name: 'Xilitla', lada: '489' },
                { name: 'Zaragoza', lada: '444' },
            ],
        },
        {
            state: 'Sinaloa',
            municipalities: [
                { name: 'Ahome', lada: '668' },
                { name: 'Angostura', lada: '697' },
                { name: 'Badiraguato', lada: '667' },
                { name: 'Choix', lada: '698' },
                { name: 'Concordia', lada: '669' },
                { name: 'Cosalá', lada: '667' },
                { name: 'Culiacán', lada: '667' },
                { name: 'El Fuerte', lada: '698' },
                { name: 'Elota', lada: '696' },
                { name: 'Escuinapa', lada: '695' },
                { name: 'Guasave', lada: '687' },
                { name: 'Mazatlán', lada: '669' },
                { name: 'Mocorito', lada: '673' },
                { name: 'Navolato', lada: '667' },
                { name: 'Rosario', lada: '694' },
                { name: 'Salvador Alvarado', lada: '673' },
                { name: 'San Ignacio', lada: '696' },
                { name: 'Sinaloa de Leyva', lada: '687' },
            ],
        },
        {
            state: 'Sonora',
            municipalities: [
                { name: 'Aconchi', lada: '623' },
                { name: 'Agua Prieta', lada: '633' },
                { name: 'Alamos', lada: '647' },
                { name: 'Altar', lada: '637' },
                { name: 'Arivechi', lada: '647' },
                { name: 'Arizpe', lada: '623' },
                { name: 'Atil', lada: '637' },
                { name: 'Bacadehuachi', lada: '634' },
                { name: 'Bacanora', lada: '634' },
                { name: 'Bacerac', lada: '634' },
                { name: 'Bacoachi', lada: '623' },
                { name: 'Bácum', lada: '644' },
                { name: 'Banámichi', lada: '623' },
                { name: 'Baviácora', lada: '623' },
                { name: 'Bavispe', lada: '634' },
                { name: 'Benito Juárez', lada: '644' },
                { name: 'Caborca', lada: '637' },
                { name: 'Cajeme', lada: '644' },
                { name: 'Cananea', lada: '645' },
                { name: 'Carbó', lada: '662' },
                { name: 'Cucurpe', lada: '623' },
                { name: 'Cumpas', lada: '633' },
                { name: 'Divisaderos', lada: '634' },
                { name: 'Empalme', lada: '622' },
                { name: 'Etchojoa', lada: '647' },
                { name: 'Fronteras', lada: '633' },
                { name: 'General Plutarco Elías Calles', lada: '637' },
                { name: 'Granados', lada: '634' },
                { name: 'Guaymas', lada: '622' },
                { name: 'Hermosillo', lada: '662' },
                { name: 'Huachinera', lada: '634' },
                { name: 'Huásabas', lada: '634' },
                { name: 'Huatabampo', lada: '647' },
                { name: 'Huépac', lada: '623' },
                { name: 'Imuris', lada: '631' },
                { name: 'Magdalena', lada: '631' },
                { name: 'Mazatán', lada: '662' },
                { name: 'Moctezuma', lada: '633' },
                { name: 'Naco', lada: '633' },
                { name: 'Nácori Chico', lada: '634' },
                { name: 'Nacozari de García', lada: '633' },
                { name: 'Navojoa', lada: '642' },
                { name: 'Nogales', lada: '631' },
                { name: 'Onavas', lada: '634' },
                { name: 'Opodepe', lada: '662' },
                { name: 'Oquitoa', lada: '637' },
                { name: 'Pitiquito', lada: '637' },
                { name: 'Puerto Peñasco', lada: '638' },
                { name: 'Quiriego', lada: '647' },
                { name: 'Rayón', lada: '662' },
                { name: 'Rosario', lada: '647' },
                { name: 'Sahuaripa', lada: '634' },
                { name: 'San Felipe de Jesús', lada: '623' },
                { name: 'San Javier', lada: '647' },
                { name: 'San Luis Río Colorado', lada: '653' },
                { name: 'San Miguel de Horcasitas', lada: '662' },
                { name: 'San Pedro de la Cueva', lada: '634' },
                { name: 'Santa Ana', lada: '641' },
                { name: 'Santa Cruz', lada: '633' },
                { name: 'Sáric', lada: '637' },
                { name: 'Soyopa', lada: '634' },
                { name: 'Suaqui Grande', lada: '634' },
                { name: 'Tepache', lada: '634' },
                { name: 'Trincheras', lada: '637' },
                { name: 'Tubutama', lada: '637' },
                { name: 'Ures', lada: '623' },
                { name: 'Villa Hidalgo', lada: '634' },
                { name: 'Villa Pesqueira', lada: '662' },
                { name: 'Yécora', lada: '647' },
            ],
        }, {
            state: 'Tamaulipas',
            municipalities: [
                { name: 'Abasolo', lada: '834' },
                { name: 'Aldama', lada: '836' },
                { name: 'Altamira', lada: '833' },
                { name: 'Antiguo Morelos', lada: '489' },
                { name: 'Burgos', lada: '891' },
                { name: 'Bustamante', lada: '891' },
                { name: 'Camargo', lada: '899' },
                { name: 'Casas', lada: '834' },
                { name: 'Ciudad Madero', lada: '833' },
                { name: 'Cruillas', lada: '891' },
                { name: 'Gómez Farías', lada: '489' },
                { name: 'González', lada: '831' },
                { name: 'Guerrero', lada: '899' },
                { name: 'Gustavo Díaz Ordaz', lada: '899' },
                { name: 'Hidalgo', lada: '835' },
                { name: 'Jaumave', lada: '834' },
                { name: 'Jiménez', lada: '891' },
                { name: 'Llera', lada: '834' },
                { name: 'Mainero', lada: '891' },
                { name: 'Matamoros', lada: '868' },
                { name: 'Méndez', lada: '891' },
                { name: 'Mier', lada: '899' },
                { name: 'Miguel Alemán', lada: '899' },
                { name: 'Miquihuana', lada: '489' },
                { name: 'Nuevo Laredo', lada: '867' },
                { name: 'Nuevo Morelos', lada: '489' },
                { name: 'Ocampo', lada: '483' },
                { name: 'Padilla', lada: '834' },
                { name: 'Palmillas', lada: '834' },
                { name: 'Reynosa', lada: '899' },
                { name: 'Río Bravo', lada: '899' },
                { name: 'San Carlos', lada: '834' },
                { name: 'San Fernando', lada: '841' },
                { name: 'San Nicolás', lada: '834' },
                { name: 'Soto la Marina', lada: '835' },
                { name: 'Tampico', lada: '833' },
                { name: 'Tula', lada: '489' },
                { name: 'Valle Hermoso', lada: '894' },
                { name: 'Victoria', lada: '834' },
                { name: 'Villagrán', lada: '834' },
                { name: 'Xicoténcatl', lada: '489' },
            ],
        },
        {
            state: 'Tlaxcala',
            municipalities: [
                { name: 'Acuamanala de Miguel Hidalgo', lada: '246' },
                { name: 'Altzayanca', lada: '241' },
                { name: 'Amaxac de Guerrero', lada: '246' },
                { name: 'Apetatitlán de Antonio Carvajal', lada: '246' },
                { name: 'Apizaco', lada: '241' },
                { name: 'Atlangatepec', lada: '241' },
                { name: 'Benito Juárez', lada: '246' },
                { name: 'Calpulalpan', lada: '748' },
                { name: 'Chiautempan', lada: '246' },
                { name: 'Contla de Juan Cuamatzi', lada: '246' },
                { name: 'Cuapiaxtla', lada: '241' },
                { name: 'Cuaxomulco', lada: '241' },
                { name: 'El Carmen Tequexquitla', lada: '241' },
                { name: 'Emiliano Zapata', lada: '246' },
                { name: 'Españita', lada: '246' },
                { name: 'Huamantla', lada: '247' },
                { name: 'Hueyotlipan', lada: '246' },
                { name: 'Ixtacuixtla de Mariano Matamoros', lada: '246' },
                { name: 'Ixtenco', lada: '241' },
                { name: 'La Magdalena Tlaltelulco', lada: '246' },
                { name: 'Lázaro Cárdenas', lada: '246' },
                { name: 'Mazatecochco de José María Morelos', lada: '246' },
                { name: 'Muñoz de Domingo Arenas', lada: '246' },
                { name: 'Nanacamilpa de Mariano Arista', lada: '748' },
                { name: 'Natívitas', lada: '246' },
                { name: 'Panotla', lada: '246' },
                { name: 'Papalotla de Xicohténcatl', lada: '246' },
                { name: 'San Damián Texóloc', lada: '246' },
                { name: 'San Francisco Tetlanohcan', lada: '246' },
                { name: 'San Jerónimo Zacualpan', lada: '246' },
                { name: 'San José Teacalco', lada: '241' },
                { name: 'San Juan Huactzinco', lada: '246' },
                { name: 'San Lorenzo Axocomanitla', lada: '246' },
                { name: 'San Lucas Tecopilco', lada: '241' },
                { name: 'San Pablo del Monte', lada: '222' },
                { name: 'Sanctorum de Lázaro Cárdenas', lada: '246' },
                { name: 'Santa Ana Nopalucan', lada: '246' },
                { name: 'Santa Apolonia Teacalco', lada: '246' },
                { name: 'Santa Catarina Ayometla', lada: '246' },
                { name: 'Santa Cruz Quilehtla', lada: '246' },
                { name: 'Santa Cruz Tlaxcala', lada: '246' },
                { name: 'Santa Isabel Xiloxoxtla', lada: '246' },
                { name: 'Tenancingo', lada: '246' },
                { name: 'Teolocholco', lada: '246' },
                { name: 'Tepetitla de Lardizábal', lada: '246' },
                { name: 'Tepeyanco', lada: '246' },
                { name: 'Terrenate', lada: '241' },
                { name: 'Tetla de la Solidaridad', lada: '241' },
                { name: 'Tetlatlahuca', lada: '246' },
                { name: 'Tlaxcala', lada: '246' },
                { name: 'Tlaxco', lada: '241' },
                { name: 'Tocatlán', lada: '241' },
                { name: 'Totolac', lada: '246' },
                { name: 'Zacatelco', lada: '246' },
                { name: 'Zitlaltepec de Trinidad Sánchez Santos', lada: '241' },
            ],
        },
        {
            state: 'Veracruz',
            municipalities: [
                { name: 'Acajete', lada: '273' },
                { name: 'Acatlán', lada: '273' },
                { name: 'Acayucan', lada: '924' },
                { name: 'Actopan', lada: '279' },
                { name: 'Acula', lada: '288' },
                { name: 'Alpatláhuac', lada: '273' },
                { name: 'Álamo Temapache', lada: '765' },
                { name: 'Altotonga', lada: '282' },
                { name: 'Alvarado', lada: '297' },
                { name: 'Amatlán de los Reyes', lada: '271' },
                { name: 'Antón Lizardo', lada: '229' },
                { name: 'Apazapan', lada: '279' },
                { name: 'Aquila', lada: '283' },
                { name: 'Astacinga', lada: '272' },
                { name: 'Atlahuilco', lada: '272' },
                { name: 'Atoyac', lada: '271' },
                { name: 'Atzacan', lada: '272' },
                { name: 'Atzalan', lada: '282' },
                { name: 'Ayahualulco', lada: '271' },
                { name: 'Banderilla', lada: '228' },
                { name: 'Benito Juárez', lada: '784' },
                { name: 'Boca del Río', lada: '229' },
                { name: 'Calcahualco', lada: '273' },
                { name: 'Camerino Z. Mendoza', lada: '272' },
                { name: 'Carrillo Puerto', lada: '271' },
                { name: 'Catemaco', lada: '294' },
                { name: 'Cazones de Herrera', lada: '782' },
                { name: 'Cerro Azul', lada: '785' },
                { name: 'Chacaltianguis', lada: '288' },
                { name: 'Chalma', lada: '784' },
                { name: 'Chiconamel', lada: '489' },
                { name: 'Chiconquiaco', lada: '279' },
                { name: 'Chicontepec', lada: '785' },
                { name: 'Chinameca', lada: '924' },
                { name: 'Chinampa de Gorostiza', lada: '784' },
                { name: 'Coacoatzintla', lada: '279' },
                { name: 'Coahuitlán', lada: '784' },
                { name: 'Coatepec', lada: '228' },
                { name: 'Coatzacoalcos', lada: '921' },
                { name: 'Coatzintla', lada: '782' },
                { name: 'Córdoba', lada: '271' },
                { name: 'Cosamaloapan', lada: '288' },
                { name: 'Cosautlán de Carvajal', lada: '279' },
                { name: 'Coscomatepec', lada: '273' },
                { name: 'Cosoleacaque', lada: '922' },
                { name: 'Cotaxtla', lada: '229' },
                { name: 'Coyutla', lada: '784' },
                { name: 'Cuichapa', lada: '271' },
                { name: 'Cuitláhuac', lada: '271' },
                { name: 'El Higo', lada: '489' },
                { name: 'Emiliano Zapata', lada: '228' },
                { name: 'Espinal', lada: '784' },
                { name: 'Filomeno Mata', lada: '784' },
                { name: 'Fortín', lada: '271' },
                { name: 'Gutiérrez Zamora', lada: '766' },
                { name: 'Hidalgotitlán', lada: '922' },
                { name: 'Huatusco', lada: '273' },
                { name: 'Huayacocotla', lada: '789' },
                { name: 'Hueyapan de Ocampo', lada: '294' },
                { name: 'Huiloapan de Cuauhtémoc', lada: '272' },
                { name: 'Ignacio de la Llave', lada: '297' },
                { name: 'Ilamatlán', lada: '785' },
                { name: 'Isla', lada: '283' },
                { name: 'Ixcatepec', lada: '784' },
                { name: 'Ixhuacán de los Reyes', lada: '271' },
                { name: 'Ixhuatlán de Madero', lada: '785' },
                { name: 'Ixhuatlán del Café', lada: '271' },
                { name: 'Ixhuatlán del Sureste', lada: '922' },
                { name: 'Ixhuatlancillo', lada: '272' },
                { name: 'Ixmatlahuacan', lada: '297' },
                { name: 'Ixtaczoquitlán', lada: '272' },
                { name: 'Jalacingo', lada: '282' },
                { name: 'Jalcomulco', lada: '279' },
                { name: 'Jáltipan', lada: '924' },
                { name: 'Jamapa', lada: '229' },
                { name: 'Jesús Carranza', lada: '924' },
                { name: 'Jilotepec', lada: '228' },
                { name: 'José Azueta', lada: '288' },
                { name: 'Juan Rodríguez Clara', lada: '288' },
                { name: 'Juchique de Ferrer', lada: '279' },
                { name: 'La Antigua', lada: '296' },
                { name: 'Landero y Coss', lada: '279' },
                { name: 'Las Choapas', lada: '923' },
                { name: 'Las Minas', lada: '282' },
                { name: 'Las Vigas de Ramírez', lada: '282' },
                { name: 'Lerdo de Tejada', lada: '296' },
                { name: 'Los Reyes', lada: '272' },
                { name: 'Magdalena', lada: '272' },
                { name: 'Maltrata', lada: '272' },
                { name: 'Manlio Fabio Altamirano', lada: '229' },
                { name: 'Mariano Escobedo', lada: '272' },
                { name: 'Martínez de la Torre', lada: '232' },
                { name: 'Mecatlán', lada: '784' },
                { name: 'Mecayapan', lada: '924' },
                { name: 'Medellín de Bravo', lada: '229' },
                { name: 'Miahuatlán', lada: '274' },
                { name: 'Minatitlán', lada: '922' },
                { name: 'Misantla', lada: '235' },
                { name: 'Mixtla de Altamirano', lada: '272' },
                { name: 'Moloacán', lada: '922' },
                { name: 'Naolinco', lada: '228' },
                { name: 'Naranjal', lada: '271' },
                { name: 'Naranjos Amatlán', lada: '768' },
                { name: 'Nautla', lada: '235' },
                { name: 'Nogales', lada: '272' },
                { name: 'Oluta', lada: '924' },
                { name: 'Omealca', lada: '271' },
                { name: 'Orizaba', lada: '272' },
                { name: 'Otatitlán', lada: '288' },
                { name: 'Oteapan', lada: '922' },
                { name: 'Ozuluama', lada: '489' },
                { name: 'Pajapan', lada: '924' },
                { name: 'Pánuco', lada: '846' },
                { name: 'Papantla', lada: '784' },
                { name: 'Paso de Ovejas', lada: '296' },
                { name: 'Paso del Macho', lada: '271' },
                { name: 'Perote', lada: '282' },
                { name: 'Platón Sánchez', lada: '789' },
                { name: 'Playa Vicente', lada: '288' },
                { name: 'Poza Rica de Hidalgo', lada: '782' },
                { name: 'Pueblo Viejo', lada: '833' },
                { name: 'Puente Nacional', lada: '296' },
                { name: 'Rafael Delgado', lada: '272' },
                { name: 'Rafael Lucio', lada: '228' },
                { name: 'Río Blanco', lada: '272' },
                { name: 'Saltabarranca', lada: '296' },
                { name: 'San Andrés Tenejapan', lada: '272' },
                { name: 'San Andrés Tuxtla', lada: '294' },
                { name: 'San Juan Evangelista', lada: '288' },
                { name: 'San Rafael', lada: '232' },
                { name: 'Santiago Sochiapan', lada: '288' },
                { name: 'Santiago Tuxtla', lada: '294' },
                { name: 'Sayula de Alemán', lada: '924' },
                { name: 'Sochiapa', lada: '228' },
                { name: 'Soconusco', lada: '924' },
                { name: 'Soledad Atzompa', lada: '272' },
                { name: 'Soledad de Doblado', lada: '229' },
                { name: 'Soteapan', lada: '924' },
                { name: 'Tamiahua', lada: '768' },
                { name: 'Tampico Alto', lada: '833' },
                { name: 'Tancoco', lada: '784' },
                { name: 'Tantima', lada: '784' },
                { name: 'Tantoyuca', lada: '789' },
                { name: 'Tatatila', lada: '279' },
                { name: 'Tecolutla', lada: '766' },
                { name: 'Tehuipango', lada: '272' },
                { name: 'Tempoal', lada: '789' },
                { name: 'Tenampa', lada: '273' },
                { name: 'Tenochtitlán', lada: '279' },
                { name: 'Teocelo', lada: '279' },
                { name: 'Tepatlaxco', lada: '271' },
                { name: 'Texcatepec', lada: '789' },
                { name: 'Texhuacán', lada: '272' },
                { name: 'Texistepec', lada: '924' },
                { name: 'Tezonapa', lada: '271' },
                { name: 'Tierra Blanca', lada: '274' },
                { name: 'Tihuatlán', lada: '782' },
                { name: 'Tlacojalpan', lada: '288' },
                { name: 'Tlacolulan', lada: '228' },
                { name: 'Tlacotalpan', lada: '288' },
                { name: 'Tlacotepec de Mejía', lada: '271' },
                { name: 'Tlalixcoyan', lada: '297' },
                { name: 'Tlalnelhuayocan', lada: '228' },
                { name: 'Tlaltetela', lada: '271' },
                { name: 'Tlapacoyan', lada: '232' },
                { name: 'Tlaquilpa', lada: '272' },
                { name: 'Tlilapan', lada: '272' },
                { name: 'Tomatlán', lada: '271' },
                { name: 'Tonayán', lada: '279' },
                { name: 'Totutla', lada: '271' },
                { name: 'Tres Valles', lada: '274' },
                { name: 'Tuxpan', lada: '783' },
                { name: 'Tuxtilla', lada: '288' },
                { name: 'Ursulo Galván', lada: '296' },
                { name: 'Uxpanapa', lada: '924' },
                { name: 'Vega de Alatorre', lada: '296' },
                { name: 'Veracruz', lada: '229' },
                { name: 'Villa Aldama', lada: '282' },
                { name: 'Xalapa', lada: '228' },
                { name: 'Xico', lada: '279' },
                { name: 'Xoxocotla', lada: '272' },
                { name: 'Yanga', lada: '271' },
                { name: 'Yecuatla', lada: '279' },
                { name: 'Zacualpan', lada: '789' },
                { name: 'Zaragoza', lada: '924' },
                { name: 'Zentla', lada: '271' },
                { name: 'Zongolica', lada: '272' },
                { name: 'Zontecomatlán de López y Fuentes', lada: '789' },
                { name: 'Zozocolco de Hidalgo', lada: '784' },
            ],
        },
        {
            state: 'Yucatán',
            municipalities: [
                { name: 'Abalá', lada: '988' },
                { name: 'Acanceh', lada: '999' },
                { name: 'Akil', lada: '997' },
                { name: 'Baca', lada: '999' },
                { name: 'Bokobá', lada: '999' },
                { name: 'Buctzotz', lada: '986' },
                { name: 'Cacalchén', lada: '999' },
                { name: 'Calotmul', lada: '986' },
                { name: 'Cansahcab', lada: '986' },
                { name: 'Cantamayec', lada: '997' },
                { name: 'Celestún', lada: '988' },
                { name: 'Cenotillo', lada: '986' },
                { name: 'Chacsinkín', lada: '997' },
                { name: 'Chankom', lada: '997' },
                { name: 'Chapab', lada: '997' },
                { name: 'Chemax', lada: '986' },
                { name: 'Chicxulub Pueblo', lada: '999' },
                { name: 'Chichimilá', lada: '986' },
                { name: 'Chikindzonot', lada: '986' },
                { name: 'Chocholá', lada: '988' },
                { name: 'Chumayel', lada: '997' },
                { name: 'Conkal', lada: '999' },
                { name: 'Cuncunul', lada: '986' },
                { name: 'Cuzamá', lada: '999' },
                { name: 'Dzemul', lada: '999' },
                { name: 'Dzidzantún', lada: '986' },
                { name: 'Dzilam de Bravo', lada: '986' },
                { name: 'Dzilam González', lada: '986' },
                { name: 'Dzitás', lada: '986' },
                { name: 'Dzoncauich', lada: '986' },
                { name: 'Espita', lada: '986' },
                { name: 'Halachó', lada: '988' },
                { name: 'Hocabá', lada: '999' },
                { name: 'Hoctún', lada: '999' },
                { name: 'Homún', lada: '999' },
                { name: 'Huhí', lada: '999' },
                { name: 'Hunucmá', lada: '988' },
                { name: 'Ixil', lada: '999' },
                { name: 'Izamal', lada: '999' },
                { name: 'Kanasín', lada: '999' },
                { name: 'Kantunil', lada: '999' },
                { name: 'Kaua', lada: '986' },
                { name: 'Kinchil', lada: '988' },
                { name: 'Kopomá', lada: '988' },
                { name: 'Mama', lada: '997' },
                { name: 'Maní', lada: '997' },
                { name: 'Maxcanú', lada: '988' },
                { name: 'Mayapán', lada: '997' },
                { name: 'Mérida', lada: '999' },
                { name: 'Mocochá', lada: '999' },
                { name: 'Motul', lada: '999' },
                { name: 'Muna', lada: '997' },
                { name: 'Muxupip', lada: '999' },
                { name: 'Opichén', lada: '988' },
                { name: 'Oxkutzcab', lada: '997' },
                { name: 'Panabá', lada: '986' },
                { name: 'Peto', lada: '997' },
                { name: 'Progreso', lada: '999' },
                { name: 'Quintana Roo', lada: '986' },
                { name: 'Río Lagartos', lada: '986' },
                { name: 'Sacalum', lada: '997' },
                { name: 'Samahil', lada: '988' },
                { name: 'Sanahcat', lada: '999' },
                { name: 'San Felipe', lada: '986' },
                { name: 'Santa Elena', lada: '997' },
                { name: 'Seyé', lada: '999' },
                { name: 'Sinanché', lada: '999' },
                { name: 'Sotuta', lada: '999' },
                { name: 'Sucilá', lada: '986' },
                { name: 'Sudzal', lada: '999' },
                { name: 'Suma', lada: '999' },
                { name: 'Tahdziú', lada: '997' },
                { name: 'Tahmek', lada: '999' },
                { name: 'Teabo', lada: '997' },
                { name: 'Tecoh', lada: '999' },
                { name: 'Tekal de Venegas', lada: '986' },
                { name: 'Tekantó', lada: '986' },
                { name: 'Tekax', lada: '997' },
                { name: 'Tekit', lada: '997' },
                { name: 'Tekom', lada: '986' },
                { name: 'Telchac Pueblo', lada: '999' },
                { name: 'Telchac Puerto', lada: '999' },
                { name: 'Temax', lada: '986' },
                { name: 'Temozón', lada: '986' },
                { name: 'Tepakán', lada: '999' },
                { name: 'Tetiz', lada: '988' },
                { name: 'Teya', lada: '999' },
                { name: 'Ticul', lada: '997' },
                { name: 'Timucuy', lada: '999' },
                { name: 'Tinum', lada: '986' },
                { name: 'Tixcacalcupul', lada: '986' },
                { name: 'Tixkokob', lada: '999' },
                { name: 'Tixméhuac', lada: '997' },
                { name: 'Tixpéhual', lada: '999' },
                { name: 'Tizimín', lada: '986' },
                { name: 'Tunkás', lada: '986' },
                { name: 'Tzucacab', lada: '997' },
                { name: 'Uayma', lada: '986' },
                { name: 'Ucú', lada: '988' },
                { name: 'Umán', lada: '988' },
                { name: 'Valladolid', lada: '986' },
                { name: 'Xocchel', lada: '999' },
                { name: 'Yaxcabá', lada: '997' },
                { name: 'Yaxkukul', lada: '999' },
                { name: 'Yobaín', lada: '999' },
            ],
        },
        {
            state: 'Zacatecas',
            municipalities: [
                { name: 'Apozol', lada: '467' },
                { name: 'Apulco', lada: '467' },
                { name: 'Atolinga', lada: '467' },
                { name: 'Benito Juárez', lada: '467' },
                { name: 'Calera', lada: '478' },
                { name: 'Cañitas de Felipe Pescador', lada: '498' },
                { name: 'Concepción del Oro', lada: '492' },
                { name: 'Cuauhtémoc', lada: '457' },
                { name: 'Chalchihuites', lada: '457' },
                { name: 'Fresnillo', lada: '493' },
                { name: 'Genaro Codina', lada: '457' },
                { name: 'General Enrique Estrada', lada: '457' },
                { name: 'General Francisco R. Murguía', lada: '457' },
                { name: 'General Pánfilo Natera', lada: '457' },
                { name: 'Guadalupe', lada: '492' },
                { name: 'Huanusco', lada: '467' },
                { name: 'Jalpa', lada: '467' },
                { name: 'Jerez', lada: '494' },
                { name: 'Jiménez del Teul', lada: '457' },
                { name: 'Juan Aldama', lada: '498' },
                { name: 'Juchipila', lada: '467' },
                { name: 'Loreto', lada: '496' },
                { name: 'Luis Moya', lada: '458' },
                { name: 'Mazapil', lada: '457' },
                { name: 'Melchor Ocampo', lada: '457' },
                { name: 'Mezquital del Oro', lada: '467' },
                { name: 'Miguel Auza', lada: '498' },
                { name: 'Momax', lada: '467' },
                { name: 'Monte Escobedo', lada: '457' },
                { name: 'Morelos', lada: '492' },
                { name: 'Moyahua de Estrada', lada: '467' },
                { name: 'Nochistlán de Mejía', lada: '467' },
                { name: 'Noria de Ángeles', lada: '457' },
                { name: 'Ojocaliente', lada: '458' },
                { name: 'Pánuco', lada: '492' },
                { name: 'Pinos', lada: '496' },
                { name: 'Río Grande', lada: '498' },
                { name: 'Sain Alto', lada: '457' },
                { name: 'Santa María de la Paz', lada: '467' },
                { name: 'Sombrerete', lada: '457' },
                { name: 'Susticacán', lada: '457' },
                { name: 'Tabasco', lada: '467' },
                { name: 'Tepechitlán', lada: '467' },
                { name: 'Tepetongo', lada: '467' },
                { name: 'Teul de González Ortega', lada: '467' },
                { name: 'Tlaltenango de Sánchez Román', lada: '467' },
                { name: 'Trinidad García de la Cadena', lada: '467' },
                { name: 'Valparaíso', lada: '457' },
                { name: 'Vetagrande', lada: '492' },
                { name: 'Villa de Cos', lada: '492' },
                { name: 'Villa García', lada: '496' },
                { name: 'Villa González Ortega', lada: '496' },
                { name: 'Villa Hidalgo', lada: '496' },
                { name: 'Villanueva', lada: '467' },
                { name: 'Zacatecas', lada: '492' },
            ],
        },
    ];


    const GetNumbers = async () => {
        setLoading(true);
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        try {
            const request = `${import.meta.env.VITE_SMS_API_URL +
                import.meta.env.VITE_API_GET_NUMBERS}${obj?.email}`;
            const response = await axios.get(request);

            if (response.status === 200) {
                const fetchedNumbers = response.data;
                setNumbersData(fetchedNumbers);
                setFilteredData(fetchedNumbers);
            }
        } catch {
            alert("Error");
        } finally {
            setLoading(false);
        }
    }
    const calculatePagination = () => {
        const total = Math.ceil(filteredData.length / itemsPerPage);
        settotalPages(total);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);
        setcurrentItems(currentItems);
    };

    useEffect(() => {

        GetNumbers();
    }, []);

    useEffect(() => {
        settotalPages(Math.ceil(filteredData.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setcurrentItems(filteredData.slice(startIndex, endIndex));
    }, [filteredData, currentPage]);


    const handlePageChange = (direction: 'next' | 'prev') => {
        setCurrentPage((prevPage) => {
            if (direction === 'next' && prevPage < totalPages) {
                return prevPage + 1;
            }
            if (direction === 'prev' && prevPage > 1) {
                return prevPage - 1;
            }
            return prevPage;
        });
    };
    const handleStateChange = (state: string) => {
        setSelectedState(state);
        const stateData = statesOfMexico.find((s) => s.state === state);
        setMunicipalities(stateData ? stateData.municipalities : []);
        setSelectedMunicipality('');
        setSelectedLada('');
        handleStateMenuClose();
    };

    const handleMunicipalityChange = (municipality: { name: string; lada: string }) => {
        setSelectedMunicipality(municipality.name);
        setSelectedLada(municipality.lada);
        handleMunicipalityMenuClose();
    };


    // Función para obtener las tarjetas de crédito
    const fetchCreditCards = async () => {
        const userData = localStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : null;

        if (!user?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CREDITCARD}${user.id}`;
            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                setCreditCards(response.data); // Asigna las tarjetas de crédito al estado
            }
        } catch (error) {
            console.error("Error al obtener las tarjetas de crédito:", error);
        }
    };


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        setNumberQuantity((prev) => {
            let newQuantity = prev;
            if (type === 'increment') newQuantity = prev + 1;
            if (type === 'decrement' && prev > 1) newQuantity = prev - 1;

            // Actualiza el costo mensual en base a la cantidad
            if (!isLongNumber) {

                setMonthlyCost(newQuantity * costPerNumbershort);
            }
            if (isLongNumber) {
                setMonthlyCost(newQuantity * costPerNumberlong)
            }
            return newQuantity;
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            // Realiza la solicitud para obtener las tarjetas de crédito
            await fetchCreditCards();
            // Avanza al siguiente paso
            setCurrentStep(2);
        }
    };


    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };


    const handleSelectCard = (card: CreditCard) => {
        setSelectedCard(card);
    };

    const filteredStates = statesOfMexico.filter((state) =>
        state.state.toLowerCase().includes(stateSearch.toLowerCase())
    );

    const filteredMunicipalities = municipalities.filter((municipality) =>
        municipality.name.toLowerCase().includes(municipalitySearch.toLowerCase())
    );

    const filteredStates2 = statesOfMexico.filter((state) =>
        state.state.toLowerCase().includes(stateSearch2.toLowerCase())
    );

    const handleRent = async () => {
        try {
            const payload = {
                quantity: numberQuantity,
                costSetup,
                monthlyCost,
                cardId: selectedCard?.id,
            };

            await axios.post('/api/rent', payload); // Ajusta la URL según tu API
            alert('Renta realizada exitosamente.');
            handleCloseModal();
        } catch {
            setErrorModal({
                title: "Error al realizar renta",
                message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
            });
        }
    };

    const closeErrorModal = () => {
        setErrorModal(null);
    };

    const handleStateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElState(event.currentTarget);
        setOpenStateMenu(true);
    };

    const handleStateMenuClose = () => {
        setAnchorElState(null);
        setOpenStateMenu(false);
        setStateSearch('');
    };

    const handleStateSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateSearch(event.target.value);
    };

    const handleMunicipalitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMunicipalitySearch(event.target.value);
    };

    const handleMunicipalityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMunicipality(event.currentTarget);
    };


    const handleMunicipalityMenuClose = () => {
        setAnchorElMunicipality(null);
        setMunicipalitySearch('');
    };

    const handleModalAyudaOpen = () => {
        setIsModalAyudaOpen(true);
    };

    const handleModalAyudaClose = () => {
        setIsModalAyudaOpen(false);
    };

    const handleStateSearchChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateSearch2(event.target.value);
    };
    const handleStateChange2 = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[]; // Asegúrate de que sea un arreglo de strings
        setSelectedStates2(value);
    };

    const handleClearSelection = () => {
        setSelectedStates2([]);
        setMunicipalities2([]);
        setFilteredData(numbersData);
    };

    const handleApplySelection = () => {
        const selectedMunicipalities: string[] = [];
        selectedStates2.forEach((state) => {
            const stateData = statesOfMexico.find((s) => s.state === state);
            if (stateData) {
                stateData.municipalities.forEach((municipality) => {
                    selectedMunicipalities.push(municipality.name);
                });
            }
        });
        setSelectedMunicipalities2(selectedMunicipalities);
        setStateMenuOpen(false); // Cerrar el menú después de aplicar
    };

    const handleMunicipalitySearchChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMunicipalitySearch2(event.target.value);
    };

    const handleMunicipalityChange2 = (event: SelectChangeEvent<string[]>) => {
        setSelectedMunicipalities2(event.target.value as string[]);
    };



    const handleClearMunicipalitySelection = () => {
        setSelectedMunicipalities2([]);
    };

    const handleApplyMunicipalitySelection = () => {
        setMunicipalityMenuOpen(false); // Cerrar el menú de municipios después de aplicar
    };

    const filteredMunicipalities2 = selectedStates2
        .flatMap((state) => {
            const stateData = statesOfMexico.find((s) => s.state === state);
            return stateData ? stateData.municipalities : [];
        })
        .filter((municipality) =>
            municipality.name.toLowerCase().includes(municipalitySearch2.toLowerCase())
        );

    const handleRowSelection = (id: number) => {
        setSelectedRows((prevSelectedRows) => {
            const updatedSelection = prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id];

            setIsAnyRowSelected(updatedSelection.length > 0); // Verifica si hay filas seleccionadas
            return updatedSelection;
        });
    };

    const handleSelectAllRows = () => {
        const updatedSelection =
            selectedRows.length === currentItems.length
                ? []
                : currentItems.map((item) => item.id);

        setSelectedRows(updatedSelection);
        setIsAnyRowSelected(updatedSelection.length > 0); // Verifica si hay filas seleccionadas
    };

    const handleOpenAcceptModal = (action: 'darDeBaja' | 'eliminar') => {
        setActionType(action);
        setIsAcceptModalOpen(true);
    };

    const handleCloseAcceptModal = () => {
        setActionType('');
        setIsAcceptModalOpen(false);
    };

    const handleCloseToast = () => {
        setToastOpen(false);
    };

    const handleAccept = async () => {
        try {
            if (actionType === 'darDeBaja') {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una espera
                setToastMessage('El número fue dado de baja correctamente.');
                setToastSeverity('success');
            }
            if (actionType === 'eliminar') {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una espera
                setToastMessage('El número fue eliminado correctamente.');
                setToastSeverity('success');
            }
            setToastOpen(true); // Muestra el toast
            setIsModalOpen(false); // Cierra el modal
        } catch {
            if (actionType === 'darDeBaja') {
                setErrorModal({
                    title: "Error al procesar la solicitud",
                    message: "Error al dar de baja los números",
                });
            }
            if (actionType === 'eliminar') {
                setErrorModal({
                    title: "Error al procesar la solicitud",
                    message: "Error al eliminar los números",
                });
            }
        } finally {
            setIsModalOpen(false);
        }
    };

    const getModalContent = () => {
        if (actionType === 'darDeBaja') {
            return {
                title: 'Dar de baja números',
                message: '¿Está seguro de que desea dar de baja los números seleccionados? Pasarán 30 días en cuarentena sin poder ser utilizados.',
            };
        }
        if (actionType === 'eliminar') {
            return {
                title: 'Eliminar números',
                message: '¿Está seguro de que desea eliminar los números seleccionados? Esta acción no podrá ser revertida.',
            };
        }
        return { title: '', message: '' };
    };

    const modalContent = getModalContent();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };


    const handleApplyStateFilter = () => {
        const filtered = filteredData.filter((item) => selectedStates2.includes(item.state));
        setFilteredData(filtered);
    };

    const handleApplyMunicipalityFilter = () => {
        const filtered = filteredData.filter((item) => selectedMunicipalities2.includes(item.municipality));
        setFilteredData(filtered);
    };

    function formatDate(dateString) {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Muestra AM/PM
        });
    }

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <Typography
                        sx={{
                            textAlign: "left",
                            fontFamily: "Poppins",
                            fontWeight: 500,  // “medium”
                            fontSize: "26px",
                            lineHeight: "55px",
                            letterSpacing: "0px",
                            color: "#330F1B",
                            opacity: 1,
                            marginBottom: "20px",
                            // textTransform: "none" // Omitido por completo
                        }}
                    >
                        Mis números
                    </Typography>
                    <hr style={{
                        border: 'none',
                        height: '1px',
                        backgroundColor: '#dcdcdc',
                        marginBottom: '20px'
                    }} />
                    {/* Filtros */}
                    <div style={{ marginBottom: '20px' }}>
                        {/* Fila superior con Estado, Municipio, Buscador y Rentar Números */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            {/* Botones de Estado y Municipio */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            {/* Select de estados con búsqueda */}

                                            <Select
                                                multiple
                                                displayEmpty
                                                value={selectedStates2}
                                                onChange={(e) => {
                                                    handleStateChange2(e);
                                                }}
                                                open={stateMenuOpen}
                                                onOpen={() => setStateMenuOpen(true)}
                                                onClose={() => setStateMenuOpen(false)}
                                                renderValue={() => (
                                                    <div
                                                        style={{
                                                            minWidth: "100px",
                                                            height: "40px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        ESTADO
                                                    </div>
                                                )}
                                                fullWidth
                                                sx={{
                                                    width: '132px', // Ancho especificado
                                                    height: '36px', // Alto especificado
                                                    background: '#FFFFFF 0% 0% no-repeat padding-box',
                                                    border: '1px solid #C6BFC2',
                                                    borderRadius: '18px',
                                                    opacity: 1,
                                                    '& .MuiSelect-icon': {
                                                        display: 'none', // Oculta la flecha hacia abajo
                                                    },
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: '300px', // Límite de altura total
                                                            overflowY: 'auto', // Habilita solo un scroll interno
                                                            paddingBottom: 0, // Para evitar espacio extra en los botones
                                                        },
                                                    },
                                                }}
                                            >
                                                <Box p={1} sx={{ overflowY: 'auto', maxHeight: '200px' }}>
                                                    <TextField
                                                        placeholder="Buscar estado"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={stateSearch2}
                                                        onChange={handleStateSearchChange2}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Box>
                                                {statesOfMexico.map((state) => (
                                                    <MenuItem key={state.state} value={state.state}>
                                                        <Checkbox checked={selectedStates2.includes(state.state)} />
                                                        <ListItemText primary={state.state} />
                                                    </MenuItem>
                                                ))}
                                                <Box
                                                    p={1}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        borderTop: '1px solid #e0e0e0',
                                                        backgroundColor: '#fff',
                                                        position: 'sticky',
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearSelection();
                                                        }}
                                                        style={{ color: '#8d406d', borderColor: '#8d406d' }}
                                                    >
                                                        LIMPIAR
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApplySelection();
                                                            handleApplyStateFilter();
                                                        }}
                                                        style={{ backgroundColor: '#8d406d', color: '#fff' }}
                                                    >
                                                        APLICAR
                                                    </Button>
                                                </Box>
                                            </Select>


                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* Select de municipios generados con búsqueda */}
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={selectedMunicipalities2}
                                                onChange={(e) => {
                                                    console.log("Evento recibido en Select (MUNICIPIO):", e);
                                                    handleMunicipalityChange2(e);
                                                }}
                                                open={municipalityMenuOpen}
                                                onOpen={() => setMunicipalityMenuOpen(true)}
                                                onClose={() => setMunicipalityMenuOpen(false)}
                                                renderValue={() => (
                                                    <div
                                                        style={{
                                                            minWidth: "100px",
                                                            height: "40px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        MUNICIPIO
                                                    </div>
                                                )}
                                                fullWidth
                                                sx={{
                                                    width: '132px', // Ancho especificado
                                                    height: '36px', // Alto especificado
                                                    background: '#FFFFFF 0% 0% no-repeat padding-box',
                                                    border: '1px solid #C6BFC2',
                                                    borderRadius: '18px',
                                                    opacity: 1,
                                                    '& .MuiSelect-icon': {
                                                        display: 'none', // Oculta la flecha hacia abajo
                                                    },
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: '300px', // Límite de altura total
                                                            overflowY: 'auto', // Habilita solo un scroll interno
                                                            paddingBottom: 0, // Para evitar espacio extra en los botones
                                                        },
                                                    },
                                                }}
                                            >
                                                <Box p={1} sx={{ overflowY: 'auto', maxHeight: '200px' }}>
                                                    <TextField
                                                        placeholder="Buscar municipio"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={municipalitySearch2}
                                                        onChange={handleMunicipalitySearchChange2}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Box>
                                                {filteredMunicipalities2.map((municipality) => (
                                                    <MenuItem key={municipality.name} value={municipality.name}>
                                                        <Checkbox checked={selectedMunicipalities2.includes(municipality.name)} />
                                                        <ListItemText primary={municipality.name} />
                                                    </MenuItem>
                                                ))}
                                                <Box
                                                    p={1}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        borderTop: '1px solid #e0e0e0',
                                                        backgroundColor: '#fff',
                                                        position: 'sticky',
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Evita que el botón cierre el menú
                                                            handleClearMunicipalitySelection();
                                                        }}
                                                        style={{ color: '#8d406d', borderColor: '#8d406d' }}
                                                    >
                                                        LIMPIAR
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Evita que el botón cierre el menú
                                                            handleApplyMunicipalitySelection();
                                                            handleApplyMunicipalityFilter();
                                                        }}
                                                        style={{ backgroundColor: '#8d406d', color: '#fff' }}
                                                    >
                                                        APLICAR
                                                    </Button>
                                                </Box>
                                            </Select>

                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>

                            {/* Buscador y Botón de Rentar Números */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={handleOpenModal}
                                    style={{
                                        padding: '10px 20px', // Un poco más grande
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: '#8d406d',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                    }}>
                                    <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span> Rentar Números
                                </button>
                                <div style={{ position: 'relative', width: '250px' }}>
                                    <SearchIcon style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#6a6a6a',
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Buscar"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px 8px 32px', // Espacio para la lupa a la izquierda
                                            border: '1px solid #dcdcdc',
                                            borderRadius: '4px',
                                            fontSize: '1rem',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Línea horizontal debajo del buscador y botón */}
                        <div style={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: '#dcdcdc',
                            margin: '10px 0',
                        }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                            {/* Controles de paginación */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span
                                    style={{
                                        textAlign: 'right',
                                        font: 'normal normal medium 14px/54px Poppins',
                                        letterSpacing: '0px',
                                        color: '#6F565E',
                                        opacity: 1,
                                        fontSize: '14px',
                                    }}
                                >
                                    {startIndex + 1}-{Math.min(startIndex + itemsPerPage, setcurrentItems.length)} de {setcurrentItems.length}
                                </span>

                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {/* Botón para ir a la primera página */}
                                    <IconButton
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        sx={{
                                            p: 0, // Sin padding en el botón
                                            display: 'flex', // Asegúrate de alinear las imágenes
                                            gap: 0, // Sin espacio entre elementos
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" gap={0}>
                                            <img
                                                src={currentPage === 1 ? backarrowD : backarrow}
                                                alt="Primera página"
                                                style={{ marginRight: '-16px' }} // Ajusta el margen negativo para unir las imágenes
                                            />
                                            <img
                                                src={currentPage === 1 ? backarrowD : backarrow}
                                                alt="Primera página"
                                            />
                                        </Box>
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        sx={{ p: 0 }}
                                    >
                                        <img
                                            src={currentPage === 1 ? backarrowD : backarrow}
                                            alt="Página anterior"
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={handleNextPage} // Acción para avanzar una página
                                        disabled={currentPage === totalPages}
                                        sx={{
                                            p: 0, // Sin padding en el botón
                                            display: 'flex', // Asegúrate de alinear las imágenes
                                            gap: 0, // Sin espacio entre elementos
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" gap={0}>
                                            <img
                                                src={currentPage === 1 ? backarrow : backarrowD}
                                                alt="Primera página"
                                                style={{
                                                    transform: 'scaleX(-1)', // Voltear horizontalmente
                                                    marginRight: '-4px', // Juntar las flechas
                                                }}
                                            />
                                        </Box>
                                    </IconButton>
                                    {/* Botón para ir a la última página */}
                                    <IconButton
                                        onClick={() => setCurrentPage(totalPages)} // Acción para ir a la última página
                                        disabled={currentPage === totalPages}
                                        sx={{
                                            p: 0, // Sin padding en el botón
                                            display: 'flex', // Asegúrate de alinear las imágenes
                                            gap: 0, // Sin espacio entre elementos
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" gap={0}>
                                            <img
                                                src={currentPage === totalPages ? backarrowD : backarrow}
                                                alt="Última página"
                                                style={{ marginRight: '-4px', transform: 'scaleX(-1)' }} // Ajusta el margen negativo para unir las imágenes
                                            />
                                            <img
                                                src={currentPage === totalPages ? backarrowD : backarrow}
                                                alt="Última página"
                                                style={{ marginLeft: '-12px', transform: 'scaleX(-1)' }} // Ajusta el margen negativo para unir las imágenes
                                            />
                                        </Box>
                                    </IconButton>

                                </div>
                            </div>

                            {/* Botón Servicios Adicionales */}
                            <div>
                                <button
                                    style={{
                                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                                        border: "1px solid #CCCFD2",
                                        borderRadius: "4px",
                                        opacity: 1,
                                        padding: "10px 20px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            "#F2E9EC 0% 0% no-repeat padding-box";
                                        e.currentTarget.style.border = "1px solid #BE93A066";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            "#FFFFFF 0% 0% no-repeat padding-box";
                                        e.currentTarget.style.border = "1px solid #CCCFD2";
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.background =
                                            "#E6C2CD 0% 0% no-repeat padding-box";
                                        e.currentTarget.style.border = "1px solid #BE93A0";
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.background =
                                            "#F2E9EC 0% 0% no-repeat padding-box";
                                        e.currentTarget.style.border = "1px solid #BE93A066";
                                    }}
                                    onClick={handleModalAyudaOpen}
                                >
                                    <span
                                        style={{
                                            textAlign: "center",
                                            fontFamily: "Poppins",
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            // Se elimina el lineHeight para que no modifique la altura del botón
                                            // lineHeight: "54px",
                                            letterSpacing: "1.12px",
                                            color: "#833A53",
                                            textTransform: "uppercase",
                                            opacity: 1,
                                        }}
                                    >
                                        SERVICIOS ADICIONALES
                                    </span>
                                </button>
                            </div>

                        </div>

                    </div>


                    {/* Tabla */}
                    <div style={{ border: '1px solid #dcdcdc', borderRadius: '8px', overflow: 'hidden' }}>
                        {currentItems.length === 0 ? (
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
                                <img src={NoResult} alt="No results" style={{ width: '150px', marginBottom: '16px' }} />
                                <Typography
                                    style={{
                                        textAlign: 'center',
                                        font: 'normal normal medium 14px/18px Poppins',
                                        letterSpacing: '0px',
                                        color: '#7B354D',
                                        opacity: 1,
                                        fontSize: '16px',
                                    }}
                                >
                                    No se encontraron resultados
                                </Typography>
                            </Box>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ backgroundColor: '#f9f9f9', color: '#6a6a6a' }}>
                                    {isAnyRowSelected ? (
                                        <tr>
                                            <th colSpan={7} style={{ textAlign: 'center', padding: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                    <Tooltip title="Dar de baja">
                                                        <button
                                                            style={{
                                                                padding: '8px 12px',
                                                                border: 'none',
                                                                backgroundColor: '#e0e0e0',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleOpenAcceptModal('darDeBaja')}                                            >
                                                            ➖
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <button
                                                            style={{
                                                                padding: '8px 12px',
                                                                border: 'none',
                                                                backgroundColor: '#e0e0e0',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleOpenAcceptModal('eliminar')}                                            >
                                                            🗑️
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th style={{ width: '50px', textAlign: 'left', padding: '10px 10px 10px 0px' }}>
                                                <Checkbox
                                                    checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                                                    indeterminate={selectedRows.length > 0 && selectedRows.length < currentItems.length}
                                                    onChange={handleSelectAllRows}
                                                />
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px',
                                                    font: 'normal normal medium 13px/54px Poppins',
                                                    letterSpacing: '0px',
                                                    color: '#330F1B',
                                                    opacity: 1,
                                                    fontSize: '13px',
                                                    backgroundColor: '#FFFFFF', // Fondo blanco
                                                }}
                                            >
                                                Número
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px',
                                                    font: 'normal normal medium 13px/54px Poppins',
                                                    letterSpacing: '0px',
                                                    color: '#330F1B',
                                                    opacity: 1,
                                                    fontSize: '13px',
                                                    backgroundColor: '#FFFFFF', // Fondo blanco
                                                }}
                                            >
                                                Tipo
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px',
                                                    font: 'normal normal medium 13px/54px Poppins',
                                                    letterSpacing: '0px',
                                                    color: '#330F1B',
                                                    opacity: 1,
                                                    fontSize: '13px',
                                                    backgroundColor: '#FFFFFF', // Fondo blanco
                                                }}
                                            >
                                                Servicio
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px',
                                                    font: 'normal normal medium 13px/54px Poppins',
                                                    letterSpacing: '0px',
                                                    color: '#330F1B',
                                                    opacity: 1,
                                                    fontSize: '13px',
                                                    backgroundColor: '#FFFFFF', // Fondo blanco
                                                }}
                                            >
                                                Costo
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px',
                                                    borderRight: '1px solid #dcdcdc',
                                                    font: 'normal normal medium 13px/54px Poppins',
                                                    letterSpacing: '0px',
                                                    color: '#330F1B',
                                                    opacity: 1,
                                                    fontSize: '13px',
                                                    backgroundColor: '#FFFFFF', // Fondo blanco
                                                }}
                                            >
                                                Fecha del próx. pago
                                            </th>

                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {currentItems.map((number) => (
                                        <tr key={number.id} style={{ borderBottom: '1px solid #dcdcdc' }}>
                                            <td style={{ textAlign: 'left', padding: '10px 10px 10px 0px' }}>
                                                <Checkbox
                                                    checked={selectedRows.includes(number.id)}
                                                    onChange={() => handleRowSelection(number.id)}
                                                />
                                            </td>
                                            <td style={{ padding: '10px' }}>{number.number}</td>
                                            <td style={{ padding: '10px' }}>{number.type}</td>
                                            <td style={{ padding: '10px' }}>{number.service}</td>
                                            <td style={{ padding: '10px' }}>${number.cost}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #dcdcdc' }}>{formatDate(number.nextPaymentDate)}</td>
                                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={handleOpenMenu}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleCloseMenu}
                                                >
                                                    <MenuItem onClick={() => handleOpenAcceptModal('darDeBaja')}   >
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <span style={{ fontSize: '1.2rem' }}>❌</span> Dar de baja
                                                        </span>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleOpenAcceptModal('eliminar')}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <span style={{ fontSize: '1.2rem' }}>🗑️</span> Eliminar
                                                        </span>
                                                    </MenuItem>
                                                </Menu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Modal */}
                    {isModalOpen && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '500px',
                                    maxHeight: '70vh', // Límite para altura del modal
                                    overflowY: 'auto', // Habilita scroll en todo el modal
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {currentStep === 1 && (
                                    <>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Renta de números</h2>

                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                            <button
                                                onClick={() => setIsLongNumber(false)}
                                                style={{
                                                    padding: '10px 20px',
                                                    borderRadius: '4px',
                                                    border: isLongNumber ? '1px solid #dcdcdc' : '1px solid #8d406d',
                                                    backgroundColor: isLongNumber ? '#fff' : '#8d406d',
                                                    color: isLongNumber ? '#8d406d' : '#fff',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Número corto
                                            </button>
                                            <button
                                                onClick={() => setIsLongNumber(true)}
                                                style={{
                                                    padding: '10px 20px',
                                                    borderRadius: '4px',
                                                    border: isLongNumber ? '1px solid #8d406d' : '1px solid #dcdcdc',
                                                    backgroundColor: isLongNumber ? '#8d406d' : '#fff',
                                                    color: isLongNumber ? '#fff' : '#8d406d',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Número largo
                                            </button>
                                        </div>


                                        <p style={{ fontSize: '0.9rem', color: '#6a6a6a', marginBottom: '20px' }}>
                                            {isLongNumber
                                                ? "Nota: Los números largos son dedicados. Tienen un costo inicial y mensual. El tiempo de espera para la implementación es de 4 semanas."
                                                : "Nota: La renta de los números dedicados toma de 2 a 4 semanas."}
                                        </p>


                                        <hr style={{ margin: '20px 0', borderColor: '#dcdcdc' }} />

                                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>Elegir cantidad de números</h3>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleQuantityChange('decrement')}
                                                    style={{
                                                        padding: '5px 10px',
                                                        border: '1px solid #dcdcdc',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    value={numberQuantity}
                                                    readOnly
                                                    style={{
                                                        width: '50px',
                                                        textAlign: 'center',
                                                        padding: '5px',
                                                        border: '1px solid #dcdcdc',
                                                        borderRadius: '4px',
                                                        fontSize: '1rem',
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange('increment')}
                                                    style={{
                                                        padding: '5px 10px',
                                                        border: '1px solid #dcdcdc',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        {!isLongNumber && (
                                            <div style={{ marginBottom: '20px', color: '#4a4a4a', fontSize: '1rem' }}>
                                                <p><strong>Costo por setup (único):</strong> ${costSetup.toFixed(2)}</p>
                                                <p><strong>Costo mensual:</strong> ${monthlyCost.toFixed(2)}</p>
                                            </div>
                                        )}
                                        {isLongNumber && (
                                            <div
                                                style={{
                                                    maxHeight: '50vh', // Límite de altura para forzar scroll si el contenido excede
                                                    overflowY: 'auto', // Activa el scroll vertical si el contenido es mayor al `maxHeight`
                                                    paddingRight: '10px',
                                                    boxSizing: 'border-box', // Asegura que los paddings no excedan el área total
                                                }}
                                            >
                                                <TextField
                                                    label="Estado"
                                                    value={selectedState}
                                                    onClick={handleStateMenuOpen}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <Menu
                                                    anchorEl={anchorElState}
                                                    open={Boolean(anchorElState)}
                                                    onClose={handleStateMenuClose}
                                                    PaperProps={{
                                                        style: { maxHeight: '300px', width: anchorElState ? anchorElState.clientWidth : undefined },
                                                    }}
                                                >
                                                    <div style={{ padding: '8px' }}>
                                                        <TextField
                                                            placeholder="Buscar estado"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={stateSearch}
                                                            onChange={handleStateSearchChange}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </div>
                                                    {filteredStates.map((state) => (
                                                        <MenuItem key={state.state} onClick={() => handleStateChange(state.state)}>
                                                            {state.state}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>

                                                <TextField
                                                    label="Municipio"
                                                    value={selectedMunicipality}
                                                    onClick={handleMunicipalityMenuOpen}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    disabled={!municipalities.length}
                                                />
                                                <Menu
                                                    anchorEl={anchorElMunicipality}
                                                    open={Boolean(anchorElMunicipality)}
                                                    onClose={handleMunicipalityMenuClose}
                                                    PaperProps={{
                                                        style: { maxHeight: '300px', width: anchorElMunicipality ? anchorElMunicipality.clientWidth : undefined },
                                                    }}
                                                >
                                                    <div style={{ padding: '8px' }}>
                                                        <TextField
                                                            placeholder="Buscar municipio"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={municipalitySearch}
                                                            onChange={handleMunicipalitySearchChange}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </div>
                                                    {filteredMunicipalities.map((municipality) => (
                                                        <MenuItem
                                                            key={municipality.name}
                                                            onClick={() => handleMunicipalityChange(municipality)}
                                                        >
                                                            {municipality.name}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                                <TextField
                                                    label="LADA"
                                                    value={selectedLada}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />

                                                <TextField
                                                    label="Costo inicial"
                                                    value={`$${monthlyCost.toFixed(2)}`}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />

                                                <TextField
                                                    label="Costo mensual"
                                                    value={`$${monthlyCost.toFixed(2)}`}
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </div>
                                        )}


                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button
                                                onClick={handleCloseModal}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    color: '#8d406d',
                                                    border: '2px solid #8d406d',
                                                    borderRadius: '5px',
                                                    padding: '10px 20px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                style={{
                                                    backgroundColor: '#8d406d',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    padding: '10px 20px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Renta de números</h2>
                                        {isLongNumber ? (
                                            <>
                                                <p style={{ margin: '5px 0' }}><strong>Números:</strong> {numberQuantity}</p>
                                                <p style={{ margin: '5px 0' }}><strong>Estado:</strong> {selectedState || 'No seleccionado'}</p>
                                                <p style={{ margin: '5px 0' }}><strong>Municipio:</strong> {selectedMunicipality || 'No seleccionado'}</p>
                                                <p style={{ margin: '5px 0' }}><strong>LADA:</strong> {selectedLada || 'No seleccionado'}</p>
                                                <p style={{ margin: '5px 0' }}><strong>Costo inicial:</strong> ${monthlyCost.toFixed(2)}</p>
                                                <p style={{ margin: '5px 0' }}><strong>Costo mensual:</strong> ${monthlyCost.toFixed(2)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #dcdcdc', borderRadius: '8px' }}>
                                                    <p style={{ margin: '5px 0' }}>Números: {numberQuantity}</p>
                                                    <p style={{ margin: '5px 0' }}>Costo por setup: ${costSetup.toFixed(2)}</p>
                                                    <p style={{ margin: '5px 0' }}>Costo mensual: ${monthlyCost.toFixed(2)}</p>
                                                </div>
                                            </>
                                        )}

                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#4a4a4a' }}>Seleccionar método de pago</h3>
                                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
                                            {creditCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    style={{
                                                        border: selectedCard?.id === card.id ? '2px solid #8d406d' : '1px solid #dcdcdc',
                                                        borderRadius: '8px',
                                                        padding: '15px',
                                                        width: '250px',
                                                        backgroundColor: selectedCard?.id === card.id ? '#f3e6f5' : '#fff',
                                                        position: 'relative', // Para posicionar los elementos
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {/* Botón de eliminar */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Evita que seleccione la tarjeta al hacer click
                                                            /*  openDeleteModal(card);*/
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            backgroundColor: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>

                                                    {/* Tipo de tarjeta */}
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        left: '10px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        color: '#8d406d',
                                                        textTransform: 'uppercase',
                                                    }}>
                                                        {card.type}
                                                    </span>

                                                    {/* Nombre de la tarjeta */}
                                                    <p style={{ margin: '25px 0 0', fontWeight: 'bold', color: '#4a4a4a' }}>
                                                        {card.card_name}
                                                    </p>

                                                    {/* Terminación y vencimiento */}
                                                    <p style={{ margin: '5px 0' }}>Terminación: •••• {card.card_number.slice(-4)}</p>
                                                    <p style={{ margin: 0 }}>
                                                        Vencimiento: {card.expiration_month}/{card.expiration_year.toString().slice(-2)}
                                                    </p>

                                                    {/* Radio button para seleccionar tarjeta */}
                                                    <label style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        marginTop: '15px',
                                                    }}>
                                                        <input
                                                            type="radio"
                                                            name="selectedCard"
                                                            checked={selectedCard?.id === card.id}
                                                            onChange={() => handleSelectCard(card)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        Seleccionar tarjeta
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                            <input type="checkbox" style={{ cursor: 'pointer' }} />
                                            Generar factura automáticamente
                                        </label>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button
                                                onClick={handlePreviousStep}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    color: '#8d406d',
                                                    padding: '10px 20px',
                                                    border: '2px solid #8d406d',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Atrás
                                            </button>
                                            <button
                                                onClick={handleNextStep}
                                                style={{
                                                    backgroundColor: '#8d406d',
                                                    color: '#fff',
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>
                                            Datos de facturación
                                        </h2>

                                        <div style={{
                                            backgroundColor: '#f9f9f9',
                                            padding: '20px',
                                            borderRadius: '8px',
                                            marginBottom: '20px',
                                            fontSize: '0.9rem',
                                            color: '#4a4a4a',
                                        }}>
                                            <p><strong>Nombre o razón social:</strong> Nuxiba</p>
                                            <p><strong>RFC:</strong> VECJ880326</p>
                                            <p><strong>Código postal:</strong> 45678</p>
                                            <p><strong>Régimen fiscal:</strong> Régimen ejemplo</p>
                                            <p><strong>Descripción de los bienes o servicios:</strong> Régimen ejemplo</p>
                                            <p><strong>Créditos:</strong> {numberQuantity.toLocaleString()}</p>
                                            <p><strong>Precio unitario:</strong> ${costSetup.toFixed(2)}</p>
                                            <p><strong>Costo total:</strong> ${monthlyCost.toFixed(2)}</p>
                                            <p><strong>Método de pago:</strong> {selectedCard?.type} **{selectedCard?.card_number.slice(-4)}, {selectedCard?.card_name}</p>
                                        </div>

                                        {/* Botones de navegación */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    color: '#8d406d',
                                                    border: '2px solid #8d406d',
                                                    borderRadius: '5px',
                                                    padding: '10px 20px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                ATRÁS
                                            </button>
                                            <button
                                                onClick={handleRent}
                                                style={{
                                                    backgroundColor: '#8d406d',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    padding: '10px 20px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                RENTAR
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {errorModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                width: '400px',
                                textAlign: 'center',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            }}>
                                <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>{errorModal.title}</h3>
                                <p style={{ marginBottom: '20px', color: '#6a6a6a' }}>{errorModal.message}</p>
                                <button
                                    onClick={closeErrorModal}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#8d406d',
                                        border: '2px solid #8d406d',
                                        borderRadius: '5px',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    CERRAR
                                </button>
                            </div>
                        </div>
                    )}
                    <Modal
                        open={isModalAyudaOpen}
                        onClose={handleModalAyudaClose}
                        aria-labelledby="modal-ayuda-title"
                        aria-describedby="modal-ayuda-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #dcdcdc',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: '8px',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography id="modal-ayuda-title" variant="h6" component="h2">
                                    Servicios adicionales
                                </Typography>
                                <CloseIcon
                                    onClick={handleModalAyudaClose}
                                    style={{ cursor: 'pointer', color: '#8d406d' }}
                                />
                            </Box>
                            <Typography id="modal-ayuda-description" sx={{ mt: 2, mb: 4 }}>
                                Si requiere un servicio adicional como compra de troncal, rotación automática o regionalizada de números por troncal entre otros, favor de llamar al ejecutivo de la cuenta.
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    onClick={handleModalAyudaClose}
                                    sx={{
                                        borderColor: '#8d406d',
                                        color: '#8d406d',
                                        '&:hover': {
                                            backgroundColor: '#f8d7da',
                                            borderColor: '#8d406d',
                                        },
                                    }}
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#8d406d',
                                        '&:hover': {
                                            backgroundColor: '#732d57',
                                        },
                                    }}
                                    onClick={handleNavigateToHelp}
                                >
                                    <img src={HelpIco} alt="Ayuda" style={{ width: '20px', height: '20px' }} />
                                    ¿AYUDA?
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    {isAcceptModalOpen && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '400px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>
                                    {modalContent.title}
                                </h2>
                                <p style={{ fontSize: '1rem', marginBottom: '20px', color: '#6a6a6a' }}>
                                    {modalContent.message}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={handleCloseAcceptModal}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            backgroundColor: '#fff',
                                            color: '#8d406d',
                                            border: '2px solid #8d406d',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            backgroundColor: '#8d406d',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ACEPTAR
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <Snackbar
                        open={toastOpen}
                        autoHideDuration={3000}
                        onClose={handleCloseToast}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
                            {toastMessage}
                        </Alert>
                    </Snackbar>
                </div>
            )}
        </>
    );
};

export default MyNumbers;
