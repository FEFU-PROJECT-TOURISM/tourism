// src/components/ErrorNotification.jsx
import React, { useEffect } from 'react';
import './ErrorNotification.css';

const ErrorNotification = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000); // Автоматически закрывается через 8 секунд
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  const { message, statusCode, details } = error;

  return (
    <div className="error-notification" onClick={onClose}>
      <div className="error-content" onClick={(e) => e.stopPropagation()}>
        <div className="error-header">
          <span className="error-icon">⚠️</span>
          <h4 className="error-title">Ошибка</h4>
          <button className="error-close" onClick={onClose}>×</button>
        </div>
        <div className="error-body">
          <p className="error-message">{message}</p>
          {statusCode && (
            <div className="error-status">
              <span className="status-label">Статус код:</span>
              <span className={`status-code status-${statusCode}`}>{statusCode}</span>
            </div>
          )}
          {details && (
            <div className="error-details">
              <span className="details-label">Детали:</span>
              <pre className="details-text">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
