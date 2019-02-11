const express = require("express");
const router = express.Router();
const Cocktail = require("..models/cocktail-model.js");

router.get("/search", (req, res, next) => {
  res.render("search.hbs");
});

// router.get("/search-results", (req,res,next)) => {

// }

module.exports = router;
