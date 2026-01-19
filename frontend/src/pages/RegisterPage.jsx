// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phones: [''],
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

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const addPhoneField = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, ''],
    });
  };

  const removePhoneField = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData({ ...formData, phones: newPhones });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const phones = formData.phones
        .map(phone => phone.trim())
        .filter(phone => phone !== '')
        .map(phone => parseInt(phone))
        .filter(phone => !isNaN(phone));

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phones: phones,
      });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Не удалось зарегистрироваться. Попробуйте еще раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Регистрация организации</h1>
          <p>Создайте аккаунт для вашей организации</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">
              Название организации <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Название вашей организации"
              required
              className="form-input"
            />
          </div>

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
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Подтвердите пароль <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Телефоны</label>
            {formData.phones.map((phone, index) => (
              <div key={index} className="phone-input-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="+7XXXXXXXXXX"
                  className="form-input"
                />
                {formData.phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoneField(index)}
                    className="remove-phone-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhoneField}
              className="add-phone-btn"
            >
              + Добавить телефон
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Регистрация...
              </>
            ) : (
              <>
                <span>✅</span>
                Зарегистрироваться
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login" className="link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
