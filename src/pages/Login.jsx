import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser, checkSetup } from '../features/authSlice';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get all state from Redux
  const { isAuthenticated, isSetupComplete, loading, error } = useSelector((state) => state.auth);

  // 1. Check if Setup is needed on mount
  useEffect(() => {
    dispatch(checkSetup());
  }, [dispatch]);

  // 2. Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/blocker');
    }
  }, [isAuthenticated, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    // 3. Dynamic Action: Login or Signup based on setup status
    if (isSetupComplete) {
      dispatch(loginUser({ username, password }));
    } else {
      dispatch(signupUser({ username, password }));
    }
  };

  const handleForgotPassword = async () => {
  try {
    const path = await window.electronAPI.getConfigPath();
    
    // NEW: Use the native Electron dialog
    await window.electronAPI.showDialog({
        title: "Reset Password",
        message: "Manual Reset Required",
        detail: `To reset your password, navigate to this folder:\n\n${path}\n\nDelete the file 'user-config.json' and restart the app.`
    });
    
  } catch (err) {
    console.error("Error showing dialog:", err);
  }
};

  if (loading) return <div className="login-container"><p>Loading...</p></div>;

  return (
    <div className='login-container'>
      <div className='login-box'>
        {/* Dynamic Headers */}
        <h1>{isSetupComplete ? 'Welcome Back' : 'First Time Setup'}</h1>
        <p>
          {isSetupComplete 
            ? 'Please log in to continue.' 
            : 'Create a master admin account to secure your blocker.'}
        </p>
        
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
            {isSetupComplete ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isSetupComplete && (
         <p 
           style={{ marginTop: '15px', cursor: 'pointer', color: '#666', fontSize: '0.9rem', textDecoration: 'underline' }} 
           onClick={handleForgotPassword}
         >
           Forgot Password?
         </p>
       )}
       
      </div>
    </div>
  );
};

export default Login;