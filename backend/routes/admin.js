const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');

// Get all users (admin)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all vendors (admin)
router.get('/vendors', auth, authorize('admin'), async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Approve vendor
router.patch('/vendors/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'vendor') return res.status(404).json({ msg: 'Vendor not found' });
    vendor.isApproved = true;
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Block vendor
router.patch('/vendors/:id/block', auth, authorize('admin'), async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'vendor') return res.status(404).json({ msg: 'Vendor not found' });
    vendor.isApproved = false;
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
