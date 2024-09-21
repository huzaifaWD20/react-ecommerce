import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Retrieve user data from sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user'));
  
        if (!user || !user._id) {
          throw new Error('User not found in session');
        }
  
        // Make the axios request with user._id in the headers
        const response = await axios.get('http://localhost:3001/user/carts', {
          headers: {
            'x-user-id': user._id // Pass user._id in a custom header
          }
        });
  
        console.log('Cart data:', response.data.cart); // Log cart data to check structure
  
        // Set cart items from response data
        setCartItems(response.data.cart);
  
        // Set loading to false once data is fetched
        setLoading(false);
      } catch (err) {
        // Set error message if fetching fails
        setError('Failed to fetch cart items.');
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  
  // Handle removing item from cart
  const removeItemFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/user/cart/${productId}`);
      // Update local state by filtering out the removed item
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  // Handle updating quantity of a cart item
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put('http://localhost:3001/user/cart', { productId, quantity: newQuantity });
      // Update the cart state with the new quantity
      setCartItems(response.data.cart);
    } catch (err) {
      setError('Failed to update quantity.');
    }
  };

  // Render loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Render the cart items
  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productId._id} className="cart-item">
              {/* Ensure product details are correctly populated */}
              <p>{item.productId._id}</p>
              <p>{item.productId.name}</p> {/* Assuming product details like name are populated */}
              <p>Price: ${item.productId.price}</p> {/* Assuming price is part of product details */}
              <div>
                <label>Quantity: </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => removeItemFromCart(item.productId._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
