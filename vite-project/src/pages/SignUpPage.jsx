import React from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const SignUpPage = ({ setUser }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AuthenticationForm isSignUp={true} />
      </div>
    </div>
  );
};

export default SignUpPage;
