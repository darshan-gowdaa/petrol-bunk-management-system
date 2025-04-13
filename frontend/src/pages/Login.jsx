// frontend/src/pages/Login.jsx - Authentication page component for user login
import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast, toastConfig } from "../utils/toastConfig";
import { useAuth } from "../hooks/useAuth";

// Lazy load non-critical resources
const HelpModal = lazy(() => import("../components/modals/HelpModal"));

// Import styles only when needed
const loadToastStyles = () => import("react-toastify/dist/ReactToastify.css");
const loadBgImage = () => import("../assets/bg_image.avif");

const DEVELOPERS = [
  { name: "Darshan Gowda G S", email: "DarshanGowdaa223@gmail.com" },
  { name: "Monish Kumar R", email: "Kumarrmonish06@gmail.com" },
  { name: "Gnanesh K C", email: "appuGnanesh655@gmail.com" },
  { name: "Kushal J Vishwas", email: "KushalVishwas3835@gmail.com" },
];

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [state, setState] = useState({ showHelpModal: false, isSubmitting: false });
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Load non-critical resources after component mounts
  React.useEffect(() => {
    loadToastStyles();
    loadBgImage().then(module => setBgImageUrl(module.default));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      showToast.error("Please enter both username and password");
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const result = await login(formData);

      if (result.success) {
        showToast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        showToast.error(result.message || "Invalid username or password");
        setFormData(prev => ({ ...prev, password: "" }));
      }
    } catch (error) {
      showToast.error("An error occurred. Please try again.");
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'username') {
        e.preventDefault();
        document.querySelector('input[name="password"]').focus();
      } else if (field === 'password') {
        e.preventDefault();
        handleLogin();
      }
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl p-6 mx-auto">
        {bgImageUrl && (
          <div
            className="fixed inset-0 transition-all duration-300 bg-center bg-cover"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              filter: `brightness(${state.showHelpModal ? '25%' : '35%'})`,
            }}
          />
        )}

        <div className="relative z-10 w-full max-w-md p-12 transition-all duration-300 bg-black rounded-lg shadow-xl opacity-90 backdrop-blur-sm hover:shadow-2xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-white">Welcome Back!</h1>

          <div className="space-y-4">
            {["username", "password"].map((field) => (
              <div key={field} className="relative mb-4">
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyPress(e, field)}
                  autoComplete={field === "username" ? "off" : "current-password"}
                  required
                  className="w-full px-5 py-4 text-white transition-all duration-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <label className={`absolute left-5 top-4 text-gray-400 transition-all duration-300 ${formData[field] ? "text-xs -translate-y-3" : ""}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={handleLogin}
              disabled={state.isSubmitting}
              className={`w-full px-4 py-3 mt-2 font-semibold text-white bg-red-600 rounded transition-all duration-300 hover:bg-red-700 ${state.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {state.isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-3.5 text-center">
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, showHelpModal: true }))}
              className="text-white transition-colors duration-300 hover:text-red-400 hover:underline focus:outline-none"
            >
              Need Help?
            </button>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {state.showHelpModal && (
            <HelpModal
              onClose={() => setState(prev => ({ ...prev, showHelpModal: false }))}
            />
          )}
        </Suspense>
      </main>
      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default Login;

