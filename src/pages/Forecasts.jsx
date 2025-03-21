import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Forecasts = () => {
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const checkForecast = async () => {
    if (!year || !quarter) {
      alert("Please select both year and quarter");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/forecast/check-forecast?year=${parseInt(year)}&quarter=${parseInt(quarter)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.predictions) {
        setForecastData(data.predictions);
      } else {
        setForecastData(null);
      }
    } catch (error) {
      console.error("Error checking forecast:", error);
      setForecastData(null);
    }
  };

  const filteredData = forecastData?.filter(entry => entry.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>Demand Forecasting</h1>
          <ul className="flex space-x-6 text-sm">
            <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600">Dashboard</button></li>
            <li><button onClick={() => navigate("/upload")} className="hover:text-indigo-600">Upload Data</button></li>
            <li><button onClick={() => navigate("/forecasts")} className="hover:text-indigo-600">Forecasts</button></li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/signin");
                  window.location.reload();
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
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Check Forecast</h2>

        {/* Year & Quarter Inputs */}
        <div className="flex space-x-6 mb-6">
          <input
            type="number"
            className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="number"
            className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Quarter (1-4)"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          />
        </div>

        {/* Check Forecast Button */}
        <button
          onClick={checkForecast}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Check Forecast
        </button>

        {/* Forecast Result */}
        {forecastData ? (
  <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      Forecast Results for {year}, Q{quarter}
    </h3>

    {/* Search Bar */}
    <input
      type="text"
      className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-500"
      placeholder="Search by SKU Name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Sales Chart */}
    <h4 className="text-lg font-semibold text-gray-700 mt-6">
      Sales Predictions
    </h4>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sku" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="predicted_sales" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>

    {/* Data Table */}
    <h4 className="text-lg font-semibold text-gray-700 mt-6">
      Detailed Forecast Data
    </h4>
    <table className="w-full bg-white shadow-md rounded-lg mt-4">
      <thead className="bg-indigo-600 text-white">
        <tr>
          <th className="p-3">SKU</th>
          <th className="p-3">Predicted Sales</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((entry, index) => (
          <tr key={index} className="border-b">
            <td className="p-3">{entry.sku}</td>
            <td className="p-3">{entry.predicted_sales.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-red-600 text-lg font-semibold mt-6">
    No forecast available
  </p>
)}

      </div>
    </div>
  );
};

export default Forecasts;
