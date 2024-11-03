import { useUser } from '../../hooks/useUser';
import profileImage from '../../assets/images/profile.png'; 
import { useNavigate } from 'react-router-dom';
export const Profile =  () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/vehiculos'); 
    };

    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <div className="profile-header mb-4">
                  {/* Imagen de perfil */}
                  <img
                    src={profileImage} // Sustituye con la URL de la imagen real
                    alt="Perfil"
                    className="rounded-circle"
                    width="150"
                    height="150"
                  />
                </div>
  
                {/* Información del usuario */}
                <h3 className="mb-3 text-primary">{user?.name}</h3>
                <p>{user?.email}</p>
  
                {user.role=="user"&&(
                <button className="btn bg-primary text-white" onClick={handleClick}>
                  Mis Vehículos
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
