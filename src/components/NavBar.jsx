import React from 'react'
import { NavLink } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
// export const NavBar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary">
//       <div className="container-fluid">
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <a className="nav-link" href="#">Reservar</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="#">Mis Reservas</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="#">Salir</a>
//             </li>
//           </ul>
          
//         </div>
//       </div>
//     </nav>
//   );
// };

export  const NavBar = () => {
  const { user } = useUser(); 

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="collapse navbar-collapse d-flex" id="navbarNav">
          <ul className="navbar-nav flex-grow-1">
            <li className="nav-item">
              <a className="nav-link">Hola { user?.name }!</a>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/">
                Mi Perfil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/vehiculos">
                Vehículos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/reservar">
                Reservar
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/reservaciones">
                Mis Reservas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/registrarHorarios">
                Crear horarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                to="/verHorariosParking">
                verHorariosParking
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

