import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

// CartDropdown Component
const CartDropdown = ({ cartItems, totalPrice, addToCart, decreaseQuantity, handleRemoveFromCart }) => (
  <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white shadow-lg rounded-lg py-4 px-4 z-20">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-semibold text-teal-400">Your Cart</h4>
      <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
    </div>
    <div className="divide-y divide-gray-700">
      {cartItems.length === 0 ? (
        <p className="text-center py-4 text-gray-400">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="flex items-center space-x-4 py-2">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <h5 className="text-sm font-semibold">{item.name}</h5>
              <p className="text-sm text-gray-400">${item.price}</p>
              <div className="flex items-center space-x-2 mt-1">
                <button onClick={() => decreaseQuantity(item)} className="text-sm bg-gray-700 text-teal-400 p-1 rounded-full">
                  <FaMinus />
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="text-sm bg-gray-700 text-teal-400 p-1 rounded-full">
                  <FaPlus />
                </button>
                <button onClick={() => handleRemoveFromCart(item)} className="text-sm bg-gray-700 text-red-500 p-1 rounded-full ml-2">
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    <div className="flex justify-between items-center mt-4">
      <Link to="/cart" className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300">View Cart</Link>
      <Link to="/create-order" className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300">Checkout</Link>
    </div>
  </div>
);

// ProfileDropdown Component
const ProfileDropdown = ({ user, handleLogout }) => (
  <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white shadow-lg rounded-lg py-4 px-4 z-20">
    {user ? (
      <>
        <div className="flex items-center justify-between">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline py-2 px-4 rounded-full">Logout</button>
        </div>
        <Link to={`/profile/${user._id}`} className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 mt-4 block text-center">View Profile</Link>
      </>
    ) : (
      <>
        <Link to="/login" className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 block text-center">Login</Link>
        <Link to="/signup" className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 block text-center mt-2">Sign Up</Link>
      </>
    )}
  </div>
);

// Main Navbar Component
const Navbar = ({ cartItems = [], removeFromCart, addToCart, decreaseQuantity, setUser, user }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price.replace('$', '')),
    0
  );

  const handleRemoveFromCart = useCallback(async (item) => {
    try {
      if (!user?._id) {
        console.error('User is not logged in.');
        return;
      }

      await axios.post('http://localhost:3001/user/removecart', {
        userId: user._id,
        productId: item._id,
        quantity: item.quantity,
      });

      removeFromCart(item._id);
      console.log(`Successfully removed product ${item._id} from the cart.`);
    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data?.message || error.message);
    }
  }, [removeFromCart, user]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get('http://localhost:3001/auth/logout');
      sessionStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log('Logout Error:', error.response?.data?.message || error.message);
    }
  }, [navigate, setUser]);

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Project Title on Left */}
        <div className="text-white text-2xl font-bold">Tech Jewel</div>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200')}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200')}>Products</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200')}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-400 transition duration-200')}>Contact</NavLink>
        </div>

        {/* Cart and Profile for Desktop */}
        <div className="relative hidden md:flex items-center space-x-4">
          <div>
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="text-gray-300 hover:bg-gray-700 relative">
              <FiShoppingCart className="text-xl" />
            </button>
            {isCartOpen && (
              <CartDropdown
                cartItems={cartItems}
                totalPrice={totalPrice}
                addToCart={addToCart}
                decreaseQuantity={decreaseQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            )}
          </div>
          <div>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-gray-300 hover:bg-gray-700 relative">
              <FiUser className="text-xl" />
            </button>
            {isProfileOpen && <ProfileDropdown user={user} handleLogout={handleLogout} />}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <NavLink to="/" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Home</NavLink>
          <NavLink to="/products" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Products</NavLink>
          <NavLink to="/about" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">About</NavLink>
          <NavLink to="/contact" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Contact</NavLink>
          
          {/* Cart and Profile in Mobile Menu */}
          <div className="relative">
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="block w-full text-left text-gray-300 hover:bg-gray-700 px-4 py-2">
              <FiShoppingCart className="inline mr-2" /> Cart
            </button>
            {isCartOpen && (
              <CartDropdown
                cartItems={cartItems}
                totalPrice={totalPrice}
                addToCart={addToCart}
                decreaseQuantity={decreaseQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            )}
          </div>
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="block w-full text-left text-gray-300 hover:bg-gray-700 px-4 py-2">
              <FiUser className="inline mr-2" /> Profile
            </button>
            {isProfileOpen && <ProfileDropdown user={user} handleLogout={handleLogout} />}
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  cartItems: PropTypes.array,
  removeFromCart: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default Navbar;
