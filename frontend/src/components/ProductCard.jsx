import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Plus, Minus, X } from 'lucide-react';

const ProductCard = ({ product, addToCart, removeFromCart, cartItems = [], increaseQuantity, decreaseQuantity }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const item = cartItems.find(item => item.productID === product.productID);
    if (item) {
      setIsInCart(true);
      setQuantity(item.quantity);
    } else {
      setIsInCart(false);
      setQuantity(0);
    }
  }, [cartItems, product.productID]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
    setQuantity(1); // Initialize quantity to 1
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.productID);
    setIsInCart(false);
    setQuantity(0);
  };

  function handleIncreaseQuantity() {
    increaseQuantity(product);
    setQuantity(prevQuantity => prevQuantity + 1);
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      decreaseQuantity(product);
      setQuantity(prevQuantity => prevQuantity - 1);
    } else {
      decreaseQuantity(product);
      setIsInCart(false);
      setQuantity(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={`data:image/jpeg;base64,${product.image_base64}`} // Display image from base64 data
          alt={product.product_name}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
        </motion.div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.product_name}</h3>
        <p className="text-teal-600 font-medium text-xl mb-4">Rs {product.price}</p>
        <div className="flex flex-col items-center justify-between mt-4">
          {isInCart ? (
            <div className="flex items-center space-x-4 w-full">
              <button
                onClick={handleDecreaseQuantity}
                className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition duration-300"
              >
                <Minus size={20} />
              </button>
              <span className="text-gray-700 font-medium text-lg">{quantity}</span>
              <button
                onClick={handleIncreaseQuantity}
                className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-full transition duration-300"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={handleRemoveFromCart}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-full transition duration-300"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-full bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition duration-300 text-lg font-semibold"
            >
              <ShoppingCart size={24} className="mr-2" /> Add to Cart
            </button>
          )}
          <Link 
            to={`/products/${product.productID}`} 
            state={{ product }} // Pass product via state
            className="flex items-center justify-center w-full text-gray-600 hover:text-teal-600 mt-4 transition duration-300"
          >
            Read More <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
