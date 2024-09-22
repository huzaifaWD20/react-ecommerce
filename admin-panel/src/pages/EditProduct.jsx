import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ModalComponent from '../components/ModalComponent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(`http://localhost:5000/products/${id}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
        } else {
          console.error(`Product with id ${id} not found`);
        }

        const categoriesResponse = await fetch('http://localhost:5000/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        } else {
          console.error('Failed to fetch categories');
        }

        const typesResponse = await fetch('http://localhost:5000/productTypes');
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setProductTypes(typesData);
        } else {
          console.error('Failed to fetch product types');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (updatedProduct) => {
    setIsProcessing(true);
    try {
      // Ensure price is correctly formatted before sending to the API
      const cleanProduct = {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price.replace(/[₨,]/g, '')), // Clean and convert price
      };

      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanProduct),
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmUpdate = () => {
    handleUpdate(product);
    setIsModalOpen(false);
  };

  if (!product || categories.length === 0 || productTypes.length === 0) return <p>Loading...</p>;

  // Format price for the form input display
  const formattedPrice = typeof product.price === 'number' ? `${product.price}` : product.price;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl text-teal-400 mb-6">Edit Product</h2>
      <ProductForm
        productName={product.name}
        setProductName={(name) => setProduct(prev => ({ ...prev, name }))}
        productPrice={formattedPrice} // Pass formatted price for display
        setProductPrice={(price) => setProduct(prev => ({ ...prev, price }))} // Set raw price value
        description={product.description}
        setDescription={(desc) => setProduct(prev => ({ ...prev, description: desc }))}
        productCategory={product.category}
        setProductCategory={(category) => setProduct(prev => ({ ...prev, category }))}
        productType={product.type}
        setProductType={(type) => setProduct(prev => ({ ...prev, type }))}
        categories={categories}
        types={productTypes}
        handleSubmit={() => setIsModalOpen(true)}
        productImage={product.image}
        setProductImage={(image) => setProduct(prev => ({ ...prev, image }))}
        isEditing={true}
      />
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to update this product?"
      />
    </div>
  );
};

export default EditProduct;
