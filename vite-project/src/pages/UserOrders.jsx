import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/orders/user/orders', {
          withCredentials: true,
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <Link to={`/orders/${order._id}`}>
                Order ID: {order._id} - Total: {order.totalPrice}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
