import React from 'react';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Tech Jewel</h2>
          <p className="text-gray-600 mb-4">
            At Tech Jewel, we believe innovation begins with the right tools. We specialize in providing high-quality, affordable electronic components that empower creators of all levels—whether you're an engineering student, a hobbyist, or a DIY enthusiast. Our extensive catalog features essential products, from Arduino boards and ESP modules to converters, switches, and more, ensuring you have everything you need to bring your ideas to life.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is simple: to make high-quality components accessible and affordable for everyone. We combine this with fast shipping, reliable customer service, and a commitment to excellence. Whether you're working on your first project or refining a professional-grade prototype, Tech Jewel is here to support you every step of the way.
          </p>
          <p className="text-gray-600 mb-4">
            At Tech Jewel, we believe that technology should be accessible to everyone. That's why we offer competitive prices and excellent customer service. Our team of tech experts is always ready to help you find the perfect product for your needs.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Innovation is within your reach, with Tech Jewel, your next big idea is just a component away.</h3>
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Our Values</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Innovation: We stay ahead of the curve, bringing you the latest tech advancements.</li>
            <li>Quality: We only sell products that meet our rigorous quality standards.</li>
            <li>Customer Satisfaction: Your happiness is our top priority.</li>
            <li>Sustainability: We're committed to reducing our environmental impact.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUsPage; 