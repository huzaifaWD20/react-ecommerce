import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SignUpUser, LoginUser } from '../assets/utils/authentication.js';

const AuthenticationForm = ({ isSignUp, onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await SignUpUser({ name: formData.name, email: formData.email, password: formData.password });
        toast.success('Signup successful!');
        navigate('/login');
      } else {
        const user = await LoginUser(formData.email, formData.password);
        toast.success('Login successful!');
        onLogin(user);  // Pass user information to App.jsx
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-md max-w-md mx-auto border border-teal-400">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h2>

      {isSignUp && (
        <div className="mb-4">
          <label htmlFor="name" className="block text-teal-400 mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-teal-400 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-teal-400 mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {isSignUp && (
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-teal-400 mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-800 text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition duration-300"
      >
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>
    </form>
  );
};

export default AuthenticationForm;
