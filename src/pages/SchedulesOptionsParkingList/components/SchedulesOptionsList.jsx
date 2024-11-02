import React, {useEffect, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import { ScheduleOptionsParkingTable } from './ScheduleOptionsParkingTable';

export const SchedulesOptionsList = () => {
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [parkings, setParkings] = useState([]);

  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal

  useEffect(() => {
    const fetchUserParkings = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkings?user__id=${user.id}`);
      const data = await response.json();
      setParkings(data);
    };
    
    fetchUserParkings();
  }, [user.id]);

  useEffect(() => {
    if (!selectedParking) return;  // Si no hay un parqueo seleccionado, no ejecutar
  
    const fetchSchedulesParkings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkings/${selectedParking}/available_schedules/`);
        if (response.ok) {
          const data = await response.json();
          setSchedules(data);
        } else {
          throw new Error('Error al obtener los horarios');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchSchedulesParkings();
  }, [selectedParking]);
  

  return (
    <div className="container">
      <h2>Ver Horarios de Parqueo</h2>
      <div className="mb-3">
        <label>Selecciona el parqueo:</label>
        <select
          className="form-control"
          value={selectedParking}
          onChange={(e) => setSelectedParking(e.target.value)}
        >
        <option value="">Selecciona un parqueo</option>
          {parkings.map((parking) => (
            <option key={parking.id} value={parking.id}>
              {parking.name} (Capacidad: {parking.capacity})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Horarios del parqueadero:</label>
        {schedules.length > 0 ? (
            <ScheduleOptionsParkingTable dataSchedules={schedules} />
          ) : (
            <p>No hay horarios disponibles para este parqueo.</p>
          )}
      </div>
    </div>
  )

};
