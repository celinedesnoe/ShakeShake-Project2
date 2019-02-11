const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const router = express.Router();

// router.get("/search", (req, res, next) => {
//   res.render("search-views/search.hbs");
// });

router.get("/search", (req, res, next) => {
  var ingredients = [];
  // function uniq(ingredients) {
  //   return ingredients.sort().filter(function(item, pos, ary) {
  //     return !pos || item != ary[pos - 1];
  //   });
  // }
  Cocktail.distinct(`strIngredient9`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient9");
    });
  });
  Cocktail.distinct(`strIngredient8`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient8");
    });
  });
  Cocktail.distinct(`strIngredient7`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient7");
    });
  });
  Cocktail.distinct(`strIngredient6`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient6");
    });
  });
  Cocktail.distinct(`strIngredient5`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient5");
    });
  });
  Cocktail.distinct(`strIngredient4`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient4");
    });
  });
  Cocktail.distinct(`strIngredient3`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient3");
    });
  });
  Cocktail.distinct(`strIngredient2`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
      console.log("ingredient2");
    });
  });
  Cocktail.distinct(`strIngredient1`)
    .then(ingredResults => {
      ingredResults.forEach(ingredient => {
        ingredients.push(ingredient);
        console.log("ingredient1");
      });
      var lowerCaseIngredients = ingredients.map(function(oneIngredient) {
        return oneIngredient.toLowerCase();
      });
      var uniqueIngredients = lowerCaseIngredients.filter(function(item, pos) {
        return lowerCaseIngredients.indexOf(item) == pos;
      });

      res.locals.ingredArray = uniqueIngredients;
      res.render("search-views/search.hbs");
    })
    .catch(err => next(err));
});

router.get("/search-result/", (req, res, next) => {
  const { search_query } = req.query;
  Cocktail.find({ strDrink: { $regex: search_query, $options: "i" } })
    .then(drinkDoc => {
      if (!drinkDoc) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.drinkArray = drinkDoc;
        res.render("search-views/search-result.hbs");
        console.log(drinkDoc);
      }
    })
    .catch(err => next(err));
});

module.exports = router;
