import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./Sign-Up";
import SignIn from "./Sign-In";
import Dashboard from "./Dashboard";
import UploadQuarterResults from "./pages/UploadQuarterlyResults";
import ProductView from "./pages/ProductView";
import Forecasts from "./pages/Forecasts";
import {jwtDecode} from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const App = () => {
  const token = localStorage.getItem("token");

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp && decoded.exp > currentTime;
    } catch (err) {
      return false;
    }
  };

  const isAuthenticated = isTokenValid(token);

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/upload" element={isAuthenticated ? <UploadQuarterResults /> : <Navigate to="/signin" />} />
        <Route path="/forecasts" element={isAuthenticated ? <Forecasts /> : <Navigate to="/signin" />} />
        <Route path="/products" element={isAuthenticated ? <ProductView /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
