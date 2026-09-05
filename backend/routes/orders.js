const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Create order (user)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'user' && req.user.role !== 'admin') return res.status(403).json({ msg: 'Only users can place orders' });
    const { items } = req.body; // [{ productId, quantity }]
    if (!items || !items.length) return res.status(400).json({ msg: 'No items provided' });
    // Build order items with price and vendor
    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ msg: `Product not found: ${it.productId}` });
      const qty = Number(it.quantity) || 1;
      orderItems.push({ product: product._id, vendor: product.vendor, quantity: qty, price: product.price });
      total += product.price * qty;
    }
    const order = new Order({ user: req.user.id, items: orderItems, total });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get orders (user: own orders, vendor: orders containing their products, admin: all)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await Order.find().populate('user', 'name email').populate('items.product');
      return res.json(orders);
    }
    if (req.user.role === 'vendor') {
      const orders = await Order.find({ 'items.vendor': req.user.id }).populate('user', 'name email').populate('items.product');
      return res.json(orders);
    }
    // user
    const orders = await Order.find({ user: req.user.id }).populate('items.product').populate('items.vendor', 'name');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Vendor statistics (vendor only)
router.get('/vendor/stats', auth, authorize('vendor'), async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Total products for vendor
    const totalProducts = await Product.countDocuments({ vendor: vendorId });

    // Total orders that include this vendor's items (unique orders)
    const totalOrders = await Order.countDocuments({ 'items.vendor': vendorId });

    // Pending orders for this vendor
    const pendingOrders = await Order.countDocuments({ status: 'pending', 'items.vendor': vendorId });

    // Total sales / revenue for this vendor from paid/shipped orders
    const objId = new mongoose.Types.ObjectId(vendorId);
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped'] }, 'items.vendor': objId } },
      { $unwind: '$items' },
      { $match: { 'items.vendor': objId } },
      { $group: { _id: null, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].revenue) || 0;

    // Recent orders containing this vendor's items
    const orders = await Order.find({ 'items.vendor': vendorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('items.product', 'title');

    const recentOrders = orders.map(o => ({
      id: o._id,
      user: o.user,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.filter(i => (i.vendor && i.vendor.toString ? i.vendor.toString() === vendorId : i.vendor === vendorId)).map(i => ({
        product: i.product ? i.product.title : i.product,
        quantity: i.quantity,
        amount: i.price * i.quantity
      }))
    }));

    res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders, recentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get specific order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product').populate('items.vendor', 'name');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    // Access control
    if (req.user.role === 'admin') return res.json(order);
    if (req.user.role === 'user' && order.user._id.toString() === req.user.id) return res.json(order);
    if (req.user.role === 'vendor') {
      const hasItem = order.items.some(i => i.vendor && i.vendor._id && i.vendor._id.toString() === req.user.id);
      if (hasItem) return res.json(order);
    }
    return res.status(403).json({ msg: 'Not authorized' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
