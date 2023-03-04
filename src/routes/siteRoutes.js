const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { validateSite } = require('../middleware/validate');

router
  .route('/')
  .get(siteController.getAllSites)
  .post(validateSite, siteController.createSite);

router
  .route('/:id')
  .get(siteController.getSiteById)
  .put(validateSite, siteController.updateSite);

module.exports = router;
