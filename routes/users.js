const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");

// @route   POST    api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  body("username", "Add name").not().isEmpty(),
  body("password", "Password must be at least 6 characters long").
    isLength({ min: 6 }),
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email } = req.body;

    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: "User exists" });
      }
      user = new User({
        username,
        password,
        email
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Something went wrong");
    }
  }
);

module.exports = router;