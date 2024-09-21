import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa'; 

const NotFoundPage = () => {
  return (
    <section className='flex flex-col justify-center items-center h-screen text-center px-4'>
      <FaExclamationTriangle className='text-yellow-400 text-8xl mb-4 md:text-6xl' />
      <h1 className='text-4xl font-bold mb-4 md:text-6xl'>404 Not Found</h1>
      <p className='text-lg mb-5 md:text-xl'>This page does not exist</p>
      <Link
        to='/' 
        className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-5 py-3 mt-4 text-sm md:text-base'
      >
        Go Back
      </Link>
    </section>
  );
}

export default NotFoundPage;
