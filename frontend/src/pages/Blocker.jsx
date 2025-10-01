import React, { useState } from 'react'
import './Blocker.css'
import Hero from '../components/Hero.jsx'
import { useNavigate } from 'react-router-dom'
import User from '../components/User.jsx'

const Blocker = ({ onAddItem,username }) => {
  const [inputValue, setInputValue] = useState('');
  const navigate=useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newSite = inputValue.trim();
    if (!newSite) return;
    // 2. Call the function from App.jsx to update the list
     // --- ADD THIS LINE TO DEBUG ---
    console.log("Form submitted. Attempting to add site:", newSite);
    onAddItem(newSite);
    // 3. Clear the local input
    setInputValue('');
  };

  
return (
  <>
    <User username={username}/>
    <Hero />
    <div className='blocker-container'>
      {/* 1. Create a new div for the left side */}
      <div className="left-panel">
        <h2>Add Website To Block</h2>
        <form className="add-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="website-input"
            placeholder="e.g., www.facebook.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      {/* 2. Create a new div for the right side */}
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
