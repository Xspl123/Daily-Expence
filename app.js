require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Sync the database (Ensure tables exist)
sequelize.sync()
    .then(() => console.log('✅ Database synced'))
    .catch(err => {
        console.error('❌ Database sync failed:', err);
        process.exit(1);
    });

// Routes
app.use('/api', apiRoutes);

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
