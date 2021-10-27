const mongoose = require("mongoose");

const FoodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  kcal: {
    type: Number,
    required: true,
  },
  carb: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true
  },
  is_public: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("food", FoodSchema);
