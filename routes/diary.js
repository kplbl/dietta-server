const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const auth = require("../middleware/auth");
const Diary = require("../models/Diary");
const Foods = require("../models/Food");

// @route GET api/diary
// @desc Get all user's diary
// @access Private
router.get("/all", auth, async (req, res) => {
  try {
    const diaries = await Diary.find({ user: req.user.id }).sort({ date: -1 });
    const foods = await Foods.find({});
    res.json({ diaries, foods });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong");
  }
});

// @route GET api/diary
// @desc Get today's user's diary
// @access Private
router.get("/today", auth, async (req, res) => {
  try {
    const diaries = await Diary.find({
      user: req.user.id,
      date: {
        $gte: startOfDay(new Date()),
        $lte: endOfDay(new Date()),
      },
    }).sort({ date: -1 });
    const foods = await Foods.find({});

    const joined = diaries.map((diary) => {
      const food = foods.find((food) => food.id === diary.food);
      console.log(diary);
      console.log(food);
      return { food, amount: diary.amount, user: diary.user };
    });
    console.log(joined);
    res.json(joined);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong");
  }
});

// @route POST api/diary
// @desc Add new diary entry / food
// @access Private
router.post(
  "/",
  auth,
  body("food", "Specify Food").not().isEmpty(),
  body("amount", "Add amount").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { food, amount } = req.body;
    try {
      const newDiary = new Diary({
        food,
        amount,
        user: req.user.id,
      });
      const diary = await newDiary.save();
      res.json(diary);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// @route PUT api/diary/:id
// @desc Update diary
// @access Private
router.put("/", auth, async (req, res) => {
  const { food, amount } = req.body;

  const diaryObj = {};
  if (food) diaryObj.food = food;
  if (amount) diaryObj.amount = amount;

  try {
    let diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json({ msg: "Entry not found" });

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    diary = await Diary.findByIdAndUpdate(
      req.params.id,
      {
        $set: diaryObj,
      },
      {
        new: true,
      }
    );
    res.json(diary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong");
  }
});

// @route DELETE api/diary/:id
// @desc Delete diary
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json({ msg: "Entry not found" });

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    await Diary.findByIdAndRemove(req.params.id);
    res.json({ msg: "Diary removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
