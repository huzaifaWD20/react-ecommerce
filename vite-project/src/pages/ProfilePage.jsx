import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiUser } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/profile/${userId}`, { withCredentials: true });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    setUploading(true);

    try {
      const response = await axios.post(`http://localhost:3001/user/profile/upload/${userId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      alert('Profile picture uploaded successfully!');
      setProfilePicture(null);
    } catch (error) {
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-teal-400" />
        <span className="ml-2 text-lg text-teal-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt={`${user.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 cursor-pointer transition-transform transform hover:scale-105"
            onClick={handleProfilePictureClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{user.name}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <FiMail className="mr-2" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <FiUser className="mr-2" />
            <span>ID: {user._id}</span>
          </div>

          {profilePicture && (
            <div className="mt-4">
              <button
                onClick={handleProfilePictureUpload}
                disabled={uploading}
                className={`bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Upload Profile Picture'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
