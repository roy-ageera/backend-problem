const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model('Site', siteSchema);
