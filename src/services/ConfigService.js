const Config = require('../models/Config');

class ConfigService {
  async getConfigById(id) {
    const config = await Config.findById(id);
    return config;
  }

  async getAllConfigs() {
    const configs = await Config.find().sort('-id');
    return configs;
  }

  async createConfig(config) {
    const newConfig = new Config(config);
    await newConfig.save();
    return newConfig;
  }

  async updateConfig(id, config) {
    const updatedConfig = await Config.findOneAndUpdate(
      { _id: String(id) },
      config,
      {
        new: true,
      }
    );
    if (!updatedConfig) {
      throw new Error('Config not found');
    }
    return updatedConfig;
  }
}

module.exports = ConfigService;
