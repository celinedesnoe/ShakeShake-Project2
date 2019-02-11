const express = require("express");
const router = express.Router();
const Cocktail = require("../models/cocktail-model.js");

router.get("/suggestions", (req, res, next) => {
  Cocktail.find()
    .then(cocktailList => {
      console.log(cocktailList, "fofofofofoff");
      res.locals.allcocktails = cocktailList;
      res.render("suggestion-views/bar-input.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
