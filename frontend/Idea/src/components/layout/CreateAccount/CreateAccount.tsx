import { useState } from "react";
import './CreateAccount.css'; 
import { useNavigate } from "react-router-dom";

export const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerWithEmail = async (email: string, password: string, username: string) => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }) // Incluye el nombre de usuario
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registro exitoso:", data);
        navigate("/login");
      } else {
        console.error("Error en el registro:", data);
        setError(data.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en el registro", error);
      setError("Hubo un error al intentar crear la cuenta.");
    }
  };

  return (
    <div className="auth-container">
      <form className="register-form" onSubmit={(e) => {
        e.preventDefault();
        registerWithEmail(email, password, username); // Pasa el nombre de usuario
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Crear Cuenta</h2>
        <div className="input-group">
          <label>Nombre de Usuario:</label> {/* Nuevo campo */}
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="register-input"
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="register-input"
          />
        </div>
        <div className="input-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="register-input"
          />
        </div>
        <div className="input-group">
          <label>Confirmar Contraseña:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className="register-input"
          />
        </div>
        <button type="submit" className="register-button">Crear Cuenta</button>
        
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
