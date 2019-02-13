const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const User = require("../models/user-model.js");
const router = express.Router();

router.get("/search", (req, res, next) => {
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

      function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      }

      let setCocktailsRandom = shuffle(setCocktails).slice(0, 20);
      res.locals.cocktailArray = setCocktailsRandom;
      res.render("search-views/search.hbs");
    })

    .catch(err => next(err));
});

//###############################################################
//Search according to the name of the cocktails
//###############################################################

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

//###############################################################
//Search according to the ingredients
//###############################################################

router.get("/search-result-ingred", (req, res, next) => {
  const { search_query } = req.query;
  var drinks = [];

  //-----------------------------------------------------------------
  //Find the cocktails that have been created
  //BY USER LOGGED IN to be in the top of the array
  //-----------------------------------------------------------------
  User.findById(req.user._id).then(userDoc => {
    const userCocktails = userDoc.cocktailCreated;
    console.log(userDoc);
    userCocktails.forEach(drink => {
      drinks.push(drink);
    });
  });

  //-----------------------------------------------------------------
  //Find the cocktails
  //WITH THE TWO INGREDIENTS
  //-----------------------------------------------------------------

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

  //-----------------------------------------------------------------
  //Find the cocktails
  //WITH ONE OF THE TWO INGREDIENTS
  //-----------------------------------------------------------------

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

module.exports = router;
