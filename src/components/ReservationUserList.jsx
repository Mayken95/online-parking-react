import React, { useContext, useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../hooks/useFetchWithAuthTrigger";
import { VehicleItem } from './VehicleItem';  
import { useUser } from '../hooks/useUser';
import {Link, Navigate} from "react-router-dom";
import { ReservationsDataTable } from './ReservationsDataTable';
import { ReservationsParkingTable} from './ReservationsParkingTable';

export const ReservationsUserList = () => {
  const { user } = useUser();
  const [deletedVehicles, setDeletedVehicles] = useState([]);  // Para simular los vehículos borrados
  const [fetchUserData, setFetchUserData] = useState(false); 

  // Usar el hook personalizado para obtener la lista de vehículos  `${process.env.REACT_APP_API_URL}/reservations/?user=${user?.id}`,
  const { loading, error, responseData:reservations } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/accounting/reservations/?user__id=${user?.id}`,
     user?.token,
     'GET',
     null,
     fetchUserData
  );
  useEffect(() => {
    setFetchUserData(true);
  }, [])
  
  const HandleDelete = (reservationId) => {    
    alert(`Me conecto al api y la elimino ${reservationId}`)
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

  return (
    // <div className="container mt-4">      
    //    <table className="table table-bordered mt-4">
    //     <thead>
    //       <tr>
    //         <th>Placa</th>
    //         <th>Color</th>
    //         <th>Acciones</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {reservationsList.length > 0 ? (
    //         reservationsList.map(vehicle => (
    //           <VehicleItem
    //             key={vehicle.id}  
    //             vehicle={vehicle}  
    //             onDelete={handleDelete}  
    //           />
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="3">No hay vehículos para mostrar</td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table> 
    // </div>
    
    <ReservationsDataTable data={reservationsList} onDelete={HandleDelete}/>
  );
};