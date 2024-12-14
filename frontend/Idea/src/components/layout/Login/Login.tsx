import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../firebaseConfig'; 
import { useState } from 'react';
import './Login.css';  

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("ID Token:", token);
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso:", data);
      } else {
        console.error("Error en el login:", data);
        setError(data.error || "Error en el login");
      }
    } catch (error) {
      console.error("Error en el login", error);
      setError("Hubo un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form className="login-form" onSubmit={(e) => {
        e.preventDefault();
        login(email, password);
      }}>
        <div className="input-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
        </div>
        <div className="input-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
