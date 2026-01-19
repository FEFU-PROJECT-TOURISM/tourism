// src/App.jsx (обновлённый)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateTourPage from './pages/CreateTourPage';
import TourPage from './pages/TourPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-tour" element={<CreateTourPage />} />
          <Route path="/tour/:tourId" element={<TourPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
