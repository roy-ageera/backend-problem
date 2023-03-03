const SiteService = require('../services/SiteService');
const siteService = new SiteService();
const { handleErrors } = require('../utils/handleErrors');
const { validateSite } = require('../middleware/validate');

async function getAllSites(req, res) {
  try {
    const sites = await siteService.getAllSites();
    res.json({
      success: true,
      message: 'Sites retrieved successfully',
      data: sites,
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function getSiteById(req, res) {
  try {
    const { id } = req.params;
    const site = await siteService.getSiteById(id);
    if (!site) {
      res.status(404).json({ error: 'Site not found' });
    } else {
      res.json({
        success: true,
        message: 'Site retrieved successfully',
        data: site,
      });
    }
  } catch (err) {
    handleErrors(res, err);
  }
}

async function createSite(req, res) {
  try {
    const site = req.body;
    const newSite = await siteService.createSite(site);
    res
      .status(201)
      .json({
        success: true,
        message: 'Site created successfully',
        data: newSite,
      });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function updateSite(req, res) {
  try {
    const { id } = req.params;
    const site = req.body;
    const updatedSite = await siteService.updateSite(id, site);
    if (!updatedSite) {
      return res
        .status(404)
        .json({ success: false, message: 'Site not found' });
    }
    res.json({
      success: true,
      message: 'Site updated successfully',
      data: updatedSite,
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = {
  getAllSites,
  getSiteById,
  createSite: [validateSite, createSite],
  updateSite: [validateSite, updateSite],
};
