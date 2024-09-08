import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
    const { formState, onInputChange } = useForm({
        firstName: "",
        lastName: "",
        dni: "",
        email: "",
        phone: "",
        password: "",
        address: ""
    });
    const { firstName, lastName, dni, email, phone, password, address } = formState;

    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const areAllFieldsFilled = () => {
        return firstName && lastName && dni && email && phone && password && address && confirmPassword;
    };

    const isPasswordsSame = () => {
        return password === confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!areAllFieldsFilled()) {
            setErrorMessage("Por favor complete todos los campos.");
            return;
        }

        if (!isPasswordsSame()) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/authentication/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    groups: [1],
                    identification: dni,
                    phone,
                    address,
                    status: 1
                }),
            });

           if (response.status >= 400 && response.status < 600) {
                const errorData = await response.json(); 
                throw new Error(`Error ${response.status}: ${errorData || 'Error al registrar el usuario.'}`);
            } 

            const data = await response.json();        
            setErrorMessage(null); 
            navigate("/");

        } catch (error) {
            setErrorMessage(error.message); 
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5 vh-90">
            <div className="card shadow p-4" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Registro de Usuario</h2>
                    <p className="lead text-center mb-4">Por favor, completa la información para crear tu cuenta.</p>
                    {errorMessage && <div className="alert alert-danger mt-3">{"Error: " + errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Nombre</label>
                            <input type="text" className="form-control"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Apellido</label>
                            <input type="text" className="form-control"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dni" className="form-label">Cédula</label>
                            <input type="text" className="form-control"
                                id="dni"
                                name="dni"
                                value={dni}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Dirección Domiciliaria</label>
                            <input type="text" className="form-control"
                                id="address"
                                name="address"
                                value={address}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input type="number" className="form-control"
                                maxLength={10}
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input type="email" className="form-control"
                                id="email"
                                name="email"
                                value={email}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control"
                                id="password"
                                name="password"
                                value={password}
                                onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password2" className="form-label">Confirmar Contraseña</label>
                            <input type="password" className="form-control"
                                id="password2"
                                value={confirmPassword}  
                                onChange={(e) => setConfirmPassword(e.target.value)}  
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-4 col-12">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
