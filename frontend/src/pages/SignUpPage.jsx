import React, { useState } from 'react';
import AuthenticationForm from '../components/AuthenticationForm';

const SignUpPage = ({ setUser }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {isOtpSent ? (
        <OtpVerificationForm email={email} name={name} />
      ) : (
        <AuthenticationForm isSignUp={true} setIsOtpSent={setIsOtpSent} setEmail={setEmail} setName={setName} />
      )}
    </div>
  );
};

export default SignUpPage;
