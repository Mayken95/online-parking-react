import React , {useContext, useEffect} from 'react';
import {Link} from "react-router-dom";
import loginImage from '../assets/images/ecupark.png'; 
import { useUser } from "../hooks/useUser";

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
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src={loginImage}  className="img-fluid" alt="Login ECUPARK" />
              <div>Aqui va una imagen</div>
            </div>
            <div className="col-md-6 border border-primary d-flex align-items-center justify-content-center" style={{height: '100%'}}>
              <div className="d-grid gap-2">              
                <h1>BIENVENIDO</h1>
                <Link to="/login" className="btn btn-primary btn-lg mt-20">
                    Inicio de Sesión
                </Link>
                <Link to="/registrar" className="btn btn-primary btn-lg mt-20">
                    Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
};
