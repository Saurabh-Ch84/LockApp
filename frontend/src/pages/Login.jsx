import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/status`)
      .then(res => res.json())
      .then(data => setIsSetup(data.is_setup));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await onLogin(username, password);

    if (result && result.success) {
      navigate('/blocker');
    } else {
      setError(result ? result.error : 'An unknown error occurred.');
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h1>{isSetup ? 'Welcome' : 'Create Admin Account'}</h1>
        <p>{isSetup ? 'Please log in to continue' : 'This will be the master account for the app.'}</p>
        
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type='submit' className="login-button">
            {isSetup ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;