import React from "react";
import {Route, Routes } from "react-router-dom";
import { PrivateRouter } from "./PrivateRouter";
import { Layout } from "../components/Layout";
import { HomePage, 
         Login,
         Register,
         ClientReservation,
         Reservations,
         ClientVehicles,
         VehicleRegister,
         SchedulesParkingList,
         SchedulesOptionsParkingList,
         Profile

 } from "../pages";


export const PagesRouter = () => {
  return (
      <Routes>          
            <Route path="/" index exact element={<HomePage />} />
            <Route element={<Layout />}>              
                <Route path="/Login/" element={ <Login />} />
                <Route path="/registrar/" element={<Register />} />
                <Route path="/vehiculos" element={<PrivateRouter allowedRoles={['user']}><ClientVehicles /></PrivateRouter>} />
                <Route path="/registrarVehiculo" element={<PrivateRouter allowedRoles={['user']}><VehicleRegister/></PrivateRouter>} />
                <Route path="/reservar" element={<PrivateRouter allowedRoles={['user']}><ClientReservation /></PrivateRouter>} />
                <Route path="/reservaciones" element={<PrivateRouter allowedRoles={['user','adminParking']}><Reservations /></PrivateRouter>} /> 
                <Route path="/registrarHorarios/" element={<PrivateRouter allowedRoles={['adminParking']}><SchedulesParkingList/></PrivateRouter>} /> 
                <Route path="/verHorariosParking/" element={<PrivateRouter  allowedRoles={['adminParking']}><SchedulesOptionsParkingList/></PrivateRouter>} />                                         
                <Route path="/perfil" element={<PrivateRouter allowedRoles={['user','adminParking']}><Profile /></PrivateRouter>} /> 
           </Route>
           <Route path="*" element={<HomePage />} />
      </Routes>
  );
};
