import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';

export const ReservationsDataTable = ({ data , onDelete}) => {
  const tableRef = useRef();

  useEffect(() => {
    let dataTableInstance = null;

    if (data.length > 0) {
      // Inicializar DataTable solo si hay datos
      dataTableInstance = $(tableRef.current).DataTable({
        responsive: true,
        dom: '<"top"f>rt<"bottom"ip>',
        destroy: true, // Asegura que se destruya cualquier instancia previa
      });
    }

    return () => {
      // Destruir la instancia de DataTable cuando se desmonte el componente o cambien los datos
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        dataTableInstance.destroy();
      }
    };
  }, [data]); // Reejecutar cuando los datos cambien

  return (
    <table ref={tableRef} className="table table-striped">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Parqueo</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((info) => (
            <tr key={info.id}>
              <td>{info.vehicle.plate}</td>
              <td>{info?.parking.name}</td>
              <td>{info?.schedule_time.date}</td>
              <td>{info?.schedule_time.start_time}</td>
              <td>{info?.schedule_time.end_time}</td>
              <td> <button 
                    className="btn btn-danger" 
                    onClick={() => onDelete(info.id)}
                    >
                    Borrar
                    </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay vehículos para mostrar</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
