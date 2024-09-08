import React, { useContext, useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../hooks/useFetchWithAuthTrigger";
import { VehicleItem } from './VehicleItem';  
import { useUser } from '../hooks/useUser';
import {Link} from "react-router-dom";

export const VehiclesList = () => {
  const { user } = useUser();
  const [deletedVehicles, setDeletedVehicles] = useState([]);  // Para simular los vehículos borrados
  const [fetchUserData, setFetchUserData] = useState(false); 
  // Usar el hook personalizado para obtener la lista de vehículos  `${process.env.REACT_APP_API_URL}/vehicles/?user=${user?.id}`,
  const { loading, error, responseData:vehicles } = useFetchWithAuthTrigger(
    `${process.env.REACT_APP_API_URL}/vehicles/?plate=&user__id=${user?.id}`,
     user?.token,
     'GET',
     null,
     fetchUserData
  );
  useEffect(() => {
    setFetchUserData(true);
  }, [])
  
  const handleDelete = (vehicleId) => {
    setDeletedVehicles((prev) => [...prev, vehicleId]);
    alert(`Vehículo con ID ${vehicleId} borrado! (Simulación)`);  
  };

  const visibleVehicles = vehicles ? vehicles.filter(vehicle => !deletedVehicles.includes(vehicle.id)):[];

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>Listado de Vehículos</h2>
        <Link to="/registrarVehiculo" className="btn btn-primary btn-lg mt-20">+ Agregar Vehículo</Link>
      </div>
      
       <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibleVehicles.length > 0 ? (
            visibleVehicles.map(vehicle => (
              <VehicleItem
                key={vehicle.id}  
                vehicle={vehicle}  
                onDelete={handleDelete}  
              />
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay vehículos para mostrar</td>
            </tr>
          )}
        </tbody>
      </table> 
    </div>
  );
};
