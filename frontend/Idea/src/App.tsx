import './App.css';
import {Header} from './components/common';
import { HomePage,ProjectPost,Login,CreateProject,UserProfile,RankingPage,CreateAccount} from './components/layout';
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
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;