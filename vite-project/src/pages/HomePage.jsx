// src/pages/HomePage.jsx
import React from 'react';
import ProductCard from '../components/ProductCard';
import { hotProducts, latestProducts, featuredProducts } from '../assets/utils/sampleData.js'; // Example data

const HomePage = ({ cartItems, addToCart, increaseQuantity, decreaseQuantity }) => {
  // console.log('HomePage props:', { addToCart, cartItems, increaseQuantity, decreaseQuantity });
  return (
    <div>
      {/* Hot Products Carousel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hot Products</h2>
        <div className="flex overflow-x-auto space-x-4">
          {hotProducts.map(product => (
            <ProductCard
              key={product.id}
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
        <h2 className="text-2xl font-bold mb-4">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestProducts.map(product => (
            <ProductCard
              key={product.id}
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
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
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
