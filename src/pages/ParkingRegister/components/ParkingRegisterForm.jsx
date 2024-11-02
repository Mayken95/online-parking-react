import React, {useState, useEffect} from 'react'
import { useForm } from "../../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../../hooks/useUser';
import { useFetchWithAuthTrigger } from "../../../hooks/useFetchWithAuthTrigger";
export const ParkingRegisterForm = () => {
    const { user } = useUser();
    const authToken = user?.token;
    const { formState, onInputChange } = useForm({
        name: "",
        address: "",
        capacity: "",
        actualCapacity: "",
        fee: "",
        available: ""
    });
    const { name, address, capacity, actualCapacity, fee, available } = formState;

    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [fetchUserData, setFetchUserData] = useState(false);  // Controla el trigger del fetch
    const areAllFieldsFilled = () => {
        return name && address && capacity && actualCapacity && fee && available;
    };

    const { loading, error, responseData } = useFetchWithAuthTrigger(
        fetchUserData ? `${process.env.REACT_APP_API_URL}/organization/parkings/` : null,  
        authToken, 
        'POST',
        { user: user?.id, name, address, capacity, actualCapacity, fee, available},
        fetchUserData  //Trigger para disparar hook
      );
    
      useEffect(() => {
        if (responseData && authToken) {
          navigate("/vehiculos"); 
        }
      }, [responseData, authToken, navigate]);
    
      const handleSubmit = (e) => {
        e.preventDefault();  
    
        if (!areAllFieldsFilled()) {
          setErrorMessage("Por favor complete todos los campos.");
          return;
        }
        if (actualCapacity > capacity) {
            setErrorMessage("La capacidad actual no puede sobrepasar la capacidad total");
            return;
          }
      
        if (authToken && user?.id && user?.group[0]=="") {
          setFetchUserData(true);  
        }
        setErrorMessage("Usuario no autorizado.");
        return;
      };

    return (
        <>
            {errorMessage && <div className="alert alert-danger mt-3">{"Error: " + errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre del Estacionamiento:</label>
                    <input type="text" className="form-control"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Dirección:</label>
                    <input type="text" className="form-control"
                        id="address"
                        name="address"
                        value={address}
                        onChange={onInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">Nº de lugares disponibles:</label>
                    <input type="number" className="form-control"
                        id="capacity"
                        name="capacity"
                        value={capacity}
                        onChange={onInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="actualCapacity" className="form-label">Capacidad actual:</label>
                    <input type="text" className="form-control"
                        id="actualCapacity"
                        name="actualCapacity"
                        value={actualCapacity}
                        onChange={onInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="fee" className="form-label">Tarifa administrativa:</label>
                    $<input type="number" className="form-control"
                        id="fee"
                        name="fee"
                        value={fee}
                        onChange={onInputChange} />
                </div>
                <button type="submit" className="btn btn-primary">Registrar</button>
            </form>
        </>
    );
}
