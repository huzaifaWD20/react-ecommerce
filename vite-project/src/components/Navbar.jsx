import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

// CartDropdown Component
const CartDropdown = ({
  cartItems,
  totalPrice,
  addToCart,
  decreaseQuantity,
  handleRemoveFromCart,
}) => (
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
          <div key={item._id} className="flex items-center space-x-4 py-2">
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
                  onClick={() => handleRemoveFromCart(item)} // Updated handler
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
          to="/create-order"
          className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300"
        >
          Checkout
        </Link>
      </div>
    )}
  </div>
);

// ProfileDropdown Component
const ProfileDropdown = ({ user, handleLogout }) => (
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
          to={`/profile/${user._id}`}
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
          className="text-sm bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition duration-300 block text-center mt-2"
        >
          Sign Up
        </Link>
      </>
    )}
  </div>
);

// Main Navbar Component
const Navbar = ({
  cartItems = [],
  removeFromCart,
  addToCart,
  decreaseQuantity,
  setUser,
  user, // Receive 'user' as a prop
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.quantity * parseFloat(item.price.replace('$', '')),
    0
  );

  // Function to handle removing items from cart
  const handleRemoveFromCart = useCallback(
    async (item) => {
      try {
        if (!user?._id) {
          console.error('User is not logged in.');
          return;
        }

        // Make POST request to remove the item from the backend cart
        await axios.post('http://localhost:3001/user/removecart', {
          userId: user._id,
          productId: item._id,
          quantity: item.quantity,
        });

        // Update frontend state by calling the removeFromCart prop
        removeFromCart(item._id);

        console.log(`Successfully removed product ${item._id} from the cart.`);
      } catch (error) {
        console.error(
          'Error removing item from cart:',
          error.response?.data?.message || error.message
        );
      }
    },
    [removeFromCart, user]
  );

  // Function to process cart items before logout
  const processCartItemsBeforeLogout = useCallback(
    async (cartItems, userId) => {
      try {
        if (!userId) {
          console.error('User ID is not available.');
          return;
        }

        for (const item of cartItems) {
          const { _id, quantity } = item;

          // Send data to backend with userId
          await axios.post('http://localhost:3001/user/cart', { userId, productId: _id, quantity });
        }
        console.log('Cart items successfully processed before logout.');
      } catch (error) {
        console.error(
          'Error processing cart items:',
          error.response?.data?.message || error.message
        );
      }
    },
    []
  );

  // Handle Logout Function
  const handleLogout = useCallback(async () => {
    try {
      // Process the cart items before logging out
      await processCartItemsBeforeLogout(cartItems, user?._id);

      // Perform logout
      await axios.get('http://localhost:3001/auth/logout');
      sessionStorage.removeItem('user');
      setUser(null); // Update the user state to null
      navigate('/');
      // Removed: window.location.reload();
    } catch (error) {
      console.log(
        'Logout Error:',
        error.response?.data?.message || error.message
      );
    }
  }, [cartItems, navigate, processCartItemsBeforeLogout, setUser, user]);

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
              isActive
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-teal-400 transition duration-200'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-teal-400 transition duration-200'
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
            className="relative cursor-pointer"
          >
            <FiShoppingCart className="text-white text-2xl" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
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

          {/* Profile Icon and Dropdown */}
          <div
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
            className="relative cursor-pointer"
          >
            <FiUser className="text-white text-2xl" />
            {isProfileOpen && (
              <ProfileDropdown
                user={user}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Prop Types validation
CartDropdown.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalPrice: PropTypes.number.isRequired,
  addToCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
};

ProfileDropdown.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  handleLogout: PropTypes.func.isRequired,
};

Navbar.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.shape({ // Added user prop types
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default Navbar;
