import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewCartPage = ({ cartItems = [], categories, removeFromCart, increaseQuantity, decreaseQuantity, setCartItems }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5175/api/auth/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, []);

  // Calculate total and subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  const total = subtotal; // You can modify this if you want to add taxes or shipping.

  // Function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.CategoryName : 'Unknown Category';
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login first to proceed with checkout.');
      navigate('/login');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        productID: item.productID,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await axios.post('http://localhost:5175/api/orders/create', {
        items: orderItems,
        shippingAddress: shippingAddress,
        paymentMethod: 'cash',
        totalAmount: total
      }, { withCredentials: true });
      
      window.localStorage.removeItem('cart');
      // Update the cart state in the frontend
      setCartItems([]);
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900">Your Shopping Cart</h2>
      
      <div className="mt-8 flex flex-col md:flex-row justify-between">
        {/* Left side - Product List */}
        <div className="md:w-2/3">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is currently empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productID} className="flex flex-col md:flex-row items-center mr-10 mb-4 p-4 bg-white shadow-lg rounded-lg">
                <img
                  src={`data:image/jpeg;base64,${item.image_base64}`}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="md:ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.product_name}</h3>
                  <p className="text-gray-500">{getCategoryName(item.category)}</p>
                  <p className="text-gray-900 font-medium">Rs {(item.quantity * item.price).toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button onClick={() => decreaseQuantity(item)} className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition duration-300">
                      <Minus size={20}/>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item)} className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-full transition duration-300">
                      <Plus size={20}/>
                    </button>
                    <button onClick={() => removeFromCart(item.productID)} className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300 transition duration-300">
                      <X size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="mt-8">
            <Link to="/products" className="text-teal-600 underline">Continue Shopping</Link>
          </div>
        </div>

        {/* Right side - Cart Summary and Checkout Form */}
        <div className="md:w-1/3 mt-8 md:mt-0">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Total:</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {cartItems.length > 0 && (
            <form onSubmit={handleCheckout} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                className="w-full px-3 py-2 mb-3 border rounded"
                required
              />
              <p className="text-sm text-gray-600 mb-4">Note: Currently, we only deliver within Pakistan.</p>
              <p className="text-sm text-gray-600 mb-4">Payment Method: Cash on Delivery</p>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition duration-300"
              >
                Place Order
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Assurance Section */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Why shop with us?</h3>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Fast and secure checkout process</li>
          <li>30-day money-back guarantee</li>
          <li>100% satisfaction guaranteed</li>
          <li>Customer support available 24/7</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="mt-8 bg-gray-900 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold">Need Help?</h3>
        <p className="mt-2">Contact us at tj.tech.jewel@gmail.com or call +92 336 5233353</p>
      </div>
    </div>
  );
};

export default ViewCartPage;