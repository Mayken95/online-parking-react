import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { useUser } from '../hooks/useUser';  
import{ PopUp } from './PopUp';
import { useNavigate } from "react-router-dom"; 

export const SchedulesRegister = () => {
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [date, setDate] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const navigate = useNavigate();
  // Cargar los parqueos correspondientes al usuario logueado
  useEffect(() => {
    const fetchUserParkings = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkings?user__id=${user.id}`);
      const data = await response.json();
      setParkings(data);
    };
    
    fetchUserParkings();
  }, [user.id]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/schedules/`);
      const data = await response.json();
      setSchedules(data);
    };    
    fetchSchedules();
  }, []);

  const handleScheduleChange = (scheduleId) => {
    setSelectedSchedules(prevState => 
      prevState.includes(scheduleId)
        ? prevState.filter(id => id !== scheduleId) 
        : [...prevState, scheduleId] 
    );
  };

  const handleSubmit = async () => {
    if (!date || !selectedParking || selectedSchedules.length === 0) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Mostrar el modal con mensaje que esta Guardando
    setModalMessage('Espere un momento, guardando cambios...');
    setShowModal(true);

    try {
      // Crear y enviar los horarios seleccionados 
      for (let scheduleId of selectedSchedules) {
        const payload = {
          date: date.toISOString().split('T')[0],  // Convertir la fecha al formato 'yyyy-mm-dd'
          available: true,  
          parking: selectedParking,
          schedule: scheduleId,
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkingschedules/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Error al crear el horario');
        }
      }
      setModalMessage('Guardado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Hubo un error al guardar los horarios');
    }
  };

  const closeModal = () => {
    setShowModal(false);  

    if (modalMessage === 'Guardado exitosamente') {
        navigate('/verHorariosParking');  
    }
  };

  return (
    <div className="container">
      <h2>Crear Horario de Parqueo</h2>

      <div className="mb-3">
        <label>Fecha:</label>
        <DatePicker
          selected={date}
          onChange={(selectedDate) => setDate(selectedDate)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
          placeholderText="Selecciona una fecha"
          minDate={new Date() } 
        />
      </div>

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
        <label>Selecciona los horarios:</label>
        {schedules.map((schedule) => (
          <div key={schedule.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`schedule-${schedule.id}`}
              checked={selectedSchedules.includes(schedule.id)}
              onChange={() => handleScheduleChange(schedule.id)}
            />
            <label htmlFor={`schedule-${schedule.id}`} className="form-check-label">
            {`Inicio: ${schedule.start_time} - Fin: ${schedule.end_time}`}
            </label>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Guardar Horarios
      </button>

      {showModal && (<PopUp message={modalMessage} closeModal={closeModal}/>
       
      )}
    </div>
  );
};
