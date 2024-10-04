import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Package } from 'lucide-react';
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
      <h2 className="text-3xl font-semibold text-black-700 mb-6">Your Orders</h2>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.simpleOrderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-teal-600">Order #{order.simpleOrderId}</h3>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-600">Total: Rs {order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                    <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-teal-700 mt-4 mb-2">Items:</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item._id} className="py-3 flex justify-between">
                      <div className="flex items-center">
                        <Package className="text-teal-500 mr-2" size={20} />
                        <span className="text-gray-800">{item.product_name}</span>
                      </div>
                      <div className="text-gray-600">
                        Qty: {item.quantity} - Rs {item.price.toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;