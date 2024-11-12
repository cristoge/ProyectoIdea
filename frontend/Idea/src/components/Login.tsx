
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importa los métodos necesarios
import { app } from '../../firebaseConfig';  // Importa la configuración de Firebase
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (email:string, password:string) => {
    try {
      // Obtén la instancia de autenticación
      const auth = getAuth(app);

      // Autenticar al usuario con email y contraseña
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener el ID token del usuario
      const token = await userCredential.user.getIdToken();
      console.log("ID Token:", token);
      // Enviar el token en la cabecera de autorización al backend
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en la cabecera
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Si necesitas enviar el email y la contraseña
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso:", data);
        // Aquí puedes almacenar el token o información del usuario si es necesario
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
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        login(email, password);
      }}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
