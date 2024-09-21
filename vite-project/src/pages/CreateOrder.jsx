// CreateOrder.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

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

  useEffect(() => {
    const fetchProductAndAdd = async () => {
      if (productId) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/product/${productId}`);
          const product = response.data;

          const formattedProduct = {
            ...product,
            price: product.price.toString(),
          };

          setProductDetails(formattedProduct);
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

  const addProductToOrder = (product) => {
    if (product) {
      setOrderData((prevState) => {
        const isProductInOrder = prevState.orderItems.some(
          (item) => item.productId === product._id
        );
        if (isProductInOrder) {
          console.log(`Product ${product._id} is already in the order.`);
          return prevState;
        }

        console.log(`Adding product ${product._id} to the order.`);
        return {
          ...prevState,
          orderItems: [
            ...prevState.orderItems,
            {
              productId: product._id,
              name: product.name,
              quantity: 1,
              price: product.price,
            },
          ],
        };
      });
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user._id && !productId) {
        try {
          const response = await axios.get(`http://localhost:3001/user/cart/${user._id}`);
          const cartItems = response.data.cartItems;

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

      const taxPrice = parseFloat((0.1 * itemsPrice).toFixed(2));
      const shippingPrice = itemsPrice > 0 ? 5 : 0;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const handleRemoveItem = (productId) => {
    setOrderData((prevState) => ({
      ...prevState,
      orderItems: prevState.orderItems.filter(
        (item) => item.productId !== productId
      ),
    }));
    toast.info('Item removed from the order.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));

      if (!user || !user._id) {
        throw new Error('User not found in session');
      }

      if (orderData.orderItems.length === 0) {
        throw new Error('No items in the order');
      }

      const orderToSubmit = {
        ...orderData,
        orderItems: orderData.orderItems.map((item) => ({
          ...item,
          price: item.price.toString(),
        })),
      };

      const response = await axios.post(
        'http://localhost:3001/orders/create',
        orderToSubmit,
        {
          withCredentials: true,
          headers: {
            'x-user-id': user._id,
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
                    className="flex flex-col md:flex-row justify-between items-center p-4 border border-gray-300 rounded-md"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <span className="text-sm text-gray-600">
                        Price per item: {item.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
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
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                value={orderData.shippingAddress.fullName}
                onChange={handleShippingAddressChange}
                placeholder="Full Name"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="address"
                value={orderData.shippingAddress.address}
                onChange={handleShippingAddressChange}
                placeholder="Address"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="city"
                value={orderData.shippingAddress.city}
                onChange={handleShippingAddressChange}
                placeholder="City"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="postalCode"
                value={orderData.shippingAddress.postalCode}
                onChange={handleShippingAddressChange}
                placeholder="Postal Code"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="country"
                value={orderData.shippingAddress.country}
                onChange={handleShippingAddressChange}
                placeholder="Country"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={orderData.shippingAddress.phoneNumber}
                onChange={handleShippingAddressChange}
                placeholder="Phone Number"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {/* Total Price */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="flex justify-between">
              <span>Items Price:</span>
              <span>${orderData.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Price:</span>
              <span>${orderData.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Price:</span>
              <span>${orderData.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Price:</span>
              <span>${orderData.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateOrder;
