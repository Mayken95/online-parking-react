import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';  


export const PrivateRouter = ({ children , allowedRoles}) => {
  const { user } = useUser();

  //Notaaa: Si el usuario no esta logueado
  if (!user.loggedIn || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;  // Redireccionar al home 
  }

  return children;
};
