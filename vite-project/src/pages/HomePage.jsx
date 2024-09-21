import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = ({ cartItems, addToCart, increaseQuantity, decreaseQuantity }) => {
  const [hotProducts, setHotProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async (url, setter) => {
      try {
        const response = await axios.get(url);
        setter(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts('http://localhost:3001/product/hotprod', setHotProducts);
    fetchProducts('http://localhost:3001/product/latest', setLatestProducts);
    fetchProducts('http://localhost:3001/product/featured', setFeaturedProducts);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Hot Products Carousel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Hot Products</h2>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
          {hotProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          ))}
        </div>
      </div>

      {/* Latest Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
