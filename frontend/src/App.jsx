
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/login';
import Notes from './pages/Notes';
import AuthState from './context/AuthState';


function App() {
  return (
    <AuthState>
      <Router>
        <Navbar />

        <main className="app-container">
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<h1>About</h1>} />
          </Routes>
        </main>
      </Router>
    </AuthState>
  );
}

export default App;
