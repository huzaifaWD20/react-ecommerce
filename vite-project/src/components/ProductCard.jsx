// src/components/ProductCard.jsx
import React from 'react';
import { useState,useEffect } from 'react';
import { FaCartPlus, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart, cartItems = [], increaseQuantity, decreaseQuantity }) => {
    // console.log('ProductCard rendered', { product, addToCart, cartItems, increaseQuantity, decreaseQuantity }); 
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(0);
  
    useEffect(() => {
      // Check if the product is in the cart and update quantity
      const item = cartItems.find(item => item.id === product.id);
      if (item) {
        setIsInCart(true);
        setQuantity(item.quantity);
      } else {
        setIsInCart(false);
        setQuantity(0);
      }
    }, [cartItems, product.id]);

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
            onClick={() => addToCart(product)}
            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition duration-300"
          >
            <FaCartPlus className="mr-2" /> Add to Cart
          </button>
        )}
        <Link
          to={`/products/${product.id}`}
          className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300"
        >
          Read More <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
