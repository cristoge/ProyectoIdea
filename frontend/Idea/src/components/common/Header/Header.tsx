import './Header.css';
import { Link } from 'react-router-dom';

export const Header = () => {
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
          <li>
            <Link to="/Login">Iniciar sesión</Link>
          </li>
          <li>
            <Link to="/create-project">Crear proyecto</Link>
          </li>
        </ul>
        <div className="right-section">
          <input type="text" className="search-bar" placeholder="Buscar..." />
            <div className="avatar">
            <Link to="/profile">
              <img src="11.jpeg" alt="Avatar" />
            </Link>
            </div>
        </div>
      </nav>
    </div>
  );
};
