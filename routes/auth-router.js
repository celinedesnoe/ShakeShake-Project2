const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;
  //enforce password rules (cant be empty and must have a digit)
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    //req.flash() sends a feedback message before a redirect
    // it's defined by the "connect-flash" npmpackage
    req.flash("error", "password can't be blank and must contain a number");
    // redirect to the signup page if the password is bad
    res.redirect("/signup");
    return;
  }

  //encrypt the user's password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })
    .then(() => {
      //req.flash() sends a feedback message before a redirect
      // it's defined by the "connect-flash" npmpackage
      req.flash("success", "Sign up succes!");
      // redirect to the home pageif the signup worked
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      if (!userDoc) {
        //req.flash() sends a feedback message before a redirect
        // it's defined by the "connect-flash" npmpackage
        req.flash("error", "email is incorrect");
        // redirect to login page if result is NULL (no account with the email)
        res.redirect("/login");
        //use return to stop the function if the email is bad
        return;
      }
      //validate the password by using bcrypt.compareSync
      const { encryptedPassword } = userDoc;
      //validate the password by using bcrypt compareSync
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        //req.flash() sends a feedback message before a redirect
        // it's defined by the "connect-flash" npmpackage
        req.flash("error", "your password is incorrect");
        // redirect to login oage is password is bad
        res.redirect("/login");
        //use return to STOP the function here if the password is bas
        return;
      }

      // email and password are correct
      //if we MANUALLY managed the user session
      // req.session.userId = userDoc._id

      //instead we will use PASSPORT - an npm package for managin user sessions
      //req.logIn() is a passport method that calls serilizeUser
      // that saves the user ID in the session which means we are logged-in
      req.logIn(userDoc, () => {
        req.flash("success", "Log in success");
        res.redirect("/");
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  // req.logOut() is a passport method that removes the user ID from the database
  req.logOut();
  req.flash("success", "logged out successfully");
  res.redirect("/");
});

module.exports = router;
