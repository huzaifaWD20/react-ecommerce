import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateUserProfile } from '../assets/utils/authentication.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
      });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(user.id, {
        ...formData,
        profilePic: newProfilePic || user.profilePic,
      });
      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          <div className="flex items-center mb-6">
            <img
              src={newProfilePic || user.profilePic || '/placeholder.svg?height=96&width=96'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Order History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="max-w-2xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          {user.orders && user.orders.length > 0 ? (
            <div className="space-y-4">
              {user.orders.map((order, index) => (
                <div key={index} className="border-b pb-4">
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;