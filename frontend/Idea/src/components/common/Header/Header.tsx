import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext'; 

export const Header = () => {
  const { currentUser } = useAuth(); // Obtener el usuario autenticado desde el contexto

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

          <li>
            <Link to="/create-project">Crear proyecto</Link>
          </li>
        </ul>
        <div className="right-section">
          {currentUser && (
            <div className="avatar">
              <Link to="/profile">
                <img src="/icon.svg" alt="Avatar" />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
