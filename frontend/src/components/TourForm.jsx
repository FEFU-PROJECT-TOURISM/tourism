// src/components/TourForm.jsx
import React, { useState } from 'react';
import { createTour } from '../services/api';

const TourForm = ({ selectedPointIds, onCreateSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || selectedPointIds.length === 0) {
      alert('Введите название и выберите хотя бы одну точку');
      return;
    }

    setLoading(true);
    try {
      const tourData = {
        name,
        description,
        tour_point_ids: selectedPointIds,
      };
      await createTour(tourData);
      alert('Тур успешно создан!');
      onCreateSuccess();
    } catch (err) {
      alert('Ошибка создания тура');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tour-form">
      <h3>Создать тур</h3>
      <input
        placeholder="Название тура"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Описание тура"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <p>
        Выбрано точек: <strong>{selectedPointIds.length}</strong>
      </p>
      <button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать тур'}
      </button>
    </form>
  );
};

export default TourForm;
