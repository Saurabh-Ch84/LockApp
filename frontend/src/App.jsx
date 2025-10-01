import React, { useEffect, useState } from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Blocker from "./pages/Blocker.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import History from "./pages/History.jsx";

const API_BASE_URL = "http://127.0.0.1:5000";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_BASE_URL}/api/blocklist`)
        .then((response) => response.json())
        .then((data) => setBlockList(data))
        .catch((error) => console.error("Error fetching blocklist:", error));
    }
  }, [isAuthenticated]);

  const addItemToBlockList = async (newItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blocklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ website: newItem }),
      });

      if (response.ok) {
        const newList = await (
          await fetch(`${API_BASE_URL}/api/blocklist`)
        ).json();
        setBlockList(newList);
      } else {
        console.error("Failed to add webiste to the backend");
      }
    } catch (error) {
      console.error("Error connecting to the server: ", error);
    }
  };

  const removeItemFromBlockList = async (itemToRemove) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blocklist/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: itemToRemove }),
      });

      if (response.ok) {
        setBlockList((prevList) =>
          prevList.filter(
            (site) => !site.includes(itemToRemove.replace("www.", ""))
          )
        );
      } else {
        // If the server returns an error (like 404), log it
        console.error(
          "Failed to remove website. Server responded with:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error connecting to the server: ", error);
    }
  };

  // In src/App.jsx

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setCurrentUser(username);
        return { success: true }; // Return success object
      } else {
        return { success: false, error: data.error }; // Return error object from server
      }
    } catch (error) {
      // --- THIS IS THE FIX ---
      // This block runs if the server is down or there's a network issue.
      console.error("Network error:", error); // Log the actual error for debugging
      // Always return a standard error object.
      return {
        success: false,
        error: "Could not connect to the server. Is it running?",
      };
    }
  };

  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/blocker"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Blocker
                  onAddItem={addItemToBlockList}
                  username={currentUser}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <History
                  list={blockList}
                  onRemoveItem={removeItemFromBlockList}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
