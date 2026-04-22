import React from 'react';

const DEVELOPERS = [
  { name: "Darshan Gowda G S", email: "DarshanGowdaa223@gmail.com" },
  { name: "Monish Kumar R", email: "Kumarrmonish06@gmail.com" },
  { name: "Gnanesh K C", email: "appuGnanesh655@gmail.com" },
  { name: "Kushal J Vishwas", email: "KushalVishwas3835@gmail.com" },
];

const HelpModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl opacity-95 backdrop-blur-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Contact Developers</h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors duration-300 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {DEVELOPERS.map((dev, index) => (
            <div
              key={index}
              className="p-4 transition-all duration-300 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <p className="font-medium text-white">{dev.name}</p>
              <a
                href={`mailto:${dev.email}`}
                className="text-sm text-blue-400 transition-colors duration-300 hover:text-blue-300"
              >
                {dev.email}
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-2 mt-6 text-white transition-colors duration-300 bg-red-600 rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal; 