Multi-Vendor Mini E-Commerce Platform

A MERN-based multi-vendor e-commerce platform with User, Vendor and Admin panels.

🔐 Demo Accounts

Role

Email

Password

Admin

aarav@gmail.com

aarav

Vendor

434310sharma@gmail.com

avnish

User

avnishrao1122@gmail.com

sanjana

🚀 Live Demo

Live Website: https://multi-vendor-ecommerce-website-opal.vercel.app/

GitHub: https://github.com/Sanjana200704/Multi-Vendor-Mini-E-Commerce-Platform

✨ Features

User

Register/Login

Browse products and view details

Add to cart with quantity management

Dummy checkout and order history

Vendor

Vendor login and admin approval

Add/Edit/Delete own products

View own orders

Dashboard statistics

Admin

Dashboard statistics

View users/vendors

Approve/Block vendors

Manage all products

View all platform orders

🛠️ Tech Stack

Frontend: React.js, React Router, Axios, Tailwind CSS, Vite
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT
Deployment: Vercel, Render, MongoDB Atlas

📁 Structure

Multi-Vendor-Mini-E-Commerce-Platform/
├── backend/
├── frontend/
└── README.md

⚙️ Local Setup

Backend

cd backend
npm install

Create backend/.env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Run:

node server.js

Frontend

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://localhost:5000/api

Run:

npm run dev

🔒 Authentication

JWT authentication, password hashing, protected routes and role-based authorization are implemented for User, Vendor and Admin access.

Demo credentials above are provided for assessment evaluation. No real production secrets are included in this repository.

👩‍💻 Author

Sanjana Sharma | B.Tech | MERN Stack Developer
