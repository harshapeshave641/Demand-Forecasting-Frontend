import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Modal from "../components/Modal";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/forecast/check-forecast?year=2022&quarter=3",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        if (data.predictions) {
          setProducts(data.predictions);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = async (product) => {
  setSelectedProduct(product);
  try {
    const suppliers = await fetchSuppliers(28.6343, 77.2195, product); // Example: Connaught Place coords
    product.suppliers = suppliers; // add to modal context
  } catch (e) {
    product.suppliers = [];
  }
  setModalOpen(true);
};
  const shopTypes = ["hardware","convenience","houseware", "supermarket", "department_store"];
  const randomShop = shopTypes[Math.floor(Math.random() * shopTypes.length)];
  const fetchSuppliers = async (lat, lon, product) => {
  const radius = 3000; // meters
  console.log(`Fetching suppliers for ${product.sku} within ${radius}m of (${lat}, ${lon})`);
  const query = `
    [out:json];
    (
      node["shop"="${randomShop}"](around:${radius},${lat},${lon});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });

  const data = await response.json();
  return [...data.elements].sort(() => 0.5 - Math.random()).slice(0, 5);
// Top 5 suppliers
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <li><button onClick={() => navigate("/products")} className="hover:text-yellow-300 transition-colors">Product Catalog</button></li>
            <li><button onClick={() => navigate("/forecasts")} className="hover:text-yellow-300 transition-colors">Forecasts</button></li>
            <li><button onClick={() => navigate("/upload")} className="hover:text-yellow-300 transition-colors">Upload Data</button></li>

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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Product Catalog</h2>
            <p className="text-gray-600">All products (2019-2025)</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-blue-100"
                onClick={() => handleProductClick(product)}
              >
                <div className="bg-blue-50 p-4 flex justify-center">
                  <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center shadow-inner border border-blue-200">
                    <span className="text-3xl font-bold text-blue-600">
                      {product.sku.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.sku}</h3>
                  <p className="text-blue-600 font-bold text-xl mb-2">
                    Category : {product.category || "N/A"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Q3 2022</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No forecasts have been generated yet</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try a different search term" : "Products are visible only after forecasts are generated."}
            </p>
          </div>
        )}

        {/* Product Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-right text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
{modalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-100 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name || selectedProduct.sku}</h3>
          <p className="text-sm text-gray-500 mt-1">Product Details</p>
        </div>
        <button 
          onClick={() => setModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="space-y-5">
        {/* Sales Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Predicted Sales</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">${selectedProduct.predicted_sales.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</p>
            <p className="font-mono text-gray-800 mt-1">{selectedProduct.sku}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
            <p className="text-gray-800 mt-1">{selectedProduct.category || "N/A"}</p>
          </div>
        </div>

        {/* Suppliers Section */}
        {selectedProduct.suppliers?.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-800">Nearby Suppliers</h4>
            </div>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {selectedProduct.suppliers.map((supplier, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800 truncate">
                      {supplier.tags.name || "Unnamed Supplier"}
                    </p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {supplier.tags.brand || "Generic"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {supplier.tags["addr:street"] || supplier.tags["addr:place"] || "Unknown address"}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      {supplier.tags["addr:city"] || "Unknown city"}
                    </p>
                    <a 
                      href={`https://www.google.com/maps?q=${supplier.lat},${supplier.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View Map
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Add your action here
            setModalOpen(false);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
        >
          Confirm Order
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProductCatalog;