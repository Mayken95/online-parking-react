import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';

export const ReservationsParkingTable = ({ data, onDelete}) => {
  const tableRef = useRef();
  const { user } = useUser(); 
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservationInfo, setReservationsInfo] = useState(null);
  const [amountToPay, setAmountToPay] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let dataTableInstance = null;

    // Destruir cualquier instancia previa de DataTables antes de reinicializar
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().clear().destroy(); 
    }

    // Inicializar DataTable solo si hay datos
    if (data.length > 0) {
      dataTableInstance = $(tableRef.current).DataTable({
        responsive: true,
        lengthChange: false, // Desactiva "Entries per page"
        dom: '<"top"f>rt<"bottom"ip>', 
        language: {
            search: "Buscar:", 
          emptyTable: "No hay reservaciones disponibles por mostrar", // Personaliza el mensaje de DataTables
        },
      });
    }

    // Limpiar la instancia de DataTable cuando se desmonte el componente o cambien los datos
    return () => {
      if (dataTableInstance) {
        dataTableInstance.destroy();
      }
    };
  }, [data]); // Reejecutar cuando los datos cambien

  let checkReservationStatus = (reservationDate, startTime, endTime) => {
    const currentTime = new Date();
    const startTimeDate = new Date(`${reservationDate}T${startTime}`);
    const endTimeDate = new Date(`${reservationDate}T${endTime}`);

    const differenceToEnd = endTimeDate - currentTime;
    const differenceFromStart = currentTime - startTimeDate;
    const totalTimeElapsed = Math.floor(differenceFromStart / (1000 * 60));

    if (currentTime < startTimeDate) {
      return { status: "No iniciado", className: "btn btn-primary", note: "", totalTimeElapsed: 0 };
    } else if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
      const minutesRemaining = Math.floor(differenceToEnd / (1000 * 60));
      return { status: "En Progreso", className: "btn btn-info", note: `${minutesRemaining} min restantes` , totalTimeElapsed: totalTimeElapsed};
    } else {
      const minutesOverdue = Math.floor(-differenceToEnd / (1000 * 60));
      return { status: "Finalizado", className: "btn btn-danger", note: `${minutesOverdue} min pasados` , totalTimeElapsed: totalTimeElapsed};
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
    <table ref={tableRef} className="table table-striped">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Parqueo</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>Monto</th>
          <th>Estado Parqueo</th>
          <th>Estado Reserva</th>
          <th>Comentarios</th>
          <th>Tiempo Transcurrido</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((info) => {
            const { status, className, note , totalTimeElapsed} = checkReservationStatus(info?.schedule_time.date,info.schedule_time?.start_time, info.schedule_time?.end_time);
            return (
            <tr key={info.id}>
              <td>{info.vehicle.plate}</td>
              <td>{info?.parking.name}</td>
              <td>{info?.schedule_time.date}</td>
              <td>{info?.schedule_time.start_time}</td>
              <td>{info?.schedule_time.end_time}</td>
              <td>${info?.payAmount}</td>
              <td>{status}</td>
              <td>{info.state=="A"?"Activa":(info.state=="P"?"Pagado":"Cancelada")}</td>
              <td>{note && (<span className={className}>{note}</span>)}</td>
              <td>{totalTimeElapsed } min</td>
              <td> <button 
                    className="btn btn-danger" 
                    onClick={() => onDelete(info.id)}
                    >
                    Borrar
                    </button>
              </td>
              <td> {info.state!="P" &&(<button 
                    className="btn btn-success" 
                    onClick={() => handlePay(info.id, info)}
                    >
                    Pagar
                    </button>
                    )} 
              </td>
            </tr>

          )})
        ) : (
          <tr>
            <td colSpan="12">No hay reservaciones para mostrar</td>
          </tr>
        )}
      </tbody>
    </table>
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
