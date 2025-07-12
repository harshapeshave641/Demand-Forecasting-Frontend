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
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

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
        backgroundColor: "rgba(0, 114, 206, 0.8)", // Walmart blue
        borderColor: "rgba(0, 114, 206, 1)",
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
    setSelectedYear(year);
    setSelectedQuarter(null);
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
            <li>
              <button onClick={() => navigate("/dashboard")} className="hover:text-yellow-300 transition-colors">
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/upload")} className="hover:text-yellow-300 transition-colors">
                Upload Data
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/forecasts")} className="hover:text-yellow-300 transition-colors">
                Forecasts
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/products")} className="hover:text-yellow-300 transition-colors">
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  sessionStorage.removeItem("token");
                  navigate("/signin");
                  window.location.reload()
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
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-blue-800">Inventory Analytics Dashboard</h2>

        {/* Year & Quarter Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Select Year & Quarter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {years.map((year) => (
              <div
                key={year}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
              >
                {/* Year Header */}
                <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-3">
                  <h4 className="text-xl font-bold text-blue-600">{year}</h4>
                  <button
                    onClick={() => handleYearClick(year)}
                    className="text-blue-600 hover:text-yellow-500 transition-colors"
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
                <div className="space-y-3 mt-4">
                  {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                    <button
                      key={quarter}
                      onClick={() => {handleYearClick(year); handleQuarterClick(quarter)}}
                      className="w-full flex items-center justify-between text-left text-sm text-gray-700 hover:bg-blue-50 px-4 py-2 rounded-md transition-all duration-200 border border-blue-100 hover:border-blue-300"
                    >
                      <span>{quarter}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
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
              </div>
            ))}
          </div>
        </div>

        {/* Predict Button */}
        <div className="mt-6">
          {/* Select Year & Quarter for Prediction */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              
            </label>
            <div className="flex space-x-4">
              {/* Year Dropdown */}
             
            </div>
          </div>

          {/* Predict Button */}
          
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