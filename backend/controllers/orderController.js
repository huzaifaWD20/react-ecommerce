const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tj.tech.jewel@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});


async function sendOrderConfirmationEmail(order, customerEmail) {
  try {
    const msg = {
      to: customerEmail,  // Customer email
      from: 'tj.tech.jewel@gmail.com',  // Your verified SendGrid sender email
      subject: 'Order Confirmation',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: Rs ${order.totalAmount.toFixed(2)}</p>
        <p>Status: ${order.status}</p>
      `,
    };

    await sgMail.send(msg);
    console.log('Order confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

async function sendOrderNotificationToOwner(order) {
  try {
    const msg = {
      to: 'k213272@nu.edu.pk',  // Owner/admin email
      from: 'tj.tech.jewel@gmail.com',  // Your verified SendGrid sender email
      subject: 'New Order Received',
      html: `
        <h1>New Order Received</h1>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: Rs ${order.totalAmount.toFixed(2)}</p>
        <p>Status: ${order.status}</p>
      `,
    };

    await sgMail.send(msg);
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

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();

    // Clear the user's cart after successful order creation
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    // Call email functions after order is successfully created
    const user = await User.findById(userId);  // Fetch user info to get the email
    await sendOrderConfirmationEmail(newOrder, user.email);  // Sending confirmation to the user
    await sendOrderNotificationToOwner(newOrder);  // Notify the owner/admin

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });

    // Fetch product details manually for each item in the order
    const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
      const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findOne({ productID: item.productID });
        return {
          ...item.toObject(),
          product_name: product ? product.product_name : 'Unknown Product',
        };
      }));

      return {
        ...order.toObject(),
        items: itemsWithDetails
      };
    }));
    res.json(ordersWithProductDetails);
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
