const express = require('express');
const app = express();

const siteRoutes = require('./routes/siteRoutes');
const configRoutes = require('./routes/configRoutes');
const liveDataRoutes = require('./routes/liveDataRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/sites', siteRoutes);
app.use('/configs', configRoutes);
app.use('/live-data', liveDataRoutes);

module.exports = app;
