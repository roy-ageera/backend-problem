const mongoose = require('mongoose');

const liveDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  soc: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 100;
      },
      message: (props) => `${props.value} must be between 0 and 100!`,
    },
  },
  load_kwh: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} must be greater than or equal to 0!`,
    },
  },
  net_load_kwh: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} must be greater than or equal to 0!`,
    },
  },
  pv_notification: { type: Boolean, required: true },
  bio_notification: { type: Boolean, required: true },
  cro_notification: { type: Boolean, required: true },
});

module.exports = mongoose.model('LiveData', liveDataSchema);
