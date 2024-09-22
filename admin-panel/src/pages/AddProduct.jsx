import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from '../components/ProductForm';

const AddProduct = () => {
  // State management
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [productImage, setProductImage] = useState(null);

  // Fetch product categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };

    // Fetch product types
    const fetchTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/productTypes');
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        toast.error('Error fetching product types');
      }
    };

    fetchCategories();
    fetchTypes();
  }, []);

  // Handle the "Add Product" action
  const handleAddProduct = async () => {
    if (!productName || !productPrice || !description || !productCategory || !productType) {
      toast.error("Please fill all fields");
      return;
    }

    // Remove any currency symbols (₨) and commas before saving
    const formattedPrice = parseFloat(productPrice.replace(/[₨,]/g, ''));

    // Generate a random product ID
    const newProductId = Math.floor(Math.random() * 10000).toString();

    // Create a new product object
    const product = {
      id: newProductId,
      name: productName,
      price: formattedPrice, // Ensure price is saved as a number
      description,
      category: productCategory,
      type: productType,
      image: productImage, // This assumes you handle image upload properly elsewhere
      rating: 0, // Default rating for new products
      reviews: [] // Default empty reviews
    };

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        toast.success("Product added successfully");
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  // Render the ProductForm and ToastContainer for notifications
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl text-teal-400 mb-6">Add New Product</h2>
      <ProductForm
        productName={productName}
        setProductName={setProductName}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        description={description}
        setDescription={setDescription}
        productCategory={productCategory}
        setProductCategory={setProductCategory}
        productType={productType}
        setProductType={setProductType}
        categories={categories}
        types={types}
        handleSubmit={handleAddProduct}
        productImage={productImage}
        setProductImage={setProductImage}
        isEditing={false}
      />
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
