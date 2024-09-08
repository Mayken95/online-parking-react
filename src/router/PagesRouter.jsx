import React from "react";
import {Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ClientReservation } from "../pages/ClientReservation";
import { Reservations } from "../pages/Reservations";
import { Layout } from "../components/Layout";
import { ClientVehicles } from "../pages/ClientVehicles";
import { VehicleRegister } from "../pages/VehicleRegister";
import { PrivateRouter } from "./PrivateRouter";
import { SchedulesParkingList } from "../pages/SchedulesParkingList";
import {SchedulesOptionsParkingList } from "../pages/SchedulesOptionsParkingList";
export const PagesRouter = () => {
  return (
      <Routes>          
            <Route path="/" index exact element={<HomePage />} />
            <Route element={<Layout />}>              
                <Route path="/Login/" element={ <Login />} />
                <Route path="/registrar/" element={<Register />} />
                <Route path="/vehiculos" element={<PrivateRouter><ClientVehicles /></PrivateRouter>} />
                <Route path="/registrarVehiculo" element={<PrivateRouter><VehicleRegister/></PrivateRouter>} />
                <Route path="/reservar" element={<PrivateRouter><ClientReservation /></PrivateRouter>} />
                <Route path="/reservaciones/" element={<PrivateRouter><Reservations /></PrivateRouter>} /> 
                <Route path="/registrarHorarios/" element={<PrivateRouter><SchedulesParkingList/></PrivateRouter>} /> 
                <Route path="/verHorariosParking/" element={<PrivateRouter><SchedulesOptionsParkingList/></PrivateRouter>} />                                         
           </Route>
           <Route path="*" element={<HomePage />} />
      </Routes>
  );
};
