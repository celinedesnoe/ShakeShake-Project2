const express = require("express");
const router = express.Router();
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");

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
  ingredientsUntilOneCocktail = [];

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
                cocktail.strIngredAll.forEach(uniqueIngredient => {
                  if (
                    userIngredientsArray.indexOf(
                      uniqueIngredient.toLowerCase
                    ) === -1
                  ) {
                    console.log("coucou", uniqueIngredient);
                    ingredientsUntilOneCocktail.push(
                      (ingredient = {
                        name: uniqueIngredient.toLowerCase(),
                        score: 0,
                        nextCocktail: cocktail.strDrink
                      })
                    );
                  }
                });
                /////////
              }
              console.log(ingredientsUntilOneCocktail);

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
