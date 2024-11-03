import React, { useContext, useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
import { useUser } from '../../../hooks/useUser';
import {Link, Navigate} from "react-router-dom";
import { ReservationsDataTable2 } from './ReservationsDataTable2';
//import { ReservationsDataTable } from './ReservationsDataTable';
import { ReservationsParkingTable} from './ReservationsParkingTable';
import { ConfirmationModal } from './ConfirmationModal';
import {SuccessModal} from './SuccessModal';
import {ErrorModal} from './ErrorModal';

export const ReservationsUserList = () => {
  const { user } = useUser();
  const [deletedVehicles, setDeletedVehicles] = useState([]);  // Para simular los vehículos borrados
  const [fetchUserData, setFetchUserData] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  // Usar el hook personalizado para obtener la lista de vehículos  `${process.env.REACT_APP_API_URL}/reservations/?user=${user?.id}`,
  const { loading, error, responseData:reservations } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/accounting/reservations/?user_id=${user?.id}`,
     user?.token,
     'GET',
     null,
     fetchUserData
  );

  useEffect(() => {
    setFetchUserData(true);
  }, [])


  
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
    
      //alert('Reserva eliminada con éxito.');      
      setShowModal(false);
      setShowSuccessModal(true);
      setShowErrorModal(false);

      setFetchUserData(false); 
      setTimeout(() => setFetchUserData(true), 0); 

    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setShowSuccessModal(false);
      setShowModal(false);
      //alert('Hubo un error al eliminar la reserva.');
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

  const reservationsList = reservations ?reservations: [];

  if (loading) return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Espere un momento</h3>
      </div>
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (<>
            <h1>Mis Reservaciones</h1>
            <ReservationsDataTable2 data={reservationsList} onDelete={HandleDelete} handleOpenModal={handleOpenModal}/>
            {showModal && (<ConfirmationModal  handleCloseModal={handleCloseModal}  handleDelete={HandleDelete}/>)}
            
            {showSuccessModal && (
                <SuccessModal
                  handleClose={handleCloseSuccessModal}
                  message="Reserva cancelada con éxito."
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