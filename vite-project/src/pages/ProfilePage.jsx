import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams(); // Extract userId from route parameters
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) { 
        console.log(userId)// Ensure userId is defined before making the request
      axios.get(`http://localhost:3001/user/profile/${userId}`)
        .then(response => setUser(response.data))
        .catch(err => {
          setError(err.response?.data?.message || 'An error occurred');
          console.error('Error fetching profile:', err);
        });
    }
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          {/* Render more user details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
