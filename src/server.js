const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./database/connectDB');
const siteRoutes = require('./routes/siteRoutes');
const configRoutes = require('./routes/configRoutes');
const liveDataRoutes = require('./routes/liveDataRoutes');

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan only in development mode
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Routes
app.use('/api/sites', siteRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/live-data', liveDataRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
