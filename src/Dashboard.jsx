import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import AnalyticsModal from "./components/AnalyticsModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const years = [2021, 2022, 2023, 2024];

  // Generate random data for charts and tables
  const generateRandomData = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  };

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: generateRandomData(12),
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Table data for each quarter
  const tableData = [
    { month: "Jan", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Feb", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Mar", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Apr", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "May", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Jun", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Jul", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Aug", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Sep", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Oct", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Nov", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
    { month: "Dec", sales: generateRandomData(1)[0], revenue: generateRandomData(1)[0] * 100 },
  ];

  const handleYearClick = (year) => {
    setSelectedYear(year); // Ensure year is stored properly
    setSelectedQuarter(null); // Reset quarter when a new year is selected
    setIsModalOpen(true);
  };

  const handleQuarterClick = (quarter) => {
    setSelectedQuarter(quarter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>

        {/* Year & Quarter Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Year & Quarter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {years.map((year) => (
              <div
                key={year}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Year Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-indigo-700">{year}</h4>
                  <button
                    onClick={() => handleYearClick(year)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>

                {/* Quarter Buttons */}
                <div className="space-y-3">
                  {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                    <button
                      key={quarter}
                      onClick={() => {handleYearClick(year);handleQuarterClick(quarter)}}
                      className="w-full flex items-center justify-between text-left text-sm text-gray-700 hover:bg-indigo-50 px-4 py-3 rounded-lg transition-all duration-200 hover:translate-x-2"
                    >
                      <span>{quarter}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Year Summary (Optional) */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">Total Sales: <span className="font-semibold text-indigo-700">${(Math.random() * 100000).toLocaleString()}</span></p>
                  <p className="text-sm text-gray-600">Top Product: <span className="font-semibold text-indigo-700">Product A</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predict Button */}
        <div className="mt-6">
          {/* Select Year & Quarter for Prediction */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Year & Quarter to Predict
            </label>
            <div className="flex space-x-4">
              {/* Year Dropdown */}
              <select
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                    console.log("Year selected:", e.target.value);
                    setSelectedYear(Number(e.target.value));
                  }}
                   // Ensure it's stored as a number
                value={selectedYear || ""}
              >
                <option value="" disabled>Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Quarter Dropdown */}
              <select
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setSelectedQuarter(e.target.value)}
                value={selectedQuarter || ""}
              >
                <option value="" disabled>Select Quarter</option>
                {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                  <option key={quarter} value={quarter}>{quarter}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Predict Button */}
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            onClick={() => {
              if (selectedYear && selectedQuarter) {
                alert(`Predicting for ${selectedYear} - ${selectedQuarter}`);
              } else {
                alert("Please select a year and quarter.");
              }
            }}
          >
            Predict Next Quarter
          </button>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        quarter={selectedQuarter}
        year={selectedYear}
      />
    </div>
  );
};

export default Dashboard;