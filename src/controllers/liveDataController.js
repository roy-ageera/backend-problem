const LiveDataService = require('../services/LiveDataService');
const liveDataService = new LiveDataService();
const { handleErrors } = require('../utils/handleErrors');
const { validateLiveData } = require('../middleware/validate');

async function getLatestLiveData(req, res) {
  try {
    const liveData = await liveDataService.getLatestLiveData();
    if (!liveData) {
      return res.status(404).json({ message: 'No live data found' });
    }
    res.json(liveData);
  } catch (err) {
    handleErrors(res, err);
  }
}

async function createLiveData(req, res) {
  try {
    const liveData = req.body;
    const newLiveData = await liveDataService.createLiveData(liveData);
    res
      .status(201)
      .json({
        message: 'Live data created successfully',
        liveData: newLiveData,
      });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = {
  getLatestLiveData,
  createLiveData: [validateLiveData, createLiveData],
};
