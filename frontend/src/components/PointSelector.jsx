// src/components/PointSelector.jsx
import React, { useState, useEffect } from 'react';
import { getPoints } from '../services/api';

const PointSelector = ({ selectedIds, onToggle }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const data = await getPoints();
        setPoints(Array.isArray(data) ? data : []);
      } catch (err) {
        alert('Не удалось загрузить точки');
      } finally {
        setLoading(false);
      }
    };

    loadPoints();
  }, []);

  if (loading) return <p>Загрузка точек...</p>;

  return (
    <div className="point-selector">
      <h3>Выберите точки для тура</h3>
      {points.length === 0 ? (
        <p>Нет доступных точек</p>
      ) : (
        <ul>
          {points.map(point => (
            <li key={point.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(point.id)}
                  onChange={() => onToggle(point.id)}
                />
                {point.name} — {point.description?.substring(0, 60)}...
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PointSelector;
