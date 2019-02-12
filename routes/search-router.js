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
    });
  });
  Cocktail.distinct(`strIngredient8`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient7`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient6`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient5`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient4`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient3`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient2`).then(ingredResults => {
    ingredResults.forEach(ingredient => {
      ingredients.push(ingredient);
    });
  });
  Cocktail.distinct(`strIngredient1`)
    .then(ingredResults => {
      ingredResults.forEach(ingredient => {
        ingredients.push(ingredient);
      });
      var lowerCaseIngredients = ingredients.map(function(oneIngredient) {
        return oneIngredient.toLowerCase();
      });
      var uniqueIngredients = lowerCaseIngredients.filter(function(item, pos) {
        return lowerCaseIngredients.indexOf(item) == pos;
      });
      var sortedIngredients = uniqueIngredients.sort();

      res.locals.ingredArray = sortedIngredients;
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
  var search_drink = req.query.search_query;
  const search_drink_String = search_drink.toString(search_drink);
  console.log(search_drink_String);
  Cocktail.find({
    // "strIngredMeasure.Ingred": { $eq: /^search_drink_String$/i }

    "strIngredMeasure.Ingred": {
      $regex: search_drink_String,
      $options: "i"
    }
  })
    .then(ingredDoc => {
      if (!ingredDoc) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.ingredArray = ingredDoc;
        res.render("search-views/search-result-ingred.hbs");
        // console.log(ingredDoc);
      }
    })
    .catch(err => next(err));
});

module.exports = router;
