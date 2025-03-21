import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import Modal from "../components/Modal"; // Import modal component

const UploadQuarterResults = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [modal, setModal] = useState({ open: false, message: "", type: "" });
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [startQuarter, setStartQuarter] = useState("");
  const [endQuarter, setEndQuarter] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [forecastMessage,setforecastMessage]=useState(null)
  const years = [2021, 2022, 2023, 2024]; // Hardcoded list of years
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const handleDownload = async (filename) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/file/download/${filename}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Use filename for download
        link.click();
      } else {
        setModal({ open: true, message: "Failed to download file", type: "danger" });
      }
    } catch (error) {
      setModal({ open: true, message: "Server error, try again!", type: "danger" });
    }
  };

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/file/files/meta", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUploadedFiles(data);
        } else {
          setModal({ open: true, message: data.message || "Failed to fetch files", type: "danger" });
        }
      } catch (error) {
        setModal({ open: true, message: "Server error, try again!", type: "danger" });
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);

      Papa.parse(file, {
        complete: (result) => setCsvData(result.data.slice(0, 5)), // Show first 5 rows
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const extractNextQuarterAndYear = (filename) => {
    const parts = filename.split("_");
    const lastQuarter = parseInt(parts[3].replace("Q", ""), 10);
    const lastYear = parseInt(parts[4], 10);

    let nextQuarter = lastQuarter + 1;
    let nextYear = lastYear;

    if (nextQuarter > 4) {
        nextQuarter = 1;
        nextYear += 1;
    }

    return { nextQuarter, nextYear };
};



  const handleUpload = async () => {
    if (!selectedFile) {
      setModal({ open: true, message: "No file selected!", type: "danger" });
      return;
    }

    if (!startYear || !endYear || !startQuarter || !endQuarter) {
      setModal({ open: true, message: "Please select all year and quarter fields!", type: "danger" });
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("startYear", startYear);
    formData.append("endYear", endYear);
    formData.append("startQuarter", startQuarter);
    formData.append("endQuarter", endQuarter);

    try {
      const response = await fetch("http://localhost:5000/file/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setModal({ open: true, message: "File uploaded successfully!", type: "success" });
        setSelectedFile(null);
        setFileName("");
      } else {
        setModal({ open: true, message: data.message || "Upload failed", type: "danger" });
      }
    } catch (error) {
      setModal({ open: true, message: "Server error, try again!", type: "danger" });
    }
  };

  const handleForecastClick = async (filename) => {
    const token = localStorage.getItem("token");
    const { nextQuarter, nextYear } = extractNextQuarterAndYear(filename);
    try {
      const response = await fetch("http://localhost:5000/forecast/upload-from-gridfs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            year: nextYear,
            quarter: nextQuarter,
            fileName: filename,
        }),
    });

      const data = await response.json();
      if (response.ok) {
        setforecastMessage(data.message)
        setForecastData(data.forecast);
        setForecastModalOpen(true);
      } else {
        setModal({ open: true, message: data.error || "Failed to fetch forecasts", type: "danger" });
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
          <h1 className="text-xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>
            Demand Forecasting
          </h1>
          <ul className="flex space-x-6 text-sm">
            <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600">Dashboard</button></li>
            <li><button onClick={() => navigate("/upload")} className="hover:text-indigo-600">Upload Data</button></li>
            <li><button onClick={() => navigate("/forecasts")} className="hover:text-indigo-600">Forecasts</button></li>
            <li><button onClick={() => navigate("/settings")} className="hover:text-indigo-600">Settings</button></li>
            <li>
              <button onClick={() => { localStorage.removeItem("token"); navigate("/signin"); window.location.reload(); }}
                className="text-red-600 font-semibold hover:text-red-800">Logout
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Year & Quarter Range</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Starting Year */}
            <select className="px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setStartYear(e.target.value)} value={startYear}>
              <option value="" disabled>Select Start Year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Ending Year */}
            <select className="px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setEndYear(e.target.value)} value={endYear}>
              <option value="" disabled>Select End Year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Starting Quarter */}
            <select className="px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setStartQuarter(e.target.value)} value={startQuarter}>
              <option value="" disabled>Select Start Quarter</option>
              {quarters.map((quarter) => <option key={quarter} value={quarter}>{quarter}</option>)}
            </select>

            {/* Ending Quarter */}
            <select className="px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setEndQuarter(e.target.value)} value={endQuarter}>
              <option value="" disabled>Select End Quarter</option>
              {quarters.map((quarter) => <option key={quarter} value={quarter}>{quarter}</option>)}
            </select>
          </div>
        </div>

        {/* File Upload Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
          <input type="file" accept=".csv" className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleFileChange} />
        </div>

        {/* File Name Display */}
        {fileName && <p className="text-sm text-gray-600 mb-2">Selected File: <span className="font-medium">{fileName}</span></p>}

        {/* CSV Preview */}
        {csvData && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">CSV Preview (First 5 Rows)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm mt-2">
                <thead className="bg-gray-100">
                  <tr>{Object.keys(csvData[0]).map((header, idx) => <th key={idx} className="border px-2 py-1 text-left">{header}</th>)}</tr>
                </thead>
                <tbody>{csvData.map((row, idx) => (
                  <tr key={idx} className="border">{Object.values(row).map((val, i) => <td key={i} className="border px-2 py-1">{val}</td>)}</tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700" onClick={handleUpload}>
          Upload Results
        </button>

        {/* Uploaded Files Table */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Uploaded Files</h4>
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-gray-600">No files uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">File Name</th>
                    <th className="border px-2 py-1 text-left">Start Quarter</th>
                    <th className="border px-2 py-1 text-left">Start Year</th>
                    <th className="border px-2 py-1 text-left">End Quarter</th>
                    <th className="border px-2 py-1 text-left">End Year</th>
                    <th className="border px-2 py-1 text-left">Number of Quarters</th>
                    <th className="border px-2 py-1 text-left">Uploaded At</th>
                    <th className="border px-2 py-1 text-left">Forecasts</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, idx) => (
                    <tr key={idx} className="border">
                      <td className="border px-2 py-1">{file.filename}</td>
                      <td className="border px-2 py-1">{file.metadata.startQuarter}</td>
                      <td className="border px-2 py-1">{file.metadata.startYear}</td>
                      <td className="border px-2 py-1">{file.metadata.endQuarter}</td>
                      <td className="border px-2 py-1">{file.metadata.endYear}</td>
                      <td className="border px-2 py-1">{file.metadata.noOfQuarters}</td>
                      <td className="border px-2 py-1">
                        {new Date(file.uploadDate).toLocaleString()}
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => handleForecastClick(file.filename)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Available forecasts
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Forecast Data */}
      {forecastModalOpen && (
        <Modal
          message={
            <div>
              <h4 className="text-lg font-semibold mb-4">{forecastMessage}</h4>
              
            </div>
          }
          type="info"
          onClose={() => setForecastModalOpen(false)}
        />
      )}

      {/* Modal for General Messages */}
      {modal.open && <Modal message={modal.message} type={modal.type} onClose={() => setModal({ open: false, message: "", type: "" })} />}
    </div>
  );
};

export default UploadQuarterResults;