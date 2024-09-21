import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user._id) {
          throw new Error('User not found in session');
        }

        const response = await axios.get('http://localhost:3001/user/carts', {
          headers: {
            'x-user-id': user._id
          }
        });

        setCartItems(response.data.cart);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart items.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeItemFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/user/cart/${productId}`);
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put('http://localhost:3001/user/cart', { productId, quantity: newQuantity });
      setCartItems(response.data.cart);
    } catch (err) {
      setError('Failed to update quantity.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={styles.cartContainer}>
      <h1 style={styles.title}>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div style={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.productId._id} style={styles.cartItem}>
              <div style={styles.itemDetails}>
                <p style={styles.itemName}>{item.productId.name}</p>
                <p style={styles.itemPrice}>Price: {item.productId.price}</p>
                <div style={styles.quantityContainer}>
                  <label>Quantity: </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                    style={styles.quantityInput}
                  />
                </div>
                <button style={styles.removeButton} onClick={() => removeItemFromCart(item.productId._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  cartContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '20px',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  cartItem: {
    display: 'flex',
    background: '#f1f1f1',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },

  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#28a745',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  quantityInput: {
    width: '50px',
    marginLeft: '5px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    padding: '5px',
  },
  removeButton: {
    marginTop: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  removeButtonHover: {
    backgroundColor: '#c82333',
  },
  loading: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: '1.2rem',
  },
};

export default Cart;
