import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import Modal from "../components/Modal"; // Import the modal component
const token = localStorage.getItem("token"); 

const UploadQuarterResults = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [modal, setModal] = useState({ open: false, message: "", type: "" });

  const years = [2021, 2022, 2023, 2024]; // Hardcoded list of years

  // Handles file selection & parses CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file); // Store file for upload
  
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data.slice(0, 5)); // Show first 5 rows
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };
  

  // Handles Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setModal({ open: true, message: "No file selected!", type: "danger" });
      return;
    }
  
    const token = localStorage.getItem("token"); // Get auth token
    const formData = new FormData();
    formData.append("file", selectedFile); // Correct file upload
  
    try {
      const response = await fetch("http://localhost:5000/file/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
        body: formData, // Send file as FormData
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setModal({ open: true, message: "File uploaded successfully!", type: "success" });
        setSelectedFile(null); // Reset file after successful upload
        setFileName(""); // Reset file name
      } else {
        setModal({ open: true, message: data.message || "Upload failed", type: "danger" });
      }
    } catch (error) {
      setModal({ open: true, message: "Server error, try again!", type: "danger" });
    }
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
      <div className="max-w-4xl mx-auto p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Upload Quarter Results</h3>

        {/* Year & Quarter Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Year & Quarter</label>
          <div className="flex space-x-4">
            {/* Year Dropdown */}
            <select
              className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setSelectedYear(e.target.value)}
              value={selectedYear}
            >
              <option value="" disabled>Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Quarter Dropdown */}
            <select
              className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setSelectedQuarter(e.target.value)}
              value={selectedQuarter}
            >
              <option value="" disabled>Select Quarter</option>
              {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleFileChange}
          />
        </div>

        {/* File Name Display */}
        {fileName && <p className="text-sm text-gray-600 mb-2">Selected File: <span className="font-medium">{fileName}</span></p>}

        {/* CSV Preview */}
        {csvData && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">CSV Preview (First 5 Rows)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(csvData[0]).map((header, idx) => (
                      <th key={idx} className="border px-2 py-1 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, idx) => (
                    <tr key={idx} className="border">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          onClick={handleUpload}
        >
          Upload Results
        </button>
      </div>

      {/* Modal */}
      {modal.open && <Modal message={modal.message} type={modal.type} onClose={() => setModal({ open: false, message: "", type: "" })} />}
    </div>
  );
};

export default UploadQuarterResults;
