import './App.css';
import UserProfile from './components/EjemploInfo';
import {Header} from './components/common';
import { HomePage,ProjectPost,Login,CreateProject} from './components/layout';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="auth-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/project/:id" element={<ProjectPost />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/create-project" element={<CreateProject />} />
          {/* <Route path="/login-github" element={<LoginGitHub />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;