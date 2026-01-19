// src/components/MapComponent.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправление иконки маркера (Leaflet + Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = ({ 
  points = [],           // Точки для отображения
  onPointClick,          // При клике на маркер
  onSelectLocation,      // При клике на карту — получить координаты (для создания)
  center,                // Центр карты
  zoom = 10 
}) => {
  const [position, setPosition] = useState(center || [55.7558, 37.6176]); // Москва по умолчанию

  useEffect(() => {
    if (points.length > 0) {
      // Центрируем по первой точке
      setPosition([points[0].latitude, points[0].longitude]);
    }
  }, [points]);

  // Компонент для клика по карте
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (onSelectLocation) {
          const { lat, lng } = e.latlng;
          onSelectLocation({ latitude: lat, longitude: lng });
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 1 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Отображаем все точки */}
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          eventHandlers={{
            click: () => onPointClick?.(point),
          }}
        >
          <Popup>
            <div>
              <strong>{point.name}</strong>
              <br />
              {point.description || 'Без описания'}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Режим выбора точки (для формы создания) */}
      {onSelectLocation && <LocationMarker />}
    </MapContainer>
  );
};

export default MapComponent;
