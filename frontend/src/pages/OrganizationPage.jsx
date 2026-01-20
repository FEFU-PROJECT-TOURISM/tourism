// src/pages/OrganizationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrganization, getOrganizationTours, updateOrganization, deleteTour, updateTour } from '../services/api';
import { getOrganization as getCurrentOrg, isAuthenticated } from '../services/auth';
import OrganizationTourCard from '../components/OrganizationTourCard';
import StatusMessage from '../components/StatusMessage';
import './OrganizationPage.css';

const OrganizationPage = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tourError, setTourError] = useState(null);
  const [tourSuccess, setTourSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    phones: ['']
  });
  const [saving, setSaving] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const [editTourForm, setEditTourForm] = useState({
    name: '',
    description: '',
    tour_points: []
  });

  const currentOrg = getCurrentOrg();
  const isOwner = isAuthenticated() && currentOrg && currentOrg.id === parseInt(orgId);

  useEffect(() => {
    loadData();
  }, [orgId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgData, toursData] = await Promise.all([
        getOrganization(orgId),
        getOrganizationTours(orgId)
      ]);
      setOrganization(orgData);
      setTours(toursData);
      
      // Инициализируем форму редактирования
      setEditForm({
        name: orgData.name || '',
        address: orgData.address || '',
        phones: orgData.phones && orgData.phones.length > 0 
          ? orgData.phones.map(p => p.phone.toString())
          : ['']
      });
    } catch (err) {
      console.error('Ошибка загрузки данных организации:', err);
      setError({
        message: err.message || 'Ошибка загрузки данных организации',
        statusCode: err.statusCode || err.response?.status,
        details: err.details || err.response?.data || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrganization = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const phones = editForm.phones
        .map(phone => phone.trim())
        .filter(phone => phone !== '')
        .map(phone => parseInt(phone))
        .filter(phone => !isNaN(phone));

      const updatedOrg = await updateOrganization(orgId, {
        name: editForm.name,
        address: editForm.address || null,
        phones: phones.length > 0 ? phones : null
      });
      
      setOrganization(updatedOrg);
      setIsEditing(false);
      setSuccess({ message: 'Информация об организации успешно обновлена' });
      setError(null);
      setTourError(null);
      setTourSuccess(null);
    } catch (err) {
      console.error('Ошибка обновления организации:', err);
      setError({
        message: err.message || 'Ошибка обновления организации',
        statusCode: err.statusCode || err.response?.status,
        details: err.details || err.response?.data || null,
      });
      setSuccess(null);
      setTourError(null);
      setTourSuccess(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот тур?')) {
      return;
    }

    try {
      await deleteTour(tourId);
      setTours(prev => prev.filter(t => t.id !== tourId));
      setTourSuccess({ message: 'Тур успешно удален' });
      setTourError(null);
      setError(null);
      setSuccess(null);
    } catch (err) {
      console.error('Ошибка удаления тура:', err);
      setTourError({
        message: err.message || 'Ошибка удаления тура',
        statusCode: err.statusCode || err.response?.status,
        details: err.details || err.response?.data || null,
      });
      setTourSuccess(null);
      setError(null);
      setSuccess(null);
    }
  };

  const handleEditTour = (tour) => {
    setEditingTourId(tour.id);
    setEditTourForm({
      name: tour.name || '',
      description: tour.description || '',
      tour_points: tour.points ? tour.points.map((point, index) => ({
        point_id: point.id,
        order: index
      })) : []
    });
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTour(editingTourId, editTourForm);
      await loadData(); // Перезагружаем данные
      setEditingTourId(null);
      setTourSuccess({ message: 'Тур успешно обновлен' });
      setTourError(null);
      setError(null);
      setSuccess(null);
    } catch (err) {
      console.error('Ошибка обновления тура:', err);
      setTourError({
        message: err.message || 'Ошибка обновления тура',
        statusCode: err.statusCode || err.response?.status,
        details: err.details || err.response?.data || null,
      });
      setTourSuccess(null);
      setError(null);
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhone = () => {
    setEditForm(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }));
  };

  const handleRemovePhone = (index) => {
    setEditForm(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneChange = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }));
  };

  if (loading) {
    return (
      <div className="organization-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="organization-page">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <h2>Организация не найдена</h2>
          <p>Возможно, организация была удалена или не существует</p>
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="organization-page">
      <div className="org-header">
        <div className="org-header-content">
          <h1 className="org-name">{organization.name}</h1>
          {isOwner && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? 'Отменить' : 'Редактировать'}
            </button>
          )}
        </div>
      </div>

      <div className="org-content">
        {isEditing ? (
          <form onSubmit={handleSaveOrganization} className="org-edit-form">
            <div className="form-group">
              <label htmlFor="org-name">
                Название организации <span className="required">*</span>
              </label>
              <input
                id="org-name"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="org-address">Адрес</label>
              <input
                id="org-address"
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Например: г. Владивосток, ул. Пушкина, д. 10"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Телефоны</label>
              {editForm.phones.map((phone, index) => (
                <div key={index} className="phone-input-group">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder="+7XXXXXXXXXX"
                    className="form-input"
                  />
                  {editForm.phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(index)}
                      className="remove-phone-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPhone}
                className="add-phone-btn"
              >
                + Добавить телефон
              </button>
            </div>
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
            <div className="form-actions">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Восстанавливаем исходные значения
                  setEditForm({
                    name: organization.name || '',
                    address: organization.address || '',
                    phones: organization.phones && organization.phones.length > 0 
                      ? organization.phones.map(p => p.phone.toString())
                      : ['']
                  });
                }}
                className="btn btn-secondary"
              >
                Отменить
              </button>
            </div>
          </form>
        ) : (
          <div className="org-info">
            <div className="info-section">
              <h2>Контактная информация</h2>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{organization.email}</span>
              </div>
              {organization.address && (
                <div className="info-item">
                  <span className="info-label">Адрес:</span>
                  <span className="info-value">{organization.address}</span>
                </div>
              )}
              {organization.phones && organization.phones.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Телефоны:</span>
                  <div className="phones-list">
                    {organization.phones.map((phone, index) => (
                      <span key={index} className="phone-item">
                        {phone.phone}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="org-tours-section">
          <h2>Туры организации</h2>
          {tours.length === 0 ? (
            <div className="empty-state">
              <p>У этой организации пока нет туров</p>
              {isOwner && (
                <Link to="/create-tour" className="btn btn-primary">
                  Создать первый тур
                </Link>
              )}
            </div>
          ) : (
            <div className="tours-section">
              {(tourError || tourSuccess) && !editingTourId && (
                <StatusMessage 
                  message={tourError?.message || tourSuccess?.message} 
                  type={tourError ? "error" : "success"}
                  statusCode={tourError?.statusCode}
                  details={tourError?.details}
                  onClose={() => {
                    setTourError(null);
                    setTourSuccess(null);
                  }}
                />
              )}
              <div className="tours-grid">
              {tours.map((tour, index) => (
                <div key={tour.id} className="tour-item-wrapper">
                  {editingTourId === tour.id ? (
                    <form onSubmit={handleSaveTour} className="tour-edit-form">
                      <div className="form-group">
                        <label htmlFor={`tour-name-${tour.id}`}>
                          Название тура <span className="required">*</span>
                        </label>
                        <input
                          id={`tour-name-${tour.id}`}
                          type="text"
                          value={editTourForm.name}
                          onChange={(e) => setEditTourForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`tour-desc-${tour.id}`}>Описание</label>
                        <textarea
                          id={`tour-desc-${tour.id}`}
                          value={editTourForm.description}
                          onChange={(e) => setEditTourForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="form-textarea"
                        />
                      </div>
                      {tourError && (
                        <StatusMessage 
                          message={tourError.message} 
                          type="error" 
                          statusCode={tourError.statusCode}
                          details={tourError.details}
                          onClose={() => setTourError(null)}
                        />
                      )}
                      {tourSuccess && (
                        <StatusMessage 
                          message={tourSuccess.message} 
                          type="success"
                          onClose={() => setTourSuccess(null)}
                        />
                      )}
                      <div className="form-actions">
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn btn-primary"
                        >
                          {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTourId(null)}
                          className="btn btn-secondary"
                        >
                          Отменить
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <OrganizationTourCard tour={tour} index={index} />
                      {isOwner && (
                        <div className="tour-actions">
                          <button
                            onClick={() => handleEditTour(tour)}
                            className="btn btn-edit"
                          >
                            ✏️ Редактировать
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="btn btn-delete"
                          >
                            🗑️ Удалить
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
