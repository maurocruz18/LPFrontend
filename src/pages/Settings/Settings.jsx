import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import './Settings.css';

const SettingsPage = () => {
  const { user, updateProfile, changePassword, updateSettings } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Data
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  // Settings Data
  const [settings, setSettings] = useState({
    showExplicitContent: user?.settings?.showExplicitContent || false
  });

  // Password Data
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});

  // Handle Profile Changes
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle Password Changes
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate Profile
  const validateProfile = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Nome é obrigatório';
    return errors;
  };

  // Validate Password
  const validatePassword = () => {
    const errors = {};
    if (!passwords.currentPassword) errors.currentPassword = 'Senha atual é obrigatória';
    if (!passwords.newPassword) errors.newPassword = 'Nova senha é obrigatória';
    if (passwords.newPassword.length < 6) errors.newPassword = 'Senha deve ter no mínimo 6 caracteres';
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = 'As senhas não correspondem';
    }
    return errors;
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfile();

    if (Object.keys(errors).length === 0) {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      try {
        await updateProfile(profile.name, profile.phone);
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao atualizar perfil' });
      } finally {
        setSaving(false);
      }
    } else {
      setProfileErrors(errors);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = validatePassword();

    if (Object.keys(errors).length === 0) {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      try {
        await changePassword(passwords.currentPassword, passwords.newPassword);
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao alterar senha' });
      } finally {
        setSaving(false);
      }
    } else {
      setPasswordErrors(errors);
    }
  };

  // Handle Settings Toggle for Explicit Content
  const handleToggleExplicitContent = async () => {
    const newExplicitContentState = !settings.showExplicitContent;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateSettings({ showExplicitContent: newExplicitContentState }); // Pass an object as expected by the service
      setSettings(prev => ({ ...prev, showExplicitContent: newExplicitContentState }));
      setMessage({ type: 'success', text: 'Configuração de conteúdo explícito atualizada!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao atualizar configuração de conteúdo explícito' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Minhas Definições</h1>
        <p>Gerencie suas informações de conta</p>
      </div>

      <div className="settings-container">
        <div className="settings-content">
          {/* Success/Error Messages */}
          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'success' ? '✓' : '✕'} {message.text}
            </div>
          )}

          {/* Profile Section */}
          <div className="settings-section">
            <h2>Informações do Perfil</h2>
            <p className="section-description">Atualize seu nome e número de telefone</p>

            <form className="settings-form" onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className={`form-input ${profileErrors.name ? 'error' : ''}`}
                  placeholder="Seu nome completo"
                />
                {profileErrors.name && <span className="error-message">{profileErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="(XX) 9XXXX-XXXX"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="settings-section">
            <h2>Alterar Senha</h2>
            <p className="section-description">Atualize sua senha para manter sua conta segura</p>

            <form className="settings-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Senha Atual *</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                  placeholder="Digite sua senha atual"
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">{passwordErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Nova Senha *</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                  placeholder="Digite sua nova senha"
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Nova Senha *</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirme sua nova senha"
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-message">{passwordErrors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn primary"
                  disabled={saving}
                >
                  {saving ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>

          {/* Display Settings Section */}
          <div className="settings-section">
            <h2>Configurações de Exibição</h2>
            <p className="section-description">Gerencie suas preferências de conteúdo</p>

            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Conteúdo Explícito</h3>
                  <p>Ativar ou desativar a exibição de conteúdo explícito.</p>
                </div>
                <button
                  type="button"
                  className={`toggle-button ${settings.showExplicitContent ? 'active' : ''}`}
                  onClick={handleToggleExplicitContent}
                  disabled={saving}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
