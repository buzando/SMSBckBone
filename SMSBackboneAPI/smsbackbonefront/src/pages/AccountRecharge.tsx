import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChipBar from "../components/commons/ChipBar";


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
    Type: string;
}

const AccountRecharge: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expirationMonth: 0,
        expirationYear: 0,
        cvv: '',
        isDefault: false,
        type: ''
    });
    const [cardType, setCardType] = useState('');
    const [isCardValid, setIsCardValid] = useState(true);
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [generateInvoice, setGenerateInvoice] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const invoiceData = {
        name: "Nuxiba",
        rfc: "VECJ880326",
        postalCode: "45678",
        fiscalRegime: "Régimen ejemplo",
        description: "Régimen ejemplo",
        credits: "8,000",
        unitPrice: "$0.10",
        totalCost: "$0.10",
        paymentMethod: selectedCard ? `${selectedCard.Type} **${selectedCard.card_number.slice(-4)}, ${selectedCard.card_name}` : 'No seleccionada'
    };
    const [showChipBarAdd, setshowChipBarAdd] = useState(false);
    const [showChipBarCard, setshowChipBarCard] = useState(false);
    const [showChipBarDelete, setshowChipBarDelete] = useState(false);
    const handleGenerateInvoiceCheck = () => {
        if (generateInvoice) {
            setGenerateInvoice(false);
        } else {
            setIsInvoiceModalOpen(true);
        }
    };
    const multiplier = 80;
    const closeInvoiceModal = () => {
        setIsInvoiceModalOpen(false);
        setGenerateInvoice(false);
    };

    const acceptInvoiceModal = () => {
        setIsInvoiceModalOpen(false);
        setGenerateInvoice(true);
    };

    // Funciones para abrir y cerrar el modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChannel(event.target.value);
    };

    const handleCreditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditAmount(event.target.value);
    };

    const handleRechargeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRechargeAmount(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setshowChipBarAdd(true); // Mostrar ChipBar para edición exitosa
        setTimeout(() => setshowChipBarAdd(false), 3000);
    };

    const fetchCreditCards = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el correo electrónico del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CREDITCARD}${obj.id}`;
            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                setCreditCards(response.data); // Asigna las tarjetas de crédito al estado
            }
        } catch (error) {
            console.error("Error al obtener las tarjetas de crédito:", error);
        }
    };

    useEffect(() => {
        fetchCreditCards();
    }, []); // Este useEffect se ejecutará solo una vez cuando el componente se monte


    const addCreditCard = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_ADD_CREDITCARD}`;
            const payload = {
                user_id: obj.id,
                card_number: cardDetails.cardNumber,
                card_name: cardDetails.cardName,
                expiration_month: cardDetails.expirationMonth,
                expiration_year: cardDetails.expirationYear,
                cvv: cardDetails.cvv,
                is_default: cardDetails.isDefault,
                type: cardType
            };

            const response = await axios.post(requestUrl, payload);

            if (response.status === 200) {
                setshowChipBarCard(true);
                setTimeout(() => setshowChipBarCard(false), 3000);
                await fetchCreditCards();
                handleCloseModal();
            }
        } catch  {
            setErrorModal({
                title: "Error al añadir tarjeta",
                message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
            });
        } finally {
            handleCloseModal();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Validación para `cardName` (solo letras y espacios)
        if (name === 'cardName' && /[^a-zA-Z\s]/.test(value)) {
            return; // Evita caracteres no permitidos
        }

        // Validación para `cvv` (solo números y máximo 3 dígitos)
        if (name === 'cvv' && (/\\D/.test(value) || value.length > 3)) {
            return; // Evita caracteres no numéricos o más de 3 dígitos
        }

        // Verificar si el input es de tipo checkbox
        if (type === 'checkbox') {
            setCardDetails((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setCardDetails((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };



    const validateCardNumber = (cardNumber: string): boolean => {
        const digits = cardNumber.replace(/\D/g, '');
        let sum = 0;
        let shouldDouble = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };

    const getCardType = (cardNumber: string): string => {
        const number = cardNumber.replace(/\D/g, "");

        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
            return "Visa";
        } else if (/^5[1-5][0-9]{14}$/.test(number)) {
            return "Mastercard";
        } else if (/^3[47][0-9]{13}$/.test(number)) {
            return "American Express";
        } else if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) {
            return "Discover";
        } else {
            return "Unknown";
        }
    };

    const handleCardNumberBlur = () => {
        const valid = validateCardNumber(cardDetails.cardNumber);
        const type = getCardType(cardDetails.cardNumber);
        setIsCardValid(valid);
        setCardType(type);
    };


    const handleDeleteCard = async () => {
        if (!cardToDelete) return;
        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_DELETE_CREDITCARD + cardToDelete.id}`;
            const response = await axios.get(requestUrl);


            if (response.status === 200) {
                await fetchCreditCards();
                setshowChipBarDelete(true);
                setTimeout(() => setshowChipBarDelete(false), 3000);
            }

         
        } catch  {
            setErrorModal({
                title: "Error al eliminar tarjeta",
                message: "Algo salió mal. Inténtelo de nuevo o regrese más tarde.",
            });
        } finally {
            closeDeleteModal();
        }
    };


    const handleSelectCard = (card: CreditCard) => {
        setSelectedCard(card);
    };

    const openDeleteModal = (card: CreditCard) => {
        setCardToDelete(card);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setCardToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const closeErrorModal = () => {
        setErrorModal(null);
    };

    const handleCreditBlur = () => {
        const calculatedAmount = parseInt(creditAmount, 10) * multiplier;
        setRechargeAmount(calculatedAmount.toString()); // Actualiza el monto a recargar
    };

    return (
        <div style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '30px 0 0 30px',
            fontFamily: 'Arial, sans-serif',
            color: '#4a4a4a'
        }}>
            {/* Modal de confirmación para eliminar */}
            {isDeleteModalOpen && (
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
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>Eliminar tarjeta</h3>
                        <p style={{ marginBottom: '20px', color: '#6a6a6a' }}>
                            ¿Está seguro de que desea eliminar la tarjeta? Esta acción no puede ser revertida.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={closeDeleteModal}
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
                                onClick={handleDeleteCard}
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
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de error */}
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
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>{errorModal.title}</h3>
                        <p style={{ marginBottom: '20px', color: '#6a6a6a' }}>
                            {errorModal.message}
                        </p>
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
                            Cerrar
                        </button>
                    </div>
                </div>
            )}


            {isInvoiceModalOpen && (
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
                        width: '500px',
                        textAlign: 'center',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#4a4a4a' }}>Datos de factura</h3>
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '15px',
                            borderRadius: '5px',
                            textAlign: 'left',
                            fontSize: '0.9rem',
                            color: '#6a6a6a'
                        }}>
                            <p><strong>Nombre o razón social:</strong> {invoiceData.name}</p>
                            <p><strong>RFC:</strong> {invoiceData.rfc}</p>
                            <p><strong>Código postal:</strong> {invoiceData.postalCode}</p>
                            <p><strong>Régimen fiscal:</strong> {invoiceData.fiscalRegime}</p>
                            <p><strong>Descripción de los bienes o servicios:</strong> {invoiceData.description}</p>
                            <p><strong>Créditos:</strong> {invoiceData.credits}</p>
                            <p><strong>Precio unitario:</strong> {invoiceData.unitPrice}</p>
                            <p><strong>Costo total:</strong> {invoiceData.totalCost}</p>
                            <p><strong>Método de pago:</strong> {invoiceData.paymentMethod}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button
                                onClick={closeInvoiceModal}
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
                                onClick={acceptInvoiceModal}
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
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 style={{
                position: 'relative',
                top: '0',
                left: '0',
                textAlign: 'left',
                font: 'normal normal medium 26px/55px Poppins',
                letterSpacing: '0px',
                color: '#330F1B',
                opacity: 1,
                margin: '0 0 10px 0'
            }}>
                Recarga de Créditos
            </h2>
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#330F1B',
                margin: '10px 0 20px 0'
            }}></div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px', width: '60%' }}> {/* Hacemos más estrecho el recuadro */}
                    <label htmlFor="channel" style={{
                        textAlign: 'left',
                        font: 'normal normal medium 18px/22px Poppins',
                        letterSpacing: '0px',
                        color: '#330F1B',
                        opacity: 1,
                        display: 'block',
                        marginBottom: '5px'
                    }}>
                        Canal
                    </label>

                    <select
                        id="channel"
                        value={selectedChannel}
                        onChange={handleChannelChange}
                        style={{
                            width: '48%',
                            padding: '12px',
                            border: '1px solid #dcdcdc',
                            borderRadius: '5px',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Seleccionar canal</option>
                        <option value="short_sms">SMS, números cortos</option>
                        <option value="long_sms">SMS, números largos</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', width: '60%' }}> {/* Ajustamos ancho aquí también */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="credits" style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px',
                            color: '#6a6a6a'
                        }}>Cantidad de créditos</label>
                        <input
                            id="credits"
                            type="number"
                            value={creditAmount}
                            onChange={handleCreditChange}
                            onBlur={handleCreditBlur}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #dcdcdc',
                                borderRadius: '5px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label htmlFor="amount" style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px',
                            color: '#6a6a6a'
                        }}>Monto a recargar</label>
                        <input
                            id="amount"
                            type="text"
                            disabled
                            value={rechargeAmount}
                            onChange={handleRechargeChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #dcdcdc',
                                borderRadius: '5px',
                                fontSize: '1rem'
                            }}
                            placeholder="$"
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px', width: '60%' }}> {/* Texto del método de pago */}
                    <label htmlFor="paymentMethod" style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6a6a6a'
                    }}>Seleccione el método de pago</label>
                </div>

                <button
                    type="button"
                    onClick={handleOpenModal}
                    style={{
                        backgroundColor: '#8d406d',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span> Agregar Tarjeta
                </button>

                <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                    {creditCards.map((card) => (
                        <div
                            key={card.id}
                            style={{
                                border: selectedCard?.id === card.id ? '2px solid #8d406d' : '1px solid #dcdcdc',
                                borderRadius: '8px',
                                padding: '15px',
                                width: '250px',
                                position: 'relative',
                                backgroundColor: selectedCard?.id === card.id ? '#f3e6f5' : '#fff',
                            }}
                        >
                            {/* Marca de la tarjeta */}
                            <div style={{ marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div>
                                    {card.Type}
                                </div>
                                {card.card_name}
                            </div>

                            {/* Detalles */}
                            <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                                <div>Terminación: •••• {card.card_number.slice(-4)}</div>
                                <div>Vencimiento: {card.expiration_month.toString().padStart(2, '0')}/{card.expiration_year.toString().slice(-2)}</div>
                            </div>

                            {/* Radio para seleccionar */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                                <input
                                    type="radio"
                                    name="selectedCard"
                                    checked={selectedCard?.id === card.id}
                                    onChange={() => handleSelectCard(card)}
                                    style={{ cursor: 'pointer' }}
                                />
                                {selectedCard?.user_id === card.user_id ? 'Tarjeta seleccionada' : 'Seleccionar tarjeta'}
                            </label>

                            {/* Botón para eliminar */}
                            <button
                                onClick={() => openDeleteModal(card)}
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
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}> {/* Facturar automáticamente y botones */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#6a6a6a' }}>
                        <input
                            type="checkbox"
                            checked={generateInvoice}
                            onChange={handleGenerateInvoiceCheck}
                            style={{ cursor: 'pointer' }}
                        />
                        Generar factura automáticamente
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}> {/* Botones a la derecha */}
                        <button
                            type="button"
                            style={{
                                backgroundColor: '#fff',
                                color: '#8d406d',
                                fontWeight: 'bold',
                                padding: '8px 12px',
                                border: '2px solid #8d406d',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#8d406d',
                                color: '#fff',
                                fontWeight: 'bold',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Recargar
                        </button>
                    </div>
                </div>
            </form>
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '1000',
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '600px', // Cambiado de 400px a 500px
                        height: 'auto', // Puedes ajustar aquí si necesitas un tamaño fijo para la altura
                        minHeight: '300px', // Añadido para que tenga un mínimo de altura
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            marginBottom: '10px',
                            color: '#4a4a4a',
                        }}>Agregar tarjeta</h2>

                        <form onSubmit={(e) => { e.preventDefault(); addCreditCard(); }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label htmlFor="cardNumber" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Número de tarjeta *
                                </label>
                                <input
                                    id="cardNumber"
                                    name="cardNumber"
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardDetails.cardNumber}
                                    onChange={handleInputChange}
                                    onBlur={handleCardNumberBlur}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: isCardValid ? '1px solid #dcdcdc' : '1px solid red',
                                        borderRadius: '4px',
                                    }}
                                    required
                                />
                                {!isCardValid && (
                                    <span style={{ color: 'red', marginTop: '5px', display: 'block' }}>
                                        Tarjeta inválida
                                    </span>
                                )}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label htmlFor="cardName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Nombre en la tarjeta *
                                </label>
                                <input
                                    id="cardName"
                                    name="cardName"
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={cardDetails.cardName}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #dcdcdc',
                                        borderRadius: '4px',
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Fecha de vencimiento *
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        name="expirationMonth"
                                        value={cardDetails.expirationMonth}
                                        onChange={handleInputChange}
                                        style={{
                                            flex: '1',
                                            padding: '8px',
                                            border: '1px solid #dcdcdc',
                                            borderRadius: '4px',
                                        }}
                                        required
                                    >
                                        <option value="">Mes</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <select
                                        name="expirationYear"
                                        value={cardDetails.expirationYear}
                                        onChange={handleInputChange}
                                        style={{
                                            flex: '1',
                                            padding: '8px',
                                            border: '1px solid #dcdcdc',
                                            borderRadius: '4px',
                                        }}
                                        required
                                    >
                                        <option value="">Año</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="cvv" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    CVV *
                                </label>
                                <input
                                    id="cvv"
                                    name="cvv"
                                    type="text"
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #dcdcdc',
                                        borderRadius: '4px',
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        name="isDefault"
                                        type="checkbox"
                                        checked={cardDetails.isDefault}
                                        onChange={handleInputChange}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    Establecer como forma de pago predeterminada.
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" onClick={handleCloseModal} style={{
                                    backgroundColor: '#fff',
                                    color: '#8d406d',
                                    padding: '10px 20px',
                                    border: '2px solid #8d406d',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{
                                    backgroundColor: '#8d406d',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}>
                                    Agregar
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
            {showChipBarAdd && (
                <ChipBar
                    message="Se ha recargado saldo con exito"
                    buttonText="Cerrar"
                    onClose={() => setshowChipBarAdd(false)}
                />
            )}
            {showChipBarCard && (
                <ChipBar
                    message="Se ha agregado la tarjeta con exito"
                    buttonText="Cerrar"
                    onClose={() => setshowChipBarAdd(false)}
                />
            )}
            {showChipBarDelete && (
                <ChipBar
                    message="Se ha eliminado la tarjeta con exito"
                    buttonText="Cerrar"
                    onClose={() => setshowChipBarAdd(false)}
                />
            )}
        </div>
    );
};

export default AccountRecharge;
