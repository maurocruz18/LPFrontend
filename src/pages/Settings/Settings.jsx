// src/pages/SettingsPage/SettingsPage.js
import React, { useState } from 'react';
import './Settings.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Profile Settings State
  const [profile, setProfile] = useState({
    username: 'gamer123',
    email: 'gamer@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    bio: 'Passionate gamer who loves RPGs and strategy games. Always looking for the next great adventure!',
    country: 'United States',
    language: 'English',
    dateOfBirth: '1990-05-15'
  });

  // Privacy Settings State
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    showGameActivity: true,
    allowFriendRequests: true,
    allowMessages: 'friends',
    dataCollection: false,
    marketingEmails: true,
    newsletter: true
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailGameUpdates: true,
    emailSales: true,
    emailWishlist: true,
    pushGameUpdates: false,
    pushSales: true,
    pushFriendOnline: true,
    inAppMessages: true,
    inAppAchievements: true
  });

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'credit-card', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'paypal', email: 'user@example.com', isDefault: false }
  ]);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (section) => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert(`${section} settings saved successfully!`);
  };

  const addPaymentMethod = () => {
    alert('This would open a payment method form in a real app');
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const removePaymentMethod = (id) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings 
          profile={profile} 
          onChange={handleProfileChange}
          onSave={() => handleSaveSettings('Profile')}
          saving={saving}
        />;
      
      case 'privacy':
        return <PrivacySettings 
          privacy={privacy}
          onChange={handlePrivacyChange}
          onSave={() => handleSaveSettings('Privacy')}
          saving={saving}
        />;
      
      case 'notifications':
        return <NotificationSettings 
          notifications={notifications}
          onChange={handleNotificationChange}
          onSave={() => handleSaveSettings('Notification')}
          saving={saving}
        />;
      
      case 'payment':
        return <PaymentSettings 
          paymentMethods={paymentMethods}
          onAdd={addPaymentMethod}
          onSetDefault={setDefaultPayment}
          onRemove={removePaymentMethod}
        />;
      
      case 'security':
        return <SecuritySettings />;
      
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your GameStore account preferences and settings</p>
      </div>

      <div className="settings-container">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              Profile
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="nav-icon">🔒</span>
              Privacy
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="nav-icon">🔔</span>
              Notifications
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              <span className="nav-icon">💳</span>
              Payment Methods
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🛡️</span>
              Security
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ profile, onChange, onSave, saving }) => {
  return (
    <div className="settings-section">
      <h2>Profile Settings</h2>
      <p className="section-description">Manage your public profile information</p>

      <div className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => onChange('username', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="form-textarea"
            rows="4"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              value={profile.country}
              onChange={(e) => onChange('country', e.target.value)}
              className="form-select"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              value={profile.language}
              onChange={(e) => onChange('language', e.target.value)}
              className="form-select"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button 
            className="save-btn primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = ({ privacy, onChange, onSave, saving }) => {
  return (
    <div className="settings-section">
      <h2>Privacy Settings</h2>
      <p className="section-description">Control your privacy and data sharing preferences</p>

      <div className="settings-form">
        <div className="setting-group">
          <h3>Profile Visibility</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={privacy.profileVisibility === 'public'}
                onChange={(e) => onChange('profileVisibility', e.target.value)}
              />
              <span className="radio-custom"></span>
              Public - Anyone can see my profile
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="profileVisibility"
                value="friends"
                checked={privacy.profileVisibility === 'friends'}
                onChange={(e) => onChange('profileVisibility', e.target.value)}
              />
              <span className="radio-custom"></span>
              Friends Only - Only my friends can see my profile
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={privacy.profileVisibility === 'private'}
                onChange={(e) => onChange('profileVisibility', e.target.value)}
              />
              <span className="radio-custom"></span>
              Private - Only I can see my profile
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Activity & Social</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.showOnlineStatus}
                onChange={(e) => onChange('showOnlineStatus', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Show when I'm online
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.showGameActivity}
                onChange={(e) => onChange('showGameActivity', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Show what games I'm playing
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.allowFriendRequests}
                onChange={(e) => onChange('allowFriendRequests', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Allow friend requests
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Communication</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="allowMessages"
                value="everyone"
                checked={privacy.allowMessages === 'everyone'}
                onChange={(e) => onChange('allowMessages', e.target.value)}
              />
              <span className="radio-custom"></span>
              Everyone can message me
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="allowMessages"
                value="friends"
                checked={privacy.allowMessages === 'friends'}
                onChange={(e) => onChange('allowMessages', e.target.value)}
              />
              <span className="radio-custom"></span>
              Only friends can message me
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="allowMessages"
                value="none"
                checked={privacy.allowMessages === 'none'}
                onChange={(e) => onChange('allowMessages', e.target.value)}
              />
              <span className="radio-custom"></span>
              No one can message me
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Data & Marketing</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.dataCollection}
                onChange={(e) => onChange('dataCollection', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Allow anonymous data collection to improve services
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.marketingEmails}
                onChange={(e) => onChange('marketingEmails', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Receive marketing emails about new games and features
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacy.newsletter}
                onChange={(e) => onChange('newsletter', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Subscribe to GameStore newsletter
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="save-btn primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ notifications, onChange, onSave, saving }) => {
  return (
    <div className="settings-section">
      <h2>Notification Settings</h2>
      <p className="section-description">Choose how you want to be notified</p>

      <div className="settings-form">
        <div className="setting-group">
          <h3>Email Notifications</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.emailGameUpdates}
                onChange={(e) => onChange('emailGameUpdates', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Game updates and patches
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.emailSales}
                onChange={(e) => onChange('emailSales', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Sales and special offers
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.emailWishlist}
                onChange={(e) => onChange('emailWishlist', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Wishlist item on sale
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Push Notifications</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.pushGameUpdates}
                onChange={(e) => onChange('pushGameUpdates', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Game updates available
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.pushSales}
                onChange={(e) => onChange('pushSales', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Flash sales and deals
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.pushFriendOnline}
                onChange={(e) => onChange('pushFriendOnline', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Friends come online
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>In-App Notifications</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.inAppMessages}
                onChange={(e) => onChange('inAppMessages', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              New messages
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications.inAppAchievements}
                onChange={(e) => onChange('inAppAchievements', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Achievement unlocked
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="save-btn primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Settings Component
const PaymentSettings = ({ paymentMethods, onAdd, onSetDefault, onRemove }) => {
  return (
    <div className="settings-section">
      <h2>Payment Methods</h2>
      <p className="section-description">Manage your saved payment methods</p>

      <div className="payment-methods-list">
        {paymentMethods.map(method => (
          <div key={method.id} className="payment-method-card">
            <div className="payment-method-info">
              <div className="payment-icon">
                {method.type === 'credit-card' ? '💳' : '📧'}
              </div>
              <div className="payment-details">
                <div className="payment-type">
                  {method.type === 'credit-card' ? 'Credit Card' : 'PayPal'}
                </div>
                <div className="payment-info">
                  {method.type === 'credit-card' 
                    ? `•••• ${method.last4} - Expires ${method.expiry}`
                    : method.email
                  }
                </div>
              </div>
            </div>
            <div className="payment-actions">
              {method.isDefault ? (
                <span className="default-badge">Default</span>
              ) : (
                <button 
                  className="action-btn secondary"
                  onClick={() => onSetDefault(method.id)}
                >
                  Set as Default
                </button>
              )}
              <button 
                className="action-btn danger"
                onClick={() => onRemove(method.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-payment-section">
        <button className="add-payment-btn" onClick={onAdd}>
          <span className="add-icon">+</span>
          Add New Payment Method
        </button>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password change functionality would be implemented with backend');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-section">
      <h2>Security Settings</h2>
      <p className="section-description">Manage your account security</p>

      <div className="security-sections">
        <div className="security-group">
          <h3>Change Password</h3>
          <form className="security-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="save-btn primary">
              Change Password
            </button>
          </form>
        </div>

        <div className="security-group">
          <h3>Two-Factor Authentication</h3>
          <div className="security-info">
            <p>Add an extra layer of security to your account</p>
            <button className="action-btn primary">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="security-group">
          <h3>Login History</h3>
          <div className="login-sessions">
            <div className="login-session">
              <div className="session-info">
                <strong>Current Session</strong>
                <span>Chrome on Windows • Just now</span>
              </div>
              <span className="session-status active">Active</span>
            </div>
            <div className="login-session">
              <div className="session-info">
                <strong>Previous Session</strong>
                <span>Firefox on MacOS • 2 days ago</span>
              </div>
              <button className="action-btn danger">Log Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;