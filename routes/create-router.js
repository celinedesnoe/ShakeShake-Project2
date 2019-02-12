const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");
const router = express.Router();

router.post("/process-cocktail", (req, res, next) => {
  const { strDrink, strInstructions } = req.body;

  const creator = req.user._id;
});

module.exports = router;
