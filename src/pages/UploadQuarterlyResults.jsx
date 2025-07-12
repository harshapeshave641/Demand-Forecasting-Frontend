import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import Modal from "../components/Modal";

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
  const [forecastMessage, setForecastMessage] = useState(null);
  const years = [2021, 2022, 2023, 2024];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const handleDownload = async (filename) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/file/download/${filename}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
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
        const response = await fetch("https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/file/files/meta", {
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
        complete: (result) => setCsvData(result.data.slice(0, 5)),
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
      const response = await fetch("https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/file/upload", {
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
      const response = await fetch("https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/forecast/upload-from-gridfs", {
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
        setForecastMessage(data.message);
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
              <button onClick={() => { localStorage.removeItem("token"); navigate("/signin"); window.location.reload(); }}
                className="font-semibold hover:text-yellow-300 transition-colors">Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Upload Quarter Results</h3>

        {/* Year & Quarter Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700 mb-1">Select Year & Quarter Range</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Starting Year */}
            <select className="px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setStartYear(e.target.value)} value={startYear}>
              <option value="" disabled>Select Start Year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Ending Year */}
            <select className="px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEndYear(e.target.value)} value={endYear}>
              <option value="" disabled>Select End Year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Starting Quarter */}
            <select className="px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setStartQuarter(e.target.value)} value={startQuarter}>
              <option value="" disabled>Select Start Quarter</option>
              {quarters.map((quarter) => <option key={quarter} value={quarter}>{quarter}</option>)}
            </select>

            {/* Ending Quarter */}
            <select className="px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEndQuarter(e.target.value)} value={endQuarter}>
              <option value="" disabled>Select End Quarter</option>
              {quarters.map((quarter) => <option key={quarter} value={quarter}>{quarter}</option>)}
            </select>
          </div>
        </div>

        {/* File Upload Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700 mb-1">Upload CSV File</label>
          <input 
            type="file" 
            accept=".csv" 
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange} 
          />
        </div>

        {/* File Name Display */}
        {fileName && <p className="text-sm text-gray-600 mb-2">Selected File: <span className="font-medium">{fileName}</span></p>}

        {/* CSV Preview */}
        {csvData && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-blue-700">CSV Preview (First 5 Rows)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-200 text-sm mt-2">
                <thead className="bg-blue-50">
                  <tr>{Object.keys(csvData[0]).map((header, idx) => <th key={idx} className="border border-blue-200 px-2 py-1 text-left">{header}</th>)}</tr>
                </thead>
                <tbody>{csvData.map((row, idx) => (
                  <tr key={idx} className="border border-blue-200">{Object.values(row).map((val, i) => <td key={i} className="border border-blue-200 px-2 py-1">{val}</td>)}</tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleUpload}
        >
          Upload Results
        </button>

        {/* Uploaded Files Table */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-blue-700 mb-4">Uploaded Files</h4>
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-gray-600">No files uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-200 text-sm mt-2">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="border border-blue-200 px-2 py-1 text-left">File Name</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">Start Quarter</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">Start Year</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">End Quarter</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">End Year</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">Number of Quarters</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">Uploaded At</th>
                    <th className="border border-blue-200 px-2 py-1 text-left">Forecasts</th>
                  </tr>
                </thead>
                <tbody>
                 {uploadedFiles.map((file, idx) => {
  const [distributor, startQ, startY, endQ, endYWithExt] = file.filename.split("_");
  const endY = endYWithExt.replace(".csv", "");

  return (
    <tr key={idx} className="border border-blue-200">
      <td className="border border-blue-200 px-2 py-1">{file.filename}</td>
      <td className="border border-blue-200 px-2 py-1">{startQ}</td>
      <td className="border border-blue-200 px-2 py-1">{startY}</td>
      <td className="border border-blue-200 px-2 py-1">{endQ}</td>
      <td className="border border-blue-200 px-2 py-1">{endY}</td>
      <td className="border border-blue-200 px-2 py-1">9</td>
      <td className="border border-blue-200 px-2 py-1">
        {new Date(file.uploadDate).toLocaleString()}
      </td>
      <td className="border border-blue-200 px-2 py-1">
        <button
          onClick={() => handleForecastClick(file.filename)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Available forecasts
        </button>
      </td>
    </tr>
  );
})}

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
              <h4 className="text-lg font-semibold mb-4 text-blue-700">{forecastMessage}</h4>
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