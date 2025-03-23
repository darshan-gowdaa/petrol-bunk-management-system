import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/bg_image.jpeg";
import { useAuth } from "../hooks/useAuth";

const DEVELOPERS = [
  { name: "Darshan Gowda G S", email: "DarshanGowdaa223@gmail.com" },
  { name: "Monish Kumar R", email: "Kumarrmonish06@gmail.com" },
  { name: "Gnanesh K C", email: "appuGnanesh655@gmail.com" },
  { name: "Kushal J Vishwas", email: "KushalVishwas3835@gmail.com" },
];

const Login = () => {
  const [{ username, password }, setFormData] = useState({ username: "", password: "" });
  const [{ showHelpModal, isSubmitting, error }, setState] = useState({
    showHelpModal: false,
    isSubmitting: false,
    error: false,
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setState(prev => ({ ...prev, error: false }));
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username || !password) {
      setState(prev => ({ ...prev, error: true }));
      toast.error("Please enter both username and password", { position: "bottom-right" });
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));
    const result = await login({ username, password });

    if (result.success) {
      toast.success("Login successful! Redirecting...", { position: "bottom-right" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setState(prev => ({ ...prev, error: true }));
      toast.error(result.message || "Invalid username or password", { position: "bottom-right" });
    }
    setState(prev => ({ ...prev, isSubmitting: false }));
  };

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl p-6 mx-auto">
        <div 
          className="fixed inset-0 bg-center bg-cover transition-multiple duration-600" 
          style={{ 
            backgroundImage: `url(${bgImage})`, 
            filter: `brightness(${showHelpModal ? '25%' : '35%'})`,
            transform: showHelpModal ? 'scale(1.05)' : 'scale(1)'
          }} 
        />

        <div className="relative z-10 w-full max-w-md p-12 transition-all duration-300 ease-in-out transform bg-black rounded-lg shadow-xl opacity-90 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 animate-scaleIn">
          <h1 className="mb-8 text-3xl font-bold text-center text-white animate-fadeInUp">Welcome Back!</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {["username", "password"].map((field) => (
              <div key={field} className="relative mb-4 transition-all duration-300 ease-in-out transform hover:translate-x-1">
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={field === "username" ? username : password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && field === "username") {
                      e.preventDefault();
                      document.querySelector('input[name="password"]').focus();
                    }
                  }}
                  required
                  className={`w-full px-5 py-4 text-white bg-gray-800 rounded focus:outline-none focus:ring-2 transition-all duration-300 ease-in-out ${
                    error ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-gray-500"
                  } transform hover:scale-[1.02]`}
                />
                <label className={`absolute left-5 top-4 text-gray-400 transition-all duration-300 ease-in-out ${
                  (field === "username" ? username : password) ? "text-xs -translate-y-3" : ""
                }`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 mt-2 font-semibold text-white bg-red-600 rounded transition-all duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 active:scale-95 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="mt-3.5 text-center">
              <button
                onClick={() => setState(prev => ({ ...prev, showHelpModal: true }))}
                className="text-white transition-all duration-300 ease-in-out transform hover:text-red-400 hover:scale-110 hover:underline focus:outline-none"
              >
                Need Help?
              </button>
            </div>
          </form>
        </div>

        {showHelpModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-modalFadeIn"
            onClick={() => setState(prev => ({ ...prev, showHelpModal: false }))}
          >
            <div
              className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl opacity-95 backdrop-blur-sm animate-modalSlideIn"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white animate-fadeInUp">Contact Developers</h3>
                <button
                  onClick={() => setState(prev => ({ ...prev, showHelpModal: false }))}
                  className="text-gray-400 transition-all duration-300 ease-in-out transform hover:text-white hover:rotate-90 focus:outline-none"
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
                    className="p-4 bg-gray-800 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-gray-700 hover:translate-x-2 hover:scale-[1.02] animate-fadeInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="font-medium text-white">{dev.name}</p>
                    <a 
                      href={`mailto:${dev.email}`} 
                      className="text-sm text-blue-400 transition-all duration-300 ease-in-out transform hover:text-blue-300 hover:translate-x-1"
                    >
                      {dev.email}
                    </a>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setState(prev => ({ ...prev, showHelpModal: false }))}
                className="w-full px-6 py-2 mt-6 text-white transition-all duration-300 ease-in-out transform bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
};

export default Login;
