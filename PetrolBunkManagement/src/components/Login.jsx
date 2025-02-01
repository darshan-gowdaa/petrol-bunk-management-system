import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import bgImage from '../assets/bg_image.jpeg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    console.log('Current state:', { alert, username, password });

    if (username === 'admin' && password === 'admin') {
      setAlert({ message: 'Login successful! Redirecting...', type: 'success' });
      console.log('Redirecting to dashboard...');
      console.log('Before navigation:', { alert });

      setTimeout(() => {
        navigate('/dashboard');
        console.log('Navigation to dashboard executed');
      }, 2000);
    } else {
      setAlert({ message: 'Invalid Credentials, Try again!', type: 'error' });
      console.log('Login failed: Invalid credentials');
      console.log('Error alert set');
      setTimeout(() => setAlert({ message: '', type: '' }), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] bg-opacity-75 bg-cover bg-center">
      {alert.message && (
        <div className="fixed top-0 left-0 z-50 w-full">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ message: '', type: '' })}
          />
        </div>
      )}
      <div
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(35%)' }}
      />
      <div className="z-10 flex-1 w-full max-w-md p-12 transition-transform duration-300 transform bg-black rounded bg-70 opacity-70">
        <h1 className="mb-8 text-3xl font-bold text-center text-white">Welcome Back!</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {['Username', 'Password'].map((label, index) => (
            <div className="relative" key={label}>
              <input
                type={label.toLowerCase()}
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
          <button
            type="submit"
            className="bg-[#E50914] text-white py-3 px-4 rounded font-semibold hover:bg-[#f6121d] transition duration-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          <a href="#" className="text-white hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;