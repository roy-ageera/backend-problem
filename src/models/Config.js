const mongoose = require('mongoose');
const batterySchema = require('./config/battery');
const pvSchema = require('./config/pv');
const bioSchema = require('./config/bio');
const croSchema = require('./config/cro');

const configSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  battery: batterySchema,
  production: {
    pv: pvSchema,
    bio: bioSchema,
    cro: croSchema,
  },
});

module.exports = mongoose.model('Config', configSchema);
