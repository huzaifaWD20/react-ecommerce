import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const AllProductsPage = ({ products, categories, loading, addToCart, removeFromCart, cartItems, increaseQuantity, decreaseQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productsPerPage = 9;

  // Filter products by search term and category
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
      const matchesSearch = product && product.product_name && 
        product.product_name.toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
        (product && product.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">All Products</h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition duration-300"
          >
            <Filter className="inline-block mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence>
          {currentProducts.map((product) => (
            <ProductCard
              key={product.productID}
              product={product}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mt-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mt-2 px-3 py-1 rounded-full ${
              currentPage === page
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mt-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg p-6 overflow-y-auto z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProductsPage;