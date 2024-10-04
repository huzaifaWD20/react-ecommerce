const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  }
});

// Function to generate a simplified order ID
function generateSimpleOrderId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5);
  return `TJ-${timestamp}-${randomStr}`.toUpperCase();
}

// Function to generate HTML for order items
function generateOrderItemsHtml(items) {
  return items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.product_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.productID}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Rs ${item.price.toFixed(2)}</td>
    </tr>
  `).join('');
}

async function sendOrderConfirmationEmail(order, customerEmail) {
  const simpleOrderId = order.simpleOrderId;
  const orderDate = new Date(order.createdAt).toLocaleDateString();

  try {
    const msg = {
      to: customerEmail,
      from: process.env.SMTP_MAIL,
      subject: 'Order Confirmation - TJ Tech Jewel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #0d9488; text-align: center;">Thank You for Your Order!</h1>
          <p style="color: #4a5568;">Dear ${order.shippingAddress.name},</p>
          <p style="color: #4a5568;">Your order has been successfully placed. Here are the details:</p>
          
          <div style="background-color: #e6fffa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${simpleOrderId}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDate}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs ${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status}</p>
          </div>

          <h2 style="color: #0d9488;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #0d9488; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.product_name}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Rs ${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2 style="color: #0d9488;">Shipping Address</h2>
          <p style="color: #4a5568;">
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
            Phone: ${order.shippingAddress.phone}
          </p>

          <p style="color: #4a5568;">If you have any questions about your order, please don't hesitate to contact us.</p>
          <p style="color: #4a5568;">Thank you for shopping with TJ Tech Jewel!</p>
        </div>
      `,
    };

    await transporter.sendMail(msg);
    console.log('Order confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

async function sendOrderNotificationToOwner(order) {
  const simpleOrderId = order.simpleOrderId;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const orderItemsHtml = generateOrderItemsHtml(order.items);

  try {
    const msg = {
      to: process.env.SMTP_MAIL,
      from: process.env.SMTP_MAIL,
      subject: 'New Order Received - TJ Tech Jewel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #0d9488; text-align: center;">New Order Received</h1>
          
          <div style="background-color: #e6fffa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${simpleOrderId}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDate}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs ${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status}</p>
          </div>

          <h2 style="color: #0d9488;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #0d9488; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Product ID</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>

          <h2 style="color: #0d9488;">Customer Information</h2>
          <p style="color: #4a5568;">
            <strong>Name:</strong> ${order.shippingAddress.name}<br>
            <strong>Address:</strong> ${order.shippingAddress.address}<br>
            <strong>City:</strong> ${order.shippingAddress.city}<br>
            <strong>State:</strong> ${order.shippingAddress.state}<br>
            <strong>Postal Code:</strong> ${order.shippingAddress.postalCode}<br>
            <strong>Phone:</strong> ${order.shippingAddress.phone}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(msg);
    console.log('Order notification email sent to owner.');
  } catch (error) {
    console.error('Error sending owner notification email:', error);
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const simpleOrderId = generateSimpleOrderId();

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(items.map(async (item) => {
      const product = await Product.findOne({ productID: item.productID });
      return {
        ...item,
        product_name: product ? product.product_name : 'Unknown Product',
      };
    }));

    const newOrder = new Order({
      simpleOrderId,
      user: userId,
      items: itemsWithDetails,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();

    // Clear the user's cart after successful order creation
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    // Call email functions after order is successfully created
    const user = await User.findById(userId);
    await sendOrderConfirmationEmail(newOrder, user.email);
    await sendOrderNotificationToOwner(newOrder);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
