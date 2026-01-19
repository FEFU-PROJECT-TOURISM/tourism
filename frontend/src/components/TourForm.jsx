// src/components/TourForm.jsx
import React, { useState } from 'react';
import { createTour } from '../services/api';
import './TourForm.css';

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
      onCreateSuccess();
    } catch (err) {
      alert('Ошибка создания тура');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tour-form">
      <div className="form-header">
        <h3>Настройки тура</h3>
        <p className="form-subtitle">Заполните информацию о вашем туре</p>
      </div>

      <div className="form-group">
        <label htmlFor="tour-name">
          Название тура <span className="required">*</span>
        </label>
        <input
          id="tour-name"
          type="text"
          placeholder="Например: Экскурсия по историческому центру"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tour-description">Описание тура</label>
        <textarea
          id="tour-description"
          placeholder="Расскажите о вашем туре, его особенностях и интересных моментах..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className="form-textarea"
        />
      </div>

      <div className="form-info">
        <div className="info-card">
          <span className="info-icon">📍</span>
          <div>
            <div className="info-label">Выбрано точек</div>
            <div className="info-value">{selectedPointIds.length}</div>
          </div>
        </div>
        {selectedPointIds.length === 0 && (
          <p className="form-warning">
            ⚠️ Выберите хотя бы одну точку для создания тура
          </p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading || selectedPointIds.length === 0}
        className="form-submit"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Создание...
          </>
        ) : (
          <>
            <span>✅</span>
            Создать тур
          </>
        )}
      </button>
    </form>
  );
};

export default TourForm;
