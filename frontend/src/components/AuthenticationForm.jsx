import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { signUpUser, loginUser } from '../assets/utils/authentication.js';

const AuthenticationForm = ({ isSignUp, handleUserLogin, isAdmin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isAdmin) {
        // Implement admin login logic
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        if (isSignUp) {
          if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          await signUpUser(formData);
          toast.success('Signup successful! Please log in.');
          setFormData({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
          navigate('/login');
        } else {
          const user = await loginUser(formData.email, formData.password);
          toast.success('Login successful!');
          handleUserLogin(user);
          navigate('/');
        }
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
        {isSignUp && !isAdmin && (
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
        )}

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

        {isSignUp && !isAdmin && (
          <>
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
          </>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
        >
          {isAdmin ? 'Login as Admin' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <FaGoogle size={20} className="text-red-500" />
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <FaFacebook size={20} className="text-blue-600" />
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <FaApple size={20} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}

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