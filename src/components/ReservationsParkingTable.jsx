import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';

export const ReservationsParkingTable = ({ data, onDelete , onPay}) => {
  const tableRef = useRef();

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
  return (
    <table ref={tableRef} className="table table-striped">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Parqueo</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>Monto</th>
          <th>Status</th>
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
              <td>{note && (<span className={className}>{note}</span>)}</td>
              <td>{totalTimeElapsed } min</td>
              <td> <button 
                    className="btn btn-danger" 
                    onClick={() => onDelete(info.id)}
                    >
                    Borrar
                    </button>
              </td>
              <td> <button 
                    className="btn btn-success" 
                    onClick={() => onPay(info.id,totalTimeElapsed,info?.payAmount)}
                    >
                    Pagar
                    </button>
              </td>
            </tr>

          )})
        ) : (
          <tr>
            <td colSpan="11">No hay reservaciones para mostrar</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
