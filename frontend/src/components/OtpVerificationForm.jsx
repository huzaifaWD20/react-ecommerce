import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../assets/utils/authentication'; // Function to verify OTP
import { toast } from 'react-toastify';

const OtpVerificationForm = ({ email, name }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verify OTP with email and name
      await verifyOtp({ email, name, otp });
      toast.success('Email verified successfully!');

      // Redirect to login or home
      navigate('/login');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">Verify Your Email</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-gray-700 mb-1">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
