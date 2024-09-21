import React from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <AuthenticationForm isSignUp={false} onLogin={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
