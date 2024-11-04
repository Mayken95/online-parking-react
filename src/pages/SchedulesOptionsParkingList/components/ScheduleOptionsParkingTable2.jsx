import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../assets/styles/global.css';

export const ScheduleOptionsParkingTable2 = ({ dataSchedules, onDelete }) => {
  const columns = [
    {
      name: 'Fecha',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'Horario',
      selector: row => `Inicio: ${row.schedule.start_time} - Fin: ${row.schedule.end_time}`,
      sortable: true,
    },
    {
      name: 'Capacidad',
      selector: row => row.available_capacity,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: row => (
        //     <button 
        //     className="btn btn-danger" 
        //     onClick={() => onDelete(row.parkingschedule_id)}
        //     >
        //     Borrar
        //   </button>
        <></>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={dataSchedules}
      noDataComponent="No hay horarios para mostrar"
      pagination
      highlightOnHover
      className="parking-schedules-datatable"
    />
  );
};


