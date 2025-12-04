// src/pages/CreateTourPage.jsx
import React, { useState } from 'react';
import PointSelector from '../components/PointSelector';
import CreatePointForm from '../components/CreatePointForm';
import TourForm from '../components/TourForm';
import './CreateTourPage.css';

const CreateTourPage = () => {
  const [selectedPointIds, setSelectedPointIds] = useState([]);

  const togglePoint = (id) => {
    setSelectedPointIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePointCreated = (newPoint) => {
    // Добавляем новую точку в выбранные
    togglePoint(newPoint.id);
    alert(`Точка "${newPoint.name}" создана и добавлена в тур`);
  };

  const handleTourCreated = () => {
    setSelectedPointIds([]);
    alert('Переход к списку туров...');
    // Можно: navigate('/tours') если используете router
  };

  return (
    <div className="create-tour-page">
      <h1>Создание нового тура</h1>

      <PointSelector selectedIds={selectedPointIds} onToggle={togglePoint} />

      <CreatePointForm onPointCreated={handlePointCreated} />

      <TourForm
        selectedPointIds={selectedPointIds}
        onCreateSuccess={handleTourCreated}
      />
    </div>
  );
};

export default CreateTourPage;
