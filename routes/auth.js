const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");

// @route   GET    api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("No such user");
  }
});

// @route   POST    api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  "/",
  body("username", "Username required").exists(),
  body("password", "Password required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: "No such user" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Wrong password" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600 * 24,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// @route   GET    api/auth
// @access  Private
// @desc    Get logged in user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("No such user");
  }
});

// @route PUT api/auth
// @desc Update profile
// @access Private
router.put("/profile", auth, async (req, res) => {
  const {
    username,
    email,
    gender,
    weight,
    height,
    body_fat_percentage,
    calorie_budget,
    protein_target,
    fat_target,
    carb_target,
    diet_type,
  } = req.body;

  const profile = {};
  if (username) profile.username = username;
  if (email) profile.email = email;
  if (gender) profile.gender = gender;
  if (weight) profile.weight = weight;
  if (height) profile.height = height;
  if (body_fat_percentage) profile.body_fat_percentage = body_fat_percentage;
  if (calorie_budget) profile.calorie_budget = calorie_budget;
  if (protein_target) profile.protein_target = protein_target;
  if (fat_target) profile.fat_target = fat_target;
  if (carb_target) profile.carb_target = carb_target;
  if (diet_type) profile.diet_type = diet_type;

  console.log(req.body);
  console.log(req.user);
  try {
    // let user = await User.findOne(username);
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not Found" });

    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: profile,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
