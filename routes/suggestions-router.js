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
      userIngredientsArray = user.ingredients;
      userIngredientsArray.sort();
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
      ingredients.sort();

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

router.post("/process-bar-suggestions", (req, res, next) => {
  const { ingredient } = req.body;

  User.findByIdAndUpdate(
    req.user._id,

    { $push: { ingredients: ingredient.toLowerCase() } },
    { runValidators: true, new: true }
  )
    .then(() => res.redirect(`/suggestions`))
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
  const ingredientsUntilOneCocktail = new Set();

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
              if (cocktail.ingredientsDifference === 1) {
                console.log(ingredient);
                cocktail.strIngredAll.forEach(() => {});
                /////////
                ingredientsUntilOneCocktail.add(
                  (ingredient = {
                    name: ingredient.toLowerCase(),
                    score: 0,
                    nextCocktail: cocktail.strDrink
                  })
                );
                console.log(ingredientsUntilOneCocktail);
              }
              // console.log(cocktail.ingredientsDifference);
              // console.log("cocktail mis a jour", cocktail);
            }
          }
        }
        console.log(ingredientsUntilOneCocktail);
      });

      let possibleCocktailsArray = Array.from(possibleCocktails);
      possibleCocktailsArray.sort(
        (a, b) => a.ingredientsDifference - b.ingredientsDifference
      );
      const recommendedIngredients = new Set();
      // parcourt tous les cocktails possibles (au moins 1 ingredient en commun avec l'utilisateur)
      possibleCocktailsArray.forEach(cocktail => {
        // parcourt tout les ingredients du cocktail en question

        cocktail.strIngredAll.forEach(ingredient => {
          score = 0;
          // si l'utilisateur ne possede pas l'ingredient en question (sinon il le possede deja donc aucun interet)
          if (!userIngredientsArray.includes(ingredient.toLowerCase())) {
            // parcourt tous les cocktails de la base de données

            cocktails.forEach(cocktail => {
              // si les ingredients du cocktail itéré contiennent l'ingredient en question, augmenter la valeur score
              if (cocktail.strIngredAll.includes(ingredient)) {
                score++;
              }
            });
            // une fois la boucle terminée, ajouter l'ingrédient avec son nom et son score aux ingrédients recommandés

            //if recommendedIngredients !== include do this

            recommendedIngredients.add(
              (ingredient = {
                name: ingredient.toLowerCase(),
                score: score
              })
            );
          }
        });
      });
      recommendedIngredientsUnique = Array.from(recommendedIngredients);

      // console.log(recommendedIngredients);
      let unique;
      function getUnique(arr, comp) {
        unique = arr
          .map(e => e[comp])

          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)

          // eliminate the dead keys & store unique objects
          .filter(e => arr[e])
          .map(e => arr[e]);

        return unique;
      }
      getUnique(recommendedIngredientsUnique, "name");
      res.locals.spotlightIngredientsArray = Array.from(
        ingredientsUntilOneCocktail
      );
      res.locals.recommendedIngredientsArray = unique;
      res.render("suggestion-views/suggestions.hbs");
    })
    .catch();
});

module.exports = router;
