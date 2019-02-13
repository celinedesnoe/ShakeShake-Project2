const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const router = express.Router();

router.get("/search", (req, res, rext) => {
  Cocktail.find()
    .then(result => {
      const setCocktails = result;
      const setIngredients = new Set();
      result.forEach(cocktail => {
        for (let i = 1; i <= 9; i++) {
          let ingredient = cocktail["strIngredient" + i];
          if (ingredient) {
            setIngredients.add(ingredient.toLowerCase());
          }
        }
      });
      let ingredients = Array.from(setIngredients);
      let sortedIngredients = ingredients.sort();
      res.locals.ingredArray = sortedIngredients;
      res.locals.cocktailArray = setCocktails;
      res.render("search-views/search.hbs");
    })

    .catch(err => next(err));
});

router.get("/search-result-drink", (req, res, next) => {
  const { search_query } = req.query;
  Cocktail.find({ strDrink: { $regex: search_query, $options: "i" } })
    .then(drinkDoc => {
      if (!drinkDoc) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.drinkArray = drinkDoc;
        res.render("search-views/search-result-drink.hbs");
      }
    })
    .catch(err => next(err));
});

router.get("/search-result-ingred", (req, res, next) => {
  const { search_query } = req.query;
  var drinks = [];
  Cocktail.find({
    $and: [
      {
        "strIngredMeasure.Ingred": search_query[0]
      },
      { "strIngredMeasure.Ingred": search_query[1] }
    ]
  })
    .collation({ locale: "en_US", strength: 1 })
    .then(drinkResults => {
      drinkResults.forEach(drink => {
        drinks.push(drink);
      });
    });
  Cocktail.find({
    $or: [
      {
        "strIngredMeasure.Ingred": search_query[0]
      },
      { "strIngredMeasure.Ingred": search_query[1] }
    ]
  })
    .collation({ locale: "en_US", strength: 1 })
    .then(drinkResults => {
      drinkResults.forEach(drink => {
        drinks.push(drink);
      });

      res.locals.search_ingredient = search_query;
      res.locals.ingredArray = drinks;
      res.render("search-views/search-result-ingred.hbs");
    })
    .catch(err => next(err));
});

router.get("/search-result-ingred/:ingredID", (req, res, next) => {
  const search_query = req.params.ingredID;
  var drinks = [];
  console.log("req.params :", req.params.ingredID);
  console.log(search_query);

  Cocktail.find({
    strIngredAll: search_query
  })
    .collation({ locale: "en_US", strength: 1 })
    .then(drinkResults => {
      drinkResults.forEach(drink => {
        console.log("coucou", req.body);
        drinks.push(drink);
      });

      res.locals.search_ingredient = search_query;
      res.locals.ingredArray = drinks;
      res.render("search-views/search-result-ingred.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
