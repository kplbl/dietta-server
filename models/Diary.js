const mongoose = require("mongoose");

const DiarySchema = mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("diary", DiarySchema);
