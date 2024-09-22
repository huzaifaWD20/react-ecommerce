import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../components/ModalComponent'; // Import your ModalComponent

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/products');
      const allProducts = response.data;
      const filteredProducts = categoryId
        ? allProducts.filter(product => product.category === categoryId)
        : allProducts;
      setProducts(filteredProducts);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory ? selectedCategory.id : null);
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/products/${productIdToDelete}`);
      setProducts(products.filter(product => product.id !== productIdToDelete));
      setProductIdToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const goToAddProduct = () => {
    navigate('/admin/add-product');
  };

  const goToEditProduct = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Products</h1>

      {/* Category Filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          className={`bg-teal-600 text-white py-2 px-4 rounded ${!selectedCategory && 'bg-teal-700'}`}
          onClick={() => handleCategoryChange(null)}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`bg-teal-600 text-white py-2 px-4 rounded ${selectedCategory?.id === category.id && 'bg-teal-700'}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="relative">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Product Name</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-200">
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex space-x-2">
                    <button
                      className="flex items-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-lg"
                      onClick={() => goToEditProduct(product.id)}
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      className="flex items-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-lg"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Product Button */}
        <div className="flex justify-start mt-4">
          <button
            onClick={goToAddProduct}
            className="bg-teal-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 flex items-center space-x-2"
          >
            <FaPlus className="text-xl pr-2" />
            <span className="text-base">Add Product</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Products;
