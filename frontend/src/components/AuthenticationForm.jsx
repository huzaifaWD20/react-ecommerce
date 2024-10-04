import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { sendOtp, verifyOtp, signUpUser, loginUser } from '../assets/utils/authentication.js';

const AuthenticationForm = ({ isSignUp, handleUserLogin, isAdmin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  const [otp, setOtp] = useState(''); // State for OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isAdmin) {
        // Admin login logic
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else if (isSignUp) {
        // Step 1: Send OTP for email verification
        if (!isOtpSent) {
          if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }

          // Send OTP to the user's email
          await sendOtp(formData);
          toast.success('OTP sent to your email. Please check your inbox.');
          setIsOtpSent(true);
        } else {
          // Step 2: Verify OTP and complete signup
          const response = await verifyOtp({ otp });
          if (response.status === 200) {
            // Now sign up the user after OTP verification
            await signUpUser();
            toast.success('Signup successful! Please log in.');
            setFormData({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
            navigate('/login');
          } else {
            toast.error('Invalid OTP. Please try again.');
          }
        }
      } else {
        // Regular login flow
        const user = await loginUser(formData.email, formData.password);
        toast.success('Login successful!');
        handleUserLogin(user);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
      if (!isSignUp) {
        setFormData({ ...formData, password: '' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
        {isAdmin ? 'Admin Login' : isSignUp ? 'Sign Up' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sign Up Form */}
        {isSignUp && !isAdmin && !isOtpSent && (
          <>
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
            >
              Send OTP
            </button>
          </>
        )}

        {/* OTP Verification Form */}
        {isSignUp && isOtpSent && (
          <>
            <div>
              <label htmlFor="otp" className="block text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
            >
              Verify OTP & Sign Up
            </button>
          </>
        )}

        {/* Login Form */}
        {!isSignUp && (
          <>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
            >
              Login
            </button>
          </>
        )}
      </form>

      {!isAdmin && (
        <div className="mt-4 text-center">
          {isSignUp ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:underline">
                Login here
              </Link>
            </p>
          ) : (
            <>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-teal-600 hover:underline">
                  Sign up here
                </Link>
              </p>
              <Link to="/forgot-password" className="text-teal-600 hover:underline block mt-2">
                Forgot your password?
              </Link>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AuthenticationForm;
