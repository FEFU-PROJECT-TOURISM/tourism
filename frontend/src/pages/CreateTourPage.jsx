// src/pages/CreateTourPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PointSelector from '../components/PointSelector';
import CreatePointForm from '../components/CreatePointForm';
import TourForm from '../components/TourForm';
import './CreateTourPage.css';

const CreateTourPage = () => {
  const navigate = useNavigate();
  const [selectedPointIds, setSelectedPointIds] = useState([]);
  const [activeSection, setActiveSection] = useState('points');

  const togglePoint = (id) => {
    setSelectedPointIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePointCreated = (newPoint) => {
    togglePoint(newPoint.id);
    // Можно показать уведомление вместо alert
  };

  const handleTourCreated = () => {
    setSelectedPointIds([]);
    navigate('/');
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
            <PointSelector selectedIds={selectedPointIds} onToggle={togglePoint} />
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
              selectedPointIds={selectedPointIds}
              onCreateSuccess={handleTourCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTourPage;
