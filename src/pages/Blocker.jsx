import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // 1. Import Redux hooks
import { addSite } from '../features/blockSlice';       // 2. Import the Thunk
import './Blocker.css';
import Hero from '../components/Hero.jsx';
import User from '../components/User.jsx';

const Blocker = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 3. Get the current user directly from the Redux Store
  // (We don't need to pass 'username' as a prop anymore)
  const { user } = useSelector((state) => state.auth);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newSite = inputValue.trim();
    if (!newSite) return;

    // 4. Dispatch the 'addSite' action directly
    try {
      // unwrap() helps us catch errors if the Electron call fails
      await dispatch(addSite(newSite)).unwrap();
      
      // Clear input only on success
      setInputValue('');
      // alert(`Successfully blocked: ${newSite}`);
    } catch (error) {
      console.error("Failed to add site:", error);
      alert("Error blocking site. Are you running as Admin?");
    }
  };

  return (
    <>
      {/* Pass the Redux user to your UI component */}
      <User username={user || 'Admin'} />
      <Hero />
      <div className='blocker-container'>
        <div className="left-panel">
          <h2>Add Website To Block</h2>
          <form className="add-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="website-input"
              placeholder="e.g., facebook.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="right-panel">
          <button className="history-button" onClick={() => navigate('/history')}>
            Block-List
          </button>
        </div>
      </div>
    </>
  );
}

export default Blocker;