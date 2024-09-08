import { useState } from "react"
import { UserContext } from "./UserContext"


// export const UserProvider = ({ children }) => {

//     const [user, setUser] = useState({
//         id: null,
//         name: null,
//         token: null
//     });
//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             { children }
//         </UserContext.Provider>
//     )
// }
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
      id: null,
      name: null,
      email: null,
      token: null,
      role: null,
      loggedIn: false,
    });
  
    // Función para actualizar parcialmente el estado del usuario
    const updateUser = (updatedFields) => {
      setUser((prevUser) => ({
        ...prevUser,  // campos anteriores
        ...updatedFields,  // Actualiza solo los camposenviiados
      }));
    };
  
    const logoutUser = () => {
      setUser({
        id: null,
        name: null,
        email: null,
        token: null,
        role: null,
        loggedIn: false,
      });
    };
  
    return (
      <UserContext.Provider value={{ user, updateUser, logoutUser }}>
        {children}
      </UserContext.Provider>
    );
}