import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const SingleProductPage = ({ cartItems = [], addToCart, increaseQuantity, decreaseQuantity }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/product/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const cartItem = cartItems.find((item) => item._id === product._id);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
        &larr; Back to Products
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg shadow-md w-full h-auto max-h-96 object-contain"
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-xl text-teal-600 mb-4">{product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="mb-6">
            <span className="text-yellow-400">{`★`.repeat(product.rating)}</span>
            <span className="text-gray-400">{`★`.repeat(5 - product.rating)}</span>
            <p className="text-sm text-gray-500">Based on {product.reviews.length} reviews</p>
          </div>
          <div className="flex items-center mb-4">
            {cartItem ? (
              <div className="flex items-center">
                <button
                  className="bg-gray-300 text-gray-900 px-3 py-1 rounded-l hover:bg-gray-400 transition-colors duration-200"
                  onClick={() => decreaseQuantity(product)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  readOnly
                  className="w-12 text-center border border-gray-300 focus:outline-none"
                />
                <button
                  className="bg-gray-300 text-gray-900 px-3 py-1 rounded-r hover:bg-gray-400 transition-colors duration-200"
                  onClick={() => increaseQuantity(product)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors duration-200"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors duration-200"
            onClick={() => navigate(`/create-order/${productId}`)}
          >
            Buy Now
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="font-semibold text-gray-800">{review.user}</p>
              <p className="text-gray-600">{review.comment}</p>
              <span className="text-yellow-400">{`★`.repeat(review.rating)}</span>
              <span className="text-gray-400">{`★`.repeat(5 - review.rating)}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default SingleProductPage;
