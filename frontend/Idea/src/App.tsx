import './App.css';
import { app } from '../firebaseConfig';  // Asegúrate de que firebaseConfig.js esté bien configurado
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

function App() {
  const auth = getAuth(app);
  const provider = new GithubAuthProvider();

  const githubSignUp = () => {
    signInWithPopup(auth, provider)
      .then(async (response) => {
        const user = response.user;  
        console.log(user);  

        // obtiene el token
        const idToken = await user.getIdToken();  
        const credential = GithubAuthProvider.credentialFromResult(response);
        const githubtoken = credential ? credential.accessToken : null;
        console.log("GithubToken:", githubtoken);
        console.log("ID Token:", idToken);


        
        try {
          const backendResponse = await fetch('http://localhost:3000/users/github', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken,
              githubtoken,
            }),
          });
          const data = await backendResponse.json();
          if (backendResponse.ok) {
            console.log("Usuario agregado en el backend:", data);
          } else {
            console.error("Error al agregar el usuario:", data);
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
      <h1>Ejemplo 12 - Autenticación con GitHub</h1>
      <button onClick={githubSignUp}>Iniciar sesión con GitHub</button>
    </div>
  );
}

export default App;