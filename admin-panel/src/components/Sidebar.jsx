import React, { useState } from 'react';
import { FaHome, FaBox, FaClipboardList, FaCogs, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          className="md:hidden p-4 text-gray-400 hover:text-gray-200 absolute top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-gray-900 text-gray-400 w-64 h-screen flex flex-col justify-between transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:relative md:flex md:flex-col z-40`}
      >
        <div className="relative">
          {/* Close button for mobile (Top-right) */}
          {isOpen && (
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 md:hidden"
              onClick={toggleSidebar}
            >
              <FaTimes size={24} />
            </button>
          )}
          
          {/* Sidebar Header */}
          <h1 className="text-teal-500 text-2xl font-bold p-4">E-Commerce Admin</h1>

          {/* Sidebar Navigation */}
          <nav className="mt-5">
            <Link to="/admin/dashboard" className="flex items-center p-4 hover:text-teal-400">
              <FaHome className="mr-3" /> Dashboard
            </Link>
            <Link to="/admin/products" className="flex items-center p-4 hover:text-teal-400">
              <FaBox className="mr-3" /> Products
            </Link>
            <Link to="/admin/categories" className="flex items-center p-4 hover:text-teal-400">
              <FaClipboardList className="mr-3" /> Categories
            </Link>
            <Link to="/admin/orders" className="flex items-center p-4 hover:text-teal-400">
              <FaClipboardList className="mr-3" /> Orders
            </Link>
            <Link to="/admin/settings" className="flex items-center p-4 hover:text-teal-400">
              <FaCogs className="mr-3" /> Settings
            </Link>
          </nav>
        </div>
        
        {/* Profile and Logout */}
        <div className="mb-5">
          <Link to="/admin/profile" className="flex items-center p-4 hover:text-teal-400">
            <FaUser className="mr-3" /> Profile
          </Link>
          <Link to="/logout" className="flex items-center p-4 hover:text-teal-400">
            <FaSignOutAlt className="mr-3" /> Logout
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
