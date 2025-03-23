import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/bg_image.jpeg";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    if (formData.username === "admin" && formData.password === "admin") {
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      toast.error("Invalid Credentials, Try again!");
    }
  };

  const developers = [
    { name: "Darshan Gowda G S", email: "DarshanGowdaa223@gmail.com" },
    { name: "Monish Kumar R", email: "Kumarrmonish06@gmail.com" },
    { name: "Gnanesh K C", email: "appuGnanesh655@gmail.com" },
    { name: "Kushal J Vishwas", email: "KushalVishwas3835@gmail.com" },
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl p-6 mx-auto">
        {/* Background Image */}
        <div
          className="fixed inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: "brightness(35%)",
          }}
        />

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-md p-12 transition-all duration-500 bg-black rounded-lg shadow-xl opacity-90 backdrop-blur-sm hover:shadow-2xl animate-fadeIn">
          <h1 className="mb-8 text-3xl font-bold text-center text-white">
            Welcome Back!
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-white transition-all duration-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <label
                className={`absolute left-5 top-4 text-gray-400 transition-all duration-200 ${
                  formData.username ? "text-xs -translate-y-3" : ""
                }`}
              >
                Username
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-white transition-all duration-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <label
                className={`absolute left-5 top-4 text-gray-400 transition-all duration-200 ${
                  formData.password ? "text-xs -translate-y-3" : ""
                }`}
              >
                Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-3 mt-2 font-semibold text-white transition-all duration-300 transform bg-red-600 rounded hover:bg-red-700 hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* Help Link */}
          <div className="mt-3.5 text-center text-gray-400">
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-white transition-all duration-300 hover:text-red-400 hover:underline focus:outline-none"
            >
              Need Help?
            </button>
          </div>
        </div>

        {/* Developer Contact Modal */}
        {showHelpModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowHelpModal(false);
            }}
          >
            <div
              className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl opacity-95 backdrop-blur-sm animate-modalSlideIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Contact Developers
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-400 transition-all duration-300 hover:text-white hover:rotate-90 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Developer List */}
              <div className="space-y-4">
                {developers.map((dev, index) => (
                  <div
                    key={index}
                    className="p-4 transition-all duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 hover:translate-x-2"
                  >
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
                  className="px-6 py-2 text-white transition-all duration-300 transform bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 active:scale-95"
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
      </main>
    </div>
  );
};

export default Login;
