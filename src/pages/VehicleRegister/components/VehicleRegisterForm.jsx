import React, { useState, useEffect } from 'react';
import { useForm } from "../../../hooks/useForm";
import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../../hooks/useUser';

export const VehicleRegisterForm = () => {
  const { user } = useUser();
  const { formState, onInputChange } = useForm({
    plate: "",
    color: "",
  });
  const { plate, color } = formState;
  const [fetchUserData, setFetchUserData] = useState(false);  // Controla el trigger del fetch
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const authToken = user?.token;

  const areAllFieldsFilled = () => {
    return plate && color;
  };

  const { loading, error, responseData } = useFetchWithAuthTrigger(
    fetchUserData ? `${process.env.REACT_APP_API_URL}/vehicles/` : null,  // Solo pasa la URL si fetchUserData es true
    authToken, 
    'POST',
    { user: user?.id, plate, color },
    fetchUserData  
  );

  useEffect(() => {
      if (error) {
        if (error!=null) {
          setErrorMessage("El vehículo ya se encuentra registrado.");
          setFetchUserData(false);
        }
        setFetchUserData(false);
      } else if(responseData) {
        setErrorMessage(null);  
        setFetchUserData(false);
        navigate("/vehiculos");
      }
  }, [responseData, error, authToken, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();  
    setFetchUserData(false);  
    if (!areAllFieldsFilled()) {
      setErrorMessage("Por favor complete todos los campos.");
      return;
    }

    if (authToken) {
      setErrorMessage(null);  
      setFetchUserData(true);  
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-2 text-center">
          <h1>Registra tu vehículo</h1>
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row mt-2 text-center">
                <div className="col-4 text-end">
                  <label htmlFor="plate" className="form-label">Número de Placa:</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="plate"
                    name="plate"
                    value={plate}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="row mt-2 text-center">
                <div className="col-4 text-end">
                  <label htmlFor="color" className="form-label">Color:</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={color}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary col-6">
                Crear
              </button>
            </div>
          </form>
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          {/* {error && <p className="text-danger">{error}</p>} */}
        </div>
      </div>
    </>
  );
};
