// components/modals/Unauthorized.jsx
import React from "react";

const Unauthorized = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Unauthorized</h2>
        <p className="mb-4">You do not have access to view this page.</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
