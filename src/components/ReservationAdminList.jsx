import React, { useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../hooks/useFetchWithAuthTrigger";
import { useUser } from '../hooks/useUser';
import { ReservationsParkingTable } from './ReservationsParkingTable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const ReservationsAdminList = () => {
  const [loadingModal, setLoadingModal] = useState(false); 
  const { user } = useUser(); 
  const [parkings, setParkings] = useState([]); // Lista de parqueos
  const [selectedParking, setSelectedParking] = useState(null); // Parqueo seleccionado
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [reservations, setReservations] = useState([]); // Lista de reservaciones
  const [searchAction, setSearchAction] = useState(false); // Indica si se ha presionado el botón "Buscar"

  const [fetchUserData, setFetchUserData] = useState(false);

  const { loading, error, responseData } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/organization/parkings/?user_id=${user.id}`,
    user?.token,
    'GET',
    null,
    fetchUserData
  );

  // Cargar los parqueos del usuario
  useEffect(() => {
    setFetchUserData(true);
  }, []);

  useEffect(() => {
    if (responseData) {
      setParkings(responseData);
    }
  }, [responseData]);

  // Función para buscar las reservaciones al presionar el botón "Buscar"
  const fetchReservationsByParkingAndDate = async () => {
    if (!selectedParking || !selectedDate) {
      alert("Por favor selecciona un parqueo y una fecha antes de buscar.");
      return;
    }

    setLoadingModal(true); 
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${process.env.REACT_APP_API_URL}/accounting/reservations/?parking=${selectedParking}&parkingSchedule__date=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data); // Guardar las reservaciones en el estado
      } else {
        throw new Error('Error al obtener las reservaciones');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingModal(false); // Terminar la carga
    }
  };

  const handleParkingChange = (e) => {
    setSelectedParking(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = () => {
    setSearchAction(true);
    fetchReservationsByParkingAndDate();
  };

  const HandleDelete = (reservationId) => {    
    alert(`Me conecto al api y la elimino ${reservationId}`);
  };

  const onPay = (reservationId, totalTimeElapsed, amountPay) => {    
    alert(`Me conecto al api y pago la reserva ${reservationId}`);
  };

  if (loading || loadingModal) return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Espere un momento</h3>
      </div>
    </div>
  );
  
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="container-fluid border border-4 mt-5">
        <div className="row mt-5 text-center">
          <h1>Reservaciones</h1>
          <br />
          <div className="container">
            <div className="row mt-2 p-10">
              <div className="col-4 text-end">
                <label className="form-label fs-5">Selecciona el parqueo:</label>
              </div>
              <div className="col-5">
                <select
                  className="form-control"
                  value={selectedParking}
                  onChange={handleParkingChange}
                >
                  <option value="">Selecciona un parqueo</option>
                  {parkings.map((parking) => (
                    <option key={parking.id} value={parking.id}>
                      {parking.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-2  p-10 text-center">
                <div className="col-8">
                    <label className="col-4 form-label fs-5">Selecciona la fecha:</label>
                    <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control col-4 w-80"
                    placeholderText="Selecciona una fecha"
                    />
                    <button 
                        className="btn btn-primary col-4 w-60" 
                        onClick={handleSearch}
                    >
                    Buscar
                  </button>
                </div>
            </div>
          </div>
        </div>
        {searchAction && (
        <ReservationsParkingTable 
          data={reservations} 
          onDelete={HandleDelete} 
          onPay={onPay} 
        />
      )}
      </div>

      {/* Mostrar las reservaciones en ReservationsParkingTable solo si se presionó buscar */}
     
    </>
  );
};
