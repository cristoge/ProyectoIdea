import { getAuth, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../firebaseConfig";
import { useState } from "react";
import './Login.css'; 

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función de login con email y contraseña
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("ID Token:", token);
      localStorage.setItem("authToken", token);
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

  // Función de login con GitHub
  const loginWithGitHub = () => {
    const auth = getAuth(app);
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (response) => {
        const user = response.user;
        console.log(user);

        const idToken = await user.getIdToken();
        const credential = GithubAuthProvider.credentialFromResult(response);
        const githubToken = credential ? credential.accessToken : null;
        localStorage.setItem("authToken", idToken);
        console.log("GithubToken:", githubToken);
        console.log("ID Token:", idToken);

        try {
          const backendResponse = await fetch('http://localhost:3000/users/github', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken,
              githubToken,
            }),
          });
          const data = await backendResponse.json();
          if (backendResponse.ok) {
            console.log("Usuario Autenticado con GitHub", data);
          } else {
            console.error("Error al autenticar con GitHub:", data);
          }
        } catch (error) {
          console.error("Error al enviar los datos al backend:", error);
        }
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión con GitHub:", error);
      });
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form className="login-form" onSubmit={(e) => {
        e.preventDefault();
        loginWithEmail(email, password);
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

      <h3>O</h3>

      <button onClick={loginWithGitHub} className="github-button">
        Iniciar sesión con GitHub
      </button>
    </div>
  );
};

export default Login;
