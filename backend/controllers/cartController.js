const User = require('../models/User');
const Product = require('../models/Product'); // Import the Product model

// Save Cart to Database
exports.saveCartToDatabase = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure the cart data matches the User model structure
    const transformedCart = cart.map(item => ({
      // Ensure the productID is actually the SKU, not the MongoDB _id
      productID: item.productID, 
      quantity: item.quantity
    }));
    
    user.cart = transformedCart;
    await user.save();
    
    console.log('Cart saved successfully:', user.cart);
    res.status(200).json({ message: 'Cart saved to database successfully' });
  } catch (error) {
    console.error('Error saving cart to database:', error);
    res.status(500).json({ message: 'Error saving cart to database', error: error.message });
  }
};

// Get Cart from Database
exports.getCartFromDatabase = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all product details for the items in the cart
    const productIds = user.cart.map(item => item.productID); // Using productID as SKU
    const products = await Product.find({ productID: { $in: productIds } }); // Find by SKU, not _id

    // Transform the cart data to match the front-end structure
    const transformedCart = user.cart.map(cartItem => {
      const product = products.find(p => p.productID === cartItem.productID); // Match by productID (SKU)
      if (!product) {
        console.error(`Product not found for SKU: ${cartItem.productID}`);
        return null;
      }
      return {
        _id: product._id.toString(), // Use MongoDB's _id for database identification
        productID: product.productID, // Ensure productID corresponds to the SKU
        sku: product.sku,
        product_name: product.product_name,
        description: product.description,
        image_base64: product.image_base64,
        category: product.category.toString(), // Convert ObjectId to string
        price: product.price,
        quantity: cartItem.quantity
      };
    }).filter(item => item !== null); // Remove any null items (products not found)

    res.status(200).json(transformedCart);
  } catch (error) {
    console.error('Error fetching cart from database:', error);
    res.status(500).json({ message: 'Error fetching cart from database', error: error.message });
  }
};
