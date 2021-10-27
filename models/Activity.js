const mongoose = require("mongoose");

const ActivitySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kcal_per_unit: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("activity", ActivitySchema);
