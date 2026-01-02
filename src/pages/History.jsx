import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // 1. Redux Hooks
import { removeSite } from '../features/blockSlice';    // 2. Import the Thunk
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 3. Get the list directly from Redux Store
  // (No more props!)
  const { list } = useSelector((state) => state.blocklist);

  const handleRemove = async (site) => {
    try {
        // 4. Dispatch the remove action
        await dispatch(removeSite(site)).unwrap();
    } catch (error) {
        alert("Failed to remove site. Are you Admin?");
    }
  };

  return (
    <div className="history-container">
      <div className="page-content">
        <h2>Blocked Websites</h2>
        <ul className="history-list">
          {list.length > 0 ? (
            list.map((site, index) => (
              <li key={index}>
                <span>{site}</span>
                <button 
                    className="remove-button" 
                    onClick={() => handleRemove(site)}
                >
                  Remove
                </button>
              </li>
            ))
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