require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const Cocktail = require("./models/cocktail-model.js");
const User = require("./models/user-model.js");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const helpers = require("handlebars-helpers")();

// run the code inside the "passport-setup.js"
require("./config/passport-setup");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);
hbs.registerPartials(path.join(__dirname, "views", "partials"));
hbs.registerHelper(helpers);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(
  session({
    // saveUninitialized and resave are just to avoir error messages
    saveUninitialized: true,
    resase: true,
    // secret should be a string that's different for every app
    secret: process.env.SESSION_SECRET,
    // store our session data inside our Mongodb with the connect-mongo package
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
//PASSORT'S LINES MUST BE BELOW SESSION
//set up passport's methods to use in our routes (properties and methods for "req")
app.use(passport.initialize());
//make passport manage our user session
app.use(passport.session());
// allow  our routes to use FLASH MESSAGES (feedback mesages before redirects)
// flash messages need sessions to work
app.use(flash());
app.use((req, res, next) => {
  // send flash messages to the hbs file
  // (req.flash() comes from the "connect-flash" npm package)
  res.locals.messages = req.flash();
  // req.user is defined by Passport and contains the logged-in user's info
  res.locals.currentUser = req.user;

  //tell express we are ready to move to the routes now
  // you need this or your pages will stay loading forever
  next();
});

// default value for title local
app.locals.title = "Shake Shake";

const index = require("./routes/index");
app.use("/", index);

const suggestions = require("./routes/suggestions-router.js");
app.use("/", suggestions);

const auth = require("./routes/auth-router.js");
app.use("/", auth);

const search = require("./routes/search-router.js");
app.use("/", search);

const create = require("./routes/create-router.js");
app.use("/", create);

const mycocktails = require("./routes/mycocktails-router.js");
app.use("/", mycocktails);

module.exports = app;
