const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

async function seed() {
  try {
    await connectDB();

    const vendor = await User.findOne({ role: 'vendor', isApproved: true });
    if (!vendor) {
      console.error('No approved vendor user found. Please approve a vendor first.');
      process.exit(1);
    }

    const vendorId = vendor._id;

    const demoProducts = [
      {
        title: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max with A17 chip, 256GB storage.',
        price: 159999,
        category: 'Electronics',
        stock: 10,
        images: ['https://www.supremeindia.com/uploads/products/2024050117044564186597f0e223ace.jpg']
      },
      {
        title: 'AirPods Pro (2nd Gen)',
        description: 'Active noise cancellation, wireless charging case.',
        price: 19999,
        category: 'Electronics',
        stock: 25,
        images: ['https://s3n.cashify.in/cashify/store/product/fcaa258f41c048dc809b1f8f287e61ae.jpg']
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung flagship with 200MP camera and 12GB RAM.',
        price: 119999,
        category: 'Electronics',
        stock: 8,
        images: ['https://images.samsung.com/is/image/samsung/p6pim/in/sm-s928bztqins/gallery/in-galaxy-s24-ultra-s928-sm-s928bztqins-thumb-539603173?$344_344_PNG$']
      },
      {
        title: 'Levi\'s Men\'s 501 Original Jeans',
        description: 'Classic straight fit denim jeans for everyday wear.',
        price: 3499,
        category: 'Fashion',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Nike Air Max 270',
        description: 'Comfortable sneakers with responsive cushioning.',
        price: 6999,
        category: 'Fashion',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1528701800489-476a4e09b9f2?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Philips Air Fryer 2.0L',
        description: 'Healthy frying with rapid air technology.',
        price: 5999,
        category: 'Home',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e8b9?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Prestige Pressure Cooker 5L',
        description: 'Stainless steel stovetop pressure cooker.',
        price: 2499,
        category: 'Home',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1601047164783-4d2d1a7d5f9b?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Maybelline Fit Me Foundation',
        description: 'Liquid foundation for natural finish.',
        price: 699,
        category: 'Beauty',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Boat Airdopes 441',
        description: 'Truly wireless earbuds with long battery life.',
        price: 1999,
        category: 'Electronics',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1585386959984-a415522c6d6f?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Fossil Minimalist Leather Wallet',
        description: 'Slim leather wallet for cards and cash.',
        price: 1299,
        category: 'Accessories',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'H&M Women\'s Summer Dress',
        description: 'Lightweight floral summer dress.',
        price: 2299,
        category: 'Fashion',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1520975919048-1d6e6b3f0383?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Syska LED Study Lamp',
        description: 'Adjustable LED lamp with brightness control.',
        price: 899,
        category: 'Home',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1582719478250-6d0e9b1c2b1d?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'AmazonBasics Stainless Steel Bottle',
        description: 'Insulated water bottle, 1L.',
        price: 799,
        category: 'Accessories',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1526403224743-9f2f4b2d8d52?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Sugar Cosmetics Matte Lipstick',
        description: 'Long-lasting matte lipstick.',
        price: 499,
        category: 'Beauty',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1545235617-9465b8d3d0ad?w=1200&q=80&auto=format&fit=crop']
      },
      {
        title: 'Lenovo IdeaPad Slim 3',
        description: '14-inch laptop with Intel i5, 8GB RAM.',
        price: 44999,
        category: 'Electronics',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop']
      }
    ];

    let inserted = 0;
    for (const p of demoProducts) {
      const exists = await Product.findOne({ title: p.title, vendor: vendorId });
      if (exists) continue;
      const prod = new Product({ ...p, vendor: vendorId });
      await prod.save();
      inserted++;
    }

    console.log('15 demo products seeded successfully');
    console.log(`${inserted} products were inserted`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
