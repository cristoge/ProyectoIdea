import './Header.css';
export const Header = () => {
  
  return (
    <div className="container">
      <nav>
        <ul className="menu">
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/Proyectos">Proyectos</a>
          </li>
          <li>
            <a href="/Ranking">Ranking</a>
          </li>
        </ul>
        <div className="right-section">
          <input type="text" className="search-bar" placeholder="Buscar..." />
          <div className="avatar">
          <img src="11.jpeg" alt="Avatar" />
          </div>
        </div>
      </nav>
    </div>
  );
};
