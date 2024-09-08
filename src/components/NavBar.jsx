import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export const NavBar = () => {
  const { user } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fs-3 text-light" to="/">
          ECUPARK
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <span className="nav-link fs-5 text-light"><b>¡Hola, {user?.name}!</b></span>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-light`}
                to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-light`}
                to="/vehiculos">
                Vehículos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-light`}
                to="/reservar">
                Reservar
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-light`}
                to="/registrarHorarios">
                Crear horarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-light`}
                to="/verHorariosParking">
                Ver Horarios Parking
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${ isActive ? 'active' : '' } fs-5 text-danger`}
                to="/">
                Cerrar Sesión
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
