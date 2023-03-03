const express = require('express');
const router = express.Router();
const liveDataController = require('../controllers/liveDataController');
const { validateLiveData } = require('../middleware/validate');

router.get('/', liveDataController.getLatestLiveData);
router.post('/', validateLiveData, liveDataController.createLiveData);

module.exports = router;
