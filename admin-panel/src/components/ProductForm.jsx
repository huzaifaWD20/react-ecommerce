import React, { useEffect } from 'react';
import { FaImage, FaPlus, FaPen } from 'react-icons/fa';

const ProductForm = ({
  productName,
  setProductName,
  productPrice,
  setProductPrice,
  description,
  setDescription,
  productCategory,
  setProductCategory,
  productType,
  setProductType,
  categories,
  types,
  handleSubmit,
  productImage,
  setProductImage,
  isEditing
}) => {

  // Set product price for editing mode
  useEffect(() => {
    if (isEditing && typeof productPrice === 'number') {
      setProductPrice(productPrice.toString());
    }
  }, [isEditing, productPrice, setProductPrice]);

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    const formattedPrice = productPrice.replace(/[₨,]/g, ''); // Remove ₨ sign before submission

    const product = {
      name: productName,
      price: parseFloat(formattedPrice), // Ensure the price is a number
      description,
      category: productCategory,
      type: productType,
      image: productImage,
    };

    handleSubmit(product);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl mx-auto">
      {productImage && (
        <div className="flex justify-center mb-4">
          <img
            src={productImage}
            alt="Product"
            className="w-full max-w-xs h-auto object-cover rounded-lg border border-gray-700"
          />
        </div>
      )}
      <div>
        <label htmlFor="productImage" className="block text-gray-400">Product Image</label>
        <input
          id="productImage"
          name="productImage"
          type="file"
          onChange={(e) => setProductImage(URL.createObjectURL(e.target.files[0]))}
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
        <FaImage className="text-teal-400 text-lg mt-2" />
      </div>
      <div>
        <label htmlFor="productName" className="block text-gray-400">Product Name</label>
        <input
          id="productName"
          name="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="productPrice" className="block text-gray-400">Price (₨)</label>
        <input
          id="productPrice"
          name="productPrice"
          type="text"
          value={`₨${productPrice}`}
          onChange={(e) => setProductPrice(e.target.value.replace(/[₨]/g, ''))}
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-400">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-gray-400">Category</label>
        <select
          id="category"
          name="category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="type" className="block text-gray-400">Type</label>
        <select
          id="type"
          name="type"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-700 rounded-lg bg-gray-800 text-white"
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-teal-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 flex items-center space-x-2"
      >
        {isEditing ? (
          <>
            <FaPen className="text-xl pr-2" />
            <span>Update Product</span>
          </>
        ) : (
          <>
            <FaPlus className="text-xl pr-2" />
            <span>Add Product</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ProductForm;
