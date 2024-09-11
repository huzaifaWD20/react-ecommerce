const Product = require("../models/productModel");

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { id, name, description, price, image, rating, reviews } = req.body;

        // Create a new product
        const newProduct = new Product({
            id,
            name,
            description,
            price,
            image,
            rating,
            reviews
        });

        // Save the product in the database
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
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
    deleteProduct
};
