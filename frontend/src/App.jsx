// src/App.jsx (обновлённый)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateTourPage from './pages/CreateTourPage';
import TourPage from './pages/TourPage';
import OrganizationPage from './pages/OrganizationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/create-tour" 
            element={
              <ProtectedRoute>
                <CreateTourPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/tour/:tourId" element={<TourPage />} />
          <Route path="/organization/:orgId" element={<OrganizationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
