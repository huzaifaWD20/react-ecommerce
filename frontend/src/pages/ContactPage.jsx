import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            We're here to help! If you have any questions or concerns, please don't hesitate to reach out to us.
          </p>
          <div className="space-y-4">
            <a
              href="https://wa.me/+923365233353"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal-600 hover:text-teal-700 transition duration-300"
            >
              <FaWhatsapp className="mr-2" size={24} />
              Chat with us on WhatsApp
            </a>
            <a
              href="mailto:tj.tech.jewel@gmail.com"
              className="flex items-center text-teal-600 hover:text-teal-700 transition duration-300"
            >
              <FaEnvelope className="mr-2" size={24} />
              Send us an email
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;