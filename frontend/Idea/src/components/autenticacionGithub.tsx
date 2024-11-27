// src/components/LoginGitHub.tsx
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebaseConfig";  // Asegúrate de que firebaseConfig.js esté bien configurado

const LoginGitHub = () => {
  const auth = getAuth(app);
  const provider = new GithubAuthProvider();

  const githubSignUp = () => {
    signInWithPopup(auth, provider)
      .then(async (response) => {
        const user = response.user;
        console.log(user);

        // Obtiene el token
        const idToken = await user.getIdToken();
        const credential = GithubAuthProvider.credentialFromResult(response);
        const githubToken = credential ? credential.accessToken : null;
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
            console.log("Usuario Autenticado", data);
          } else {
            console.error("Error al autenticar:", data);
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
};

export default LoginGitHub;
