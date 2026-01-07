import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../components/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'member') {
      navigate('/user/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Branding */}
        <div className="navbar-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Task Manager Logo" className="navbar-logo" />
          <div className="brand-text">
            <h1 className="brand-title">Task Manager</h1>
            <p className="brand-subtitle">Organize • Manage • Succeed</p>
          </div>
        </div>

        {/* User Info and Logout */}
        {user && user.name && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`user-role ${userRole}`}>{userRole?.toUpperCase()}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
