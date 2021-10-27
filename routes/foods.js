const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Food = require("../models/Food");

// @route GET api/foods
// @desc  Get all users foods
// @access Private

router.get("/",
  auth,
  async (req, res) => {
    try {
      const foods = await Food.find({ owner: req.user.id }).sort({ date: -1 });
      res.json(foods);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }
  });

// @route POST api/foods
// @desc Add new food
// @access Private
router.post(
  "/",
  auth,
  body("name", "Name is required").not().isEmpty(),
  body("kcal", "Kcal is required").not().isEmpty(),
  body("carb", "Carb is required").not().isEmpty(),
  body("fat", "Fat is required").not().isEmpty(),
  body("protein", "Protein is required").not().isEmpty(),
  body("is_public", "Public is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, kcal, carb, fat, protein, is_public, description } = req.body;
    try {
      const newFood = new Food({
        name,
        kcal,
        carb,
        fat,
        protein,
        is_public,
        description,
        owner: req.user.id
      });
      const food = await newFood.save();
      res.json(food);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// @route PUT api/foods/:id
// @desc Update food
// @access Private
router.put(
  "/:id",
  auth,
  async (req, res) => {
    const { name, kcal, carb, fat, protein, is_public, description } = req.body;

    const foodObj = {};
    if (name) foodObj.name = name;
    if (kcal) foodObj.kcal = kcal;
    if (carb) foodObj.carb = carb;
    if (fat) foodObj.fat = fat;
    if (protein) foodObj.protein = protein;
    if (is_public) foodObj.is_public = is_public;
    if (description) foodObj.description = description;

    try {
      let food = await Food.findById(req.params.id);
      if (!food) return res.status(404).json({ msg: "Food not found" });

      if (food.owner.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not Authorized" });
      }

      food = await Food.findByIdAndUpdate(
        req.params.id,
        {
          $set: foodObj
        },
        {
          new: true,
        }
      );
      res.json(food);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }

  }
);

// @route DELETE api/foods/:id
// @desc Delete food
// @access Private
router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      let food = await Food.findById(req.params.id);
      if (!food) return res.status(404).json({ msg: "Food not found" });

      if (food.owner.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not Authorized" });
      }
      await Food.findByIdAndRemove((req.params.id));
      res.json({ msg: "Food removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }
  }
);

module.exports = router;