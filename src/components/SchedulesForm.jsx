// export const FormReservation = () => {
//   return (
//    <>
//     <h1>Nueva Reserva</h1>
//     <form action="">
//         <div className="mb-3">
//             <label htmlFor="name" className="form-label">Fecha</label>
//             <input type="text" className="form-control" id="name" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="lastName" className="form-label">Estacionamiento</label>
//             <input type="text" className="form-control" id="lastName" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="dni" className="form-label">Dirección</label>
//             <input type="text" className="form-control" id="dni" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="email" className="form-label">Lugares disponibles</label>
//             <input type="email" className="form-control" id="email" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="phone" className="form-label">Horario inicio</label>
//             <input type="text" className="form-control" id="phone" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="plate" className="form-label">Horario fin</label>
//             <input type="text" className="form-control" id="plate" />
//         </div>
//         <div className="mb-3">
//             <label htmlFor="time" className="form-label">Vehículo</label>
//             <input type="time" className="form-control" id="time" />
//         </div>
//     </form>
//    </>

//   )
// }

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export const ReservationForm = () => {
    const [startDate, setStartDate] = useState(null);  // Estado para la fecha de ingreso
    const [endDate, setEndDate] = useState(null);  // Estado para la fecha de fin
    const [startTime, setStartTime] = useState(null);  // Estado para el horario de inicio
    const [endTime, setEndTime] = useState(null);  // Estado para el horario de fin
    const [startDateReservation, setStartDateReservation] = useState(null);  // Estado para la fecha de inicio reservacion

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validar que todos los campos estén llenos y que la fecha de inicio sea anterior a la de fin
        if (!startDate || !endDate || !startTime || !endTime) {
            alert("Por favor completa todos los campos");
            return;
        }

        if (startDate > endDate || (startDate === endDate && startTime >= endTime)) {
            alert("La fecha de inicio debe ser antes de la fecha de fin");
            return;
        }

        // Formatear los datos para enviarlos
        const reservationData = {
            startDate: format(startDate, 'yyyy-MM-dd'),
            startTime: format(startTime, 'HH:mm'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            endTime: format(endTime, 'HH:mm')
        };

        console.log("Datos de la reserva:", reservationData);
        // Aquí puedes enviar los datos a tu API o backend
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Fecha reservación:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" id="name" />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Estacionamiento:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" id="parkingName" />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Dirección estacionamiento:</label>
                    </div>
                    <div className="col-8">
                        <input type="text" className="form-control" id="parkingAddress" />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Nº de lugares disponibles:</label>
                    </div>
                    <div className="col-8">
                        <input type="text" className="form-control" id="parkingAddress" />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Horario inicio:</label>
                    </div>
                    <div className="col-4">
                        <DatePicker 
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Selecciona la fecha de inicio"
                                minDate={new Date() }  // Deshabilitar fechas pasadas
                                className="form-control"    
                                wrapperClassName="w-100" 
                               
                        />
                    </div>
                    <div className="col-4">
                        <DatePicker 
                            selected={startTime}
                            onChange={(time) => setStartTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Hora"
                            dateFormat="HH:mm"
                            placeholderText="Selecciona la hora de inicio"
                            className="form-control"    
                            wrapperClassName="w-100"   
                               
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Horario fin:</label>
                    </div>
                    <div className="col-4">
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Selecciona la fecha de fin"
                            minDate={startDate || new Date()}
                            className="form-control"    
                            wrapperClassName="w-100"   
                        />
                    </div>
                    <div className="col-4 mt-2">
                        <DatePicker
                            selected={endTime}
                            onChange={(time) => setEndTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Hora"
                            dateFormat="HH:mm"
                            placeholderText="Selecciona la hora de fin"
                            className="form-control"    
                            wrapperClassName="w-100" 
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label">Vehículos:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" id="parkingAddress" />
                    </div>
                </div>
            </div>
            {/* <div>
                <label>Fecha de Inicio:</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Selecciona la fecha de inicio"
                    minDate={new Date()}  // Deshabilitar fechas pasadas
                />
            </div>
            <div>
                <label>Hora de Inicio:</label>
                <DatePicker
                    selected={startTime}
                    onChange={(time) => setStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Selecciona la hora de inicio"
                />
            </div>
            <div>
                <label>Fecha de Fin:</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Selecciona la fecha de fin"
                    minDate={startDate || new Date()}  // Deshabilitar fechas anteriores a la fecha de inicio
                />
            </div>
            <div>
                <label>Hora de Fin:</label>
                <DatePicker
                    selected={endTime}
                    onChange={(time) => setEndTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Selecciona la hora de fin"
                />
            </div> */}
            <button type="submit">Reservar</button>
        </form>
    );
};

