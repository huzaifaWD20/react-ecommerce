import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const HomePage = ({ products, categories, loading, addToCart, removeFromCart, cartItems, increaseQuantity, decreaseQuantity }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;

  const featuredProducts = products.slice(0, 3);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
          <img
            src="https://cdn.vectorstock.com/i/1000v/94/15/cpu-microchip-isometric-banner-vector-42469415.avif"
            alt="Product Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                Discover the Latest Tech Trends
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-200 mb-8"
              >
                Explore our curated collection of cutting-edge gadgets and accessories.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full text-lg font-semibold hover:bg-teal-700 transition duration-300"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Products</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-teal-600" size={48} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
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
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Categories</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-teal-600" size={48} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentCategories.map((category) => (
                    <motion.div
                      key={category.CategoryId}
                      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300 flex flex-col justify-between"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">{category.CategoryName}</h3>
                      <Link
                        to={`/products`}
                        className="text-teal-600 hover:underline mt-4 inline-block"
                      >
                        Shop Now
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === index + 1 ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
                      className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((testimonial) => (
                <motion.div
                  key={testimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: testimonial * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
                  </p>
                  <p className="font-semibold">- John Doe</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;