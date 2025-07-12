import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";

const AnalyticsModal = ({ isOpen, closeModal, quarter, year }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
        fetch(`http://localhost:5000/analytics/${year}/${quarter}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`, 
              "Content-Type": "application/json"
            }
          })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server Error: ${res.status} - ${errorText}`);
          }
          return res.json();
        })
        .then((data) => {
          setAnalyticsData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching analytics:", err.message);
          setLoading(false);
        });
    }
  }, [isOpen, quarter, year]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            📊 Analytics for {year} {quarter && `- ${quarter}`}
          </h3>
          <button onClick={closeModal} className="text-white hover:text-gray-200 text-2xl">✖</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {loading ? (
            <p className="text-center text-lg font-semibold">Loading...</p>
          ) : !analyticsData || analyticsData.totalSales === undefined ? (
            // If no data exists for the selected quarter
            <p className="text-center text-red-600 font-semibold text-lg py-10">
              ❌ Data not available for this quarter
            </p>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
                  <h4 className="text-lg font-semibold text-gray-700">Total Sales</h4>
                  <p className="text-2xl font-bold text-blue-600">₹{analyticsData.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center shadow">
                  <h4 className="text-lg font-semibold text-gray-700">Total Orders</h4>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.totalOrders}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
                  <h4 className="text-lg font-semibold text-gray-700">Avg Sales Per Order</h4>
                  <p className="text-2xl font-bold text-yellow-600">₹{analyticsData.avgSalesPerOrder}</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demand Trends */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-md font-semibold mb-3">📈 Demand Trends</h4>
                  {analyticsData.previousSales && Object.keys(analyticsData.previousSales).length > 0 ? (
                    <Line
                      data={{
                        labels: Object.keys(analyticsData.previousSales),
                        datasets: [
                          {
                            label: "Sales Over Time",
                            data: Object.values(analyticsData.previousSales),
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                          },
                        ],
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">⚠️ Not enough data available</p>
                  )}
                </div>

                {/* Product Sales */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-md font-semibold mb-3">📊 Product Sales</h4>
                  {analyticsData.skuSales && Object.keys(analyticsData.skuSales).length > 0 ? (
                    <Bar
                      data={{
                        labels: Object.keys(analyticsData.skuSales),
                        datasets: [
                          {
                            label: "Units Sold",
                            data: Object.values(analyticsData.skuSales),
                            backgroundColor: "#10B981",
                          },
                        ],
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">⚠️ Not enough data available</p>
                  )}
                </div>

                {/* Revenue Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-md font-semibold mb-3">💰 Revenue Distribution</h4>
                  {analyticsData.categorySales && Object.keys(analyticsData.categorySales).length > 0 ? (
                    <Pie
                      data={{
                        labels: Object.keys(analyticsData.categorySales),
                        datasets: [
                          {
                            label: "Revenue Share",
                            data: Object.values(analyticsData.categorySales),
                            backgroundColor: ["#4F46E5", "#10B981", "#EF4444", "#F59E0B", "#3B82F6"],
                          },
                        ],
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">⚠️ Not enough data available</p>
                  )}
                </div>

                {/* Peak Sales Periods */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-md font-semibold mb-3">🔥 Peak Sales Periods</h4>
                  {analyticsData.previousSales && Object.keys(analyticsData.previousSales).length > 0 ? (
                    <Bar
                      data={{
                        labels: Object.keys(analyticsData.previousSales),
                        datasets: [
                          {
                            label: "Sales",
                            data: Object.values(analyticsData.previousSales),
                            backgroundColor: "#EF4444",
                          },
                        ],
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">⚠️ Not enough data available</p>
                  )}
                </div>
              </div>

              {/* Festivals Section */}
              {analyticsData.festivals && analyticsData.festivals.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg shadow mt-6">
                  <h4 className="text-md font-semibold mb-3">🎉 Festivals Impacting Sales</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {analyticsData.festivals.map((festival, index) => (
                      <li key={index} className="font-medium">{festival}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          
        </div>
        
      </div>
      
    </div>
  );
};

export default AnalyticsModal;
