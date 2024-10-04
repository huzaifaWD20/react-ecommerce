import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 text-gray-600 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center space-y-6 lg:space-y-0 lg:justify-between">
          {/* Animated Tech Jewel Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: 'spring',
              stiffness: 100,
            }}
            className="text-center"
          >
            <Link to="/" className="text-2xl font-semibold text-teal-600">
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{
                  duration: 0.6,
                  yoyo: Infinity,
                }}
              >
                TECH JEWEL
              </motion.span>
            </Link>
          </motion.div>

          {/* Links and Social Icons - Grouped */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6 justify-center">
              <Link to="/about" className="hover:text-teal-600 transition duration-300">
                About
              </Link>
              <Link to="/contact" className="hover:text-teal-600 transition duration-300">
                Contact
              </Link>
              <Link to="/products" className="hover:text-teal-600 transition duration-300">
                Products
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 justify-center">
              <a
                href="https://www.facebook.com"
                className="text-gray-400 hover:text-teal-600 transition duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/tj.tech.jewel/"
                className="text-gray-400 hover:text-teal-600 transition duration-300"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Text */}
        <div className="mt-8 text-center text-sm">
          <p>&copy; {currentYear} Tech Jewel. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
