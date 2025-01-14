import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountRecharge: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [creditCards, setCreditCards] = useState<string[]>([]); // Nueva variable para tarjetas de crédito
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expirationMonth: 0,
        expirationYear: 0,
        cvv: '',
        isDefault: false
    });


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
        console.log({ selectedChannel, creditAmount, rechargeAmount });
    };


    useEffect(() => {
        const fetchCreditCards = async () => {
            const usuario = localStorage.getItem("userData");
            const obj = usuario ? JSON.parse(usuario) : null;

            if (!obj?.email) {
                console.error("No se encontró el correo electrónico del usuario.");
                return;
            }

            try {
                const requestUrl = `${import.meta.env.VITE_SMS_API_URL + import.meta.env.VITE_API_GET_CREDITCARD}${obj.email}`;
                const response = await axios.get(requestUrl);

                if (response.status === 200) {
                    setCreditCards(response.data); // Asigna las tarjetas de crédito al estado
                }
            } catch (error) {
                console.error("Error al obtener las tarjetas de crédito:", error);
            }
        };

        fetchCreditCards();
    }, []); // Este useEffect se ejecutará solo una vez cuando el componente se monte


    const addCreditCard = async () => {
        const usuario = localStorage.getItem("userData");
        const obj = usuario ? JSON.parse(usuario) : null;

        if (!obj?.userId) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        try {
            const requestUrl = `${import.meta.env.VITE_SMS_API_URL}/credit_cards`;
            const payload = {
                userId: obj.userId,
                cardNumber: cardDetails.cardNumber,
                cardName: cardDetails.cardName,
                expirationMonth: cardDetails.expirationMonth,
                expirationYear: cardDetails.expirationYear,
                cvv: cardDetails.cvv,
                isDefault: cardDetails.isDefault
            };

            const response = await axios.post(requestUrl, payload);

            if (response.status === 201) {
                console.log("Tarjeta añadida exitosamente:", response.data);
                // Aquí puedes actualizar la lista de tarjetas o cerrar el modal
                setCreditCards((prev) => [...prev, response.data]);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al agregar la tarjeta:", error);
        }
    };


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setCardDetails((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
};

    return (
        <div style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '30px 0 0 30px',
            fontFamily: 'Arial, sans-serif',
            color: '#4a4a4a'
        }}>
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
                        <option value="">SMS, números cortos</option>
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

                <div style={{
                    height: '150px',
                    width: '100%',
                    border: '1px dashed #dcdcdc',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: '#6a6a6a',
                    flexDirection: 'column'
                }}> {/* Espacio reservado para tarjetas */}
                    {creditCards.length === 0 ? (
                        <div>Ninguna tarjeta registrada</div>
                    ) : null}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}> {/* Facturar automáticamente y botones */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#6a6a6a' }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
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

        </div>
    );
};

export default AccountRecharge;
