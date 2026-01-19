// src/pages/CreateTourPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PointSelector from '../components/PointSelector';
import CreatePointForm from '../components/CreatePointForm';
import TourForm from '../components/TourForm';
import './CreateTourPage.css';

const CreateTourPage = () => {
  const navigate = useNavigate();
  const [selectedPoints, setSelectedPoints] = useState([]); // Храним полные данные точек
  const [activeSection, setActiveSection] = useState('points');

  const togglePoint = (point) => {
    setSelectedPoints(prev => {
      const exists = prev.find(p => p.id === point.id);
      if (exists) {
        return prev.filter(p => p.id !== point.id);
      } else {
        return [...prev, point];
      }
    });
  };

  const handlePointCreated = (newPoint) => {
    setSelectedPoints(prev => [...prev, newPoint]);
  };

  const handleTourCreated = () => {
    setSelectedPoints([]);
    navigate('/');
  };

  const handlePointsReorder = (reorderedPoints) => {
    setSelectedPoints(reorderedPoints);
  };

  return (
    <div className="create-tour-page">
      <div className="page-header">
        <h1>Создание нового тура</h1>
        <p>Создайте уникальный маршрут, выбрав точки интереса или добавив новые</p>
      </div>

      <div className="page-tabs">
        <button
          className={`tab ${activeSection === 'points' ? 'active' : ''}`}
          onClick={() => setActiveSection('points')}
        >
          <span className="tab-icon">📍</span>
          Выбрать точки
        </button>
        <button
          className={`tab ${activeSection === 'create' ? 'active' : ''}`}
          onClick={() => setActiveSection('create')}
        >
          <span className="tab-icon">➕</span>
          Создать точку
        </button>
        <button
          className={`tab ${activeSection === 'tour' ? 'active' : ''}`}
          onClick={() => setActiveSection('tour')}
        >
          <span className="tab-icon">🗺️</span>
          Настройки тура
        </button>
      </div>

      <div className="page-content">
        {activeSection === 'points' && (
          <div className="content-section">
            <PointSelector 
              selectedPoints={selectedPoints} 
              onToggle={togglePoint} 
            />
          </div>
        )}

        {activeSection === 'create' && (
          <div className="content-section">
            <CreatePointForm onPointCreated={handlePointCreated} />
          </div>
        )}

        {activeSection === 'tour' && (
          <div className="content-section">
            <TourForm
              selectedPoints={selectedPoints}
              onPointsReorder={handlePointsReorder}
              onCreateSuccess={handleTourCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTourPage;
