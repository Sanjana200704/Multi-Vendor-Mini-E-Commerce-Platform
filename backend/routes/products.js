const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// List products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('vendor', 'name email');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name email');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create product (vendor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor' && req.user.role !== 'admin') return res.status(403).json({ msg: 'Only vendors can add products' });
    const { title, description, price, images, category, stock } = req.body;
    const product = new Product({ title, description, price, images, category, stock, vendor: req.user.id });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update product (owner vendor or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    const fields = ['title', 'description', 'price', 'images', 'category', 'stock'];
    fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
