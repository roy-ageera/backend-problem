const express = require('express');
const router = express.Router();
const liveDataController = require('../controllers/liveDataController');
const { validateLiveData } = require('../middleware/validate');

router
  .route('/')
  .get(liveDataController.getLatestLiveData)
  .post(validateLiveData, liveDataController.createLiveData);

module.exports = router;
