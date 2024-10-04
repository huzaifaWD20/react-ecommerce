import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const testimonials = [
  {
    quote: "Excellent Service and Quality! I ordered some Arduino boards and sensors from TECH JEWEL, and I was blown away by the quality of the components. The shipping was fast, and everything arrived in perfect condition. Their customer service team was super responsive and helped me choose the right products for my project. Definitely my go-to store for electronics now!",
    name: "Ahmed R."
  },
  {
    quote: "Fast Shipping and Affordable Prices. I needed an ESP module and a few converters for a DIY project, and TECH JEWEL had everything I was looking for. The prices are very reasonable, and the products are high quality. Plus, my order arrived within 3 days! I highly recommend TECH JEWEL to any hobbyists or engineering students out there.",
    name: "Sara M."
  },
  {
    quote: "A Lifesaver for My Projects! I was struggling to find reliable electronic components for a school project, but TECH JEWEL had everything I needed in one place. The 12V power module I ordered worked perfectly, and their team even answered my questions about how to use it! Super helpful and quick to respond—highly recommended!",
    name: "Zainab A."
  },
  {
    quote: "Top-notch Customer Support! I'm new to electronics, and TECH JEWEL made my experience so easy! I wasn't sure which converter to get, but they guided me through the options. The products were well-packaged, arrived in just a few days, and worked like a charm. I'll definitely be ordering again for my future projects.",
    name: "Hassan I."
  },
  {
    quote: "Great Prices and Quick Delivery! I've been ordering components from different sites for my DIY projects, and TECH JEWEL is hands down the best. Their prices are unbeatable, and the products are high quality. I was impressed by the fast delivery—it arrived even earlier than expected! This is now my favorite place to shop for electronic parts.",
    name: "Wania S."
  },
];

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
        <section className="py-16 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">{testimonial.quote}</p>
                  <p className="font-semibold text-right">- {testimonial.name}</p>
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