import React from 'react';
import Sidebar from '../components/Sidebar';
import { ToastContainer } from 'react-toastify';

import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <Outlet />
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLayout;
  