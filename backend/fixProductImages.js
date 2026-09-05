const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB = require('./config/db')
const Product = require('./models/Product')
const User = require('./models/User')

async function fixImages() {
  try {
    await connectDB()

    const vendor = await User.findOne({ role: 'vendor', isApproved: true })
    if (!vendor) {
      console.error('No approved vendor found; aborting.')
      process.exit(1)
    }

    const vendorId = vendor._id

    const updates = {
      'iPhone 15 Pro Max': ['https://images.unsplash.com/photo-1630098266703-7d5a88f8b3e6?q=80&w=1200&auto=format&fit=crop'],
      'AirPods Pro (2nd Gen)': ['https://images.unsplash.com/photo-1518444021770-3e3d8f2a4e6d?q=80&w=1200&auto=format&fit=crop'],
      'Samsung Galaxy S24 Ultra': ['https://images.unsplash.com/photo-1682685799484-8f6b0b0b8f7b?q=80&w=1200&auto=format&fit=crop'],
      "Levi's Men's 501 Original Jeans": ['https://images.unsplash.com/photo-1520975919048-1d6e6b3f0383?q=80&w=1200&auto=format&fit=crop'],
      'Nike Air Max 270': ['https://images.unsplash.com/photo-1528701800489-476a4e09b9f2?q=80&w=1200&auto=format&fit=crop'],
      'Philips Air Fryer 2.0L': ['https://images.unsplash.com/photo-1586201375761-83865001e8b9?q=80&w=1200&auto=format&fit=crop'],
      'Prestige Pressure Cooker 5L': ['https://images.unsplash.com/photo-1601047164783-4d2d1a7d5f9b?q=80&w=1200&auto=format&fit=crop'],
      'Maybelline Fit Me Foundation': ['https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1200&auto=format&fit=crop'],
      'Boat Airdopes 441': ['https://images.unsplash.com/photo-1585386959984-a415522c6d6f?q=80&w=1200&auto=format&fit=crop'],
      'Fossil Minimalist Leather Wallet': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'],
      "H&M Women's Summer Dress": ['https://images.unsplash.com/photo-1520975919048-1d6e6b3f0383?q=80&w=1200&auto=format&fit=crop'],
      'Syska LED Study Lamp': ['https://images.unsplash.com/photo-1582719478250-6d0e9b1c2b1d?q=80&w=1200&auto=format&fit=crop'],
      'AmazonBasics Stainless Steel Bottle': ['https://images.unsplash.com/photo-1526403224743-9f2f4b2d8d52?q=80&w=1200&auto=format&fit=crop'],
      'Sugar Cosmetics Matte Lipstick': ['https://images.unsplash.com/photo-1545235617-9465b8d3d0ad?q=80&w=1200&auto=format&fit=crop'],
      'Lenovo IdeaPad Slim 3': ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop']
    }

    let updated = 0

    for (const [title, imgs] of Object.entries(updates)) {
      const prod = await Product.findOne({ title, vendor: vendorId })
      if (!prod) {
        console.warn('Product not found, skipping:', title)
        continue
      }
      // Only update images field, keep other fields intact
      prod.images = imgs
      await prod.save()
      console.log('Updated images for:', title)
      updated++
    }

    console.log(`Updated images for ${updated} products`)
    process.exit(0)
  } catch (err) {
    console.error('Error updating product images:', err)
    process.exit(1)
  }
}

fixImages()
