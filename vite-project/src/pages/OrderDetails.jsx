import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the orderId from URL params
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

  // Function to fetch order details
  const fetchOrder = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));

      if (!user) {
        toast.error('User not found in session');
        return;
      }

      const response = await axios.get(`http://localhost:3001/orders/${orderId}`, {
        withCredentials: true,
        headers: {
          'x-user-id': user._id, // Pass user._id in a custom header
        },
      });

      setOrderData(response.data); // Update state with order data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details.');
    }
  };

  // Effect to fetch order when component mounts
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {orderData.shippingAddress.fullName}, {orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}, {orderData.shippingAddress.country}, Phone: {orderData.shippingAddress.phoneNumber}
          </p>
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">{orderData.paymentMethod}</p>
        </div>
        <div>
          <label htmlFor="itemsPrice" className="block text-sm font-medium text-gray-700">Items Price</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">{orderData.itemsPrice}</p>
        </div>
        <div>
          <label htmlFor="taxPrice" className="block text-sm font-medium text-gray-700">Tax Price</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">{orderData.taxPrice}</p>
        </div>
        <div>
          <label htmlFor="shippingPrice" className="block text-sm font-medium text-gray-700">Shipping Price</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">{orderData.shippingPrice}</p>
        </div>
        <div>
          <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">{orderData.totalPrice}</p>
        </div>
        <div>
          <label htmlFor="orderItems" className="block text-sm font-medium text-gray-700">Order Items</label>
          <ul className="mt-1 p-2 border border-gray-300 rounded-md">
            {orderData.orderItems.map((item, index) => (
              <li key={index} className="py-1">
                <p><strong>Product ID:</strong> {item.productId}</p>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
