import React from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <AuthenticationForm isSignUp={false} onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
