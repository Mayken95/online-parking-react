import React from 'react';

export const ScheduleOptionItem = ({ schedule, onDelete }) => {
  return (
    <tr>
      <td>{schedule.date}</td>
      <td>{`Inicio: ${schedule.schedule.start_time} - Fin: ${schedule.schedule.end_time}`}</td>
      <td>{schedule.available_capacity}</td>
      <td>
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(schedule.parkingschedule_id)}
        >
          Borrar
        </button>
      </td>
    </tr>
  );
};
