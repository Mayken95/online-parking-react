import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import DataTable from 'react-data-table-component';

import '../../../assets/styles/global.css';

export const ReservationsParkingTable2 = ({ data, onDelete, openModal}) => {

  const { user } = useUser(); 
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservationInfo, setReservationsInfo] = useState(null);
  const [amountToPay, setAmountToPay] = useState(null); 
  const [showModal, setShowModal] = useState(false);


  const [searchTerm, setSearchTerm] = useState('');

  // Filtra los datos según el término de búsqueda
  const filteredData = data.filter(item =>
    item.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.schedule_time.date.includes(searchTerm) ||
    item.schedule_time.start_time.includes(searchTerm) ||
    item.schedule_time.end_time.includes(searchTerm) ||
    (item.payAmount && item.payAmount.toString().includes(searchTerm)) ||
    (item.state && (item.state === "A" ? "Activa" : item.state === "P" ? "Pagado" : "Cancelada").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Barra de búsqueda
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    { name: 'Placa', selector: row => row.vehicle.plate, sortable: true },
    { name: 'Parqueo', selector: row => row.parking.name, sortable: true },
    { name: 'Fecha', selector: row => row.schedule_time.date, sortable: true },
    { name: 'Hora Inicio', selector: row => row.schedule_time.start_time, sortable: true },
    { name: 'Hora Fin', selector: row => row.schedule_time.end_time, sortable: true },
    { name: 'Monto', selector: row => `$${row.payAmount}`, sortable: true },
    {
      name: 'Estado Parqueo',
      cell: row => {
        const { status, className } = checkReservationStatus(row.schedule_time.date, row.schedule_time.start_time, row.schedule_time.end_time, row.state);
        return <span className={className}>{status}</span>;
      },
      sortable: true,
    },
    {
      name: 'Estado Reserva',
      selector: row => (row.state === "A" ? "Activa" : row.state === "P" ? "Pagado" : "Cancelada"),
      sortable: true,
    },
    {
      name: 'Comentarios',
      cell: row => {
        const { note, className } = checkReservationStatus(row.schedule_time.date, row.schedule_time.start_time, row.schedule_time.end_time, row.state);
        return note ? <span className={className}>{note}</span> : null;
      },
    },
    { name: 'Tiempo Transcurrido', selector: row => `${checkReservationStatus(row.schedule_time.date, row.schedule_time.start_time, row.schedule_time.end_time, row.state).totalTimeElapsed} min`, sortable: true },
    {
      name: '',
      cell: row => (row.state !== "C" && row.state !== "P") && (
        <button className="btn btn-danger" onClick={() =>  openModal(row.id)}>
          Borrar
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: '',
      cell: row =>
        (row.state !== "C" && row.state !== "P") && (
          <button className="btn btn-success" onClick={() => handlePay(row.id, row)}>
            Pagar
          </button>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  let checkReservationStatus = (reservationDate, startTime, endTime, statusReservation) => {
    const currentTime = new Date();
    const startTimeDate = new Date(`${reservationDate}T${startTime}`);
    const endTimeDate = new Date(`${reservationDate}T${endTime}`);

    const differenceToEnd = endTimeDate - currentTime;
    const differenceFromStart = currentTime - startTimeDate;
    const totalTimeElapsed = Math.floor(differenceFromStart / (1000 * 60));

    if(statusReservation!="C"){
      if (currentTime < startTimeDate) {
        return { status: "No iniciado", className: "btn btn-primary", note: "", totalTimeElapsed: 0 };
      } else if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
        const minutesRemaining = Math.floor(differenceToEnd / (1000 * 60));
        return { status: "En Progreso", className: "btn btn-info", note: `${minutesRemaining} min restantes` , totalTimeElapsed: totalTimeElapsed};
      } else {
        const minutesOverdue = Math.floor(-differenceToEnd / (1000 * 60));
        return { status: "Finalizado", className: "btn btn-danger", note: `${minutesOverdue} min pasados` , totalTimeElapsed: totalTimeElapsed};
      }
    }
    
    if(statusReservation=="C"){
      return { status: "Cancelado", className: "btn btn-warning", note: "" , totalTimeElapsed:0};
    }
  };
   // Función para abrir el modal y calcular el monto a pagar
   const handlePay = async (reservationId, reservationInfo) => {
    setShowModal(true);
    setSelectedReservation(reservationId);
    setReservationsInfo(reservationInfo);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/accounting/reservations/${reservationId}/calcular_valor_a_pagar/`, {
        headers: {
          'Authorization': `Bearer ${user.token}`, // Si tienes un token de autenticación
        },
      });
  
      const result = await response.json();
      
      // Verifica si la respuesta contiene el campo esperado
      if (result && result.total_payment) {
        setAmountToPay(result.total_payment); // Establece el monto a pagar
      } else {
        console.error("Error: La respuesta no contiene el monto a pagar");
      }
    } catch (error) {
      console.error("Error al conectar con el API", error);
    }
  };
  
  const handleProceedPayment = async (reservationId, amountToPay) => {
    if (!reservationId || !amountToPay) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/accounting/reservations/${reservationId}/pay/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Si es necesario un token
        },
        body: JSON.stringify({
          payAmount: amountToPay
        }),
      });
  
      // Verifica si la respuesta es exitosa basándote en el código de estado
      if (response.status >= 200 && response.status < 300) {
        alert('Pago realizado con éxito');
        setShowModal(false); // Cierra el modal
        setAmountToPay(null); // Limpia el monto
        // Aquí podrías actualizar la tabla o realizar alguna otra acción
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al conectar con el API", error);
    }
  };


  return (
    <>
    <label>Buscar:</label>
    <DataTable
      className="my-table"
      columns={columns}
      data={filteredData}
      noDataComponent="No hay reservaciones para mostrar"
      pagination
      highlightOnHover
      striped
      subHeader
      subHeaderComponent={
        <>         
          <input
            type="text"
            placeholder=""
            className="form-control"
            value={searchTerm}
            onChange={handleSearch}
          />
         
        </>
       }
    />
      {/* Modal para mostrar el monto y proceder con el pago */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Realizar Pago</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false);
                  setSelectedReservation(null);
                  setReservationsInfo(null);
                  }}></button>
              </div>
              <div className="modal-body">
                <p><b>Cajero:</b> {user.name}</p>
                <p><b>Reserva:</b> {reservationInfo.id}</p>
                <p><b>Vehículo:</b> {reservationInfo.vehicle.plate}</p>
                <p><b>Monto a pagar:</b> {amountToPay ? `$${amountToPay}` : "Calculando..."}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={()=>handleProceedPayment(selectedReservation, amountToPay)}
                >
                  Proceder Pago
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                onClick={() =>{
                  setShowModal(false);
                  setSelectedReservation(null);
                  setReservationsInfo(null);
                } }
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     </>
  );
};
