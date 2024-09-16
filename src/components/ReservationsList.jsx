import React, { useEffect, useState } from 'react';
import { useFetchWithAuthTrigger } from "../hooks/useFetchWithAuthTrigger";
import { useUser } from '../hooks/useUser';
import { ReservationsParkingTable } from './ReservationsParkingTable';
import DatePicker from 'react-datepicker';
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
