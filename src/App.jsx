import React, { useEffect } from "react";
import "./App.css"; // CSS kept intact
import { HashRouter, Routes, Route } from "react-router-dom"; // Routes kept intact
import { useDispatch, useSelector } from "react-redux";
import { fetchBlocklist } from "./features/blockSlice";

import Blocker from "./pages/Blocker.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import History from "./pages/History.jsx";

const App = () => {
  const dispatch = useDispatch();
  
  // 1. Get state directly from Redux (instead of useState)
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 2. Load the blocklist automatically when the user logs in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBlocklist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          {/* 3. CLEAN! No more passing 'onLogin' props */}
          <Route path="/" element={<Login />} />
          
          <Route
            path="/blocker"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {/* 4. CLEAN! No more 'onAddItem' or 'username' props */}
                <Blocker />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {/* 5. CLEAN! No more 'list' or 'onRemoveItem' props */}
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;