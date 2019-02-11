const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const router = express.Router();

router.get("/search", (req, res, next) => {
  res.render("search-views/search.hbs");
});

// router.get("/search-results", (req,res,next)) => {

// }

module.exports = router;
