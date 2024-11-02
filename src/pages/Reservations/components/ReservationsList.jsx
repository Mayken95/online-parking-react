import React from 'react';
import { useUser } from '../../../hooks/useUser';
import 'react-datepicker/dist/react-datepicker.css';
import { ReservationsAdminList } from './ReservationAdminList';
import { ReservationsUserList } from './ReservationUserList';

export const ReservationsList = () => {
  const { user } = useUser(); 
  
  return (
   <>
     {user.role == "adminParking" && (
        <ReservationsAdminList/>
      ) } 

    {user.role == "user" && (
        <ReservationsUserList/>
      ) } 

   </>
       
       
      
  );
};
