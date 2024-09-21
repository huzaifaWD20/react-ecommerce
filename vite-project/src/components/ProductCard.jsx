import React, { useState, useEffect } from 'react';
import { FaCartPlus, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product, addToCart, cartItems = [], increaseQuantity, decreaseQuantity }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    // Check if the product is in the cart and update quantity
    const item = cartItems.find(item => item._id === product._id);
    if (item) {
      setIsInCart(true);
      setQuantity(item.quantity);
    } else {
      setIsInCart(false);
      setQuantity(0);
    }
  }, [cartItems, product._id]);
  //console.log(product.id)
  const handleAddToCart = async () => {
    try {
      addToCart(product);
  
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      if (storedUser && storedUser._id) {
        await axios.post('http://localhost:3001/user/cart', {
          userId: storedUser._id,
          productId: product._id, // Ensure it's a string
          quantity: 1
        });
        console.log('Product added to cart successfully');
      } else {
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data?.message || error.message);
    }
  };
  
  

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.price}</p>
      <p className="text-gray-500 mb-4">{product.description}</p>
      <div className="flex items-center justify-between">
        {isInCart ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => decreaseQuantity(product)}
              className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition duration-300"
            >
              -
            </button>
            <span className="text-gray-700">{quantity}</span>
            <button
              onClick={() => increaseQuantity(product)}
              className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600 transition duration-300"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition duration-300"
          >
            <FaCartPlus className="mr-2" /> Add to Cart
          </button>
        )}
        <Link
          to={`/products/${product._id}`}
          className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300"
        >
          Read More <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
