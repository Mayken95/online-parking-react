import React, { useState, useEffect } from 'react';
import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from "react-router-dom";

export const ReservationForm = () => {
  const [selectedParking, setSelectedParking] = useState(null);
  const [parkings, setParkings] = useState([]);
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState({}); // Guardar la info del vehículo seleccionado
  const [selectedParkingInfo, setSelectedParkingInfo] = useState({
    name: '',
    address: '',
    capacity: ''
  });
  const [fetchUserData, setFetchUserData] = useState(false); 
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, error, responseData: vehicles } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/vehicles/?plate=&user__id=${user?.id}`,
    user?.token,
    'GET',
    null,
    fetchUserData
  );

  useEffect(() => {
    setFetchUserData(true);
  }, []);

  // Cargar la lista de parqueos c
  useEffect(() => {
    const fetchUserParkings = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkings/`);
      const data = await response.json();
      setParkings(data);
    };
    fetchUserParkings();
  }, [user.id]);

  // LLenado de info automaticamente al seleccionar parqueo
  const handleParkingChange = (e) => {
    const selectedId = e.target.value;
    const parking = parkings.find((p) => p.id === parseInt(selectedId));

    if (parking) {
      setSelectedParking(parking.id);
      setSelectedParkingInfo({
        name: parking.name,
        address: parking.address,
        capacity: parking.capacity
      });
    }
  };

  // Cargar horarioss
  useEffect(() => {
    if (!selectedParking) return; // Si no hay un parqueo , no ejecutar

    const fetchSchedulesParkings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/organization/parkings/${selectedParking}/available_schedules/`);
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    fetchSchedulesParkings();
  }, [selectedParking]);

  const handleVehicleChange = (e) => {
    const selectedPlate = e.target.value;
    const vehicle = vehicles.find(v => v.plate === selectedPlate);

    if (vehicle) {
      setSelectedVehicle(vehicle);
      setVehicleDetails({
        plate: vehicle.plate,
        color: vehicle.color,
        user: vehicle.user
      });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const reservationData = {
      vehicle: {
        id: selectedVehicle?.id,
        plate: selectedVehicle?.plate,
        color: selectedVehicle?.color,
        user: selectedVehicle?.user.id
      },
      state:"A",
      parking: selectedParking,
      parkingSchedule: selectedSchedule
    };

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/accounting/reservations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });

       if (response.status >= 400 && response.status < 600) {
            const errorData = await response.json(); 
            throw new Error(`Error ${response.status}: ${errorData || 'Error al registrar la reservacion.'}`);
        } 
        navigate("/reservaciones");

    } catch (error) {
        setErrorMessage(error.message); 
    }
  };

  return (
    <div className="container border border-4 mt-5">
        <div className="row mt-5 text-center">
            <h1>Realiza una reservación!</h1>
            <br/>
            <form className="mt-5" onSubmit={handleSubmit}>
            <div className="container">
                {/* Seleccionar parqueo */}
                <div className="row mt-2">
                <div className="col-4 text-end">
                    <label className="form-label fs-5">Selecciona el parqueo:</label>
                </div>
                <div className="col-6">
                    <select
                    className="form-control"
                    value={selectedParking}
                    onChange={handleParkingChange}
                    >
                    <option value="">Selecciona un parqueo</option>
                    {parkings.map((parking) => (
                        <option key={parking.id} value={parking.id}>
                        {parking.name} (Capacidad: {parking.capacity})
                        </option>
                    ))}
                    </select>
                </div>
                </div>

                {selectedParking && (
                <>
                    <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="name" className="form-label fs-5">Estacionamiento:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={selectedParkingInfo.name} readOnly />
                    </div>
                    </div>
                    <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="address" className="form-label fs-5">Dirección estacionamiento:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={selectedParkingInfo.address} readOnly />
                    </div>
                    </div>
                    <div className="row mt-2">
                    <div className="col-4 text-end">
                        <label htmlFor="capacity" className="form-label fs-5">Capacidad disponible:</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={selectedParkingInfo.capacity} readOnly />
                    </div>
                    </div>
                </>
                )}

                {/* Seleccionar horario */}
                <div className="row mt-2">
                <div className="col-4 text-end fs-5">
                    <label>Horarios del parqueadero:</label>
                </div>
                <div className="col-6">
                    {schedules.length > 0 ? (
                    <select
                        className="form-control"
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                    >
                        <option value="">Selecciona un horario</option>
                        {schedules.map((schedule) => (
                        <option key={schedule.parkingschedule_id} value={schedule.parkingschedule_id}>
                            {`Fecha: ${schedule.date} - Inicio: ${schedule.schedule.start_time} - Fin: ${schedule.schedule.end_time}`}
                        </option>
                        ))}
                    </select>
                    ) : (
                    <p>No hay horarios disponibles para este parqueo.</p>
                    )}
                </div>
                </div>

                <div className="row mt-2">
                <div className="col-4 text-end fs-5">
                    <label htmlFor="vehicle" className="form-label">Vehículos:</label>
                </div>
                <div className="col-6">
                    <select
                    className="form-control"
                    value={selectedVehicle?.plate}
                    onChange={handleVehicleChange}
                    >
                    <option value="">Selecciona un vehículo</option>
                    {vehicles && vehicles.length > 0 ? (
                        vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.plate}>
                            {vehicle.plate} (Color: {vehicle.color})
                        </option>
                        ))
                    ) : (
                        <p>No hay vehículos para mostrar</p>
                    )}
                    </select>
                </div>
                </div>
            </div>

            <button type="submit" className='btn btn-primary col-6 mt-5 mb-5'>Reservar</button>
            </form>
    </div>
    </div>
  );
};
