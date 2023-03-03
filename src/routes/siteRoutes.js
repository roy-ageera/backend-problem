const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { validateSite } = require('../middleware/validate');

router.get('/', siteController.getAllSites);
router.get('/:id', siteController.getSiteById);
router.post('/', validateSite, siteController.createSite);
router.put('/:id', validateSite, siteController.updateSite);

module.exports = router;
