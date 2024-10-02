import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5175/api/orders/user', { withCredentials: true });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-2">Order #{order._id}</h3>
                  <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <h4 className="text-md font-semibold mt-4 mb-2">Items:</h4>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item._id} className="text-gray-600">
                        {item.product_name} - Quantity: {item.quantity} - Price: Rs {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;