import React, { useState } from 'react';
import { Button, Popper, Paper } from "@mui/material";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../components/commons/CSS/DatePicker.css';
import { es } from 'date-fns/locale';
import Iconarrow from '../assets/icon-punta-flecha-bottom.svg'
import MainButton from '../components/commons/MainButton'
import SecondaryButton from '../components/commons/SecondaryButton'

const PaymentHistoric: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(), // Asegura que tenga un valor válido
            endDate: new Date(),   // Asegura que tenga un valor válido
            key: 'selection',
        },
    ]);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [endHours, setEndHours] = useState(0);
    const [endMinutes, setEndMinutes] = useState(0);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? "date-picker-popper" : undefined;


    return (
        <div style={{ padding: '20px', maxWidth: '1000px', marginLeft: '0' }}>
            <h2
                style={{
                    textAlign: 'left',
                    font: 'normal normal medium 26px/55px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1,
                    fontSize: '26px',
                }}
            >
                Historial de pago
            </h2>
            <hr className="date-picker-divider" />
            <Button
                aria-describedby={id}
                variant="outlined"
                onClick={handleClick}
                style={{
                    background: open ? '#FEFEFE' : '#F6F6F6',
                    border: open ? '1px solid #8F4E63CC' : '1px solid #C6BFC2',
                    borderRadius: '18px',
                    opacity: 1,
                    width: '90px',
                    height: '36px',
                }}
            >
                Fecha
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                <Paper elevation={3} className="date-picker-container">
                    <div className="date-picker-divider"></div>
                    <DateRange
                        locale={es}
                        editableDateInputs={true}
                        onChange={(item) => {
                            setDateRange([
                                {
                                    startDate: item.selection.startDate || new Date(),
                                    endDate: item.selection.endDate || new Date(),
                                    key: 'selection',
                                },
                            ]);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        months={2}
                        direction="horizontal"
                        showDateDisplay={false}
                        showMonthAndYearPickers={false}
                    />
                    {/* Línea divisoria debajo del Date Picker */}
                    <hr className="date-picker-divider" />

                    {/* Controles de tiempo */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                        {[{
                            title: "HORA INICIAL",
                            hourValue: hours,
                            setHour: setHours,
                            minuteValue: minutes,
                            setMinute: setMinutes
                        }, {
                            title: "HORA FINAL",
                            hourValue: endHours,
                            setHour: setEndHours,
                            minuteValue: endMinutes,
                            setMinute: setEndMinutes
                        }].map((time, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <p style={{
                                    textAlign: 'center',
                                    font: 'normal normal medium 14px/54px Poppins',
                                    letterSpacing: '1.12px',
                                    color: '#574B4F',
                                    textTransform: 'uppercase',
                                    opacity: 1,
                                    fontSize: '14px',
                                    marginBottom: '-5px'
                                }}>{time.title}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    {[{
                                        value: time.hourValue,
                                        setter: time.setHour,
                                        label: "hora"
                                    }, {
                                        value: time.minuteValue,
                                        setter: time.setMinute,
                                        label: "minuto"
                                    }].map((unit, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input type="text" value={unit.value.toString().padStart(2, '0')} readOnly
                                                    style={{
                                                        textAlign: 'center', width: '40px', height: '40px',
                                                        border: '1px solid #ccc', borderRadius: '4px', background: '#F2F2F2',
                                                        fontSize: '20px', fontWeight: 600, color: '#574B4F'
                                                    }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-6px' }}>
                                                    <button onClick={() => unit.setter((prev) => (prev + 1) % (i === 0 ? 24 : 60))}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginBottom: '-10px' }}>
                                                        <img src={Iconarrow} alt="Subir" style={{ width: '24px', height: '24px' }} />
                                                    </button>
                                                    <button onClick={() => unit.setter((prev) => (prev - 1 + (i === 0 ? 24 : 60)) % (i === 0 ? 24 : 60))}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginTop: '-10px' }}>
                                                        <img src={Iconarrow} alt="Bajar" style={{ transform: 'rotate(180deg)', width: '24px', height: '24px' }} />
                                                    </button>
                                                </div>
                                                {i === 0 && <span style={{ fontSize: '18px', fontWeight: 600, color: '#574B4F' }}>:</span>}
                                            </div>
                                            {/* Texto debajo de cada input */}
                                            <span style={{
                                                textAlign: 'center',
                                                font: 'normal normal normal 12px/54px Poppins',
                                                letterSpacing: '0px',
                                                color: '#574B4F',
                                                opacity: 1,
                                                fontSize: '12px',
                                                marginTop: '-25px',
                                                marginRight: '65px'
                                            }}>{unit.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="time-divider" /> {/* Línea horizontal debajo de Hora Inicial y Hora Final */}

                    {/* Contenedor de botones */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <SecondaryButton onClick={() => setAnchorEl(null)} text="Limpiar" />
                        <div style={{ marginLeft: 'auto' }}>
                            <MainButton onClick={() => console.log('p')} text="Aplicar" />
                        </div>
                    </div>

                </Paper>
            </Popper>
            <hr className="date-picker-divider" />

        </div>
    );
};

export default PaymentHistoric;
