const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const router = express.Router();

router.get("/search", (req, res, next) => {
  res.render("search-views/search.hbs");
});

// router.get("/search-results", (req, res, next) => {
//   const ingredients = Cocktail.distinct("strIngredient1")
//     .then(ingredResults => {
//       res.locals.ingredArray = ingredResults;
//       res.render("search-views/search.hbs", ingredResults);
//     })
//     .catch(err => next(err));
// });

router.get("/search-result/", (req, res, next) => {
  const { search_query } = req.query;
  Cocktail.findOne({ strDrink: { $eq: search_query } })
    .then(drinkDoc => {
      if (!drinkDoc) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.drinkItem = drinkDoc;
        res.render("search-views/search-result.hbs");
        console.log(drinkDoc);
      }
    })
    .catch(err => next(err));
});

module.exports = router;
