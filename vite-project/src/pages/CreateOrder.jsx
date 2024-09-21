// CreateOrder.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Get productId from URL

  // Initialize order data state
  const [orderData, setOrderData] = useState({
    orderItems: [],
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
    },
    paymentMethod: '',
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
  });

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product details and add to orderItems on mount if productId is provided
  useEffect(() => {
    const fetchProductAndAdd = async () => {
      if (productId) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/product/${productId}`);
          const product = response.data;

          // Ensure the price is a string as per the model
          const formattedProduct = {
            ...product,
            price: product.price.toString(),
          };

          setProductDetails(formattedProduct);
          // Automatically add product to order if not already present
          addProductToOrder(formattedProduct);
        } catch (error) {
          console.error('Error fetching product details:', error);
          toast.error('Failed to fetch product details.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductAndAdd();
  }, [productId]);

  // Function to add product to orderItems
  const addProductToOrder = (product) => {
    if (product) {
      setOrderData((prevState) => {
        const isProductInOrder = prevState.orderItems.some(
          (item) => item.productId === product._id
        );
        if (isProductInOrder) {
          console.log(`Product ${product._id} is already in the order.`);
          return prevState; // Don't add if it's already in the order
        }

        console.log(`Adding product ${product._id} to the order.`);
        return {
          ...prevState,
          orderItems: [
            ...prevState.orderItems,
            {
              productId: product._id,
              name: product.name,
              quantity: 1, // Default quantity
              price: product.price, // Keep as string
            },
          ],
        };
      });
    }
  };

  // Fetch cart items from the backend if user is logged in and productId is not present
  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user._id && !productId) {
        try {
          const response = await axios.get(`http://localhost:3001/user/cart/${user._id}`);
          const cartItems = response.data.cartItems;

          // Add each cart item to orderItems
          cartItems.forEach((item) => {
            addProductToOrder({
              _id: item.productId,
              name: item.name,
              price: item.price.toString(),
            });
          });
        } catch (error) {
          console.error('Error fetching cart items:', error);
          toast.error('Failed to fetch cart items.');
        }
      }
    };

    fetchCartItems();
  }, [productId]);

  // Recalculate prices whenever orderItems change
  useEffect(() => {
    const calculatePrices = () => {
      const itemsPrice = orderData.orderItems.reduce((acc, item) => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 0;

        if (isNaN(price)) {
          console.warn(`Invalid price for item ${item.name}: ${item.price}`);
          return acc;
        }

        return acc + price * quantity;
      }, 0);

      const taxPrice = parseFloat((0.1 * itemsPrice).toFixed(2)); // 10% tax
      const shippingPrice = itemsPrice > 0 ? 5 : 0; // $5 shipping fee
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      console.log('Calculating prices:', { itemsPrice, taxPrice, shippingPrice, totalPrice });

      setOrderData((prevState) => ({
        ...prevState,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      }));
    };

    calculatePrices();
  }, [orderData.orderItems]);

  // Handle input changes for orderData fields (e.g., paymentMethod)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle input changes for shippingAddress fields
  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      shippingAddress: {
        ...prevState.shippingAddress,
        [name]: value,
      },
    }));
  };

  // Increase quantity of a specific order item
  const increaseQuantity = (productId) => {
    setOrderData((prevState) => ({
      ...prevState,
      orderItems: prevState.orderItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  };

  // Decrease quantity of a specific order item
  const decreaseQuantity = (productId) => {
    setOrderData((prevState) => ({
      ...prevState,
      orderItems: prevState.orderItems.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  // Remove an item from orderItems
  const handleRemoveItem = (productId) => {
    setOrderData((prevState) => ({
      ...prevState,
      orderItems: prevState.orderItems.filter(
        (item) => item.productId !== productId
      ),
    }));
    toast.info('Item removed from the order.');
  };

  // Handle form submission to create order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));

      if (!user || !user._id) {
        throw new Error('User not found in session');
      }

      // Validate orderItems
      if (orderData.orderItems.length === 0) {
        throw new Error('No items in the order');
      }

      // Optionally, validate shippingAddress and paymentMethod here

      // Prepare order data for submission
      const orderToSubmit = {
        ...orderData,
        orderItems: orderData.orderItems.map((item) => ({
          ...item,
          price: item.price.toString(), // Ensure price is string
        })),
      };

      // Create order
      const response = await axios.post(
        'http://localhost:3001/orders/create',
        orderToSubmit,
        {
          withCredentials: true,
          headers: {
            'x-user-id': user._id, // Pass user._id in a custom header
          },
        }
      );

      console.log('Order created:', response.data);
      toast.success('Order created successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create order.'
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Create Order</h1>
      {loading ? (
        <p>Loading product details...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Items Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Items
            </label>
            {orderData.orderItems.length === 0 ? (
              <p className="text-gray-500">No items in the order.</p>
            ) : (
              <ul className="space-y-4">
                {orderData.orderItems.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between items-center p-4 border border-gray-300 rounded-md"
                  >
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <span className="text-sm text-gray-600">
                        Price per item: {item.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.productId)}
                        className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.productId)}
                        className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        title="Remove Item"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={orderData.shippingAddress.fullName}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={orderData.shippingAddress.phoneNumber}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={orderData.shippingAddress.address}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={orderData.shippingAddress.city}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={orderData.shippingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={orderData.shippingAddress.country}
                  onChange={handleShippingAddressChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Payment Method</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              {/* Add more payment options as needed */}
            </select>
          </div>

          {/* Price Fields */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Price Details</h2>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Items Price:</span>
                <span>${orderData.itemsPrice.toFixed(2)}</span> {/* Ensure formatting */}
              </div>
              <div className="flex justify-between">
                <span>Tax Price (10%):</span>
                <span>${orderData.taxPrice.toFixed(2)}</span> {/* Ensure formatting */}
              </div>
              <div className="flex justify-between">
                <span>Shipping Price:</span>
                <span>${orderData.shippingPrice.toFixed(2)}</span> {/* Ensure formatting */}
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Price:</span>
                <span>${orderData.totalPrice.toFixed(2)}</span> {/* Ensure formatting */}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300"
            >
              Submit Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateOrder;
