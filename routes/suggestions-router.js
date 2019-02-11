const express = require("express");
const Cocktail = require("../models/cocktail-model.js");

const router = express.Router();

router.get("/views", (req, res, next) => {
  res.render("/views/suggestion-views/bar-input.hbs");
});

module.exports = router;
