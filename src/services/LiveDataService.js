const LiveData = require('../models/LiveData');

class LiveDataService {
  async getLatestLiveData() {
    const liveData = await LiveData.findOne().sort('-timestamp');
    return liveData;
  }

  async createLiveData(liveData) {
    const newLiveData = new LiveData(liveData);
    await newLiveData.save();
    return newLiveData;
  }
}

module.exports = LiveDataService;
