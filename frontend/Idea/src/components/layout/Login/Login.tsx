import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext'; 
import { getAuth, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import './Login.css';

export const Login = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [screenName, setScreenName] = useState<string | null>(null);  // Estado para guardar el screenName
  const navigate = useNavigate();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/profile'); 
    }
  }, [currentUser, navigate]); // Dependencia en currentUser para que solo se ejecute cuando cambie

  useEffect(() => {
    if (screenName) {
      console.log('GitHub Screen Name:', screenName);
    }
  }, [screenName]);

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
        
        if (githubToken) {
          try {
            const githubUserResponse = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${githubToken}`,
              },
            });
  
            if (githubUserResponse.ok) {
              const githubUserData = await githubUserResponse.json();
              const screenName = githubUserData.login;  // Guardar el screenName
              console.log('GitHub Screen Name:', screenName);
              
              // Enviar los datos al backend aquí, cuando ya tienes screenName
              try {
                const backendResponse = await fetch('http://localhost:3000/users/github', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    idToken,
                    githubToken,
                    screenName,  // Ahora screenName está correctamente asignado
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
  
            } else {
              console.error('Error al obtener los datos de GitHub');
            }
          } catch (error) {
            console.error('Error al realizar la solicitud a GitHub API:', error);
          }
        }
  
        localStorage.setItem("authToken", idToken);
        console.log("GithubToken:", githubToken);
        console.log("ID Token:", idToken);
  
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión con GitHub:", error);
      });
  };

  return (
    <div className="auth-container">
      <form className="login-form" onSubmit={(e) => {
        e.preventDefault();
        loginWithEmail(email, password);
      }}>
        <h2>Iniciar sesión</h2>
        <p style={{ color: 'black' }}>No tienes cuenta? <span className="register-link" onClick={() => navigate("/create-account")}>Créala aquí</span></p> 
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
        <button type="button" onClick={loginWithGitHub} className="login-button">
          Iniciar sesión con GitHub
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {screenName && <p className="screen-name">GitHub Screen Name: {screenName}</p>} {/* Mostrar el screenName */}
    </div>
  );
};

export default Login;
