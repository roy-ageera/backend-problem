const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { validateConfig } = require('../middleware/validate');

router
  .route('/')
  .get(configController.getAllConfigs)
  .post(validateConfig, configController.createConfig);

router
  .route('/:id')
  .get(configController.getConfigById)
  .put(validateConfig, configController.updateConfig);

module.exports = router;
