import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      if (!user) {
        // Add a slight delay to avoid immediate redirection
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!user) {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
          <div className="flex items-center mb-6">
            <img
              src={user.profilePic || '/placeholder.svg?height=96&width=96'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;