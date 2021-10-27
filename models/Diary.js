const mongoose = require("mongoose");

const DiarySchema = mongoose.Schema({
  food_id: {
    type: String,
  },
  activity_id: {
    type: String,
  },
  user_id: {
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
