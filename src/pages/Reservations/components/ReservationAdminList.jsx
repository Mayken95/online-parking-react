import React, { useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
import { useUser } from '../../../hooks/useUser';
//import { ReservationsParkingTable } from './ReservationsParkingTable';
import { ReservationsParkingTable2 } from './ReservationsParkingTable2';
import DatePicker from 'react-datepicker';
import { ConfirmationModal } from './ConfirmationModal';
import {SuccessModal} from './SuccessModal';
import {ErrorModal} from './ErrorModal';

import 'react-datepicker/dist/react-datepicker.css';

export const ReservationsAdminList = () => {
  const [loadingModal, setLoadingModal] = useState(false);
  const { user } = useUser();
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [searchAction, setSearchAction] = useState(false);

  const [fetchUserData, setFetchUserData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);


  const { loading, error, responseData } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/organization/parkings/?user_id=${user.id}`,
    user?.token,
    'GET',
    null,
    fetchUserData
  );

  useEffect(() => {
    setFetchUserData(true);
  }, []);

  useEffect(() => {
    if (responseData) {
      setParkings(responseData);
    }
  }, [responseData]);

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
        setReservations(data);
      } else {
        throw new Error('Error al obtener las reservaciones');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingModal(false);
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

  const handleOpenModal = (reservationId) => {
    setReservationToDelete(reservationId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReservationToDelete(null);
  };

  const HandleDelete = async (reservationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/accounting/reservations/${reservationToDelete}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al eliminar la reserva');

     // alert('Reserva eliminada con éxito.');
      setShowModal(false);
      setShowErrorModal(false);
      setShowSuccessModal(true);
      handleSearch();
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setShowModal(false);
      setShowSuccessModal(false);
     // alert('Hubo un error al eliminar la reserva.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setShowSuccessModal(false);
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
            <div className="row mt-2">
              <div className="col-md-4 text-end">
                <label className="form-label fs-5">Selecciona el parqueo:</label>
              </div>
              <div className="col-md-5">
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
            <div className="row mt-3">
              <div className="col-md-8 d-flex justify-content-center align-items-center">
                <div className="col-md-6">
                  <label className="form-label fs-5">Selecciona la fecha:</label>

                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="Selecciona una fecha"                  />
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  className="btn btn-primary w-100"  // Quita el w-100 para mantener su tamaño natural
                  onClick={handleSearch}
                >
                  Buscar Reservaciones
                </button>
              </div>
            </div>
          </div>
        </div>
        {searchAction && (
          <ReservationsParkingTable2
            data={reservations}
            onDelete={HandleDelete}
            openModal={handleOpenModal}
            onPaymentSuccess={handleSearch}
            
          />
        )}
      </div>
      {showModal && (<ConfirmationModal  handleCloseModal={handleCloseModal}
                             handleDelete={HandleDelete}/>)}

      {showSuccessModal && (
                <SuccessModal
                  handleClose={handleCloseSuccessModal}
                  message="La Reserva fue cancelada con éxito."
                />
              )}

      {showErrorModal && (
        <ErrorModal
          handleCloseError={handleCloseErrorModal}
          message="Hubo un error al eliminar la reserva."
        />
      )}
    </>
  );
};
