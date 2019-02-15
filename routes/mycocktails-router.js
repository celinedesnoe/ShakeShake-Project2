const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");
const fileUploader = require("../config/file-upload.js");
const router = express.Router();

router.get("/mycocktails", (req, res, next) => {
  if (req.user) {
    var drinks = [];

    //-----------------------------------------------------------------
    //Find the cocktails that have been created
    //BY USER LOGGED IN to be in the top of the array
    //-----------------------------------------------------------------
    User.findById(req.user._id)
      .then(userDoc => {
        const userCocktails = userDoc.cocktailCreated;
        console.log(userDoc);
        userCocktails.forEach(drink => {
          drinks.push(drink);
        });
        res.locals.drinkArray = drinks;
        res.render("mycocktails-view/mycocktails.hbs");
      })
      .catch(err => next(err));
  } else {
    res.redirect("/");
  }
});

// #####################################################
// To delete a cocktail of the user
// #####################################################

router.get("/mycocktails/:cocktailId/delete", (req, res, next) => {
  const { cocktailId } = req.params;
  const userLog = req.user._id;

  User.findByIdAndUpdate(userLog, {
    $pull: { cocktailCreated: { strDrink: cocktailId } }
  })
    .then(userDoc => {
      res.redirect("/mycocktails");
    })
    .catch(err => next(err));
});

// #####################################################
// To update a cocktail of the user
// #####################################################

router.get("/mycocktails/:cocktailId/edit", (req, res, next) => {
  const { cocktailId } = req.params;
  const userLog = req.user._id;

  User.findById(userLog)
    .then(userDoc => {
      var userCocktailsArray = userDoc.cocktailCreated;

      var userCocktail = userCocktailsArray.filter(item => {
        return item.strDrink === cocktailId;
      });

      res.locals.userItem = userDoc;
      res.locals.cocktailItem = userCocktail[0];
      res.render("mycocktails-view/edit-form.hbs");
    })
    .catch(err => next(err));
});

router.post(
  "/mycocktails/:cocktailId/process-edit",
  fileUploader.single("strDrinkThumb"),
  (req, res, next) => {
    const { cocktailId } = req.params;
    const userLog = req.user._id;

    if (strDrinkThumb) {
      var strDrinkThumb = req.file.secure_url;
    }

    const {
      strDrink,
      strIngredient1,
      strMeasure1,
      strIngredient2,
      strMeasure2,
      strIngredient3,
      strMeasure3,
      strIngredient4,
      strMeasure4,
      strIngredient5,
      strMeasure5,
      strIngredient6,
      strMeasure6,
      strIngredient7,
      strMeasure7,
      strIngredient8,
      strMeasure8,
      strIngredient9,
      strMeasure9,
      strInstructions
    } = req.body;

    const IngredMeasure = [
      { Ingred: strIngredient1, Measure: strMeasure1 },
      { Ingred: strIngredient2, Measure: strMeasure2 },
      { Ingred: strIngredient3, Measure: strMeasure3 },
      { Ingred: strIngredient4, Measure: strMeasure4 },
      { Ingred: strIngredient5, Measure: strMeasure5 },
      { Ingred: strIngredient6, Measure: strMeasure6 },
      { Ingred: strIngredient7, Measure: strMeasure7 },
      { Ingred: strIngredient8, Measure: strMeasure8 },
      { Ingred: strIngredient9, Measure: strMeasure9 }
    ];

    strIngredMeasure = IngredMeasure.filter(item => {
      return item.Ingred !== "";
    });

    let IngredAll = [
      strIngredient1,
      strIngredient2,
      strIngredient3,
      strIngredient4,
      strIngredient5,
      strIngredient6,
      strIngredient7,
      strIngredient8,
      strIngredient9
    ];

    strIngredAll = IngredAll.filter(item => {
      return item !== "";
    });

    User.findByIdAndUpdate(
      userLog,
      {
        $set: {
          cocktailCreated: {
            strDrink,
            strIngredient1,
            strMeasure1,
            strIngredient2,
            strMeasure2,
            strIngredient3,
            strMeasure3,
            strIngredient4,
            strMeasure4,
            strIngredient5,
            strMeasure5,
            strIngredient6,
            strMeasure6,
            strIngredient7,
            strMeasure7,
            strIngredient8,
            strMeasure8,
            strIngredient9,
            strMeasure9,
            strInstructions,
            strIngredMeasure,
            strIngredAll,
            strDrinkThumb
          }
        }
      },
      { runvalidators: true }
    )
      .then(userDoc => {
        res.redirect(`/mycocktails`);
      })
      .catch(err => next(err));
  }
);

// #####################################################
// To add a favorite cocktail to the user
// #####################################################

// router.get("/mycocktails/:cocktailId/add-favorites", (req, res, next) => {
//   const { cocktailId } = req.params;
//   const userLog = req.user._id;
//   // var cocktailLove;

//   // console.log("Cocktail Favorites", userLog);
//   // console.log("The cocktail is", cocktailId);

//   Cocktail.findOne({ strDrink: { $eq: cocktailId } }).then(cocktailDoc => {
//     // console.log("e cocktail que j'ai trouvé", cocktailDoc);
//     // console.log(cocktailDoc);
//     // cocktailLove = cocktailDoc;
//     res.locals.cocktailLove = cocktailDoc;
//   });

//   User.findByIdAndUpdate(
//     userLog,
//     {
//       $push: { cocktailFavorites: cocktailLove }
//     },
//     { runValidators: true }
//   )
//     .then(userDoc => {
//       console.log("Le cocktail que j'envoie en favori", cocktailLove);
//       res.redirect("/mycocktails");
//     })
//     .catch(err => next(err));
// });

module.exports = router;
