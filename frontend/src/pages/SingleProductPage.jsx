import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Plus, Minus, X, Loader } from 'lucide-react';

const SingleProductPage = ({ cartItems = [], addToCart, removeFromCart, increaseQuantity, decreaseQuantity }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  const handleRemoveFromCart = () => {
    removeFromCart(product.productID);
  };

  useEffect(() => {
    // Fetch product only if not passed via state
    if (!product) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5175/api/products/${productId}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, product]);

  const cartItem = cartItems.find((item) => item.productID === product?.productID);

  // Show loader while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="bg-teal-600 text-white mb-5 px-4 py-2 rounded-full hover:bg-teal-700 transition duration-300"
      >
        &larr; Back to Products
      </motion.button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={`data:image/jpeg;base64,${product.image_base64}`} 
            alt={product.product_name} 
            className="rounded-lg shadow-md w-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
          <p className="text-2xl text-teal-600 font-bold mb-4">Rs {product.price}</p>
          <p className="mb-4 text-gray-600">{product.description}</p>
          <div className="flex items-center space-x-4">
            {cartItem ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(product)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition duration-300"
                >
                  <Minus size={20}/>
                </button>
                <span className="text-xl font-semibold">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQuantity(product)}
                  className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-full transition duration-300"
                >
                  <Plus size={20}/>
                </button>
                <button
                  onClick={handleRemoveFromCart}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-full transition duration-300"
                >
                  <X size={20}/>
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition duration-300"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SingleProductPage;
