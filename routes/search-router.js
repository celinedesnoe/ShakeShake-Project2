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
  const { search_query } = req.query.toString();
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
  Cocktail.find({
    "strIngredMeasure.Ingred": search_query
  })
    .collation({ locale: "en_US", strength: 1 })

    .then(ingredDoc => {
      if (!ingredDoc) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.search_ingredient = search_query;
        res.locals.ingredArray = ingredDoc;

        res.render("search-views/search-result-ingred.hbs");
      }
    })
    .catch(err => next(err));
});

module.exports = router;
