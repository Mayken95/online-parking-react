import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
import React, { useState, useCallback } from 'react';

export const useDeleteVehicle = (token) => {
  const [vehicleId, setVehicleId] = useState(null); 
  const [fetchUserData, setFetchUserData] = useState(false);

  const { loading, error, responseData } = useFetchWithAuthTrigger(
    fetchUserData ? `${process.env.REACT_APP_API_URL}/vehicles/${vehicleId}/` : null,  
    token,
    'DELETE',
    null,
    fetchUserData  
  );

  const triggerDelete = useCallback((id) => {
    setVehicleId(id);
    setFetchUserData(true);
  }, []);

  return { loading, error, responseData, triggerDelete };
};
