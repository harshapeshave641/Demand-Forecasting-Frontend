import React from "react";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl text-center p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome to My App</h1>
        <p className="text-gray-700 mt-4 text-lg">
          This is the homepage of your React app, built with React and Tailwind CSS.
          It serves as a foundation for building a fully functional web application.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Get Started</button>
          <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default App;
