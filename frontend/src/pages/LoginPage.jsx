// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Не удалось войти. Проверьте email и пароль.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Вход в систему</h1>
          <p>Войдите в свой аккаунт организации</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@organization.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Пароль <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Вход...
              </>
            ) : (
              <>
                <span>🔐</span>
                Войти
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
