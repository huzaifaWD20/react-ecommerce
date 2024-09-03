import React, { useState, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { LogoutUser } from '../assets/utils/authentication.js';

const Navbar = ({ cartItems = [], removeFromCart, addToCart, decreaseQuantity, user, setUser }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();  

  // Calculate total price based on cart items
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price.replace('$', '')),
    0
  );

  const handleLogout = useCallback(() => {
    LogoutUser();
    setUser(null); // Clear user state
    navigate('/');
    window.location.reload();  // To update the Navbar state after logout
  }, [navigate, setUser]);

  // Handle profile dropdown open/close
  const handleProfileMouseEnter = () => setIsProfileOpen(true);
  const handleProfileMouseLeave = () => setIsProfileOpen(false);

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <NavLink to="/" className="text-2xl font-semibold text-teal-400">
          TECH JEWEL
        </NavLink>
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            Contact
          </NavLink>
        </div>
        <div className="flex items-center space-x-4 relative">
          {/* Cart Icon and Dropdown */}
          <div
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
            className="relative"
          >
            <Link to="/cart" className="relative text-gray-400 hover:text-teal-400 transition duration-200">
              <FiShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>

            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 text-white shadow-lg rounded-lg py-4 px-4 z-20">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-teal-400">Your Cart</h4>
                  <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="divide-y divide-gray-700">
                  {cartItems.length === 0 ? (
                    <p className="text-center py-4 text-gray-400">Your cart is empty.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold">{item.name}</h5>
                          <p className="text-sm text-gray-400">${item.price}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => decreaseQuantity(item)}
                              className="text-sm bg-gray-700 text-teal-400 p-1 rounded-full"
                            >
                              <FaMinus />
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="text-sm bg-gray-700 text-teal-400 p-1 rounded-full"
                            >
                              <FaPlus />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm bg-gray-700 text-red-500 p-1 rounded-full ml-2"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      to="/cart"
                      className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300"
                    >
                      Checkout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Icon and Dropdown */}
          <div
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
            className="relative"
          >
            <button className="relative text-gray-400 hover:text-teal-400 transition duration-200">
              <FiUser size={24} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white shadow-lg rounded-lg py-4 px-4 z-20">
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>{user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:underline py-2 px-4 rounded-full"
                      >
                        Logout
                      </button>
                    </div>
                    <Link
                      to="/profile"
                      className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 mt-4 block text-center"
                    >
                      View Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 block text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 block text-center mt-4"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
