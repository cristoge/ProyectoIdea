import './Header.css';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext'; 
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

export const Header = () => {
  const { currentUser } = useAuth(); // Obtener el usuario autenticado desde el contexto
  const navigate = useNavigate(); 
  const goToProfile = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.uid}`); // Navegar al perfil del usuario autenticado
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Cerrar sesión
      navigate('/'); // Redirigir al inicio después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="container">
      <nav>
        <ul className="menu">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/Ranking">Ranking</Link>
          </li>
          
          
          {!currentUser && (
            <li>
              <Link to="/Login">Iniciar sesión</Link>
            </li>
          )}
          {currentUser && (
            <>
            <li>
              <Link to="/create-project">Crear proyecto</Link>
            </li>
            <li>
                <a className="logout-link" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
                  Cerrar sesión
                </a>
              </li>
          </>
          )}
        </ul>
        <div className="right-section">
          {currentUser && (
            <div className="avatar" onClick={goToProfile}> {/* Se navega al perfil del usuario */}
              <img src="/icon.svg" alt="Avatar" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
