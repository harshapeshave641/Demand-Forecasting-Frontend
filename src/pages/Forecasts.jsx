import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Forecasts = () => {
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [forecasts, setForecasts] = useState([]);
  const navigate = useNavigate();
  const fetchForecasts = async () => {
    if (!year || !quarter) {
      alert("Please select both year and quarter");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/forecasts?year=${year}&quarter=${quarter}`);
      const data = await response.json();
      setForecasts(data);
    } catch (error) {
      console.error("Error fetching forecasts:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    <h1 
      className="text-xl font-bold text-indigo-600 cursor-pointer" 
      onClick={() => navigate("/")}
    >
      Demand Forecasting
    </h1>
    <ul className="flex space-x-6 text-sm">
      <li>
        <button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600">
          Dashboard
        </button>
      </li>
      <li>
        <button onClick={() => navigate("/upload")} className="hover:text-indigo-600">
          Upload Data
        </button>
      </li>
      <li>
        <button onClick={() => navigate("/forecasts")} className="hover:text-indigo-600">
          Forecasts
        </button>
      </li>
      <li>
        <button onClick={() => navigate("/settings")} className="hover:text-indigo-600">
          Settings
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            localStorage.removeItem("token"); // Remove token
            sessionStorage.removeItem("token"); // Also clear sessionStorage if used
            navigate("/signin"); // Redirect to login
            window.location.reload()
          }}
          className="text-red-600 font-semibold hover:text-red-800"
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">View Forecasts</h2>

        {/* Year & Quarter Select */}
        <div className="flex space-x-6 mb-6">
          <select
            className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <select
            className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <option value="">Select Quarter</option>
            <option value="Q1">Q1 (Jan - Mar)</option>
            <option value="Q2">Q2 (Apr - Jun)</option>
            <option value="Q3">Q3 (Jul - Sep)</option>
            <option value="Q4">Q4 (Oct - Dec)</option>
          </select>
        </div>

        {/* Fetch Forecasts Button */}
        <button
          onClick={fetchForecasts}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          See Forecasts
        </button>

        {/* Forecast Results */}
        <div className="mt-8">
          {forecasts.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold mb-4">Forecast Results</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {forecasts.map((forecast, index) => (
                  <li key={index}>{forecast}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No forecasts available. Please select a year and quarter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecasts;
