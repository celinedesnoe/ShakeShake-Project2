const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/cocktails", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    banned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Ingredient = mongoose.model(
  "Ingredient",
  ingredientSchema,
  "listIngredients"
);
module.exports = Ingredient;
