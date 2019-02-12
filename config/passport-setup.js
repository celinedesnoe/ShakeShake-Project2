const passport = require("passport");

const User = require("../models/user-model.js");

//serializeUser : defines what data to save in the session
// (this.happens when you log in successfully)
passport.serializeUser((userDoc, done) => {
  //call done() to give Passport the result of the function
  // null as the first argument means NO ERROR OCCURED
  // user's ID as the second argument is the RESULT we send passport
  done(null, userDoc._id);
});

//deserualizeUser: defines how to retrieve the user information from the database
// happens automatically on every request once the user is logged in
passport.deserializeUser((userId, done) => {
  // userId is the result of serializeUser
  // call done() to give Passport the result
  User.findById(userId)
    .then(userDoc => {
      // null as the first argument means NO ERROR OCCURED
      // DB document as the second argument is the RESULT we send passport
      done(null, userDoc);
    })
    //err as the first argument means we tell passport there was an error
    .catch(err => done(err));
});
