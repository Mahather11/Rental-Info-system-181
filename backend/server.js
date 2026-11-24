const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Building = require('./models/Building');
const Room = require('./models/Room');
const Tenancy = require('./models/Tenancy');
const Payment = require('./models/Payment'); // <-- ADDED

// Import Routes
const authRoutes = require('./routes/auth');
const buildingRoutes = require('./routes/buildings');
const roomRoutes = require('./routes/rooms');
const tenancyRoutes = require('./routes/tenancies');
const paymentRoutes = require('./routes/payments'); // <-- ADDED

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenancies', tenancyRoutes);
app.use('/api/payments', paymentRoutes); // <-- ADDED

app.get('/', (req, res) => {
    res.send('Find Your Room API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});