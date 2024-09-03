// src/pages/AllProductsPage.jsx
import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { hotProducts, latestProducts, featuredProducts } from '../assets/utils/sampleData.js';

const AllProductsPage = ({ addToCart, cartItems, increaseQuantity, decreaseQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Combine all products into one list
  const allProducts = useMemo(() => [
    ...hotProducts.map(product => ({ ...product, category: 'Hot' })),
    ...latestProducts.map(product => ({ ...product, category: 'Latest' })),
    ...featuredProducts.map(product => ({ ...product, category: 'Featured' }))
  ], []);

  // Filter products by search term, category, and type
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesType = selectedType === 'All' || product.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType, allProducts]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="All">All Categories</option>
          <option value="Hot">Hot Products</option>
          <option value="Latest">Latest Products</option>
          <option value="Featured">Featured Products</option>
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="All">All Types</option>
          <option value="Arduino Chips">Arduino Chips</option>
          <option value="BT Modules">BT Modules</option>
          <option value="Wires">Wires</option>
          {/* Add more types as needed */}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
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

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 border ${currentPage === index + 1 ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;
