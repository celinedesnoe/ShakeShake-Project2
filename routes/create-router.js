const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");
const fileUploader = require("../config/file-upload.js");
const router = express.Router();

router.get("/cocktail-form", (req, res, next) => {
  if (req.user) {
    //AUTHORIZATION only show the form if your are logged in
    res.render("create-views/cocktail-form.hbs");
    return;
  } else {
    // redirect to the login page if you ARE NOT logged-in
    req.flash("error", "You have to be logged in to add a room");
    res.redirect("/login");
    return;
  }
});

router.post(
  "/process-cocktail",
  fileUploader.single("strDrinkThumb"),
  (req, res, next) => {
    const userLog = req.user._id;

    if (strDrinkThumb !== null) {
      var strDrinkThumb = req.file.secure_url;
    }

    console.log("Lien Image", strDrinkThumb);

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

    const userCreated = true;

    console.log("userCreated is", userCreated);

    console.log("The array" + strIngredAll);

    //------------------------------
    //  Update the user collection and add the cocktail
    //---------------------------------

    User.findByIdAndUpdate(
      userLog,
      {
        $push: {
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
            userCreated,
            strDrinkThumb
          }
        }
      },
      { runValidators: true }
    )
      .then(() => {
        res.redirect("/mycocktails");
        return;
      })
      .catch(err => next(err));
  }
);

module.exports = router;
