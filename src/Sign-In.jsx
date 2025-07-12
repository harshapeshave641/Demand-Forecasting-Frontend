import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import googleLogo from "./assets/google-logo.png";
import appleLogo from "./assets/apple-logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setModal({ show: true, message: "Email and password are required!", type: "danger" });
      return;
    }

    try {
      const response = await fetch("https://demandforecast-a0efcfcvc7bncdgj.centralindia-01.azurewebsites.net/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        setModal({ show: true, message: "Login successful!", type: "success" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
        window.location.reload();
      } else {
        setModal({ show: true, message: result.error || "Login failed!", type: "danger" });
      }
    } catch (error) {
      setModal({ show: true, message: "Network error! Try again.", type: "danger" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-poppins bg-white">
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}

      {/* Left Column - Form (50%) */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="mb-8 flex justify-center md:justify-start">
          <img 
            src="https://tse2.mm.bing.net/th/id/OIP.I1V6-BVd7eoOueZPws3IZAHaEK?w=1060&h=596&rs=1&pid=ImgDetMain&o=7&rm=3" 
            alt="Company Logo"
            className="h-12 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h2>
        <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-gray-700">
                Remember me for 30 days
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <img src={googleLogo} alt="Google Logo" className="h-5 w-5" />
              <span className="ml-2">Google</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <img src={appleLogo} alt="Apple Logo" className="h-5 w-5" />
              <span className="ml-2">Apple</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/" className="font-medium text-green-600 hover:text-green-500">
            Sign up
          </Link>
        </div>
      </div>

      {/* Right Column - Image (50%) */}
      <div className="hidden md:block md:w-1/2 bg-gray-100 relative">
        <div 
          className="absolute inset-0 flex items-center justify-center p-12 bg-green-600"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(5, 150, 105, 0.8), rgba(5, 150, 105, 0.8))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-md text-center text-white -mt-32">
            <h3 className="text-3xl font-bold mb-4">Walmart Inventory Management</h3>
            <p className="text-lg mb-6">
              Our platform helps organizations streamline operations and increase efficiency.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p>Secure</p>
              </div>
              <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>Fast</p>
              </div>
              <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p>Reliable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;