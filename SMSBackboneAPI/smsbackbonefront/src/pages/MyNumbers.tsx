import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
const MyNumbers: React.FC = () => {
    // Datos en duro para la tabla
    const numbersData = [
        {
            number: '525512121212',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Largo',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        },
        {
            number: '525512121212',
            type: 'Corto',
            service: 'SMS',
            cost: '$0.10',
            nextPaymentDate: '23/07/2024 12:00:00 a.m.'
        }
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(numbersData.length / itemsPerPage);

    // Calcular los elementos de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = numbersData.slice(startIndex, startIndex + itemsPerPage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'corto' | 'largo'>('corto');
    const [numberQuantity, setNumberQuantity] = useState(1);
    const [monthlyCost, setMonthlyCost] = useState(50);
    const [currentStep, setCurrentStep] = useState(1);
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
            setMonthlyCost(newQuantity * 50);

            return newQuantity;
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };


    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Mis números</h2>
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
                        <button style={{
                            padding: '10px 20px',
                            border: '1px solid #dcdcdc',
                            borderRadius: '50px', // Bordes ovalados
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: '#6a6a6a',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            Estado
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            border: '1px solid #dcdcdc',
                            borderRadius: '50px', // Bordes ovalados
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: '#6a6a6a',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            Municipio
                        </button>
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
                        <span style={{ color: '#6a6a6a' }}>
                            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, numbersData.length)} de {numbersData.length}
                        </span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {/* Botón para ir a la primera página */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'|<<'}
                            </button>

                            {/* Botón para ir a la página anterior */}
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'<<'}
                            </button>

                            {/* Botón para ir a la siguiente página */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'>>'}
                            </button>

                            {/* Botón para ir a la última página */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none', // Eliminamos el marco
                                    borderRadius: '4px',
                                    backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {'>>|'}
                            </button>
                        </div>
                    </div>

                    {/* Botón Servicios Adicionales */}
                    <div>
                        <button style={{
                            padding: '8px 12px',
                            border: '1px solid #8d406d',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            color: '#8d406d',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}>
                            SERVICIOS ADICIONALES
                        </button>
                    </div>
                </div>

            </div>


            {/* Tabla */}
            <div style={{ border: '1px solid #dcdcdc', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: '#f9f9f9', color: '#6a6a6a' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Número</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Tipo</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Servicio</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Costo</th>
                            <th style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid #dcdcdc' }}>Fecha del próx. pago</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((number, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #dcdcdc' }}>
                                <td style={{ padding: '10px' }}>{number.number}</td>
                                <td style={{ padding: '10px' }}>{number.type}</td>
                                <td style={{ padding: '10px' }}>{number.service}</td>
                                <td style={{ padding: '10px' }}>{number.cost}</td>
                                <td style={{ padding: '10px' }}>{number.nextPaymentDate}</td>
                                <td style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    borderLeft: '1px solid #dcdcdc'
                                }}>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '2px',
                                        }}>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                            <span style={{ width: '5px', height: '5px', backgroundColor: '#8d406d', borderRadius: '50%' }}></span>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            width: '400px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {currentStep === 1 && (
                            <>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4a4a4a' }}>Renta de números</h2>

                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                    <button
                                        onClick={() => setSelectedType('corto')}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '4px 0 0 4px',
                                            backgroundColor: selectedType === 'corto' ? '#8d406d' : '#f3e6f5',
                                            color: selectedType === 'corto' ? '#fff' : '#8d406d',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Número corto
                                    </button>
                                    <button
                                        onClick={() => setSelectedType('largo')}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '0 4px 4px 0',
                                            backgroundColor: selectedType === 'largo' ? '#8d406d' : '#f3e6f5',
                                            color: selectedType === 'largo' ? '#fff' : '#8d406d',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Número largo
                                    </button>
                                </div>

                                <p style={{ textAlign: 'center', color: '#6a6a6a', marginBottom: '20px' }}>
                                    Nota: La renta de los números dedicados toma de 2 a 4 semanas.
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

                                <div style={{ marginBottom: '20px', color: '#4a4a4a', fontSize: '1rem' }}>
                                    <p><strong>Costo por setup (único):</strong> $100.00</p>
                                    <p><strong>Costo mensual:</strong> ${monthlyCost.toFixed(2)}</p>
                                </div>

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
                                        onClick={handleNextStep}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNumbers;
