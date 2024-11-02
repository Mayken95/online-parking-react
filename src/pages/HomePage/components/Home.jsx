import React, { useEffect} from 'react';
import {Link} from "react-router-dom";
import loginImage from '../../../assets/images/ecupark.png'; 
import { useUser } from "../../../hooks/useUser";

export const Home = () => {
  const { updateUser } = useUser();

  useEffect(() => {    
    updateUser({
      id: null,
      name: null,
      token: null,
    });
  }, []); 

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img src={loginImage} className="img-fluid" alt="Login ECUPARK" />
        </div>
        
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-primary text-white">
          <div className="text-center">
            <h1 className="mb-4">BIENVENIDO A ECUPARK</h1>
            <p className="lead mb-5">La mejor solución para gestionar tu parqueo</p>
            <div className="d-grid gap-3">
              <Link to="/login" className="btn btn-light btn-lg">
                Inicio de Sesión
              </Link>
              <Link to="/registrar" className="btn btn-outline-light btn-lg">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
