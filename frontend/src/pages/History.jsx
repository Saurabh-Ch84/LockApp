// src/pages/History.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = ({ list,onRemoveItem }) => {
  const navigate = useNavigate();

  return (
    // 1. Add this new top-level container
    <div className="history-container">
      {/* 2. Your existing content card goes inside it */}
      <div className="page-content">
        <h2>Blocked Websites History</h2>
        <ul className="history-list">
          {list.length > 0 ? (
            list.map((site, index) => <li key={index}>
              <span>{site}</span>
              {/* 2. Add a remove button for each item */}
              <button className="remove-button" onClick={() => onRemoveItem(site)}>
                Remove
              </button>
            </li>)
          ) : (
            <p>Block list is currently empty.</p>
          )}
        </ul>
        <button className='back-button' onClick={() => navigate('/blocker')}>
            Back to Blocker
        </button>
      </div>
    </div>
  );
};

export default History;