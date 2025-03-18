import React from "react";

const Modal = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`relative w-96 p-6 rounded-lg shadow-xl text-white transform transition-all duration-300 ${
          type === "danger" ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg font-bold hover:text-gray-300"
        >
          ✕
        </button>
        <p className="text-lg font-semibold text-center">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
