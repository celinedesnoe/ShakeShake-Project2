const express = require("express");
const Cocktail = require("../models/cocktail-model.js");
const Ingredient = require("../models/ingredient-model.js");
const User = require("../models/user-model.js");
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

router.post("/process-cocktail", (req, res, next) => {
  const { strDrink, strInstructions } = req.body;
  const userLog = req.user._id;

  User.findByIdAndUpdate(
    userLog,
    {
      $push: { cocktailCreated: { strDrink, strInstructions } }
    },
    { runValidators: true }
  ).then(() => {});

  Cocktail.create({ strDrink, strInstructions })
    .then(() => {})
    .catch(err => next(err));
});

module.exports = router;
