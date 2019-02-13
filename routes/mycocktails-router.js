const express = require("express");
const router = express.Router();
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");

router.get("/mycocktails", (req, res, next) => {
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
});

module.exports = router;
