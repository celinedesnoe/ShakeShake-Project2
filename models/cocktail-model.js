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

const cocktailSchema = new Schema(
  {
    strDrink: { type: String, required: true },
    dateModified: { type: Date },
    idDrink: { type: String },
    strAlcoholic: { type: String },
    strCategory: { type: String },
    strDrinkThumb: { type: String },
    strGlass: { type: String },
    strIBA: { type: String },
    strIngredient1: { type: String },
    strIngredient2: { type: String },
    strIngredient3: { type: String },
    strIngredient4: { type: String },
    strIngredient5: { type: String },
    strIngredient6: { type: String },
    strIngredient7: { type: String },
    strIngredient8: { type: String },
    strIngredient9: { type: String },
    strInstructions: { type: String, required: true },
    strMeasure1: { type: String },
    strMeasure2: { type: String },
    strMeasure3: { type: String },
    strMeasure4: { type: String },
    strMeasure5: { type: String },
    strMeasure6: { type: String },
    strMeasure7: { type: String },
    strMeasure8: { type: String },
    strMeasure9: { type: String },
    strIngredMeasure: { type: Array, items: Object },
    strIngredAll: { type: Array },
    ingredientsInCommon: { type: Number, default: 0 },
    ingredientsDifference: { type: Number, default: 0 },
    userCreated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Cocktail = mongoose.model("Cocktail", cocktailSchema, "listcocktails");
module.exports = Cocktail;
