// src/components/CreatePointForm.jsx
import React, { useState } from 'react';
import { createPoint } from '../services/api';
import MapComponent from '../components/MapComponent';
import StatusMessage from './StatusMessage';
import './CreatePointForm.css';

const CreatePointForm = ({ onPointCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Предпросмотр фото
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Валидация размера файлов (максимум 10 МБ на файл)
    const maxSize = 10 * 1024 * 1024; // 10 МБ
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setError({ message: `Некоторые файлы слишком большие (максимум 10 МБ на файл). Пропущено файлов: ${invalidFiles.length}` });
      const validFiles = files.filter(file => file.size <= maxSize);
      setPhotos(validFiles);
      
      // Освобождаем старые URL
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      return;
    }
    
    // Освобождаем старые URL перед созданием новых
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setPhotos(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !latitude || !longitude) {
      setError({ message: 'Заполните обязательные поля: название, широта и долгота' });
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    let interval = null;

    try {
      // Данные точки
      const pointData = { name, description, latitude: +latitude, longitude: +longitude };

      // Симуляция прогресса (axios не передаёт onUploadProgress через обычный createPoint)
      interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 200);

      // Используем ЕДИНСТВЕННЫЙ API-метод
      const newPoint = await createPoint(pointData, photos);

      if (interval) clearInterval(interval);
      setProgress(100);

      // Успешно
      onPointCreated(newPoint);
      setSuccess({ message: 'Точка успешно создана!' });

      // Сброс формы
      setName('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setPhotos([]);
      // Освобождаем URL перед очисткой
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      console.error('Ошибка создания точки:', err);
      
      // Формируем детальную информацию об ошибке
      const errorInfo = {
        message: err.message || 'Ошибка создания точки',
        statusCode: err.statusCode || err.response?.status,
        details: err.details || err.response?.data || null,
      };
      
      setError(errorInfo);
    } finally {
      setUploading(false);
      if (interval) clearInterval(interval);
    }
  };

  return (
    <div className="create-point-form">
      <div className="form-header">
        <h3>Создать новую точку</h3>
        <p className="form-subtitle">Добавьте новую точку интереса на карту</p>
      </div>

      <form onSubmit={handleSubmit} className="point-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="point-name">
              Название точки <span className="required">*</span>
            </label>
            <input
              id="point-name"
              type="text"
              placeholder="Например: Красная площадь"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="point-description">Описание</label>
            <textarea
              id="point-description"
              placeholder="Расскажите о точке..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="point-latitude">
              Широта <span className="required">*</span>
            </label>
            <input
              id="point-latitude"
              type="number"
              step="any"
              placeholder="55.7558"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="point-longitude">
              Долгота <span className="required">*</span>
            </label>
            <input
              id="point-longitude"
              type="number"
              step="any"
              placeholder="37.6176"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="point-map-picker">
          <h4>Или выберите точку на карте</h4>
          <p className="map-hint">Кликните на карте, чтобы установить координаты</p>
          <MapComponent
            points={
              latitude && longitude
                ? [{ id: 'preview', name: 'Выбранная точка', latitude: +latitude, longitude: +longitude }]
                : []
            }
            onSelectLocation={({ latitude: lat, longitude: lng }) => {
              setLatitude(lat.toFixed(6));
              setLongitude(lng.toFixed(6));
            }}
            center={latitude && longitude ? [+latitude, +longitude] : [43.1155, 131.8855]}
            zoom={12}
          />
        </div>

        <div className="form-group">
          <label htmlFor="point-photos">
            Фотографии
          </label>
          <div className="file-input-wrapper">
            <input
              id="point-photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={uploading}
              className="file-input"
            />
            <label htmlFor="point-photos" className="file-label">
              <span className="file-icon">📷</span>
              <span>{photos.length > 0 ? `${photos.length} файлов выбрано` : 'Выберите фотографии'}</span>
            </label>
          </div>
        </div>

        {/* Предпросмотр фото */}
        {previewUrls.length > 0 && (
          <div className="photo-preview">
            <h5>Предпросмотр ({previewUrls.length})</h5>
            <div className="preview-grid">
              {previewUrls.map((url, index) => (
                <div key={index} className="preview-item">
                  <img
                    src={url}
                    alt={`Предпросмотр ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Прогресс-бар */}
        {uploading && (
          <div className="upload-progress">
            <div className="progress-info">
              <span>Загрузка...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && (
          <StatusMessage 
            message={error.message} 
            type="error" 
            statusCode={error.statusCode}
            details={error.details}
            onClose={() => setError(null)}
          />
        )}
        {success && (
          <StatusMessage 
            message={success.message} 
            type="success"
            onClose={() => setSuccess(null)}
          />
        )}

        <button type="submit" disabled={uploading || !name || !latitude || !longitude} className="form-submit">
          {uploading ? (
            <>
              <span className="spinner"></span>
              Загрузка...
            </>
          ) : (
            <>
              <span>✅</span>
              Создать точку
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePointForm;
