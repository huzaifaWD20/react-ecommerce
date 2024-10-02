import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { logoutUser } from '../assets/utils/authentication.js';

const Navbar = ({ cartItems = [], removeFromCart, addToCart, increaseQuantity, decreaseQuantity, user, setUser, handleLogout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate total price directly without '$'
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price, // item.price should be a number
    0
  );

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-gray-700 hover:text-teal-600 transition duration-200 ${location.pathname === to ? 'text-teal-600 font-semibold' : ''}`}
    >
      {children}
    </Link>
  );

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="text-gray-600 hover:text-teal-600 focus:outline-none focus:text-teal-600 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-2xl font-semibold text-teal-600 ml-2 lg:ml-0">
              TECH JEWEL
            </Link>
          </div>

          <div className="hidden lg:flex space-x-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button
                className="text-gray-600 hover:text-teal-600 focus:outline-none"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)} {/* Show total quantity */}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white text-gray-800 shadow-lg rounded-lg py-4 px-4 z-20"
                  >
                    <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
                    {cartItems.length === 0 ? (
                      <p>Your cart is empty</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.productID} className="flex items-center justify-between mb-2">
                            <span>{item.product_name}</span>
                            <div className="flex items-center">
                              <button onClick={() => decreaseQuantity(item)} className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition duration-300">
                                <Minus size={12} />
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button onClick={() => handleAddToCart(item)} className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-full transition duration-300">
                                <Plus size={12} />
                              </button>
                              <button onClick={() => removeFromCart(item.productID)} className="ml-2 bg-gray-200 text-black-800 p-2 rounded-full hover:bg-gray-300 transition duration-300">
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 border-t pt-2">
                          <p className="font-semibold">Total: Rs {totalPrice.toFixed(2)}</p>
                          <Link to="/cart" className="mt-2 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition duration-200 block text-center">
                            Checkout
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <button
                className="text-gray-600 hover:text-teal-600 focus:outline-none flex items-center"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {user ? (
                  <>
                    <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                    <span className="hidden md:inline">{user.name}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </>
                ) : (
                  <User size={24} />
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg py-4 px-4 z-20"
                  >
                    {user ? (
                      <>
                        <div className="flex items-center mb-3">
                          <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                          <div>
                            <p className="font-semibold">{user.name}</p>
                          </div>
                        </div>
                        <Link to="/profile" className="block py-2 text-sm text-gray-700 hover:text-teal-600">View Profile</Link>
                        <Link to="/orders" className="block py-2 text-sm text-gray-700 hover:text-teal-600">Orders</Link>
                        <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700">Logout</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block py-2 text-sm text-gray-700 hover:text-teal-600">Login</Link>
                        <Link to="/signup" className="block py-2 text-sm text-gray-700 hover:text-teal-600">Sign Up</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4"
            >
              <div className="flex flex-col space-y-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
