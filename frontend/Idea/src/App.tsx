import './App.css';
import Login from './components/Login';
import UserProfile from './components/EjemploInfo';
import CreateProject from './components/AñadirProyecto';
import LoginGitHub from './components/autenticacionGithub';
import {Card,Header} from './components/common';
import { HomePage } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="auth-container">
      {/* <LoginGitHub />
      <Login />
      <UserProfile />
      <HomePage/>
      <CreateProject />  */}
      <Header />
    </div>
  );
}

export default App;