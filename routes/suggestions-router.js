const express = require("express");
const router = express.Router();
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");

router.get("/mybar", (req, res, rext) => {
  const host = req.user._id;
  User.findById(req.user._id)
    .then(user => {
      userIngredientsArray = user.ingredients;
      res.locals.userIngredientsArray = user.ingredients;
    })
    .catch(err => next(err));
  // console.log(host);
  Cocktail.find()
    .then(result => {
      const setIngredients = new Set();
      result.forEach(cocktail => {
        for (let i = 1; i <= 9; i++) {
          // cocktail["strIngredient" + i]
          // cocktail["strIngredient" + 6]
          // cocktail["strIngredient6"]
          // cocktail.strIngredient6
          let ingredient = cocktail["strIngredient" + i];
          if (ingredient) {
            setIngredients.add(ingredient.toLowerCase());
          }
        }
      });
      // console.log(setIngredients);
      let ingredients = Array.from(setIngredients);
      userIngredientsArray.forEach(ingredient => {
        if (ingredients.includes(ingredient)) {
          var index = ingredients.indexOf(ingredient); // <-- Not supported in <IE9
          if (index !== -1) {
            ingredients.splice(index, 1);
            // console.log(ingredient);
          }
        }
      });

      //       console.log(ingredients);
      res.locals.ingredArray = ingredients;
      res.render("suggestion-views/bar-input.hbs");
    })

    .catch(err => next(err));
});

router.post("/process-bar", (req, res, next) => {
  const { ingredient } = req.body;

  User.findByIdAndUpdate(
    req.user._id,

    { $push: { ingredients: ingredient } },
    { runValidators: true, new: true }
  )
    .then(() => res.redirect(`/mybar`))
    .catch(err => next(err));
});

router.post("/process-bar-remove", (req, res, next) => {
  const { ingredient } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { ingredients: ingredient } },
    { runValidators: true, new: true }
  )
    .then(() => res.redirect(`/mybar`))
    .catch(err => next(err));
});

router.get("/suggestions", (req, res, next) => {
  User.findById(req.user._id).then(user => {
    userIngredientsArray = user.ingredients;
  });
  Cocktail.find()

    .then(cocktails => {
      const possibleCocktails = new Set();

      cocktails.forEach(cocktail => {
        for (let i = 1; i <= 9; i++) {
          let ingredient = cocktail["strIngredient" + i];
          if (ingredient) {
            if (userIngredientsArray.includes(ingredient.toLowerCase())) {
              possibleCocktails.add(cocktail);
            }
            // console.log(possibleCocktails);
          }
        }
      });
      possibleCocktails.forEach(cocktail => {
        cocktail.ingredientsDifference = cocktail.strIngredAll.length;
        // console.log("cocktail difference", cocktail.ingredientsDifference);
        for (let i = 1; i <= 9; i++) {
          let ingredient = cocktail["strIngredient" + i];
          if (ingredient) {
            if (userIngredientsArray.includes(ingredient.toLowerCase())) {
              cocktail.ingredientsInCommon++;
              cocktail.ingredientsDifference--;
              // console.log(cocktail.ingredientsDifference);
              // console.log("cocktail mis a jour", cocktail);
            }
          }
        }
      });
      let possibleCocktailsArray = Array.from(possibleCocktails);
      possibleCocktailsArray.sort(
        (a, b) => a.ingredientsDifference - b.ingredientsDifference
      );
      const recommendedIngredients = new Set();

      possibleCocktailsArray.forEach(cocktail => {
        cocktail.strIngredAll.forEach(ingredient => {
          score = 0;
          if (!userIngredientsArray.includes(ingredient.toLowerCase())) {
            cocktails.forEach(cocktail => {
              if (cocktail.strIngredAll.includes(ingredient)) {
                score++;
              }
            });
            recommendedIngredients.add({
              name: ingredient.toLowerCase(),
              score: score
            });
          }
        });
        // console.log(recommendedIngredients);
      });
      res.locals.recommendedIngredientsArray = Array.from(
        recommendedIngredients
      );
      res.render("suggestion-views/suggestions.hbs");
    })
    .catch();
});

module.exports = router;
