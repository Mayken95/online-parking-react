import React from 'react'
import { ScheduleOptionItem } from './ScheduleOptionItem'

export const ScheduleOptionsParkingTable = ({dataSchedules, handleDelete}) => {
  return (
    <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataSchedules.length > 0 ? (
            dataSchedules.map(schedule => (
              <ScheduleOptionItem
                key={schedule.parkingschedule_id}  
                schedule={schedule}  
                onDelete={handleDelete}  
              />
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay horarios para mostrar</td>
            </tr>
          )}
        </tbody>
      </table> 
  )
}
