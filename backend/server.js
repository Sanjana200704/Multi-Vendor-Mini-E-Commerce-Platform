require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/health', require('./routes/health'));

const PORT = process.env.PORT || 5000;

async function start() {
	await connectDB();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
	start();
}

module.exports = { app, start };
