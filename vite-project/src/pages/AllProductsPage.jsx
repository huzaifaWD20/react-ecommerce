import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const AllProductsPage = ({ addToCart, cartItems, increaseQuantity, decreaseQuantity }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/product/all');
        console.log(response.data); // Log to verify data structure
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setProducts([]); // Set to empty array if data is not an array
        }
      } catch (err) {
        console.error('Error fetching products', err);
        setProducts([]); // Set to empty array on error
      }
    };

    fetchProducts();
  }, []);

  // Filter products by search term, category, and type
  const filteredProducts = useMemo(() => {
    console.log('Filtering products with:', {
      searchTerm,
      selectedCategory,
      selectedType,
      products
    });
    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesType = selectedType === 'All' || product.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType, products]);

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
          <option value="hot">Hot Products</option>
          <option value="latest">Latest Products</option>
          <option value="featured">Featured Products</option>
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
            key={product._id} // Assuming MongoDB ObjectID
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
