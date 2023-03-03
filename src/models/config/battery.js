const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
  vendor: {
    type: String,
    enum: ['Tesla', 'KATL'],
    required: true,
  },
  capacity_kwh: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} must be greater than or equal to 0!`,
    },
  },
  max_power_kw: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} must be greater than or equal to 0!`,
    },
  },
});

module.exports = batterySchema;
