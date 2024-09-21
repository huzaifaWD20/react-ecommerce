const Product = require("../models/productModel");

// Add a new product
const addProduct = async (req, res) => {
  try {
      const { id, name, description, price, image, rating, category, reviews } = req.body;

      // Validate required fields
      if (!id || !name || !description || !price || !image || !rating || !category) {
          return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Create a new product
      const newProduct = new Product({
          id,
          name,
          description,
          price,
          image,
          rating,
          category, // Ensure category is provided
          reviews
      });

      // Save the product in the database
      const savedProduct = await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
  }
};


const getProductById = async (req, res) => {
  try {
    const { productid } = req.params; // Extract product ID from the URL parameters

    // Find the product by ID
    const product = await Product.findById(productid);

    // If product not found, return a 404 response
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the product details in the response
    res.json(product);
  } catch (error) {
    // Handle errors and return a 500 response
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            { $set: req.body }, // Update the fields provided in the request body
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products
      res.json(products); // Send the products as JSON
    } catch (err) {
      console.error('Error fetching all products', err);
      res.status(500).json({ message: 'Error fetching all products' });
    }
  };

// Get Hot Products
const getHotProducts = async (req, res) => {
  try {
    const hotProducts = await Product.find({ category: 'hot' }); // Replace with your own filtering logic
    res.status(200).json(hotProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Latest Products
const getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find({ category: "latest" }) // Latest based on creation date
    res.status(200).json(latestProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Featured Products
const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ category: "featured" }); // Replace with your own filtering logic
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedProduct = await Product.findOneAndDelete({ id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    getHotProducts,
    getLatestProducts,
    getFeaturedProducts,
    getAllProducts,
    deleteProduct,
    getProductById
};
