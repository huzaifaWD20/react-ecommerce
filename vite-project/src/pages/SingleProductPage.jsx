import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { hotProducts, latestProducts, featuredProducts } from '../assets/utils/sampleData';

// Combine all product arrays into one array for easier searching
const sampleProducts = [...hotProducts, ...latestProducts, ...featuredProducts];

// Loader function to fetch product data by ID
export const productLoader = ({ params }) => {
  const productId = parseInt(params.productId);
  const product = sampleProducts.find((item) => item.id === productId);
  return product;
};


const SingleProductPage = ({ cartItems = [], addToCart, increaseQuantity, decreaseQuantity }) => {
  const product = useLoaderData();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the product is already in the cart
  const cartItem = cartItems.find((item) => item.id === product.id);

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">
        &larr; Back to Products
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <img src={product.image} alt={product.name} className="rounded-lg shadow-md w-full" />
        </div>
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">{product.price}</p>
          <p className="mb-4">{product.description}</p>
          <div className="mb-6">
            <span className="text-yellow-400">{`★`.repeat(product.rating)}</span>
            <span className="text-gray-400">{`★`.repeat(5 - product.rating)}</span>
            <p className="text-sm text-gray-500">Based on {product.reviews.length} reviews</p>
          </div>
          <div className="flex items-center">
            {cartItem ? (
              // If product is in the cart, show quantity controls
              <div className="flex items-center">
                <button
                  className="bg-gray-300 text-gray-900 px-2 py-1 rounded-l"
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
                  className="bg-gray-300 text-gray-900 px-2 py-1 rounded-r"
                  onClick={() => increaseQuantity(product)}
                >
                  +
                </button>
              </div>
            ) : (
              // If product is not in the cart, show Add to Cart button
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded-md"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{review.user}</p>
              <p>{review.comment}</p>
              <span className="text-yellow-400">{`★`.repeat(review.rating)}</span>
              <span className="text-gray-400">{`★`.repeat(5 - review.rating)}</span>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default SingleProductPage;
