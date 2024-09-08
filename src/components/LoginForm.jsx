import React, { useContext, useState, useEffect } from "react";
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
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);
  const [fetchUserData, setFetchUserData] = useState(false);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);  // Establece el token si existe en localStorage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username:email, password }),
      });

      if (response.status >= 400 && response.status < 600) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error en la autenticación'}`);
      }

      const {token} = await response.json();
      localStorage.setItem('authToken', token);  // Guardar en localStorage
      setAuthToken(token)
      setFetchUserData(true); 
      console.log("Este es el tokennnn "+token)
    } catch (error) {
      console.error("Error en el login:", error.message);
    }
  };

 // Solo ejecutar el fetch si hay token y email
  const { loading, error, responseData } = useFetchWithAuth(
    authToken && fetchUserData && email ? `${process.env.REACT_APP_API_URL}/authentication/users/?email=${encodeURIComponent(email)}` : null,
    authToken, 
    'GET'
  );



  useEffect(() => {
    if (responseData && Array.isArray(responseData) && responseData.length > 0 && authToken) {
      const user = responseData[0];  
      updateUser({
        id: user.id,
        name: `${user?.first_name} ${user?.last_name}`,
        token: authToken,
        loggedIn: true,
      });
      navigate("/reservar");  
    }
  }, [responseData, authToken]);
  return (
    <>
    <div className="container">
      <div className="row mt-5">
        <div className="mb-3 col-12">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 col-12">
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
              <div className="mb-3 col-12">
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
              <div className="d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-primary col-6 text-center">
                    Ingresar
                    </button>
              </div>
        </form>

        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}

        </div>
       
      </div>
     </div>
    </>
  );
};
