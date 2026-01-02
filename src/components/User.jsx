import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import './User.css';

const User = ({ username }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear Redux state & LocalStorage
    dispatch(logout());
    // 2. Send back to Login screen
    navigate('/');
  };

  return (
    <div className='user-container'>
      <div className="user-info">
        <h2>Welcome,</h2>
        <h3>{username}</h3>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default User;