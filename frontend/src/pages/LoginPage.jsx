import React from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const LoginPage = ({ handleUserLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <AuthenticationForm isSignUp={false} handleUserLogin={handleUserLogin} />
    </div>
  );
};

export default LoginPage;
