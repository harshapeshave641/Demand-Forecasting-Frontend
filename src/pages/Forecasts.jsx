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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Walmart Style */}
      <nav className="bg-blue-600 shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
             <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
  <img
    src="https://logos-world.net/wp-content/uploads/2021/11/Walmart-Symbol.png"
    alt="Walmart Logo"
    className="h-8 w-auto object-contain"
  />
  <h1 className="text-xl font-bold text-white">Walmart Inventory Analytics</h1>
</div>
          <ul className="flex space-x-6 text-sm text-white">
            <li><button onClick={() => navigate("/dashboard")} className="hover:text-yellow-300 transition-colors">Dashboard</button></li>
            <li><button onClick={() => navigate("/upload")} className="hover:text-yellow-300 transition-colors">Upload Data</button></li>
            <li><button onClick={() => navigate("/forecasts")} className="hover:text-yellow-300 transition-colors">Forecasts</button></li>
            <li><button onClick={() => navigate("/products")} className="hover:text-yellow-300 transition-colors">Products</button></li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/signin");
                  window.location.reload();
                }}
                className="font-semibold hover:text-yellow-300 transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-blue-100">
        <h2 className="text-2xl font-semibold mb-6 text-blue-800">Inventory Forecasts</h2>

        {/* Year & Quarter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="number"
            className="w-full sm:w-1/2 p-3 border border-blue-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Year (e.g., 2023)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="number"
            className="w-full sm:w-1/2 p-3 border border-blue-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Quarter (1-4)"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            min="1"
            max="4"
          />
        </div>

        {/* Check Forecast Button */}
        <button
          onClick={checkForecast}
          className="bg-blue-600 text-white px-6 py-3 text-sm rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Check Forecast
        </button>

        {/* Forecast Result */}
        {forecastData ? (
          <div className="mt-10 p-6 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              Forecast Results for {year}, Q{quarter}
            </h3>

            {/* Search Bar */}
            <input
              type="text"
              className="w-full p-3 mb-6 border border-blue-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Search by SKU Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Sales Chart */}
            <h4 className="text-lg font-semibold text-blue-700 mb-4">
              Sales Predictions
            </h4>
            <div className="bg-white p-4 rounded-lg border border-blue-200 mb-8">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="sku" stroke="#4a5568" />
                  <YAxis stroke="#4a5568" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #4299e1',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="predicted_sales" 
                    fill="#0072CE" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <h4 className="text-lg font-semibold text-blue-700 mb-4">
              Detailed Forecast Data
            </h4>
           <div className="overflow-x-auto rounded-xl shadow-lg">
  <table className="w-full bg-white rounded-xl overflow-hidden">
    {/* Table Header */}
    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <tr>
        <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            SKU
          </div>
        </th>
        <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Predicted Sales
          </div>
        </th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="divide-y divide-blue-100">
      {filteredData.map((entry, index) => (
        <tr 
          key={index} 
          className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">{entry.sku.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{entry.sku}</div>
                <div className="text-sm text-gray-500">SKU-{index + 1}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="w-full">
                <div className="text-lg font-bold text-blue-700">
                  {entry.predicted_sales.toFixed(2)}
                  <span className="ml-1 text-xs font-normal text-gray-500">units</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(entry.predicted_sales/10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>

    {/* Table Footer */}
    <tfoot className="bg-blue-50">
      <tr>
        <td colSpan="2" className="px-6 py-3 text-right">
          <div className="text-sm text-blue-700 font-medium">
            Showing {filteredData.length} items
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 text-lg font-semibold">
              No forecast available for the selected period
            </p>
            <p className="text-red-500 mt-2">
              Please check your inputs and try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasts;