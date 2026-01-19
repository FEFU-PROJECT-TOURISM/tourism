// src/components/MapComponent.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { loadYmapsComponents } from '../lib/ymaps';

const MapComponent = ({
  points = [],
  onPointClick,
  onSelectLocation,
  center,
  zoom = 12,
  showRoute = false,
}) => {
  const [components, setComponents] = useState(null);
  const [error, setError] = useState(null);

  // Загружаем компоненты карты при монтировании
  useEffect(() => {
    loadYmapsComponents()
      .then(setComponents)
      .catch(setError);
  }, []);

  // Центр по умолчанию - Владивосток
  const defaultCenter = [131.8855, 43.1155]; // [lng, lat] для Яндекс карт
  const mapCenter = center
    ? [center[1], center[0]] // Конвертируем [lat, lng] в [lng, lat]
    : points.length > 0
    ? [points[0].longitude, points[0].latitude]
    : defaultCenter;

  // Вычисляем оптимальную локацию для карты (всегда вызывается)
  const calculatedLocation = useMemo(() => {
    if (points.length === 0) {
      return { center: mapCenter, zoom: zoom };
    }
    
    if (points.length === 1) {
      return {
        center: [points[0].longitude, points[0].latitude],
        zoom: 13,
      };
    }

    // Вычисляем границы для всех точек
    const bounds = points.reduce(
      (acc, point) => {
        return {
          minLng: Math.min(acc.minLng, point.longitude),
          maxLng: Math.max(acc.maxLng, point.longitude),
          minLat: Math.min(acc.minLat, point.latitude),
          maxLat: Math.max(acc.maxLat, point.latitude),
        };
      },
      {
        minLng: points[0].longitude,
        maxLng: points[0].longitude,
        minLat: points[0].latitude,
        maxLat: points[0].latitude,
      }
    );

    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;

    return {
      center: [centerLng, centerLat],
      zoom: 12,
    };
  }, [points, mapCenter, zoom]);

  // Обработчик клика по карте (всегда вызывается)
  const handleMapClick = useCallback(
    (e) => {
      if (onSelectLocation) {
        const coords = e.detail.coordinates;
        onSelectLocation({ latitude: coords[1], longitude: coords[0] });
      }
    },
    [onSelectLocation]
  );

  // Согласно документации: используем reactify.useDefault для location
  // ВАЖНО: этот useMemo должен вызываться ВСЕГДА, до проверки components
  const location = useMemo(() => {
    if (!components || !components.reactify) {
      // Если reactify еще не загружен, возвращаем обычный объект
      return calculatedLocation;
    }
    return components.reactify.useDefault(calculatedLocation, [calculatedLocation]);
  }, [calculatedLocation, components]);

  // Показываем загрузку или ошибку
  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#ef4444',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>Ошибка загрузки карты</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!components) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Загрузка карты...</p>
        </div>
      </div>
    );
  }

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapControls,
    YMapFeature,
    reactify,
  } = components;

  // Проверяем наличие обязательных компонентов
  if (!YMap || !YMapDefaultSchemeLayer || !YMapDefaultFeaturesLayer || !YMapMarker || !reactify) {
    console.error('Не все компоненты карты загружены:', {
      YMap: !!YMap,
      YMapDefaultSchemeLayer: !!YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer: !!YMapDefaultFeaturesLayer,
      YMapMarker: !!YMapMarker,
      reactify: !!reactify,
    });
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#ef4444',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>Ошибка: не все компоненты карты загружены</p>
        </div>
      </div>
    );
  }

  // Логируем для отладки
  console.log('Рендерим карту с location:', calculatedLocation, 'points:', points.length);

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <YMap
        location={location}
        mode="vector"
        onClick={onSelectLocation ? handleMapClick : undefined}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        {/* Элементы управления картой (если доступны) */}
        {YMapControls && (
          <YMapControls position="top right">
            {/* Используем встроенные элементы управления */}
          </YMapControls>
        )}

        {/* Отображаем маркеры для всех точек */}
        {points.map((point, index) => (
          <YMapMarker
            key={point.id || index}
            coordinates={reactify.useDefault([point.longitude, point.latitude], [[point.longitude, point.latitude]])}
            onClick={() => onPointClick?.(point)}
          >
            <div
              style={{
                background: showRoute ? '#6366f1' : '#3b82f6',
                width: '32px',
                height: '32px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  transform: 'rotate(45deg)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
              >
                {index + 1}
              </span>
            </div>
          </YMapMarker>
        ))}

        {/* Отображаем маршрут (линию между точками) через YMapFeature */}
        {showRoute && points.length > 1 && YMapFeature && (
          <YMapFeature
            id="route"
            geometry={reactify.useDefault({
              type: 'LineString',
              coordinates: points.map(point => [point.longitude, point.latitude]),
            }, [points])}
            style={{
              stroke: [{ color: '#6366f1', width: 4 }],
            }}
          />
        )}
      </YMap>
    </div>
  );
};

export default MapComponent;
