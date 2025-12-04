// src/components/CreatePointForm.jsx
import React, { useState } from 'react';
import { createPoint } from '../services/api'; // ← У нас уже есть эта функция!

const CreatePointForm = ({ onPointCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Предпросмотр фото
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !latitude || !longitude || photos.length === 0) {
      alert('Заполните все поля и добавьте хотя бы одно фото');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Данные точки
      const pointData = { name, description, latitude: +latitude, longitude: +longitude };

      // Симуляция прогресса (axios не передаёт onUploadProgress через обычный createPoint)
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 200);

      // Используем ЕДИНСТВЕННЫЙ API-метод
      const newPoint = await createPoint(pointData, photos);

      clearInterval(interval);
      setProgress(100);

      // Успешно
      onPointCreated(newPoint);
      alert('Точка создана!');

      // Сброс формы
      setName('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setPhotos([]);
      setPreviewUrls([]);
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      alert('Ошибка создания точки');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-point-form">
      <h3>Создать новую точку</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Название точки"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Широта (latitude)"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Долгота (longitude)"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
          disabled={uploading}
        />

        {/* Предпросмотр фото */}
        {previewUrls.length > 0 && (
          <div className="photo-preview">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Предпросмотр ${index + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  margin: '4px',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
        )}

        {/* Прогресс-бар */}
        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span>{Math.round(progress)}%</span>
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Загрузка...' : 'Создать точку'}
        </button>
      </form>
    </div>
  );
};

export default CreatePointForm;
