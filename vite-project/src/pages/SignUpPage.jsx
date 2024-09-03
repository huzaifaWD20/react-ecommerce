import React from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const SignUpPage = ({ setUser }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <AuthenticationForm isSignUp={true} />
    </div>
  );
};

export default SignUpPage;
