const Site = require('../models/Site');

class SiteService {
  async getAllSites() {
    const sites = await Site.find();
    return sites;
  }

  async getSiteById(id) {
    const site = await Site.findById(id);
    return site;
  }

  async createSite(site) {
    const newSite = new Site(site);
    await newSite.save();
    return newSite;
  }

  async updateSite(id, site) {
    const updatedSite = await Site.findOneAndUpdate({ _id: String(id) }, site, {
      new: true,
    });
    if (!updatedSite) {
      throw new Error('Site not found');
    }
    return updatedSite;
  }
}

module.exports = SiteService;
