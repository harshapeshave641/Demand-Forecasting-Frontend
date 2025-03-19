import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./Sign-Up";
import SignIn from "./Sign-In";
import Dashboard from "./Dashboard"; // Assuming you have a Dashboard component
import UploadQuarterResults from "./pages/UploadQuarterlyResults";
import "./index.css";
import Forecasts from "./pages/Forecasts";
const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* If token exists, go to Dashboard; otherwise, go to SignIn */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/signin" element={token ? <Navigate to="/dashboard" /> : <SignIn />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/upload" element={token ? <UploadQuarterResults /> : <Navigate to="/signin" />} />
        <Route path="/forecasts" element={token ? <Forecasts /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
