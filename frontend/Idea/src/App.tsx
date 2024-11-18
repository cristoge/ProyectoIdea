import './App.css';
import { app } from '../firebaseConfig';  // Asegúrate de que firebaseConfig.js esté bien configurado
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import Login from './components/Login';
import UserProfile from './components/EjemploInfo';
import CreateProject from './components/AñadirProyecto';
import LoginGitHub from './components/autenticacionGithub';
function App() {
  

  return (
    <div className="auth-container">
      <LoginGitHub />
      <Login />
      <UserProfile />
      <CreateProject />

    </div>
  );
}

export default App;