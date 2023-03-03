const ConfigService = require('../services/ConfigService');
const configService = new ConfigService();
const { handleErrors } = require('../utils/handleErrors');
const { validateConfig } = require('../middleware/validate');

async function getConfigById(req, res) {
  try {
    const { id } = req.params;
    const config = await configService.getConfigById(id);
    if (!config) {
      res.status(404).json({ error: 'Config not found' });
    } else {
      res.json({ message: `Config with ID ${id} found.`, data: config });
    }
  } catch (err) {
    handleErrors(res, err);
  }
}

async function getAllConfigs(req, res) {
  try {
    const configs = await configService.getAllConfigs();
    res.json({ message: 'All configs retrieved successfully.', data: configs });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function createConfig(req, res) {
  try {
    const config = req.body;
    const newConfig = await configService.createConfig(config);
    res
      .status(201)
      .json({ message: 'Config created successfully.', data: newConfig });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function updateConfig(req, res) {
  try {
    const { id } = req.params;
    const config = req.body;
    const updatedConfig = await configService.updateConfig(id, config);
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ message: `Config with ID ${id} not found.` });
    }
    res.json({
      message: `Config with ID ${id} updated successfully.`,
      data: updatedConfig,
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = {
  getConfigById,
  getAllConfigs,
  createConfig: [validateConfig, createConfig],
  updateConfig: [validateConfig, updateConfig],
};
