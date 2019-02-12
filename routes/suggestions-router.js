const express = require("express");
const router = express.Router();
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");

// router.get("/suggestions", (req, res, next) => {
//   const setIngredients = new Set();
//   // function uniq(ingredients) {
//   //   return ingredients.sort().filter(function(item, pos, ary) {
//   //     return !pos || item != ary[pos - 1];
//   //   });
//   // }
//   Cocktail.distinct(`strIngredient9`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient9");
//     });
//   });
//   Cocktail.distinct(`strIngredient8`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient8");
//     });
//   });
//   Cocktail.distinct(`strIngredient7`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient7");
//     });
//   });
//   Cocktail.distinct(`strIngredient6`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient6");
//     });
//   });
//   Cocktail.distinct(`strIngredient5`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient5");
//     });
//   });
//   Cocktail.distinct(`strIngredient4`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient4");
//     });
//   });
//   Cocktail.distinct(`strIngredient3`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient3");
//     });
//   });
//   Cocktail.distinct(`strIngredient2`).then(ingredResults => {
//     ingredResults.forEach(ingredient => {
//       setIngredients.add(ingredient.toLowerCase());
//       // console.log("ingredient2");
//     });
//   });
//   Cocktail.distinct(`strIngredient1`)
//     .then(ingredResults => {
//       ingredResults.forEach(ingredient => {
//         setIngredients.add(ingredient.toLowerCase());
//         // console.log("ingredient1");
//       });
//       // var lowerCaseIngredients = ingredients.map(function(oneIngredient) {
//       //   return oneIngredient.toLowerCase();
//       // });
//       // var uniqueIngredients = lowerCaseIngredients.filter(function(item, pos) {
//       //   return lowerCaseIngredients.indexOf(item) == pos;
//       // });
//       let ingredients = Array.from(setIngredients);
//       console.log(ingredients);
//       res.locals.ingredArray = ingredients;
//       res.render("suggestion-views/bar-input.hbs", ingredResults);
//     })
//     .catch(err => next(err));

//   // for (let i = 1; i <= 9; i++) {
//   //   if (cocktail["ingredient" + i]) {
//   //     ingredients.push(ingredient);
//   //   }
//   // }
// });

// router.get("/suggestions", (req, res, next) => {
//   const setIngredients = new Set();

//   Cocktail.find().then( for (let i = 1; i <= 9; i++) {
//     if (cocktail["ingredient" + i]) {
//       setIngredients.add(ingredient);
//       let ingredients = Array.from(setIngredients);
//       console.log(ingredients);
//       res.locals.ingredArray = ingredients;
//       res.render("suggestion-views/bar-input.hbs", ingredResults);
//     }).catch(err => next(err));

// });

// for (let i = 1; i <= 9; i++) {
//   if (cocktail["ingredient" + i]) {
//     setIngredients.add(ingredient);
//   }
// }

router.get("/mybar", (req, res, rext) => {
  const host = req.user._id;
  User.findById(req.user._id)
    .then(user => {
      res.locals.userIngredientsArray = user.ingredients;
    })
    .catch();
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
      // possibleCocktails.sort(
      //   (a, b) => a.ingredientsDifference - b.ingredientsDifference
      // );
      console.log(possibleCocktails);

      res.render("suggestion-views/suggestions.hbs");
    })
    .catch();
});

module.exports = router;
