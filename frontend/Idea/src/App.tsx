import './App.css';
import {Header} from './components/common';
import { HomePage,ProjectPost,Login,CreateProject,UserProfile} from './components/layout';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;