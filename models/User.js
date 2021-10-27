const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,

    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  body_fat_percentage: {
    type: Number,
  },
  calorie_budget: {
    type: Number,
  },
  protein_target: {
    type: Number,
  },
  fat_target: {
    type: Number,
  },
  carbohydrate_target: {
    type: Number,
  },
  energy_expenditure: {
    type: Number,
  },
  activity_level: {
    type: String,
  },
  diet_type: {
    type: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
