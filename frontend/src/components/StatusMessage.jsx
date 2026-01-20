// src/components/StatusMessage.jsx
import React from 'react';
import './StatusMessage.css';

const StatusMessage = ({ message, type = 'error', statusCode, details, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div className={`status-message status-${type}`}>
      <div className="status-content">
        <div className="status-header">
          <span className="status-icon">
            {isError ? '⚠️' : isSuccess ? '✅' : 'ℹ️'}
          </span>
          <span className="status-text">{message}</span>
          {statusCode && (
            <span className="status-code-badge">HTTP {statusCode}</span>
          )}
          {onClose && (
            <button className="status-close" onClick={onClose} aria-label="Закрыть">
              ×
            </button>
          )}
        </div>
        {details && (
          <div className="status-details">
            <pre>{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusMessage;
