import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgImage from '../assets/bg_image.jpeg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin') {
      toast.success('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } else {
      toast.error('Invalid Credentials, Try again!');
    }
  };

  const developers = [
    { name: "Darshan Gowda G S", email: "DarshanGowdaa223@gmail.com" },
    { name: "Monish Kumar R", email: "Kumarrmonish06@gmail.com" },
    { name: "Gnanesh K C", email: "appuGnanesh655@gmail.com" },
    { name: "Kushal J Vishwas", email: "KushalVishwas3835@gmail.com" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] bg-opacity-75 bg-cover bg-center">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(35%)' }}
      />
      
      {/* Login Form */}
      <div className="z-10 flex-1 w-full max-w-md p-12 transition-transform duration-300 transform bg-black rounded shadow-xl opacity-90 backdrop-blur-sm">
        <h1 className="mb-8 text-3xl font-bold text-center text-white">Welcome Back!</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Username and Password Input Fields */}
          {['Username', 'Password'].map((label, index) => (
            <div className="relative" key={label}>
              <input
                type={label.toLowerCase() === 'password' ? 'password' : 'text'}
                value={index === 0 ? username : password}
                onChange={(e) =>
                  index === 0 ? setUsername(e.target.value) : setPassword(e.target.value)
                }
                required
                className="w-full bg-[#333] text-white px-5 py-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <label
                className={`absolute left-5 top-4 text-gray-400 transition-all duration-200 ${
                  (index === 0 ? username : password) ? 'text-xs -translate-y-3' : ''
                }`}
              >
                {label}
              </label>
            </div>
          ))}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#E50914] text-white py-3 px-4 rounded font-semibold hover:bg-[#f6121d] transition duration-200"
          >
            Sign In
          </button>
        </form>
        
        {/* Help Link */}
        <div className="mt-6 text-center text-gray-400">
          <button 
            onClick={() => setShowHelpModal(true)}
            className="text-right text-white transition-colors hover:underline focus:outline-none"
          >
            Need Help?
          </button>
        </div>
      </div>

      {/* Developer Contact Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-80">
          <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-xl rounded-3xl opacity-90 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Contact Developers</h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Developer List */}
            <div className="space-y-4">
              {developers.map((dev, index) => (
                <div key={index} className="p-4 bg-[#0f0f0f] rounded-lg hover:bg-[#444] transition-colors">
                  <p className="font-medium text-white">{dev.name}</p>
                  <a 
                    href={`mailto:${dev.email}`}
                    className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                  >
                    {dev.email}
                  </a>
                </div>
              ))}
            </div>
            
            {/* Close Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[#E50914] text-white rounded hover:bg-[#f6121d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;