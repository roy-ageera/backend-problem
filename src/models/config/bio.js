const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
  units: {
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

module.exports = bioSchema;
