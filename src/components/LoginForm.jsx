import React, { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { useUser } from "../hooks/useUser";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { formState, onInputChange } = useForm({
    email: "",
    password: "",
  });
  const { email, password } = formState;
  const {user, updateUser } = useUser();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);
  const [fetchUserData, setFetchUserData] = useState(false);
  const [loginError, setLoginError] = useState(""); // Estado para almacenar el mensaje de error

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);  // Establece el token si existe en localStorage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Limpiar el estado del error al enviar nuevamente

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.status >= 400 && response.status < 600) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error en la autenticación'}`);
      }

      const {token} = await response.json();
      localStorage.setItem('authToken', token);  // Guardar en localStorage
      setAuthToken(token)
      setFetchUserData(true); 
    } catch (error) {
      setLoginError(error.message);  // Actualizar el estado del error
      console.error("Error en el login:", error.message);
    }
  };

  const { loading, error, responseData } = useFetchWithAuth(
    authToken && fetchUserData && email ? `${process.env.REACT_APP_API_URL}/authentication/users/?email=${encodeURIComponent(email)}` : null,
    authToken, 
    'GET'
  );

  useEffect(() => {
    if (responseData && Array.isArray(responseData) && responseData.length > 0 && authToken) {
      const userInfo = responseData[0];  
      updateUser({
        id: userInfo.id,
        name: `${userInfo?.first_name} ${userInfo?.last_name}`,
        token: authToken,
        role: ((userInfo.groups[0]==1||userInfo.groups[0]==undefined)? "user" : (userInfo.groups[0]==2 ? "adminParking" : "other") ),
        loggedIn: true,
      });
      if(user.role =="user"){
        navigate("/reservar");  
      }else{
        navigate("/registrarHorarios");  
      }
      
    }
  }, [responseData, authToken]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 vh-90">
      <div className="card shadow p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <p className="lead text-center mb-4">Ingresa tus credenciales para acceder a tu cuenta.</p>

          {loginError && <div className="alert alert-danger mt-3">Error: {loginError}</div>}  {/* Mostrar error */}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fs-5">Correo electrónico:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onInputChange}
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fs-5">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={onInputChange}
              />
            </div>
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-block">Ingresar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
